/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Document', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend();

    /**
     * Creates a Document instance.
     * A `Document` instance may also be created via conversion from string, array, and `DocumentKey`.
     * @name bookworm.Document.create
     * @function
     * @param {bookworm.DocumentKey} documentKey Identifies document.
     * @returns {bookworm.Document}
     */

    /**
     * The Document class implements an API for document nodes,
     * granting access to the document's fields and attributes.
     * @class
     * @extends bookworm.Entity
     */
    bookworm.Document = self
        .addMethods(/** @lends bookworm.Document# */{
            /**
             * @param {bookworm.DocumentKey} documentKey
             * @ignore
             */
            init: function (documentKey) {
                dessert.isDocumentKey(documentKey, "Invalid document key");
                base.init.call(this, documentKey);

                /**
                 * Field key associated with current entity.
                 * @name bookworm.Field#entityKey
                 * @type {bookworm.DocumentKey}
                 */
            },

            /**
             * Fetches document attribute node from cache.
             * @param {string} attribute
             * @returns {*}
             */
            getDocumentAttribute: function (attribute) {
                var attributePath = this.entityKey.getAttributePath(attribute);
                return bookworm.entities.getNode(attributePath);
            },

            /**
             * Retrieves Field entity matching the specified field name.
             * @param {string} fieldName
             * @returns {bookworm.Field}
             */
            getField: function (fieldName) {
                return this.entityKey.getFieldKey(fieldName).toField();
            }
        });
});

troop.amendPostponed(bookworm, 'DocumentKey', function () {
    "use strict";

    bookworm.DocumentKey
        .addMethods(/** @lends bookworm.DocumentKey */{
            /**
             * Converts `DocumentKey` to `Document`.
             * @returns {bookworm.Document}
             */
            toDocument: function () {
                return bookworm.Document.create(this);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `Document` instance, assuming the string is a serialized `DocumentKey`.
             * @returns {bookworm.Document}
             */
            toDocument: function () {
                return bookworm.Document.create(this.toDocumentKey());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `Document` instance, assuming the array is a document key in array notation.
             * @returns {bookworm.Document}
             */
            toDocument: function () {
                return bookworm.Document.create(this.toDocumentKey());
            }
        },
        false, false, false
    );
}());
