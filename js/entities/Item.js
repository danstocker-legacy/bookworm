/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Item', function () {
    "use strict";

    var base = bookworm.Field,
        self = base.extend();

    /**
     * Creates an Item instance.
     * @name bookworm.Item.create
     * @function
     * @param {bookworm.ItemKey} itemKey
     * @returns {bookworm.Item}
     */

    /**
     * The Item class implements an API for collection item nodes in the cache.
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
                 * @name bookworm.Item#entityKey
                 * @type {bookworm.ItemKey}
                 */
            }
        });
});

troop.amendPostponed(bookworm, 'Entity', function () {
    "use strict";

    bookworm.Entity
        .addSurrogate(bookworm, 'Item', function (entityKey) {
            return entityKey.isA(bookworm.ItemKey);
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
             * Converts `String` to `Item` instance, assuming the string is a serialized `ItemKey`.
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
             * Converts `Array` to `Item` instance, assuming the array is an item key in array notation.
             * @returns {bookworm.Item}
             */
            toItem: function () {
                return bookworm.Item.create(this.toItemKey());
            }
        },
        false, false, false
    );
}());
