/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'FieldKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * Creates FieldKey instance.
     * FieldKey instances may also be created via conversion from string or array.
     * @name bookworm.FieldKey.create
     * @function
     * @param {string} documentType Identifies type of document the field belongs to.
     * @param {string} documentId Identifies document (within document type) the field belongs to.
     * @param {string} fieldName Identifies field (within document).
     * @returns {bookworm.FieldKey}
     */

    /**
     * The FieldKey class identifies a field entity nodes in the cache.
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.FieldKey = self
        .setEventPath(['document'].toPath().prepend(base.eventPath))
        .addMethods(/** @lends bookworm.FieldKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @ignore
             */
            init: function (documentType, documentId, fieldName) {
                base.init.call(this);

                /**
                 * Document key reference.
                 * @type {bookworm.DocumentKey}
                 */
                this.documentKey = bookworm.DocumentKey.create(documentType, documentId);

                /**
                 * Name of current field.
                 * @type {string}
                 */
                this.fieldName = fieldName;

                this.setEventPath([fieldName].toPath().prepend(this.documentKey.eventPath));
            },

            /**
             * Tells whether current field key is equivalent to the specified one.
             * @param {bookworm.FieldKey} fieldKey
             * @returns {boolean}
             */
            equals: function (fieldKey) {
                return this.documentKey.equals(fieldKey.documentKey) &&
                       this.fieldName === fieldKey.fieldName;
            },

            /**
             * Fetches key to config document that describes the current field.
             * @returns {bookworm.DocumentKey}
             */
            getConfigKey: function () {
                var documentId = [this.documentKey.documentType, this.fieldName].toDocumentKey().toString();
                return ['field', documentId].toDocumentKey();
            },

            /**
             * Creates an `ItemKey` instance based on the current field key and the specified item ID.
             * @param {string} itemId
             * @returns {bookworm.ItemKey}
             */
            getItemKey: function (itemId) {
                var documentKey = this.documentKey;

                return bookworm.ItemKey.create(
                    documentKey.documentType,
                    documentKey.documentId,
                    this.fieldName,
                    itemId
                );
            },

            /**
             * Determines absolute path to the field node identified by the current key.
             * In case field node sits on a different path relative to the document node
             * for a certain `documentType` / `fieldName` combination,
             * subclass `FieldKey` and override `.getEntityPath()` to reflect the correct path.
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                return this.documentKey
                    .getEntityPath()
                    .appendKey(String(this.fieldName));
            },

            /**
             * Determines absolute path to the value node of the field identified by the current key.
             * In case field value node sits on a different path relative the field node
             * for a certain `documentType` / `fieldName` combination,
             * subclass `FieldKey` and override `.getValuePath()` to reflect the correct path.
             * By default, the value path is same as the entity path.
             * @returns {sntls.Path}
             */
            getValuePath: function () {
                return this.getEntityPath();
            },

            /**
             * Retrieves the field type associated with the current field from the config datastore.
             * @returns {string}
             * @see bookworm.config
             */
            getFieldType: function () {
                var field = this.getConfigKey().getFieldKey('fieldType');
                return bookworm.config.getNode(field.getEntityPath());
            },

            /**
             * Retrieves item type string for the item entity identified by the current key.
             * @returns {string}
             */
            getItemType: function () {
                var field = this.getConfigKey().getFieldKey('itemType');
                return bookworm.config.getNode(field.getEntityPath());
            },

            /**
             * Retrieves item type string for the item entity identified by the current key.
             * @returns {string}
             */
            getItemIdType: function () {
                var field = this.getConfigKey().getFieldKey('itemIdType');
                return bookworm.config.getNode(field.getEntityPath());
            },

            /**
             * Serializes current field key.
             * @example
             * bookworm.FieldKey.create('user', '1234', 'name').toString() // "user/1234/name"
             * @returns {string}
             */
            toString: function () {
                return this.documentKey.toString() + '/' + encodeURIComponent(this.fieldName);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {bookworm.FieldKey} expr */
        isFieldKey: function (expr) {
            return bookworm.FieldKey.isBaseOf(expr);
        },

        /** @param {bookworm.FieldKey} expr */
        isFieldKeyStrict: function (expr) {
            return bookworm.FieldKey.isBaseOf(expr) &&
                   expr.getBase() === bookworm.FieldKey;
        },

        /** @param {bookworm.FieldKey} [expr] */
        isFieldKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.FieldKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to a `FieldKey`. Assumes that string is a serialized `FieldKey`.
             * @returns {bookworm.FieldKey}
             */
            toFieldKey: function () {
                var parts = this.split('/'),
                    documentType = parts[0],
                    documentId = parts[1],
                    fieldName = parts[2];

                return typeof documentType === 'string' &&
                       typeof documentId === 'string' &&
                       typeof fieldName === 'string' ?
                    bookworm.FieldKey.create(
                        decodeURIComponent(documentType),
                        decodeURIComponent(documentId),
                        decodeURIComponent(fieldName)) :
                    undefined;
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` (of strings) to a `FieldKey` instance.
             * Assumes that array is a field key in array notation.
             * @returns {bookworm.FieldKey}
             */
            toFieldKey: function () {
                var documentType = this[0],
                    documentId = this[1],
                    fieldName = this[2];

                return typeof documentType !== 'undefined' &&
                       typeof documentId !== 'undefined' &&
                       typeof fieldName !== 'undefined' ?
                    bookworm.FieldKey.create(documentType, documentId, fieldName) :
                    undefined;
            }
        },
        false, false, false
    );
}());
