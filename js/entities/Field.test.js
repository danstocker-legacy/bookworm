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

        var field = b$.Field.create('foo/bar/baz'.toFieldKey());

        strictEqual(field.fieldKey, field.entityKey, "should set field key");
    });

    test("Conversion from String", function () {
        var field = 'foo/bar/baz'.toField();

        ok(field.isA(b$.Field), "should return Field instance");
        equal(field.fieldKey.toString(), 'foo/bar/baz', "should set field key");
    });

    test("Conversion from Array", function () {
        var field = ['foo', 'bar', 'baz'].toField();

        ok(field.isA(b$.Field), "should return Field instance");
        equal(field.fieldKey.toString(), 'foo/bar/baz', "should set field key");
    });

    test("Conversion from FieldKey", function () {
        var fieldKey = ['foo', 'bar', 'baz'].toFieldKey(),
            field = fieldKey.toField();

        ok(field.isA(b$.Field), "should return Field instance");
        strictEqual(field.fieldKey, fieldKey, "should set field key");
    });

    test("Field meta getter", function () {
        expect(2);

        var field = 'foo/bar/baz'.toField(),
            metaNode = {};

        b$.Field.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'hello'},
                    "should fetch the metadata node from right under the entity node");
                return metaNode;
            }
        });

        strictEqual(field.getFieldMeta('hello'), metaNode, "should return meta node");

        b$.Field.removeMocks();
    });

    test("Field value getter", function () {
        expect(2);

        var field = 'foo/bar/baz'.toField(),
            valueNode = {};

        b$.Field.addMocks({
            getNode: function () {
                deepEqual(arguments, {}, "should fetch field node");
                return valueNode;
            }
        });

        strictEqual(field.getFieldValue(), valueNode, "should return field node");

        b$.Field.removeMocks();
    });

    test("Field value setter", function () {
        expect(2);

        var field = 'foo/bar/baz'.toField(),
            valueNode = {};

        b$.Field.addMocks({
            setNode: function (value) {
                deepEqual(arguments, {0: valueNode},
                    "should set specified value on field node");
            }
        });

        strictEqual(field.setFieldValue(valueNode), field, "should be chainable");

        b$.Field.removeMocks();
    });
}());
