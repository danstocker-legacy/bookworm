/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'ItemKey', function () {
    "use strict";

    var base = dache.FieldKey,
        self = base.extend();

    /**
     * @name dache.ItemKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @param {string} fieldName
     * @param {string} itemId
     * @returns {dache.ItemKey}
     */

    /**
     * @class
     * @extends dache.FieldKey
     */
    dache.ItemKey = self
        .addMethods(/** @lends dache.ItemKey# */{
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
             * @param {dache.ItemKey} itemKey
             * @returns {boolean}
             */
            equals: function (itemKey) {
                return dache.FieldKey.equals.call(this, itemKey) &&
                       this.itemId === itemKey.itemId;
            },

            /**
             * Creates a field key identifying the Item entity's parent Field entity.
             * @returns {dache.FieldKey}
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
                return dache.metadata.getNode(this.getMetaPath().appendKey('hasItemMeta'));
            },

            /**
             * Retrieves item type string for the Item entity identified by the current key.
             * @returns {string}
             */
            getItemType: function () {
                return dache.metadata.getNode(this.getMetaPath().appendKey('itemType'));
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return dache.FieldKey.toString.call(this) + '/' + encodeURIComponent(this.itemId);
            }
        });
});

troop.amendPostponed(dache, 'Key', function () {
    "use strict";

    dache.EntityKey
        .addSurrogate(dache, 'ItemKey', function () {
            return arguments.length >= 4 && !arguments[3].toDocumentKey().documentId;
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isItemKey: function (expr) {
            return dache.ItemKey.isBaseOf(expr);
        },

        isItemKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   dache.ItemKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {dache.ItemKey}
             */
            toItemKey: function () {
                var parts = this.split('/');

                return dache.ItemKey.create(
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
             * @returns {dache.ItemKey}
             */
            toItemKey: function () {
                return dache.ItemKey.create(this[0], this[1], this[2], this[3]);
            }
        },
        false, false, false
    );
}());
