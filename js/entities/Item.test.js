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

    test("Item attribute getter", function () {
        expect(3);

        var item = 'foo/bar/baz/A'.toItem(),
            attributePath = {},
            attributeNode = {};

        item.itemKey.addMocks({
            getAttributePath: function (attribute) {
                equal(attribute, 'hello', "should fetch path for specified attribute");
                return attributePath;
            }
        });

        b$.documents.addMocks({
            getNode: function (path) {
                strictEqual(path, attributePath, "should fetch node at attribute path");
                return attributeNode;
            }
        });

        strictEqual(item.getAttribute('hello'), attributeNode, "should return attribute node");

        b$.documents.removeMocks();
    });

    test("Item attribute setter", function () {
        expect(4);

        var item = 'foo/bar/baz/A'.toItem(),
            attributePath = {},
            attributeNode = {};

        item.itemKey.addMocks({
            getAttributePath: function (attribute) {
                ok(true, "should fetch attribute path for current key");
                return attributePath;
            }
        });

        b$.documents.addMocks({
            setNode: function (path, node) {
                strictEqual(path, attributePath, "should set node at attribute path");
                strictEqual(node, attributeNode, "should set specified value at attribute path");
            }
        });

        strictEqual(item.setAttribute('hello', attributeNode), item, "should be chainable");

        b$.documents.removeMocks();
    });

    test("Item value getter", function () {
        expect(3);

        var item = 'foo/bar/baz/A'.toItem(),
            valuePath = {},
            valueNode = {};

        item.itemKey.addMocks({
            getValuePath: function () {
                ok(true, "should fetch value path for current key");
                return valuePath;
            }
        });

        b$.documents.addMocks({
            getNode: function (path) {
                strictEqual(path, valuePath, "should fetch node at specified value path");
                return valueNode;
            }
        });

        strictEqual(item.getValue(), valueNode, "should return value node");

        b$.documents.removeMocks();
    });

    test("Item value setter", function () {
        expect(4);

        var item = 'foo/bar/baz/A'.toItem(),
            valuePath = {},
            valueNode = {};

        item.itemKey.addMocks({
            getValuePath: function () {
                ok(true, "should fetch value path for current key");
                return valuePath;
            }
        });

        b$.documents.addMocks({
            setNode: function (path, value) {
                strictEqual(path, valuePath, "should set node at specified value path");
                strictEqual(value, valueNode, "should set specified value node at path");
            }
        });

        strictEqual(item.setValue(valueNode), item, "should be chainable");

        b$.documents.removeMocks();
    });
}());
