/*global dessert, troop, sntls, dache */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Field key");

    test("Instantiation", function () {
        var fieldKey = dache.FieldKey.create('hello', 'world', 'foo');

        ok(fieldKey.documentKey.isA(dache.DocumentKey), "should set document key");
        equal(fieldKey.documentKey.documentType, 'hello', "should set document type");
        equal(fieldKey.documentKey.documentId, 'world', "should set document ID");
        equal(fieldKey.fieldName, 'foo', "should set field name");
    });

    test("Conversion from String", function () {
        var key;

        key = 'foo/bar/baz'.toFieldKey();
        ok(key.isA(dache.FieldKey), "should return FieldKey instance");
        equal(key.documentKey.documentType, 'foo', "should set document type");
        equal(key.documentKey.documentId, 'bar', "should set document ID");
        equal(key.fieldName, 'baz', "should set field name");

        key = 'foo/bar/b%2Faz'.toFieldKey();
        equal(key.fieldName, 'b/az', "should URI decode field name");
    });

    test("Conversion from Array", function () {
        var key;

        key = ['foo', 'bar', 'baz'].toFieldKey();
        ok(key.isA(dache.FieldKey), "should return FieldKey instance");
        equal(key.documentKey.documentType, 'foo', "should set document type");
        equal(key.documentKey.documentId, 'bar', "should set document ID");
        equal(key.fieldName, 'baz', "should set field name");
    });

    test("Conversion from EntityKey", function () {
        var key = dache.EntityKey.create('foo', 'bar', 'baz');

        ok(key.isA(dache.FieldKey), "should return FieldKey instance");
        equal(key.documentKey.documentType, 'foo', "should set document type");
        equal(key.documentKey.documentId, 'bar', "should set document ID");
        equal(key.fieldName, 'baz', "should set field name");
    });

    test("Conversion from Path", function () {
        var key = 'foo>bar>baz'.toPath().toFieldKey();

        ok(key.isA(dache.FieldKey), "should return FieldKey instance");
        equal(key.documentKey.documentType, 'foo', "should set document type");
        equal(key.documentKey.documentId, 'bar', "should set document ID");
        equal(key.fieldName, 'baz', "should set field name");
    });

    test("Equivalence tester", function () {
        ok('foo/bar/baz'.toFieldKey().equals('foo/bar/baz'.toFieldKey()), "should pass on identical content");
        ok(!'foo/bar/baz'.toFieldKey().equals('foo/baz/baz'.toFieldKey()), "should fail on different document IDs");
        ok(!'foo/bar/baz'.toFieldKey().equals('foo/bar/hello'.toFieldKey()), "should fail on different field name");
    });

    test("Entity path getter", function () {
        var key = 'foo/bar/baz'.toFieldKey(),
            path = key.getEntityPath();

        ok(path.isA(sntls.Path), "should return Path instance");
        deepEqual(path.asArray, ['foo', 'bar', 'baz'], "should set path contents");

        dache.DocumentKey.addMocks({
            hasDocumentMeta: function () {
                return true;
            }
        });

        path = key.getEntityPath();
        deepEqual(path.asArray, ['foo', 'bar', 'fields', 'baz'], "should set path contents (with document meta)");

        dache.DocumentKey.removeMocks();
    });

    test("Meta path getter", function () {
        var key = 'foo/bar/baz'.toFieldKey(),
            path;

        path = key.getMetaPath();
        ok(path.isA(sntls.Path), "should return Path instance");
        deepEqual(path.asArray, ['document', 'foo', 'fields', 'baz'], "should set path contents");
    });

    test("Field meta tester", function () {
        var key = 'foo/bar/baz'.toFieldKey(),
            paths = [];

        dache.metadata.addMocks({
            getNode: function (path) {
                paths.push(path.toString());

                // this is only called from .hasXXXMeta()
                // returning true tells entity path getters to include document meta level
                return true;
            }
        });

        key.hasFieldMeta();

        dache.metadata.removeMocks();

        deepEqual(paths, [
            'document>document>hasDocumentMeta',
            'document>foo>fields>baz>hasFieldMeta'
        ], "should fetch meta flags from cache");
    });

    test("Field type getter", function () {
        var key = 'foo/bar/baz'.toFieldKey(),
            paths;

        dache.FieldKey.addMocks({
            getMetaPath: function () {
                return 'meta>path'.toPath();
            }
        });

        dache.metadata.addMocks({
            getNode: function (path) {
                paths.push(path.toString());
                return undefined;
            }
        });

        paths = [];
        key.getFieldType();

        dache.metadata.removeMocks();

        deepEqual(paths, [
            "meta>path>fieldType",
            "meta>path"
        ], "should try metadata first, then field value");

        dache.metadata.addMocks({
            getNode: function (path) {
                paths.push(path.toString());
                return 'fieldType';
            }
        });

        paths = [];
        key.getFieldType();

        dache.metadata.removeMocks();
        dache.FieldKey.removeMocks();

        deepEqual(paths, [
            "meta>path>fieldType"
        ], "should fetch field type from metadata if it is found there");
    });

    test("Conversion to String", function () {
        equal(dache.FieldKey.create('foo', 'bar', 'baz').toString(), 'foo/bar/baz');
        equal(dache.FieldKey.create('foo', 'bar', 'b/az').toString(), 'foo/bar/b%2Faz');
        equal('foo/bar/baz'.toFieldKey().toString(), 'foo/bar/baz');
    });
}());
