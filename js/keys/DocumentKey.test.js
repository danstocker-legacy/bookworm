/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Document Key");

    test("Instantiation", function () {
        var documentKey = bookworm.DocumentKey.create('hello', 'world');

        equal(documentKey.documentType, 'hello', "should set document type");
        equal(documentKey.documentId, 'world', "should set document ID");
        equal(documentKey.eventPath.toString(), 'entity>document>hello>world',
            "should set event path");
    });

    test("Conversion from String", function () {
        var documentKey;

        documentKey = 'foo/bar'.toDocumentKey();
        ok(documentKey.isA(bookworm.DocumentKey), "should return DocumentKey instance");
        equal(documentKey.documentType, 'foo', "should set document type");
        equal(documentKey.documentId, 'bar', "should set document ID");

        documentKey = 'foo/b%2Far'.toDocumentKey();
        equal(documentKey.documentId, 'b/ar', "should decode encoded chars in document ID");

        documentKey = 'foo'.toDocumentKey();
        equal(typeof documentKey.documentId, 'undefined', "should set undefined document type for invalid key string");
    });

    test("Conversion from Array", function () {
        var documentKey;

        documentKey = ['foo', 'bar'].toDocumentKey();
        ok(documentKey.isA(bookworm.DocumentKey), "should return DocumentKey instance");
        equal(documentKey.documentType, 'foo', "should set document type");
        equal(documentKey.documentId, 'bar', "should set document ID");
    });

    test("Equivalence tester", function () {
        ok(!'foo/bar'.toDocumentKey().equals(undefined), "should fail for undefined");
        ok('foo/bar'.toDocumentKey().equals('foo/bar'.toDocumentKey()), "should pass for keys w/ same type / ID");
        ok(!'foo/bar'.toDocumentKey().equals('foo/baz'.toDocumentKey()), "should fail for different IDs");
        ok(!'foo/bar'.toDocumentKey().equals('fuu/bar'.toDocumentKey()), "should fail for different types");
    });

    test("Field key getter", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            fieldKey = documentKey.getFieldKey('baz');

        ok(fieldKey.isA(bookworm.FieldKey), "should return a FieldKey instance");
        ok(fieldKey.documentKey.isA(bookworm.DocumentKey), "should set document key");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.fieldName, 'baz', "should set field name");
    });

    test("Entity path getter", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            documentEntityPath = documentKey.getEntityPath();

        ok(documentEntityPath.isA(sntls.Path), "should return Path instance");
        deepEqual(documentEntityPath.asArray, ['document', 'foo', 'bar'], "should set path contents correctly");
    });

    test("Attribute path getter", function () {
        expect(3);

        var documentKey = 'foo/bar'.toFieldKey(),
            entityPath = 'entity>path'.toPath(),
            attributePath = {};

        documentKey.addMocks({
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


        strictEqual(documentKey.getAttributePath('hello'), attributePath, "should return attribute path");
    });

    test("Config path getter", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityPath = documentKey.getConfigPath();

        ok(entityPath.isA(sntls.Path), "should return Path instance");
        deepEqual(entityPath.asArray, ['document', 'document', 'foo'], "should set path contents correctly");
    });

    test("Conversion to String", function () {
        equal(bookworm.DocumentKey.create('foo', 'bar').toString(), 'foo/bar', 'should concatenate type / ID with slash');
        equal(bookworm.DocumentKey.create('f/oo', 'b/ar').toString(), 'f%2Foo/b%2Far', 'should URI encode type / ID');
    });
}());
