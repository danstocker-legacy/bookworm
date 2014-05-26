/*global dessert, troop, sntls, flock, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Collection Field");

    test("Field surrogate", function () {
        expect(4);

        var collection,
            testedField;

        b$.FieldKey.addMocks({
            getFieldType: function () {
                testedField = this.toString();
                return 'collection';
            }
        });

        collection = b$.Field.create('foo/bar/baz'.toFieldKey());

        b$.FieldKey.removeMocks();

        ok(collection.isA(b$.CollectionField), "should return CollectionField instance when field type is 'collection'");
        equal(testedField, 'foo/bar/baz', "should test field type");

        b$.FieldKey.addMocks({
            getFieldType: function () {
                return 'string';
            }
        });

        collection = b$.Field.create('foo/bar/baz'.toFieldKey());
        ok(collection.isA(b$.Field),
            "should return Field instance when field type is not 'collection'");
        ok(!collection.isA(b$.CollectionField),
            "should return plain Field instance when field type is not 'collection'");

        b$.FieldKey.removeMocks();
    });

    test("Items getter", function () {
        expect(2);

        var collection = b$.CollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {},
            result;

        b$.Field.addMocks({
            getValue: function () {
                equal(this.fieldKey.toString(), 'foo/bar/baz', "should get field value");
                return itemsNode;
            }
        });

        result = collection.getItems();

        strictEqual(result, itemsNode, "should return Collection instance with the field value in it");

        b$.Field.removeMocks();
    });

    test("Collection getter", function () {
        expect(3);

        var collection = b$.CollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {},
            result;

        b$.Field.addMocks({
            getValue: function () {
                equal(this.fieldKey.toString(), 'foo/bar/baz', "should get field value");
                return itemsNode;
            }
        });

        result = collection.getItemsAsCollection();

        ok(result.isA(sntls.Collection), "should return Collection instance");
        strictEqual(result.items, itemsNode, "should return Collection instance with the field value in it");

        b$.Field.removeMocks();
    });
}());
