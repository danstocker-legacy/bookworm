/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'OrderedCollectionField', function () {
    "use strict";

    var base = bookworm.CollectionField,
        self = base.extend();

    /**
     * @name bookworm.OrderedCollectionField.create
     * @function
     * @returns {bookworm.OrderedCollectionField}
     */

    /**
     * @class
     * @extends bookworm.CollectionField
     */
    bookworm.OrderedCollectionField = self
        .addMethods(/** @lends bookworm.OrderedCollectionField# */{
            /**
             * Fetches item order for specified item ID.
             * @param {string} itemId
             * @returns {number}
             */
            getItemOrder: function (itemId) {
                var itemKey = this.entityKey.getItemKey(itemId),
                    item = itemKey.toItem();

                return item.getAttribute('order') ||
                       item.getValue();
            },

            /**
             * Retrieves ItemKey from collection matching the specified order.
             * @param {number} order
             * @returns {undefined}
             */
            getItemKeyByOrder: function (order) {
                var result,
                    itemsNode = this.getItems(),
                    itemIds,
                    i, itemId;

                if (itemsNode) {
                    itemIds = Object.keys(itemsNode);
                    for (i = 0; i < itemIds.length; i++) {
                        itemId = itemIds[i];
                        if (this.getItemOrder(itemId) === order) {
                            result = this.entityKey.getItemKey(itemId);
                            break;
                        }
                    }
                }

                return result;
            },

            /**
             * Retrieves Item entity from collection matching the specified order.
             * @param {number} order
             * @returns {bookworm.Item}
             */
            getItemByOrder: function (order) {
                var itemKey = this.getItemKeyByOrder(order);
                return itemKey ?
                    itemKey.toItem() :
                    undefined;
            },

            /**
             * Retrieves highest item order from collection.
             * TODO: Implement (optionally) indexed version.
             * @returns {number}
             */
            getMaxOrder: function () {
                var result = Number.MIN_VALUE,
                    itemsNode = this.getItems(),
                    itemIds,
                    i, itemId, itemOrder;

                if (itemsNode) {
                    itemIds = Object.keys(itemsNode);
                    for (i = 0; i < itemIds.length; i++) {
                        itemId = itemIds[i];
                        itemOrder = this.getItemOrder(itemId);
                        if (itemOrder > result) {
                            result = itemOrder;
                        }
                    }
                }

                return result;
            }
        });
});

troop.amendPostponed(bookworm, 'Field', function () {
    "use strict";

    bookworm.Field
        .addSurrogate(bookworm, 'OrderedCollectionField', function (/**bookworm.FieldKey*/fieldKey) {
            return fieldKey.getFieldType() === 'ordered-collection';
        });
});
