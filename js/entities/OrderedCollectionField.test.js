/*global dessert, troop, sntls, flock, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Ordered Collection Field");

    test("Field surrogate", function () {
        var collection,
            testedField;

        b$.FieldKey.addMocks({
            getFieldType: function () {
                testedField = this.toString();
                return 'ordered-collection';
            }
        });

        collection = b$.Field.create('foo/bar/baz'.toFieldKey());

        b$.FieldKey.removeMocks();

        equal(testedField, 'foo/bar/baz', "should test field type");
        ok(collection.isA(b$.OrderedCollectionField),
            "should return OrderedCollectionField instance when field type is 'ordered-collection'");
    });

    test("Item order getter", function () {
        expect(4);

        var orderedCollection = b$.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            orderNode = {};

        b$.Item.addMocks({
            getAttribute: function (attribute) {
                equal(this.itemKey.toString(), 'foo/bar/baz/hello', "should fetch attribute for specified item");
                ok(attribute, 'order', "should attempt to fetch order attribute");
                return undefined;
            },

            getValue: function () {
                equal(this.itemKey.toString(), 'foo/bar/baz/hello', "should fetch value node of specified item");
                return orderNode;
            }
        });

        strictEqual(orderedCollection.getItemOrder('hello'), orderNode, "should return order node");

        b$.Item.removeMocks();
    });

    test("Item key getter by order", function () {
        expect(6);

        var orderedCollection = b$.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            traversedItemsIds = [],
            result;

        b$.OrderedCollectionField.addMocks({
            getItemsAsCollection: function () {
                // called twice
                equal(this.fieldKey.toString(), 'foo/bar/baz', "should fetch collection items");
                return sntls.Collection.create({
                    'foo': 1,
                    'bar': 2,
                    'baz': 3
                });
            },

            getItemOrder: function (itemId) {
                traversedItemsIds.push(itemId);
                return 0;
            }
        });

        equal(typeof orderedCollection.getItemKeyByOrder(3), 'undefined', "should return undefined for invalid order");
        deepEqual(traversedItemsIds.sort(),
            ['foo', 'bar', 'baz'].sort(),
            "should get order until matching order found");

        result = orderedCollection.getItemKeyByOrder(0);
        ok(result.isA(b$.ItemKey), "should return ItemKey instance");
        equal(result.itemId, 'foo', "should return ItemKey with matching item ID");

        b$.OrderedCollectionField.removeMocks();
    });
}());
