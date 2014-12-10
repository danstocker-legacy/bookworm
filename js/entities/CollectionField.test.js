/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Collection Field");

    test("Field surrogate", function () {
        expect(4);

        var collection,
            testedField;

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                testedField = this.toString();
                return 'collection';
            }
        });

        collection = bookworm.Field.create('foo/bar/baz'.toFieldKey());

        bookworm.FieldKey.removeMocks();

        ok(collection.isA(bookworm.CollectionField), "should return CollectionField instance when field type is 'collection'");
        equal(testedField, 'foo/bar/baz', "should test field type");

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                return 'string';
            }
        });

        collection = bookworm.Field.create('foo/bar/baz'.toFieldKey());
        ok(collection.isA(bookworm.Field),
            "should return Field instance when field type is not 'collection'");
        ok(!collection.isA(bookworm.CollectionField),
            "should return plain Field instance when field type is not 'collection'");

        bookworm.FieldKey.removeMocks();
    });

    test("Items getter", function () {
        expect(2);

        var collection = bookworm.CollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {},
            result;

        bookworm.Field.addMocks({
            getValue: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should get field value");
                return itemsNode;
            }
        });

        result = collection.getItems();

        strictEqual(result, itemsNode, "should return Collection instance with the field value in it");

        bookworm.Field.removeMocks();
    });

    test("Collection getter", function () {
        expect(3);

        var collection = bookworm.CollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {},
            result;

        bookworm.Field.addMocks({
            getValue: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should get field value");
                return itemsNode;
            }
        });

        result = collection.getItemsAsCollection();

        ok(result.isA(sntls.Collection), "should return Collection instance");
        strictEqual(result.items, itemsNode, "should return Collection instance with the field value in it");

        bookworm.Field.removeMocks();
    });

    test("Item getter", function () {
        var collection = bookworm.CollectionField.create('foo/bar/baz'.toFieldKey()),
            result;

        result = collection.getItem('A');

        ok(result.isA(bookworm.Item), "should return Item instance");
        equal(result.entityKey.toString(), 'foo/bar/baz/A', "should set the correct item key on the returned Item");
    });
}());
