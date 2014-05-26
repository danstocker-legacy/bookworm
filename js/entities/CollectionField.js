/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'CollectionField', function () {
    "use strict";

    var base = bookworm.Field,
        self = base.extend();

    /**
     * @name bookworm.CollectionField.create
     * @function
     * @param {bookworm.FieldKey} fieldKey
     * @returns {bookworm.CollectionField}
     */

    /**
     * @class
     * @extends bookworm.Field
     */
    bookworm.CollectionField = self
        .addMethods(/** @lends bookworm.CollectionField# */{
            /**
             * Fetches node from cache containing collection items.
             * @returns {object}
             */
            getItems: function () {
                return this.getValue();
            },

            /**
             * Fetches items node wrapped in a Collection.
             * @returns {sntls.Collection}
             */
            getItemsAsCollection: function () {
                return sntls.Collection.create(this.getValue());
            }
        });
});

troop.amendPostponed(bookworm, 'Field', function () {
    "use strict";

    bookworm.Field
        .addSurrogate(bookworm, 'CollectionField', function (/**bookworm.FieldKey*/fieldKey) {
            return fieldKey.getFieldType() === 'collection';
        });
});
