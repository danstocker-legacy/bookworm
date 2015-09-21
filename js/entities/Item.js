/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Item', function () {
    "use strict";

    var base = bookworm.Field,
        self = base.extend(),
        shallowCopy = sntls.Utils.shallowCopy;

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
            },

            /**
             * Fetches attribute entity that holds the items the current item belongs to.
             * @returns {bookworm.Entity}
             */
            getParentEntity: function () {
                return this.entityKey.getFieldKey().toField()
                    .getValueEntity();
            },

            /**
             * Sets item in collection. When the item is already present, it just replaces the item node.
             * When it's not present yet, the item gets appended to the rest, triggering appropriate events.
             * @param {*} node Item node to be set in the collection.
             * @returns {bookworm.Item}
             */
            setNode: function (node) {
                var that = this,
                    parentEntity = this.getParentEntity(),
                    parentKey = parentEntity.entityKey,
                    parentNodeBefore = shallowCopy(parentEntity.getSilentNode()),
                    nodeToAppend = {},
                    itemId = this.entityKey.itemId;

                nodeToAppend[itemId] = node;

                bookworm.entities.appendNode(parentKey.getEntityPath(), nodeToAppend, function () {
                    var parentNodeAfter = parentEntity.getNode();

                    parentKey.spawnEvent(that.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(parentNodeBefore)
                        .setAfterNode(parentNodeAfter)
                        .setAffectedKey(that.entityKey)
                        .triggerSync();
                });

                return this;
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
