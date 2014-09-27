/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'OrderedCollectionField', function () {
    "use strict";

    var base = bookworm.CollectionField,
        self = base.extend();

    /**
     * Creates an OrderedCollectionField instance.
     * OrderedCollectionField instances may be created via `bookworm.Field.create` provided that the `config`
     * cache defines the field type as 'ordered-collection'.
     * @name bookworm.OrderedCollectionField.create
     * @function
     * @param {string} fieldKey Identifies ordered collection field.
     * @returns {bookworm.OrderedCollectionField}
     */

    /**
     * The OrderedCollectionField class defines an API for collections the items of which are in a pre-defined order.
     * Provides methods for accessing information about item order, as well as retrieving items based on order.
     * TODO: Add managed index for fetching items by order.
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
             * Retrieves `ItemKey` from collection matching the specified order.
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
             * Retrieves `Item` entity from collection matching the specified order.
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
