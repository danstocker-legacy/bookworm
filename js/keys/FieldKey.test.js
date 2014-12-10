/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Field Key");

    test("Instantiation", function () {
        var fieldKey = bookworm.FieldKey.create('hello', 'world', 'foo');

        ok(fieldKey.documentKey.isA(bookworm.DocumentKey), "should set document key");
        equal(fieldKey.documentKey.documentType, 'hello', "should set document type");
        equal(fieldKey.documentKey.documentId, 'world', "should set document ID");
        equal(fieldKey.fieldName, 'foo', "should set field name");
    });

    test("Conversion from String", function () {
        var key;

        key = 'foo/bar/baz'.toFieldKey();
        ok(key.isA(bookworm.FieldKey), "should return FieldKey instance");
        equal(key.documentKey.documentType, 'foo', "should set document type");
        equal(key.documentKey.documentId, 'bar', "should set document ID");
        equal(key.fieldName, 'baz', "should set field name");

        key = 'foo/bar/b%2Faz'.toFieldKey();
        equal(key.fieldName, 'b/az', "should URI decode field name");
    });

    test("Conversion from Array", function () {
        var key;

        key = ['foo', 'bar', 'baz'].toFieldKey();
        ok(key.isA(bookworm.FieldKey), "should return FieldKey instance");
        equal(key.documentKey.documentType, 'foo', "should set document type");
        equal(key.documentKey.documentId, 'bar', "should set document ID");
        equal(key.fieldName, 'baz', "should set field name");
    });

    test("Conversion from EntityKey", function () {
        var key = bookworm.EntityKey.create('foo', 'bar', 'baz');

        ok(key.isA(bookworm.FieldKey), "should return FieldKey instance");
        equal(key.documentKey.documentType, 'foo', "should set document type");
        equal(key.documentKey.documentId, 'bar', "should set document ID");
        equal(key.fieldName, 'baz', "should set field name");
    });

    test("Conversion from Path", function () {
        var key = 'foo>bar>baz'.toPath().toFieldKey();

        ok(key.isA(bookworm.FieldKey), "should return FieldKey instance");
        equal(key.documentKey.documentType, 'foo', "should set document type");
        equal(key.documentKey.documentId, 'bar', "should set document ID");
        equal(key.fieldName, 'baz', "should set field name");
    });

    test("Equivalence tester", function () {
        ok('foo/bar/baz'.toFieldKey().equals('foo/bar/baz'.toFieldKey()), "should pass on identical content");
        ok(!'foo/bar/baz'.toFieldKey().equals('foo/baz/baz'.toFieldKey()), "should fail on different document IDs");
        ok(!'foo/bar/baz'.toFieldKey().equals('foo/bar/hello'.toFieldKey()), "should fail on different field name");
    });

    test("Item key getter", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            itemKey = fieldKey.getItemKey('hello');

        ok(itemKey.isA(bookworm.ItemKey), "should return an ItemKey instance");
        ok(itemKey.documentKey.isA(bookworm.DocumentKey), "should set document key");
        equal(itemKey.documentKey.documentType, 'foo', "should set document type");
        equal(itemKey.documentKey.documentId, 'bar', "should set document ID");
        equal(itemKey.fieldName, 'baz', "should set field name");
        equal(itemKey.itemId, 'hello', "should set item ID");
    });

    test("Entity path getter", function () {
        expect(3);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            documentEntityPath = 'document>entity'.toPath(),
            entityPath = {},
            path;

        bookworm.DocumentKey.addMocks({
            getEntityPath: function () {
                equal(this.toString(), 'foo/bar', "should get entity key from document key");
                return documentEntityPath;
            }
        });

        documentEntityPath.addMocks({
            appendKey: function (fieldName) {
                equal(fieldName, fieldKey.fieldName, "should append field name to document entity path");
                return entityPath;
            }
        });

        path = fieldKey.getEntityPath();

        bookworm.DocumentKey.removeMocks();

        strictEqual(path, entityPath, "should return correct field path");
    });

    test("Attribute path getter", function () {
        expect(3);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            entityPath = 'entity>path'.toPath(),
            attributePath = {},
            path;

        fieldKey.addMocks({
            getEntityPath: function () {
                ok(true, "should fetch entity path for current key");
                return entityPath;
            }
        });

        entityPath.addMocks({
            appendKey: function (key) {
                equal(key, 'hello', "should append attribute to entity path");
                return attributePath;
            }
        });

        path = fieldKey.getAttributePath('hello');

        strictEqual(path, attributePath, "should return attribute path");
    });

    test("Field type getter", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            paths;

        bookworm.config.addMocks({
            getNode: function (path) {
                paths.push(path.toString());
                return undefined;
            }
        });

        paths = [];
        fieldKey.getFieldType();

        bookworm.config.removeMocks();

        deepEqual(paths, [
            "document>document>foo>baz>fieldType",
            "document>document>foo>baz"
        ], "should try attribute first, then field value");

        bookworm.config.addMocks({
            getNode: function (path) {
                paths.push(path.toString());
                return 'fieldType';
            }
        });

        paths = [];
        fieldKey.getFieldType();

        bookworm.config.removeMocks();

        deepEqual(paths, [
            "document>document>foo>baz>fieldType"
        ], "should fetch field type from attribute if it is found there");
    });

    test("Value path getter", function () {
        expect(2);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            entityPath = {},
            path;

        fieldKey.addMocks({
            getEntityPath: function () {
                ok(true, "should fetch entity path for current key");
                return entityPath;
            }
        });

        path = fieldKey.getValuePath();

        strictEqual(path, entityPath, "should return entity path");
    });

    test("Config path getter", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            path;

        path = fieldKey.getConfigPath();
        ok(path.isA(sntls.Path), "should return Path instance");
        deepEqual(path.asArray, ['document', 'document', 'foo', 'baz'], "should set path contents");
    });

    test("Conversion to String", function () {
        equal(bookworm.FieldKey.create('foo', 'bar', 'baz').toString(), 'foo/bar/baz');
        equal(bookworm.FieldKey.create('foo', 'bar', 'b/az').toString(), 'foo/bar/b%2Faz');
        equal('foo/bar/baz'.toFieldKey().toString(), 'foo/bar/baz');
    });
}());
