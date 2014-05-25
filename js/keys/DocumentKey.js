/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'DocumentKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * @name bookworm.DocumentKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @returns {bookworm.DocumentKey}
     */

    /**
     * Identifies a Document entity.
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.DocumentKey = self
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
            },

            /**
             * @param {bookworm.DocumentKey} documentKey
             */
            equals: function (documentKey) {
                return documentKey &&
                       this.documentType === documentKey.documentType &&
                       this.documentId === documentKey.documentId;
            },

            /**
             * Creates a FieldKey instance based on the current document key and the specified field name.
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
             * Determines absolute path for the current Document entity's cache node.
             * In case the entity node sits on a different path for a certain documentType,
             * subclass DocumentKey and override .getEntityPath() to reflect the correct path.
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                return [this.documentType, this.documentId].toPath();
            },

            /**
             * @returns {sntls.Path}
             */
            getMetaPath: function () {
                return ['document', this.documentType].toDocumentKey().getEntityPath();
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return encodeURIComponent(this.documentType) + '/' + encodeURIComponent(this.documentId);
            }
        });
});

troop.amendPostponed(bookworm, 'EntityKey', function () {
    "use strict";

    bookworm.EntityKey
        .addSurrogate(bookworm, 'DocumentKey', function () {
            return arguments.length === 2;
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path
        .addMethods(/** @lends sntls.Path */{
            /**
             * Converts cache Path to DocumentKey instance.
             * @returns {bookworm.DocumentKey}
             */
            toDocumentKey: function () {
                return this.asArray.toDocumentKey();
            }
        });
});

troop.postpone(bookworm, 'DocumentKeyCollection', function () {
    "use strict";

    /**
     * @name bookworm.DocumentKeyCollection.create
     * @function
     * @param {object} [items]
     * @returns {bookworm.DocumentKeyCollection}
     */

    /**
     * @class
     * @extends {sntls.Collection}
     * @extends {bookworm.DocumentKey}
     */
    bookworm.DocumentKeyCollection = sntls.Collection.of(bookworm.DocumentKey);
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash */{
            /**
             * Converts Hash instance to DocumentKeyCollection instance.
             * @returns {bookworm.DocumentKeyCollection}
             */
            toDocumentKeyCollection: function () {
                return bookworm.DocumentKeyCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** Tells whether expression is a DocumentKey */
        isDocumentKey: function (expr) {
            return bookworm.DocumentKey.isBaseOf(expr);
        },

        /** Tells whether expression is optionally a DocumentKey */
        isDocumentKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.DocumentKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to a DocumentKey instance.
             * @returns {bookworm.DocumentKey}
             */
            toDocumentKey: function () {
                var parts = this.split('/');
                return bookworm.DocumentKey.create(
                    decodeURIComponent(parts[0]),
                    decodeURIComponent(parts[1])
                );
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts array of strings (key components) to a DocumentKey instance.
             * @returns {bookworm.DocumentKey}
             * @example
             * ['foo', 'bar'].toDocumentKey() // single document key
             */
            toDocumentKey: function () {
                return bookworm.DocumentKey.create(this[0], this[1]);
            },

            /**
             * Converts array of strings (keys) to a DocumentKeyCollection.
             * @returns {bookworm.DocumentKeyCollection}
             * @example
             * ['foo/bar', 'foo/baz'].toDocumentKeyCollection() // collection of document keys
             */
            toDocumentKeyCollection: function () {
                return this
                    .toCollection()
                    .callOnEachItem('toDocumentKey')
                    .toDocumentKeyCollection();
            }
        },
        false, false, false
    );
}());
