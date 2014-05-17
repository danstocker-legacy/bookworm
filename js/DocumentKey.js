/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'DocumentKey', function () {
    "use strict";

    var base = dache.EntityKey,
        self = base.extend();

    /**
     * @name dache.DocumentKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @returns {dache.DocumentKey}
     */

    /**
     * Identifies a Document entity.
     * @class
     * @extends dache.EntityKey
     */
    dache.DocumentKey = self
        .addMethods(/** @lends dache.DocumentKey# */{
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
             * @param {dache.DocumentKey} documentKey
             */
            equals: function (documentKey) {
                return documentKey &&
                       this.documentType === documentKey.documentType &&
                       this.documentId === documentKey.documentId;
            },

            /**
             * Creates a FieldKey instance based on the current document key and the specified field name.
             * @param {string} fieldName
             * @returns {dache.FieldKey}
             */
            getFieldKey: function (fieldName) {
                return dache.FieldKey.create(
                    this.documentType,
                    this.documentId,
                    fieldName
                );
            },

            /**
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
             * Tells whether Document entity identified by the current key has metadata associated with it.
             * @returns {boolean}
             */
            hasDocumentMeta: function () {
                return dache.metadata.getNode(this.getMetaPath().appendKey('hasDocumentMeta'));
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return encodeURIComponent(this.documentType) + '/' + encodeURIComponent(this.documentId);
            }
        });
});

troop.amendPostponed(dache, 'EntityKey', function () {
    "use strict";

    dache.EntityKey
        .addSurrogate(dache, 'DocumentKey', function () {
            return arguments.length === 2;
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path
        .addMethods(/** @lends sntls.Path */{
            /**
             * Converts cache Path to DocumentKey instance.
             * @returns {dache.DocumentKey}
             */
            toDocumentKey: function () {
                return this.asArray.toDocumentKey();
            }
        });
});

troop.postpone(dache, 'DocumentKeyCollection', function () {
    "use strict";

    /**
     * @name dache.DocumentKeyCollection.create
     * @function
     * @param {object} [items]
     * @returns {dache.DocumentKeyCollection}
     */

    /**
     * @class
     * @extends {sntls.Collection}
     * @extends {dache.DocumentKey}
     */
    dache.DocumentKeyCollection = sntls.Collection.of(dache.DocumentKey);
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash */{
            /**
             * Converts Hash instance to DocumentKeyCollection instance.
             * @returns {dache.DocumentKeyCollection}
             */
            toDocumentKeyCollection: function () {
                return dache.DocumentKeyCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** Tells whether expression is a DocumentKey */
        isDocumentKey: function (expr) {
            return dache.DocumentKey.isBaseOf(expr);
        },

        /** Tells whether expression is optionally a DocumentKey */
        isDocumentKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   dache.DocumentKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to a DocumentKey instance.
             * @returns {dache.DocumentKey}
             */
            toDocumentKey: function () {
                var parts = this.split('/');
                return dache.DocumentKey.create(
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
             * @returns {dache.DocumentKey}
             * @example
             * ['foo', 'bar'].toDocumentKey() // single document key
             */
            toDocumentKey: function () {
                return dache.DocumentKey.create(this[0], this[1]);
            },

            /**
             * Converts array of strings (keys) to a DocumentKeyCollection.
             * @returns {dache.DocumentKeyCollection}
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
