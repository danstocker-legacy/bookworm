/*global dessert, troop, sntls, flock, dache */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Collection Item");

    test("Instantiation", function () {
        raises(function () {
            dache.Item.create();
        }, "should raise exception on missing item key argument");

        raises(function () {
            dache.Item.create('foo/bar/baz'.toFieldKey());
        }, "should raise exception on invalid item key argument");

        var item = dache.Item.create('foo/bar/baz/hello'.toItemKey());

        strictEqual(item.itemKey, item.entityKey, "should set item key");
    });

    test("Conversion from String", function () {
        var item = 'foo/bar/baz/hello'.toItem();

        ok(item.isA(dache.Item), "should return Item instance");
        equal(item.itemKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Conversion from Array", function () {
        var item = ['foo', 'bar', 'baz', 'hello'].toItem();

        ok(item.isA(dache.Item), "should return Item instance");
        equal(item.itemKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Conversion from FieldKey", function () {
        var itemKey = ['foo', 'bar', 'baz', 'hello'].toItemKey(),
            item = itemKey.toItem();

        ok(item.isA(dache.Item), "should return Item instance");
        equal(item.itemKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Item meta getter", function () {
        expect(4);

        var item = 'foo/bar/baz/hello'.toItem(),
            metaNode = {};

        dache.Item.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'world'},
                    "should fetch the metadata node from right under the entity node");
                return metaNode;
            }
        });

        dache.ItemKey.addMocks({
            hasItemMeta: function () {
                equal(this.toString(), 'foo/bar/baz/hello', "should test for item metadata");
                return true;
            }
        });

        strictEqual(item.getItemMeta('world'), metaNode, "should return meta node");

        dache.ItemKey.removeMocks();

        dache.ItemKey.addMocks({
            hasItemMeta: function () {
                return false;
            }
        });

        equal(typeof item.getItemMeta('world'), 'undefined',
            "should return undefined when item has no metadata");

        dache.ItemKey.removeMocks();

        dache.Item.removeMocks();
    });

    test("Item value getter", function () {
        expect(4);

        var item = 'foo/bar/baz/hello'.toItem(),
            valueNode = {};

        dache.Item.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'value'},
                    "should fetch value node when item has meta");
                return valueNode;
            }
        });

        dache.ItemKey.addMocks({
            hasItemMeta: function () {
                equal(this.toString(), 'foo/bar/baz/hello', "should test for item metadata");
                return true;
            }
        });

        strictEqual(item.getItemValue(), valueNode, "should return value node");

        dache.Item.removeMocks();
        dache.ItemKey.removeMocks();

        dache.Item.addMocks({
            getNode: function () {
                equal(arguments.length, 0, "should fetch item node when field has no meta");
                return valueNode;
            }
        });

        dache.ItemKey.addMocks({
            hasItemMeta: function () {
                return false;
            }
        });

        item.getFieldValue();

        dache.Item.removeMocks();
        dache.ItemKey.removeMocks();
    });

    test("Item value setter", function () {
        expect(4);

        var item = 'foo/bar/baz/hello'.toItem(),
            valueNode = {};

        dache.Item.addMocks({
            setNode: function (value) {
                deepEqual(arguments, {0: valueNode, 1: 'value'},
                    "should set specified value on value node when item has meta");
            }
        });

        dache.ItemKey.addMocks({
            hasItemMeta: function () {
                equal(this.toString(), 'foo/bar/baz/hello', "should test for item metadata");
                return true;
            }
        });

        strictEqual(item.setItemValue(valueNode), item, "should be chainable");

        dache.Item.removeMocks();
        dache.ItemKey.removeMocks();

        dache.Item.addMocks({
            setNode: function () {
                deepEqual(arguments, {0: valueNode},
                    "should set item node when field has no meta");
                return valueNode;
            }
        });

        dache.ItemKey.addMocks({
            hasItemMeta: function () {
                return false;
            }
        });

        item.setItemValue(valueNode);

        dache.Item.removeMocks();
        dache.ItemKey.removeMocks();
    });
}());
