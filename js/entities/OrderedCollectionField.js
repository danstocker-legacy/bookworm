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
        });
});

troop.amendPostponed(dache, 'Field', function () {
    "use strict";

    dache.Field
        .addSurrogate(dache, 'OrderedCollectionField', function (/**dache.FieldKey*/fieldKey) {
            return fieldKey.getFieldType() === 'ordered-collection';
        });
});
