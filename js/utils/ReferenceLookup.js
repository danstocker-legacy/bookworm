/*global dessert, troop, sntls, evan, flock, bookworm, app */
troop.postpone(bookworm, 'ReferenceLookup', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name bookworm.ReferenceLookup.create
     * @function
     * @returns {bookworm.ReferenceLookup}
     */

    /**
     * Maintains a lookup of references.
     * TODO: Move private functions to EntityStoreTree & EntityConfigTree.
     * @class
     * @extends troop.Base
     */
    bookworm.ReferenceLookup = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addConstants(/** @lends bookworm.ReferenceLookup */{
            /**
             * @type {sntls.Query}
             * @constant
             */
            referenceFieldsQuery: 'document>document>|>|>fieldType<itemType<itemIdType^reference'.toQuery()
        })
        .addPrivateMethods(/** @lends bookworm.ReferenceLookup */{
            /**
             * @param {string} referredRef Reference to referred document.
             * @param {string} referrerRef Reference to referrer field or item.
             * @private
             */
            _addReference: function (referredRef, referrerRef) {
                bookworm.index
                    .setNode(['reference', 'by-referred', referredRef, referrerRef].toPath(), true)
                    .setNode(['reference', 'by-referrer', referrerRef].toPath(), referredRef);
            },

            /**
             * @param {string} referredRef Reference to referred document.
             * @param {string} referrerRef Reference to referrer field or item.
             * @private
             */
            _removeReference: function (referredRef, referrerRef) {
                bookworm.index
                    .unsetKey(['reference', 'by-referred', referredRef, referrerRef].toPath())
                    .unsetKey(['reference', 'by-referrer', referrerRef].toPath());
            },

            /**
             * @param {string} documentType
             * @param {string} fieldName
             * @returns {sntls.Collection}
             * @private
             */
            _queryFieldReferences: function (documentType, fieldName) {
                var query = ['document', documentType, '|'.toKVP(), fieldName].toQuery();

                return bookworm.entities.queryPathValuePairsAsHash(query)
                    .toCollection()
                    .mapKeys(function (reference, fieldPathStr) {
                        return fieldPathStr.toPath().trimLeft().toFieldKey();
                    });
            },

            /**
             * @param {string} documentType
             * @param {string} fieldName
             * @returns {sntls.Collection}
             * @private
             */
            _queryItemReferences: function (documentType, fieldName) {
                var query = ['document', documentType, '|'.toKVP(), fieldName, '|'.toKVP()].toQuery();

                return bookworm.entities.queryPathValuePairsAsHash(query)
                    .toCollection()
                    .mapKeys(function (reference, itemPathStr) {
                        return itemPathStr.toPath().trimLeft().toItemKey();
                    });
            },

            /**
             * @param {string} documentType
             * @param {string} fieldName
             * @returns {sntls.Collection}
             * @private
             */
            _queryItemIdReferences: function (documentType, fieldName) {
                var query = ['document', documentType, '|'.toKVP(), fieldName, '|'.toKVP()].toQuery();

                return bookworm.entities.queryPathsAsHash(query)
                    .toCollection()
                    .mapKeys(function (itemPath) {
                        return itemPath.clone().trimLeft().toReferenceItemKey();
                    })
                    .mapValues(function (itemPath, referenceItemRef) {
                        return referenceItemRef.toReferenceItemKey().referenceKey.toString();
                    });
            },

            /**
             * Returns a collection of ALL reference pairs found in the entity cache.
             * @returns {sntls.Collection}
             * @private
             */
            _queryReferences: function () {
                var that = this;

                return bookworm.config.queryPathsAsHash(this.referenceFieldsQuery)
                    .toCollection()
                    .mapValues(function (path) {
                        var asArray = path.asArray,
                            documentType = asArray[2],
                            fieldName = asArray[3],
                            reference = asArray[4];

                        switch (reference) {
                        case 'fieldType':
                            return that._queryFieldReferences(documentType, fieldName);
                        case 'itemType':
                            return that._queryItemReferences(documentType, fieldName);
                        case 'itemIdType':
                            return that._queryItemIdReferences(documentType, fieldName);
                        }

                        return undefined;
                    })
                    .toTree()
                    .queryKeyValuePairsAsHash('|>items>|'.toQuery())
                    .toCollection();
            }
        })
        .addMethods(/** @lends bookworm.ReferenceLookup# */{
            /** @ignore */
            init: function () {
                // initializing lookup
                this._queryReferences()
                    .forEachItem(this._addReference);
            },

            /**
             * @param {bookworm.DocumentKey} referredKey
             * @param {bookworm.FieldKey} referrerKey
             * @returns {bookworm.ReferenceLookup}
             */
            addReference: function (referredKey, referrerKey) {
                this._addReference(referredKey.toString(), referrerKey.toString());
                return this;
            },

            /**
             * @param {bookworm.DocumentKey} referredKey
             * @returns {bookworm.ReferenceLookup}
             */
            removeReference: function (referredKey) {
                this._removeReference(referredKey.toString());
                return this;
            },

            /**
             * Fetches all references from a field.
             * @param {bookworm.FieldKey} fieldKey
             * @returns {string[]}
             */
            getReferencesFromField: function (fieldKey) {
                var attributes = bookworm.FieldTypeLookup.create()
                        .getAttributesForFieldType('reference', fieldKey.documentKey.documentType, fieldKey.fieldName),
                    field = fieldKey.toField();

                if (attributes.fieldType) {
                    return [field.getValue()];
                } else if (attributes.itemType) {
                    return field.getItemsAsCollection()
                        .getValues();
                } else if (attributes.itemIdType) {
                    return field.getItemsAsCollection()
                        .getKeys();
                } else {
                    return undefined;
                }
            },

            /**
             * Fetches all references from a document.
             * @param {bookworm.DocumentKey} documentKey
             * @returns {string[]}
             */
            getReferencesFromDocument: function (documentKey) {
                return bookworm.FieldTypeLookup.create()
                    .getFieldNamesForType('reference', documentKey.documentType)
                    .toCollection()
                    .mapValues(function (fieldName) {
                        return documentKey.getFieldKey(fieldName);
                    })
                    .passEachItemTo(this.getReferencesFromField.bind(this))
                    .toTree()
                    .queryValues('|>|'.toQuery());
            },

            /**
             * @param {bookworm.DocumentKey} documentKey
             * @returns {sntls.Collection}
             */
            getBackReferences: function (documentKey) {
                var referrersPath = ['reference', 'by-referred', documentKey.toString()].toPath();
                return bookworm.index.getNodeAsHash(referrersPath)
                    .getKeysAsHash()
                    .toCollection();
            },

            /**
             * @param {bookworm.DocumentKey} fieldKey
             * @returns {string}
             */
            getForwardReference: function (fieldKey) {
                var referencePath = ['reference', 'by-referrer', fieldKey.toString()].toPath();
                return bookworm.index.getNode(referencePath);
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onCacheChange: function (event) {
                var affectedPath = event.originalPath.clone(),
                    affectedKey = affectedPath.trimLeft().toEntityKey();

                // checking whether affected entity is a reference field or item
                if (affectedKey.isA(bookworm.ItemKey) && affectedKey.getItemType() === 'reference' ||
                    affectedKey.isA(bookworm.FieldKey) && affectedKey.getFieldType() === 'reference'
                    ) {
                    // entity _value_ holds a reference
                    if (!event.isInsert()) {
                        // reference was removed
                        this._removeReference(event.beforeValue, affectedKey.toString());
                    }
                    if (!event.isDelete()) {
                        // reference was added
                        this._addReference(event.afterValue, affectedKey.toString());
                    }
                } else if (affectedKey.isA(bookworm.ReferenceItemKey)) {
                    // entity _key_ holds a reference
                    if (event.isInsert()) {
                        // reference was added
                        this._addReference(affectedKey.referenceKey.toString(), affectedKey.toString());
                    } else if (event.isDelete()) {
                        // reference was removed
                        this._removeReference(affectedKey.referenceKey.toString(), affectedKey.toString());
                    }
                }
            }
        });
});

troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    if (bookworm.useBackReferences) {
        bookworm.entities
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'document'.toPath(), function (event) {
                bookworm.ReferenceLookup.create()
                    .onCacheChange(event);
            });
    }
});
