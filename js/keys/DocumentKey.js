/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'DocumentKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * Creates a DocumentKey instance.
     * DocumentKey instances may also be created via conversion from string or array.
     * @name bookworm.DocumentKey.create
     * @function
     * @param {string} documentType Identifies document type.
     * @param {string} documentId Identifies document in the context of its document type.
     * @returns {bookworm.DocumentKey}
     */

    /**
     * The DocumentKey class identifies document nodes in the cache.
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.DocumentKey = self
        .setEventPath(['document'].toPath().prepend(base.eventPath))
        .addMethods(/** @lends bookworm.DocumentKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @ignore
             */
            init: function (documentType, documentId) {
                /**
                 * Document type.
                 * @type {string}
                 */
                this.documentType = documentType;

                /**
                 * Document identifier.
                 * @type {string}
                 */
                this.documentId = documentId;

                this.setEventPath([documentType, documentId].toPath().prepend(this.eventPath));
            },

            /**
             * Tells whether the specified `DocumentKey` instance is equivalent to the current one.
             * @param {bookworm.DocumentKey} documentKey
             * @returns {boolean}
             */
            equals: function (documentKey) {
                return documentKey &&
                       this.documentType === documentKey.documentType &&
                       this.documentId === documentKey.documentId;
            },

            /**
             * Fetches a document key to the
             * @returns {bookworm.DocumentKey}
             */
            getConfigKey: function () {
                return ['document', this.documentType].toDocumentKey();
            },

            /**
             * Creates a `FieldKey` instance based on the current document key and the specified field name.
             * @param {string} fieldName
             * @returns {bookworm.FieldKey}
             */
            getFieldKey: function (fieldName) {
                return bookworm.FieldKey.create(
                    this.documentType,
                    this.documentId,
                    fieldName
                );
            },

            /**
             * Determines absolute path to the entity node of the document identified by the current key.
             * In case document node sits on a different path for a certain `documentType`,
             * subclass `DocumentKey` and override `.getEntityPath()` to reflect the correct path.
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                return ['document', String(this.documentType), String(this.documentId)].toPath();
            },

            /**
             * Determines absolute path to the specified attribute of the document identified by the current key.
             * In case attribute node sits on a different path for a certain `documentType`,
             * subclass `DocumentKey` and override `.getAttributePath()` to reflect the correct path.
             * @param {string} attribute Identifies document attribute.
             * @returns {sntls.Path}
             */
            getAttributePath: function (attribute) {
                return this.getEntityPath()
                    .appendKey(attribute);
            },

            /**
             * Determines the absolute path to the config node of the current document.
             * @returns {sntls.Path}
             */
            getConfigPath: function () {
                return ['document', String(this.documentType)].toDocumentKey().getEntityPath();
            },

            /**
             * Serializes current document key.
             * @example
             * bookworm.DocumentKey.create('user', '1234').toString() // "user/1234"
             * @returns {string}
             */
            toString: function () {
                return encodeURIComponent(this.documentType) + '/' + encodeURIComponent(this.documentId);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {bookworm.DocumentKey} expr */
        isDocumentKey: function (expr) {
            return bookworm.DocumentKey.isBaseOf(expr);
        },

        /** @param {bookworm.DocumentKey} [expr] */
        isDocumentKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.DocumentKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to a `DocumentKey` instance. Assumes string is a serialized document key.
             * @returns {bookworm.DocumentKey}
             */
            toDocumentKey: function () {
                var parts = this.split('/');
                return bookworm.DocumentKey.create(
                    parts[0] && decodeURIComponent(parts[0]),
                    parts[1] && decodeURIComponent(parts[1])
                );
            }
        },
        false, false, false);

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` (of strings) to a `DocumentKey` instance.
             * Assumes array is a document key in array notation.
             * @returns {bookworm.DocumentKey}
             * @example
             * ['foo', 'bar'].toDocumentKey() // single document key
             */
            toDocumentKey: function () {
                return bookworm.DocumentKey.create(this[0], this[1]);
            }
        },
        false, false, false);
}());
