/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Collection Item");

    test("Instantiation", function () {
        raises(function () {
            bookworm.Item.create();
        }, "should raise exception on missing item key argument");

        raises(function () {
            bookworm.Item.create('foo/bar/baz'.toFieldKey());
        }, "should raise exception on invalid item key argument");
    });

    test("Conversion from String", function () {
        var item = 'foo/bar/baz/hello'.toItem();

        ok(item.isA(bookworm.Item), "should return Item instance");
        equal(item.entityKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Conversion from Array", function () {
        var item = ['foo', 'bar', 'baz', 'hello'].toItem();

        ok(item.isA(bookworm.Item), "should return Item instance");
        equal(item.entityKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Conversion from ItemKey", function () {
        var itemKey = ['foo', 'bar', 'baz', 'hello'].toItemKey(),
            item = itemKey.toItem();

        ok(item.isA(bookworm.Item), "should return Item instance");
        equal(item.entityKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Entity surrogate", function () {
        var entity;

        entity = bookworm.Entity.create('foo/bar/baz/0'.toItemKey());
        ok(entity.isA(bookworm.Item), "should return Item instance for ItemKey");
        equal(entity.entityKey.toString(), 'foo/bar/baz/0', "should set correct key");

        entity = bookworm.Entity.create('foo/bar/baz/hello%2Fworld'.toReferenceItemKey());
        ok(entity.isA(bookworm.Item), "should return Item instance for ReferenceItemKey");
    });

    test("Item attribute getter", function () {
        expect(3);

        var item = 'foo/bar/baz/A'.toItem(),
            attributePath = {},
            attributeNode = {};

        item.entityKey.addMocks({
            getAttributePath: function (attribute) {
                equal(attribute, 'hello', "should fetch path for specified attribute");
                return attributePath;
            }
        });

        bookworm.entities.addMocks({
            getNode: function (path) {
                strictEqual(path, attributePath, "should fetch node at attribute path");
                return attributeNode;
            }
        });

        strictEqual(item.getAttribute('hello'), attributeNode, "should return attribute node");

        bookworm.entities.removeMocks();
    });

    test("Item attribute setter", function () {
        expect(4);

        var item = 'foo/bar/baz/A'.toItem(),
            attributePath = {},
            attributeNode = {};

        item.entityKey.addMocks({
            getAttributePath: function (attribute) {
                ok(true, "should fetch attribute path for current key");
                return attributePath;
            }
        });

        bookworm.entities.addMocks({
            setNode: function (path, node) {
                strictEqual(path, attributePath, "should set node at attribute path");
                strictEqual(node, attributeNode, "should set specified value at attribute path");
            }
        });

        strictEqual(item.setAttribute('hello', attributeNode), item, "should be chainable");

        bookworm.entities.removeMocks();
    });

    test("Item value getter", function () {
        expect(3);

        var item = 'foo/bar/baz/A'.toItem(),
            valuePath = {},
            valueNode = {};

        item.entityKey.addMocks({
            getValuePath: function () {
                ok(true, "should fetch value path for current key");
                return valuePath;
            }
        });

        bookworm.entities.addMocks({
            getNode: function (path) {
                strictEqual(path, valuePath, "should fetch node at specified value path");
                return valueNode;
            }
        });

        strictEqual(item.getValue(), valueNode, "should return value node");

        bookworm.entities.removeMocks();
    });

    test("Item value setter", function () {
        expect(4);

        var item = 'foo/bar/baz/A'.toItem(),
            valuePath = {},
            valueNode = {};

        item.entityKey.addMocks({
            getValuePath: function () {
                ok(true, "should fetch value path for current key");
                return valuePath;
            }
        });

        bookworm.entities.addMocks({
            setNode: function (path, value) {
                strictEqual(path, valuePath, "should set node at specified value path");
                strictEqual(value, valueNode, "should set specified value node at path");
            }
        });

        strictEqual(item.setValue(valueNode), item, "should be chainable");

        bookworm.entities.removeMocks();
    });
}());
