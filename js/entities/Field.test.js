/*global dessert, troop, sntls, flock, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Field");

    test("Instantiation", function () {
        raises(function () {
            b$.Field.create();
        }, "should raise exception on missing field key argument");

        raises(function () {
            b$.Field.create('foo/bar/baz');
        }, "should raise exception on invalid field key argument");
    });

    test("Conversion from String", function () {
        var field = 'foo/bar/baz'.toField();

        ok(field.isA(b$.Field), "should return Field instance");
        equal(field.entityKey.toString(), 'foo/bar/baz', "should set field key");
    });

    test("Conversion from Array", function () {
        var field = ['foo', 'bar', 'baz'].toField();

        ok(field.isA(b$.Field), "should return Field instance");
        equal(field.entityKey.toString(), 'foo/bar/baz', "should set field key");
    });

    test("Conversion from FieldKey", function () {
        var fieldKey = ['foo', 'bar', 'baz'].toFieldKey(),
            field = fieldKey.toField();

        ok(field.isA(b$.Field), "should return Field instance");
        strictEqual(field.entityKey, fieldKey, "should set field key");
    });

    test("Field attribute getter", function () {
        expect(3);

        var field = 'foo/bar/baz'.toField(),
            attributePath = {},
            attributeNode = {};

        field.entityKey.addMocks({
            getAttributePath: function (attribute) {
                equal(attribute, 'hello', "should fetch path for specified attribute");
                return attributePath;
            }
        });

        b$.entities.addMocks({
            getNode: function (path) {
                strictEqual(path, attributePath, "should fetch node at attribute path");
                return attributeNode;
            }
        });

        strictEqual(field.getAttribute('hello'), attributeNode, "should return attribute node");

        b$.entities.removeMocks();
    });

    test("Field attribute setter", function () {
        expect(4);

        var field = 'foo/bar/baz'.toField(),
            attributePath = {},
            attributeNode = {};

        field.entityKey.addMocks({
            getAttributePath: function (attribute) {
                equal(attribute, 'hello', "should fetch path for specified attribute");
                return attributePath;
            }
        });

        b$.entities.addMocks({
            setNode: function (path, node) {
                strictEqual(path, attributePath, "should set node at attribute path");
                strictEqual(node, attributeNode, "should set specified value at attribute path");
            }
        });

        strictEqual(field.setAttribute('hello', attributeNode), field, "should be chainable");

        b$.entities.removeMocks();
    });

    test("Field value getter", function () {
        expect(3);

        var field = 'foo/bar/baz'.toField(),
            valuePath = {},
            valueNode = {};

        field.entityKey.addMocks({
            getValuePath: function () {
                ok(true, "should fetch value path for current key");
                return valuePath;
            }
        });

        b$.entities.addMocks({
            getNode: function (path) {
                strictEqual(path, valuePath, "should fetch node at specified value path");
                return valueNode;
            }
        });

        strictEqual(field.getValue(), valueNode, "should return value node");

        b$.entities.removeMocks();
    });

    test("Field value setter", function () {
        expect(4);

        var field = 'foo/bar/baz'.toField(),
            valuePath = {},
            valueNode = {};

        field.entityKey.addMocks({
            getValuePath: function () {
                ok(true, "should fetch value path for current key");
                return valuePath;
            }
        });

        b$.entities.addMocks({
            setNode: function (path, value) {
                strictEqual(path, valuePath, "should set node at specified value path");
                strictEqual(value, valueNode, "should set specified value node at path");
            }
        });

        strictEqual(field.setValue(valueNode), field, "should be chainable");

        b$.entities.removeMocks();
    });
}());
