/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Document', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend();

    /**
     * @name bookworm.Document.create
     * @function
     * @param {bookworm.DocumentKey} documentKey
     * @returns {bookworm.Document}
     */

    /**
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
                 * Document key associated with current entity.
                 * Same as entityKey.
                 * @type {bookworm.DocumentKey}
                 */
                this.documentKey = documentKey;
            },

            /**
             * Fetches document metadata node from cache.
             * @param {string} metaName
             * @returns {*}
             */
            getDocumentMeta: function (metaName) {
                return this.getNode(metaName);
            },

            /**
             * Retrieves Field entity matching the specified field name.
             * @param {string} fieldName
             * @returns {bookworm.Field}
             */
            getField: function (fieldName) {
                return this.documentKey.getFieldKey(fieldName).toField();
            }
        });
});

troop.amendPostponed(bookworm, 'DocumentKey', function () {
    "use strict";

    bookworm.DocumentKey
        .addMethods(/** @lends bookworm.DocumentKey */{
            /**
             * Creates Document instance based on the current document key.
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
             * Creates Document instance based on the current string as key.
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
             * Creates Document instance based on the current Array of strings as key.
             * @returns {bookworm.Document}
             */
            toDocument: function () {
                return bookworm.Document.create(this.toDocumentKey());
            }
        },
        false, false, false
    );
}());
