/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'OrderedCollectionField', function () {
    "use strict";

    var base = dache.CollectionField,
        self = base.extend();

    /**
     * @name dache.OrderedCollectionField.create
     * @function
     * @returns {dache.OrderedCollectionField}
     */

    /**
     * @class
     * @extends dache.CollectionField
     */
    dache.OrderedCollectionField = self
        .addMethods(/** @lends dache.OrderedCollectionField# */{
            /**
             * Fetches item order for specified item ID.
             * @param {string} itemId
             * @returns {number}
             */
            getItemOrder: function (itemId) {
                var itemKey = this.fieldKey.getItemKey(itemId),
                    item = itemKey.toItem();

                return itemKey.hasItemMeta() ?
                    item.getItemMeta('order') :
                    item.getNode();
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

troop.amendPostponed(dache, 'Field', function () {
    "use strict";

    dache.Field
        .addSurrogate(dache, 'OrderedCollectionField', function (/**dache.FieldKey*/fieldKey) {
            return fieldKey.getFieldType() === 'ordered-collection';
        });
});
