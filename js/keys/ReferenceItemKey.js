/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'ReferenceItemKey', function () {
    "use strict";

    var base = dache.ItemKey,
        self = base.extend();

    /**
     * @name dache.ReferenceItemKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @param {string} fieldName
     * @param {string} ref
     * @returns {dache.ReferenceItemKey}
     */

    /**
     * @class
     * @extends dache.ItemKey
     */
    dache.ReferenceItemKey = self
        .addMethods(/** @lends dache.ReferenceItemKey# */{
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
                 * @type {dache.DocumentKey}
                 */
                this.referenceKey = ref.toDocumentKey();
            }
        });
});

troop.amendPostponed(dache, 'ItemKey', function () {
    "use strict";

    dache.ItemKey
        .addSurrogate(dache, 'ReferenceItemKey', function (documentType, documentId, fieldName, itemId) {
            return itemId.toDocumentKey().documentId;
        });
});

troop.amendPostponed(dache, 'EntityKey', function () {
    "use strict";

    dache.EntityKey
        .addSurrogate(dache, 'ReferenceItemKey', function () {
            return arguments.length === 4 &&
                   arguments[3].toDocumentKey().documentId;
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** Tells whether expression is a ReferenceItemKey */
        isReferenceItemKey: function (expr) {
            return dache.ReferenceItemKey.isBaseOf(expr);
        },

        /** Tells whether expression is optionally a ReferenceItemKey */
        isReferenceItemKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   dache.ReferenceItemKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to ReferenceItemKey.
             * @returns {dache.ReferenceItemKey}
             */
            toReferenceItemKey: function () {
                var parts = this.split('/');
                return dache.ReferenceItemKey.create(
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
             * @returns {dache.ReferenceItemKey}
             */
            toReferenceItemKey: function () {
                return dache.ReferenceItemKey.create(this[0], this[1], this[2], this[3]);
            }
        },
        false, false, false
    );
}());
