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
                var itemKey = this.fieldKey.getItemKey(itemId),
                    item = itemKey.toItem();

                return item.getAttribute('order') ||
                       item.getValue();
            },

            /**
             * Retrieves item key from collection matching the specified order.
             * @param {number} order
             * @returns {undefined}
             */
            getItemKeyByOrder: function (order) {
                var that = this,
                    result;

                this.getItemsAsCollection()
                    .forEachItem(function (item, itemId) {
                        if (that.getItemOrder(itemId) === order) {
                            result = that.fieldKey.getItemKey(itemId);
                            return false;
                        }
                    });

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
