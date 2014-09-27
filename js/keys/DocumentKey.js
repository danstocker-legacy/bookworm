/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'DocumentKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * Creates a DocumentKey instance.
     * DocumentKey instances may also be created via conversion from string, array, and `sntls.Path`,
     * as well as instantiating `EntityKey` with suitable arguments.
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
             * Tells whether the specified `DocumentKey` instance is equivalent to the current one.
             * @param {bookworm.DocumentKey} documentKey
             */
            equals: function (documentKey) {
                return documentKey &&
                       this.documentType === documentKey.documentType &&
                       this.documentId === documentKey.documentId;
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
                return [this.documentType, this.documentId].toPath();
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
                return ['document', this.documentType].toDocumentKey().getEntityPath();
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
             * Converts `Path` to `DocumentKey` instance. Here the path is not a cache path.
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
     * Creates a DocumentKeyCollection instance.
     * @name bookworm.DocumentKeyCollection.create
     * @function
     * @param {object} [items]
     * @returns {bookworm.DocumentKeyCollection}
     */

    /**
     * The DocumentKeyCollection offers a simplified way of dealing with multiple document keys.
     * @example
     * // retrieves a collection of `Document` instances based on the specified document keys
     * ['user/1234', 'user/4321'].toDocumentKeyCollection().toDocument();
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
             * Converts `Hash` instance to `DocumentKeyCollection` instance.
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
        isDocumentKey: function (expr) {
            return bookworm.DocumentKey.isBaseOf(expr);
        },

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
             * Converts `Array` (of strings) to a `DocumentKey` instance.
             * Assumes array is a document key in array notation.
             * @returns {bookworm.DocumentKey}
             * @example
             * ['foo', 'bar'].toDocumentKey() // single document key
             */
            toDocumentKey: function () {
                return bookworm.DocumentKey.create(this[0], this[1]);
            },

            /**
             * Converts `Array` (of `DocumentKey` instances) to a `DocumentKeyCollection` instance.
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
