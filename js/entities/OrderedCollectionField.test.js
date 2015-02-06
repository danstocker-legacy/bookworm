/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Ordered Collection Field");

    test("Field surrogate", function () {
        var collection,
            testedField;

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                testedField = this.toString();
                return 'ordered-collection';
            }
        });

        collection = bookworm.Field.create('foo/bar/baz'.toFieldKey());

        bookworm.FieldKey.removeMocks();

        equal(testedField, 'foo/bar/baz', "should test field type");
        ok(collection.isA(bookworm.OrderedCollectionField),
            "should return OrderedCollectionField instance when field type is 'ordered-collection'");
    });

    test("Item order getter", function () {
        expect(4);

        var orderedCollection = bookworm.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            orderNode = {};

        bookworm.Item.addMocks({
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

        bookworm.Item.removeMocks();
    });

    test("Item key getter by order", function () {
        expect(5);

        var orderedCollection = bookworm.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {
                a: 3,
                b: 1,
                c: 0,
                d: 2
            },
            itemKey;

        orderedCollection.addMocks({
            getItems: function () {
                ok(true, "should fetch collection items node");
                return itemsNode;
            },

            getItemOrder: function (itemId) {
                return itemsNode[itemId];
            }
        });

        equal(typeof orderedCollection.getItemKeyByOrder(10), 'undefined', "should return undefined for absent order");

        itemKey = orderedCollection.getItemKeyByOrder(2);

        ok(itemKey.isA(bookworm.ItemKey), "should return ItemKey instance");
        strictEqual(itemKey.toString(), 'foo/bar/baz/d',
            "should return ItemKey matching the specified order");
    });

    test("Item getter by order", function () {
        expect(5);

        var orderedCollection = bookworm.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {
                a: 3,
                b: 1,
                c: 0,
                d: 2
            },
            item;

        orderedCollection.addMocks({
            getItems: function () {
                ok(true, "should fetch collection items node");
                return itemsNode;
            },

            getItemOrder: function (itemId) {
                return itemsNode[itemId];
            }
        });

        equal(typeof orderedCollection.getItemByOrder(10), 'undefined', "should return undefined for absent order");

        item = orderedCollection.getItemByOrder(2);

        ok(item.isA(bookworm.Item), "should return Item instance");
        strictEqual(item.entityKey.toString(), 'foo/bar/baz/d',
            "should return item with ItemKey matching the specified order");
    });

    test("Max order getter", function () {
        var orderedCollection = bookworm.OrderedCollectionField.create('foo/bar/baz'.toFieldKey()),
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
