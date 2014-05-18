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

troop.amendPostponed(dache, 'FieldKey', function () {
    "use strict";

    dache.FieldKey
        .addMethods(/** @lends dache.FieldKey# */{
            /**
             * Creates CollectionField instance based on the current field key.
             * @returns {dache.CollectionField}
             */
            toCollectionField: function () {
                return dache.CollectionField.create(this);
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

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Creates CollectionField instance based on the current string as key.
             * @returns {dache.CollectionField}
             */
            toCollectionField: function () {
                return dache.CollectionField.create(this.toFieldKey());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates CollectionField instance based on the current Array of string as key.
             * @returns {dache.CollectionField}
             */
            toCollectionField: function () {
                return dache.CollectionField.create(this.toFieldKey());
            }
        },
        false, false, false
    );
}());
