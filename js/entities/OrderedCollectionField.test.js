/*global dessert, troop, sntls, flock, dache */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Ordered Collection Field");

    test("Field surrogate", function () {
        var collection,
            testedField;

        dache.FieldKey.addMocks({
            getFieldType: function () {
                testedField = this.toString();
                return 'ordered-collection';
            }
        });

        collection = dache.Field.create('foo/bar/baz'.toFieldKey());

        dache.FieldKey.removeMocks();

        equal(testedField, 'foo/bar/baz', "should test field type");
        ok(collection.isA(dache.OrderedCollectionField),
            "should return OrderedCollectionField instance when field type is 'ordered-collection'");
    });
}());
