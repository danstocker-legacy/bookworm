/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'ReferenceItemKey', function () {
    "use strict";

    var base = bookworm.ItemKey,
        self = base.extend();

    /**
     * @name bookworm.ReferenceItemKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @param {string} fieldName
     * @param {string} ref
     * @returns {bookworm.ReferenceItemKey}
     */

    /**
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
        /** Tells whether expression is a ReferenceItemKey */
        isReferenceItemKey: function (expr) {
            return bookworm.ReferenceItemKey.isBaseOf(expr);
        },

        /** Tells whether expression is optionally a ReferenceItemKey */
        isReferenceItemKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.ReferenceItemKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to ReferenceItemKey.
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
             * Converts Array of strings to ReferenceItemKey.
             * @returns {bookworm.ReferenceItemKey}
             */
            toReferenceItemKey: function () {
                return bookworm.ReferenceItemKey.create(this[0], this[1], this[2], this[3]);
            }
        },
        false, false, false
    );
}());
