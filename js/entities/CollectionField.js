/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'CollectionField', function () {
    "use strict";

    var base = bookworm.Field,
        self = base.extend();

    /**
     * Creates a CollectionField instance.
     * CollectionField instances may be created via `bookworm.Field.create` provided that the `config` cache defines
     * the field type as 'collection'.
     * @name bookworm.CollectionField.create
     * @function
     * @param {bookworm.FieldKey} fieldKey Identifies collection field.
     * @returns {bookworm.CollectionField}
     */

    /**
     * The CollectionField class implements an API for composite document fields, granting access to items.
     * @class
     * @extends bookworm.Field
     */
    bookworm.CollectionField = self
        .addMethods(/** @lends bookworm.CollectionField# */{
            /**
             * Fetches node from cache containing the collection items.
             * @returns {object}
             */
            getItems: function () {
                return this.getValue();
            },

            /**
             * Fetches items node wrapped in a `Collection` instance.
             * @returns {sntls.Collection}
             */
            getItemsAsCollection: function () {
                return sntls.Collection.create(this.getValue());
            },

            /**
             * Retrieves `Item` entity matching the specified item ID.
             * @param {string} itemId
             * @returns {bookworm.Item}
             */
            getItem: function (itemId) {
                return this.entityKey.getItemKey(itemId).toItem();
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
