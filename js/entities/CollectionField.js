/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'CollectionField', function () {
    "use strict";

    var base = dache.Field,
        self = base.extend();

    /**
     * @name dache.CollectionField.create
     * @function
     * @param {dache.FieldKey} fieldKey
     * @returns {dache.CollectionField}
     */

    /**
     * @class
     * @extends dache.Field
     */
    dache.CollectionField = self
        .addMethods(/** @lends dache.CollectionField# */{
            /**
             * Fetches node from cache containing collection items.
             * @returns {object}
             */
            getItems: function () {
                return this.getFieldValue();
            },

            /**
             * Fetches items node wrapped in a Collection.
             * @returns {sntls.Collection}
             */
            getItemsAsCollection: function () {
                return sntls.Collection.create(this.getFieldValue());
            }
        });
});

troop.amendPostponed(dache, 'Field', function () {
    "use strict";

    dache.Field
        .addSurrogate(dache, 'CollectionField', function (/**dache.FieldKey*/fieldKey) {
            return fieldKey.getFieldType() === 'collection';
        });
});
