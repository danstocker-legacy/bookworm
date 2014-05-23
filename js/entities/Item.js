/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Item', function () {
    "use strict";

    var base = bookworm.Field,
        self = base.extend();

    /**
     * @name bookworm.Item.create
     * @function
     * @param {bookworm.ItemKey} itemKey
     * @returns {bookworm.Item}
     */

    /**
     * @class
     * @extends bookworm.Field
     */
    bookworm.Item = self
        .addMethods(/** @lends bookworm.Item# */{
            /**
             * @param {bookworm.ItemKey} itemKey
             * @ignore
             */
            init: function (itemKey) {
                dessert.isItemKey(itemKey, "Invalid item key");

                base.init.call(this, itemKey);

                /**
                 * Item key associated with current entity.
                 * Same as entityKey.
                 * @type {bookworm.ItemKey}
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
             * @returns {bookworm.Item}
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

troop.amendPostponed(bookworm, 'ItemKey', function () {
    "use strict";

    bookworm.ItemKey
        .addMethods(/** @lends bookworm.ItemKey */{
            /**
             * Creates Item instance based on the current item key.
             * @returns {bookworm.Item}
             */
            toItem: function () {
                return bookworm.Item.create(this);
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
             * @returns {bookworm.Item}
             */
            toItem: function () {
                return bookworm.Item.create(this.toItemKey());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates Item instance based on the current Array of string as key.
             * @returns {bookworm.Item}
             */
            toItem: function () {
                return bookworm.Item.create(this.toItemKey());
            }
        },
        false, false, false
    );
}());
