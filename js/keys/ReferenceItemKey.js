/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'ReferenceItemKey', function () {
    "use strict";

    var base = bookworm.ItemKey,
        self = base.extend();

    /**
     * Creates ReferenceItemKey instance.
     * ReferenceItemKey instances may also be created via conversion from string, array,
     * as well as instantiating `ItemKey` or `EntityKey` with suitable arguments.
     * @name bookworm.ReferenceItemKey.create
     * @function
     * @param {string} documentType Identifies type of document the current item belongs to.
     * @param {string} documentId Identifies the document (within document type) the current item belongs to.
     * @param {string} fieldName Identifies field (within document) the current item belongs to.
     * @param {string} ref Serialized `DocumentKey` identifying the referred document.
     * @returns {bookworm.ReferenceItemKey}
     */

    /**
     * The ReferenceItemKey identifies an item node in the cache, the item ID of which is a document reference
     * (serialized `DocumentKey`).
     * @class
     * @extends bookworm.ItemKey
     */
    bookworm.ReferenceItemKey = self
        .addMethods(/** @lends bookworm.ReferenceItemKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @param {string} ref
             * @ignore
             */
            init: function (documentType, documentId, fieldName, ref) {
                base.init.call(this, documentType, documentId, fieldName, ref);

                /**
                 * Key referenced by item ID.
                 * @type {bookworm.DocumentKey}
                 */
                this.referenceKey = ref.toDocumentKey();
            }
        });
});

troop.amendPostponed(bookworm, 'ItemKey', function () {
    "use strict";

    bookworm.ItemKey
        .addSurrogate(bookworm, 'ReferenceItemKey', function (documentType, documentId, fieldName, itemId) {
            return itemId.toDocumentKey().documentId;
        });
});

troop.amendPostponed(bookworm, 'EntityKey', function () {
    "use strict";

    bookworm.EntityKey
        .addSurrogate(bookworm, 'ReferenceItemKey', function () {
            return arguments.length === 4 &&
                   arguments[3].toDocumentKey().documentId;
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isReferenceItemKey: function (expr) {
            return bookworm.ReferenceItemKey.isBaseOf(expr);
        },

        isReferenceItemKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.ReferenceItemKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to a `ReferenceItemKey` instance. Assumes the string to be a serialized `ReferenceItemKey`.
             * @returns {bookworm.ReferenceItemKey}
             */
            toReferenceItemKey: function () {
                var parts = this.split('/');
                return bookworm.ReferenceItemKey.create(
                    decodeURIComponent(parts[0]),
                    decodeURIComponent(parts[1]),
                    decodeURIComponent(parts[2]),
                    decodeURIComponent(parts[3])
                );

            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` (of strings) to a `ReferenceItemKey` instance.
             * Assumes the array to be a reference item key in array notation.
             * @returns {bookworm.ReferenceItemKey}
             */
            toReferenceItemKey: function () {
                return bookworm.ReferenceItemKey.create(this[0], this[1], this[2], this[3]);
            }
        },
        false, false, false
    );
}());
