/*global dessert, troop, sntls, evan, flock, bookworm, app */
troop.postpone(bookworm, 'BackReferenceLookup', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name bookworm.BackReferenceLookup.create
     * @function
     * @returns {bookworm.BackReferenceLookup}
     */

    /**
     * TODO: Move private functions to EntityStoreTree & EntityConfigTree.
     * @class
     * @extends troop.Base
     */
    bookworm.BackReferenceLookup = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addConstants(/** @lends bookworm.BackReferenceLookup */{
            /**
             * @type {sntls.Query}
             * @constant
             */
            referenceFieldsQuery: 'document>document>|>|>fieldType<itemType<itemIdType^reference'.toQuery()
        })
        .addPrivateMethods(/** @lends bookworm.BackReferenceLookup */{
            /**
             * @param {string} referredRef Reference to referred document.
             * @param {string} referrerRef Reference to referrer field or item.
             * @private
             */
            _addBackReference: function (referredRef, referrerRef) {
                bookworm.index.setNode(['back-reference', 'by-referred', referredRef, referrerRef].toPath(), true);
            },

            /**
             * @param {string} referredRef Reference to referred document.
             * @private
             */
            _removeBackReference: function (referredRef) {
                bookworm.index.unsetKey(['back-reference', 'by-referred', referredRef].toPath());
            },

            /**
             * @param {string} documentType
             * @param {string} fieldName
             * @returns {sntls.Collection}
             * @private
             */
            _queryFieldBackReferences: function (documentType, fieldName) {
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
            _queryItemBackReferences: function (documentType, fieldName) {
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
            _queryItemIdBackReferences: function (documentType, fieldName) {
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
            _queryBackReferences: function () {
                var that = this;

                return bookworm.config.queryPathsAsHash(this.referenceFieldsQuery)
                    .toCollection()
                    .mapValues(function (pathStr) {
                        var asArray = pathStr.toPath().asArray,
                            documentType = asArray[2],
                            fieldName = asArray[3],
                            reference = asArray[4];

                        switch (reference) {
                        case 'fieldType':
                            return that._queryFieldBackReferences(documentType, fieldName);
                        case 'itemType':
                            return that._queryItemBackReferences(documentType, fieldName);
                        case 'itemIdType':
                            return that._queryItemIdBackReferences(documentType, fieldName);
                        }

                        return undefined;
                    })
                    .toTree()
                    .queryKeyValuePairsAsHash('|>items>|'.toQuery())
                    .toCollection();
            }
        })
        .addMethods(/** @lends bookworm.BackReferenceLookup# */{
            /** @ignore */
            init: function () {
                // initializing lookup
                this._queryBackReferences()
                    .forEachItem(this._addBackReference);
            },

            /**
             * @param {bookworm.DocumentKey} referredKey
             * @param {bookworm.FieldKey} referrerKey
             * @returns {bookworm.BackReferenceLookup}
             */
            addBackReference: function (referredKey, referrerKey) {
                this._addBackReference(referredKey.toString(), referrerKey.toString());
                return this;
            },

            /**
             * @param {bookworm.DocumentKey} referredKey
             * @returns {bookworm.BackReferenceLookup}
             */
            removeBackReference: function (referredKey) {
                this._removeBackReference(referredKey.toString());
                return this;
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onCacheChange: function (event) {
                // was it addition, change, or removal?
            }
        });
});

troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    bookworm.entities
        .subscribeTo(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'document'.toPath(), function (event) {
            bookworm.BackReferenceLookup.create()
                .onCacheChange(event);
        });
});
