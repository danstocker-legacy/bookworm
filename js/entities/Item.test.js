/*global dessert, troop, sntls, flock, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Collection Item");

    test("Instantiation", function () {
        raises(function () {
            b$.Item.create();
        }, "should raise exception on missing item key argument");

        raises(function () {
            b$.Item.create('foo/bar/baz'.toFieldKey());
        }, "should raise exception on invalid item key argument");

        var item = b$.Item.create('foo/bar/baz/hello'.toItemKey());

        strictEqual(item.itemKey, item.entityKey, "should set item key");
    });

    test("Conversion from String", function () {
        var item = 'foo/bar/baz/hello'.toItem();

        ok(item.isA(b$.Item), "should return Item instance");
        equal(item.itemKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Conversion from Array", function () {
        var item = ['foo', 'bar', 'baz', 'hello'].toItem();

        ok(item.isA(b$.Item), "should return Item instance");
        equal(item.itemKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Conversion from FieldKey", function () {
        var itemKey = ['foo', 'bar', 'baz', 'hello'].toItemKey(),
            item = itemKey.toItem();

        ok(item.isA(b$.Item), "should return Item instance");
        equal(item.itemKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Item meta getter", function () {
        expect(2);

        var item = 'foo/bar/baz/hello'.toItem(),
            metaNode = {};

        b$.Item.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'world'},
                    "should fetch the metadata node from right under the entity node");
                return metaNode;
            }
        });

        strictEqual(item.getItemMeta('world'), metaNode, "should return meta node");

        b$.Item.removeMocks();
    });

    test("Item value getter", function () {
        expect(2);

        var item = 'foo/bar/baz/hello'.toItem(),
            valueNode = {};

        b$.Item.addMocks({
            getNode: function () {
                deepEqual(arguments, {},
                    "should fetch value node");
                return valueNode;
            }
        });

        strictEqual(item.getItemValue(), valueNode, "should return value node");

        b$.Item.removeMocks();
    });

    test("Item value setter", function () {
        expect(2);

        var item = 'foo/bar/baz/hello'.toItem(),
            valueNode = {};

        b$.Item.addMocks({
            setNode: function (value) {
                deepEqual(arguments, {0: valueNode}, "should set specified value on item node");
            }
        });

        strictEqual(item.setItemValue(valueNode), item, "should be chainable");

        b$.Item.removeMocks();
    });
}());
