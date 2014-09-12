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
                equal(this.entityKey.toString(), 'foo/bar/baz/hello', "should fetch attribute for specified item");
                ok(attribute, 'order', "should attempt to fetch order attribute");
                return undefined;
            },

            getValue: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz/hello', "should fetch value node of specified item");
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
            getItems: function () {
                // called twice
                equal(this.entityKey.toString(), 'foo/bar/baz', "should fetch collection items");
                return {
                    'foo': 1,
                    'bar': 2,
                    'baz': 3
                };
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

    test("Item getter by order", function () {
        expect(3);

        var orderedCollection = b$.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            itemKey = 'item>key'.toItemKey(),
            item;

        orderedCollection.addMocks({
            getItemKeyByOrder: function (order) {
                equal(order, 2, "should fetch item key by order");
                return itemKey;
            }
        });

        item = orderedCollection.getItemByOrder(2);

        ok(item.isA(b$.Item), "should return Item instance");
        strictEqual(item.entityKey, itemKey,
            "should return item with ItemKey matching the specified order");
    });

    test("Max order getter", function () {
        var orderedCollection = b$.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {
                A: 2,
                B: 12,
                C: 0,
                D: 3
            };

        orderedCollection.addMocks({
            getItems: function () {
                ok(true, "should fetch items node");
                return itemsNode;
            },

            getItemOrder: function (itemId) {
                return itemsNode[itemId];
            }
        });

        equal(orderedCollection.getMaxOrder(), 12, "should get highest order");
    });
}());
