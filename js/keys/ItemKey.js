/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'ItemKey', function () {
    "use strict";

    var base = bookworm.FieldKey,
        self = base.extend();

    /**
     * @name bookworm.ItemKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @param {string} fieldName
     * @param {string} itemId
     * @returns {bookworm.ItemKey}
     */

    /**
     * @class
     * @extends bookworm.FieldKey
     */
    bookworm.ItemKey = self
        .addMethods(/** @lends bookworm.ItemKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @param {string} itemId
             * @ignore
             */
            init: function (documentType, documentId, fieldName, itemId) {
                base.init.call(this, documentType, documentId, fieldName);

                /**
                 * Identifies item in collection.
                 * @type {string}
                 */
                this.itemId = itemId;
            },

            /**
             * @param {bookworm.ItemKey} itemKey
             * @returns {boolean}
             */
            equals: function (itemKey) {
                return bookworm.FieldKey.equals.call(this, itemKey) &&
                       this.itemId === itemKey.itemId;
            },

            /**
             * Creates a field key identifying the Item entity's parent Field entity.
             * @returns {bookworm.FieldKey}
             */
            getFieldKey: function () {
                var documentKey = this.documentKey;
                return [documentKey.documentType, documentKey.documentId, this.fieldName].toFieldKey();
            },

            /**
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                var result = base.getEntityPath.call(this);

                if (base.hasFieldMeta.call(this)) {
                    result.appendKey('value');
                }

                result.appendKey(this.itemId);

                return result;
            },

            /**
             * Tells whether Item entity identified by the current key has metadata associated with it.
             * @returns {boolean}
             */
            hasItemMeta: function () {
                return bookworm.metadata.getNode(this.getMetaPath().appendKey('hasItemMeta'));
            },

            /**
             * Retrieves item type string for the Item entity identified by the current key.
             * @returns {string}
             */
            getItemType: function () {
                return bookworm.metadata.getNode(this.getMetaPath().appendKey('itemType'));
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return bookworm.FieldKey.toString.call(this) + '/' + encodeURIComponent(this.itemId);
            }
        });
});

troop.amendPostponed(bookworm, 'EntityKey', function () {
    "use strict";

    bookworm.EntityKey
        .addSurrogate(bookworm, 'ItemKey', function () {
            return arguments.length === 4 &&
                   !arguments[3].toDocumentKey().documentId;
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** Tells whether expression is an ItemKey */
        isItemKey: function (expr) {
            return bookworm.ItemKey.isBaseOf(expr);
        },

        /** Tells whether expression is optionally an ItemKey */
        isItemKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.ItemKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to ItemKey.
             * @returns {bookworm.ItemKey}
             */
            toItemKey: function () {
                var parts = this.split('/');

                return bookworm.ItemKey.create(
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
             * Converts Array of strings to ItemKey.
             * @returns {bookworm.ItemKey}
             */
            toItemKey: function () {
                return bookworm.ItemKey.create(this[0], this[1], this[2], this[3]);
            }
        },
        false, false, false
    );
}());
