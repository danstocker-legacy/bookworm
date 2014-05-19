/*global dessert, troop, sntls, flock, dache */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Field");

    test("Instantiation", function () {
        raises(function () {
            dache.Field.create();
        }, "should raise exception on missing field key argument");

        raises(function () {
            dache.Field.create('foo/bar/baz');
        }, "should raise exception on invalid field key argument");

        var field = dache.Field.create('foo/bar/baz'.toFieldKey());

        strictEqual(field.fieldKey, field.entityKey, "should set field key");
    });

    test("Conversion from String", function () {
        var field = 'foo/bar/baz'.toField();

        ok(field.isA(dache.Field), "should return Field instance");
        equal(field.fieldKey.toString(), 'foo/bar/baz', "should set field key");
    });

    test("Conversion from Array", function () {
        var field = ['foo', 'bar', 'baz'].toField();

        ok(field.isA(dache.Field), "should return Field instance");
        equal(field.fieldKey.toString(), 'foo/bar/baz', "should set field key");
    });

    test("Conversion from FieldKey", function () {
        var fieldKey = ['foo', 'bar', 'baz'].toFieldKey(),
            field = fieldKey.toField();

        ok(field.isA(dache.Field), "should return Field instance");
        strictEqual(field.fieldKey, fieldKey, "should set field key");
    });

    test("Field meta getter", function () {
        expect(4);

        var field = 'foo/bar/baz'.toField(),
            metaNode = {};

        dache.Field.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'hello'},
                    "should fetch the metadata node from right under the entity node");
                return metaNode;
            }
        });

        dache.FieldKey.addMocks({
            hasFieldMeta: function () {
                equal(this.toString(), 'foo/bar/baz', "should test for field metadata");
                return true;
            }
        });

        strictEqual(field.getFieldMeta('hello'), metaNode, "should return meta node");

        dache.FieldKey.removeMocks();

        dache.FieldKey.addMocks({
            hasFieldMeta: function () {
                return false;
            }
        });

        equal(typeof field.getFieldMeta('hello'), 'undefined',
            "should return undefined when field has no metadata");

        dache.FieldKey.removeMocks();

        dache.Field.removeMocks();
    });

    test("Field value getter", function () {
        expect(4);

        var field = 'foo/bar/baz'.toField(),
            valueNode = {};

        dache.Field.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'value'},
                    "should fetch value node when field has meta");
                return valueNode;
            }
        });

        dache.FieldKey.addMocks({
            hasFieldMeta: function () {
                equal(this.toString(), 'foo/bar/baz', "should test for field metadata");
                return true;
            }
        });

        strictEqual(field.getFieldValue(), valueNode, "should return value node");

        dache.Field.removeMocks();
        dache.FieldKey.removeMocks();

        dache.Field.addMocks({
            getNode: function () {
                equal(arguments.length, 0, "should fetch field node when field has no meta");
                return valueNode;
            }
        });

        dache.FieldKey.addMocks({
            hasFieldMeta: function () {
                return false;
            }
        });

        field.getFieldValue();

        dache.Field.removeMocks();
        dache.FieldKey.removeMocks();
    });

    test("Field value setter", function () {
        expect(4);

        var field = 'foo/bar/baz'.toField(),
            valueNode = {};

        dache.Field.addMocks({
            setNode: function (value) {
                deepEqual(arguments, {0: valueNode, 1: 'value'},
                    "should set specified value on value node when field has meta");
            }
        });

        dache.FieldKey.addMocks({
            hasFieldMeta: function () {
                equal(this.toString(), 'foo/bar/baz', "should test for field metadata");
                return true;
            }
        });

        strictEqual(field.setFieldValue(valueNode), field, "should be chainable");

        dache.Field.removeMocks();
        dache.FieldKey.removeMocks();

        dache.Field.addMocks({
            setNode: function () {
                deepEqual(arguments, {0: valueNode},
                    "should set field node when field has no meta");
                return valueNode;
            }
        });

        dache.FieldKey.addMocks({
            hasFieldMeta: function () {
                return false;
            }
        });

        field.setFieldValue(valueNode);

        dache.Field.removeMocks();
        dache.FieldKey.removeMocks();
    });
}());
