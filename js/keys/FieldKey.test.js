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
        equal(fieldKey.eventPath.toString(), 'entity>document>hello>world>foo',
            "should set event path");
    });

    test("Conversion from String", function () {
        var fieldKey;

        fieldKey = 'foo/bar/baz'.toFieldKey();
        ok(fieldKey.isA(bookworm.FieldKey), "should return FieldKey instance");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.fieldName, 'baz', "should set field name");

        fieldKey = 'foo/bar/b%2Faz'.toFieldKey();
        equal(fieldKey.fieldName, 'b/az', "should URI decode field name");

        fieldKey = 'foo/bar'.toFieldKey();
        equal(typeof fieldKey.fieldName, 'undefined', "should set undefined field name for invalid key string");
    });

    test("Conversion from Array", function () {
        var fieldKey;

        fieldKey = ['foo', 'bar', 'baz'].toFieldKey();
        ok(fieldKey.isA(bookworm.FieldKey), "should return FieldKey instance");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.fieldName, 'baz', "should set field name");
    });

    test("Equivalence tester", function () {
        ok('foo/bar/baz'.toFieldKey().equals('foo/bar/baz'.toFieldKey()), "should pass on identical content");
        ok(!'foo/bar/baz'.toFieldKey().equals('foo/baz/baz'.toFieldKey()), "should fail on different document IDs");
        ok(!'foo/bar/baz'.toFieldKey().equals('foo/bar/hello'.toFieldKey()), "should fail on different field name");
    });

    test("Config key getter", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            configKey = fieldKey.getConfigKey();

        ok(configKey.isA(bookworm.DocumentKey), "should return DocumentKey instance");
        ok(configKey.equals(['field', 'foo/baz'].toDocumentKey()), "should return correct config key");
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
            entityPath = {};

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

        strictEqual(fieldKey.getEntityPath(), entityPath, "should return correct field path");

        bookworm.DocumentKey.removeMocks();
    });

    test("Attribute path getter", function () {
        expect(3);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            entityPath = 'entity>path'.toPath(),
            attributePath = {};

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

        strictEqual(fieldKey.getAttributePath('hello'), attributePath, "should return attribute path");
    });

    test("Field type getter", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            entityPaths;

        bookworm.config.addMocks({
            getNode: function (path) {
                entityPaths.push(path.toString());
                return 'fieldType';
            }
        });

        entityPaths = [];
        fieldKey.getFieldType();

        bookworm.config.removeMocks();

        deepEqual(entityPaths, [
            "document>document>foo>baz>fieldType"
        ], "should fetch field type from attribute if it is found there");
    });

    test("Value path getter", function () {
        expect(2);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            entityPath = {};

        fieldKey.addMocks({
            getEntityPath: function () {
                ok(true, "should fetch entity path for current key");
                return entityPath;
            }
        });

        strictEqual(fieldKey.getValuePath(), entityPath, "should return entity path");
    });

    test("Config path getter", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            configPath;

        configPath = fieldKey.getConfigPath();
        ok(configPath.isA(sntls.Path), "should return Path instance");
        deepEqual(configPath.asArray, ['document', 'document', 'foo', 'baz'], "should set path contents");
    });

    test("Conversion to String", function () {
        equal(bookworm.FieldKey.create('foo', 'bar', 'baz').toString(), 'foo/bar/baz');
        equal(bookworm.FieldKey.create('foo', 'bar', 'b/az').toString(), 'foo/bar/b%2Faz');
        equal('foo/bar/baz'.toFieldKey().toString(), 'foo/bar/baz');
    });
}());
