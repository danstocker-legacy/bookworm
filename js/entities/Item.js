/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'Item', function () {
    "use strict";

    var base = dache.Field,
        self = base.extend();

    /**
     * @name dache.Item.create
     * @function
     * @param {dache.ItemKey} itemKey
     * @returns {dache.Item}
     */

    /**
     * @class
     * @extends dache.Field
     */
    dache.Item = self
        .addMethods(/** @lends dache.Item# */{
            /**
             * @param {dache.ItemKey} itemKey
             * @ignore
             */
            init: function (itemKey) {
                dessert.isItemKey(itemKey, "Invalid item key");

                base.init.call(this, itemKey);

                /**
                 * Item key associated with current entity.
                 * Same as entityKey.
                 * @type {dache.ItemKey}
                 */
                this.itemKey = itemKey;
            },

            /**
             * Fetches item metadata node from cache.
             * @param {string} metaName
             * @returns {*}
             */
            getItemMeta: function (metaName) {
                return this.itemKey.hasItemMeta() ?
                    this.getNode(metaName) :
                    undefined;
            },

            /**
             * Fetches item value node from cache.
             * @returns {*}
             */
            getItemValue: function () {
                return this.itemKey.hasItemMeta() ?
                    this.getNode('value') :
                    this.getNode();
            },

            /**
             * Replaces item value node with the specified value.
             * @param {*} value
             * @returns {dache.Item}
             */
            setItemValue: function (value) {
                if (this.itemKey.hasItemMeta()) {
                    this.setNode(value, 'value');
                } else {
                    this.setNode(value);
                }

                return this;
            }
        });
});

troop.amendPostponed(dache, 'ItemKey', function () {
    "use strict";

    dache.ItemKey
        .addMethods(/** @lends dache.ItemKey */{
            /**
             * Creates Item instance based on the current item key.
             * @returns {dache.Item}
             */
            toItem: function () {
                return dache.Item.create(this);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Creates Item instance based on the current string as key.
             * @returns {dache.Item}
             */
            toItem: function () {
                return dache.Item.create(this.toItemKey());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates Item instance based on the current Array of string as key.
             * @returns {dache.Item}
             */
            toItem: function () {
                return dache.Item.create(this.toItemKey());
            }
        },
        false, false, false
    );
}());
