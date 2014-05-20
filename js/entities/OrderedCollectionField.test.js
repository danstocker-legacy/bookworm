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

    test("Item order getter", function () {
        expect(7);

        var orderedCollection = dache.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            getNodeArgs = [],
            orderNode = {};

        dache.Item.addMocks({
            getNode: function () {
                // called twice
                equal(this.itemKey.toString(), 'foo/bar/baz/hello', "should fetch item node from cache");
                getNodeArgs.push(arguments);
                return orderNode;
            }
        });

        dache.ItemKey.addMocks({
            hasItemMeta: function () {
                // called twice
                equal(this.toString(), 'foo/bar/baz/hello', "should test for item meta");
                return true;
            }
        });

        strictEqual(orderedCollection.getItemOrder('hello'), orderNode, "should return order node");

        dache.ItemKey.removeMocks();

        dache.ItemKey.addMocks({
            hasItemMeta: function () {
                return false;
            }
        });

        strictEqual(orderedCollection.getItemOrder('hello'), orderNode, "should return order node");

        dache.ItemKey.removeMocks();

        dache.Item.removeMocks();

        deepEqual(getNodeArgs, [
            {0: 'order'},
            {}
        ], "should pass correct meta name to getNode");
    });

    test("Item key getter by order", function () {
        expect(6);

        var orderedCollection = dache.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            traversedItemsIds = [],
            result;

        dache.OrderedCollectionField.addMocks({
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
        deepEqual(traversedItemsIds.sort(), ['foo', 'bar', 'baz'].sort(), "should get order until matching order found");

        result = orderedCollection.getItemKeyByOrder(0);
        ok(result.isA(dache.ItemKey), "should return ItemKey instance");
        equal(result.itemId, 'foo', "should return ItemKey with matching item ID");

        dache.OrderedCollectionField.removeMocks();
    });
}());
