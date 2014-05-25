/*global dessert, troop, sntls, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Document Key");

    test("Instantiation", function () {
        var key = b$.DocumentKey.create('hello', 'world');

        equal(key.documentType, 'hello', "should set document type");
        equal(key.documentId, 'world', "should set document ID");
    });

    test("Conversion from String", function () {
        var key;

        key = 'foo/bar'.toDocumentKey();
        ok(key.isA(b$.DocumentKey), "should return DocumentKey instance");
        equal(key.documentType, 'foo', "should set document type");
        equal(key.documentId, 'bar', "should set document ID");

        key = 'foo/b%2Far'.toDocumentKey();
        equal(key.documentId, 'b/ar', "should decode encoded chars in document ID");
    });

    test("Conversion from Array", function () {
        var key;

        key = ['foo', 'bar'].toDocumentKey();
        ok(key.isA(b$.DocumentKey), "should return DocumentKey instance");
        equal(key.documentType, 'foo', "should set document type");
        equal(key.documentId, 'bar', "should set document ID");
    });

    test("Conversion from cache Path", function () {
        var path = ['foo', 'bar', 'baz'].toPath(),
            key = path.toDocumentKey();

        ok(key.isA(b$.DocumentKey), "should return DocumentKey instance");
        equal(key.documentType, 'foo', "should set document type");
        equal(key.documentId, 'bar', "should set document ID");
    });

    test("Conversion from EntityKey", function () {
        var key = b$.EntityKey.create('foo', 'bar');

        ok(key.isA(b$.DocumentKey), "should return DocumentKey instance");
        equal(key.documentType, 'foo', "should set document type");
        equal(key.documentId, 'bar', "should set document ID");
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

        ok(fieldKey.isA(b$.FieldKey), "should return a FieldKey instance");
        ok(fieldKey.documentKey.isA(b$.DocumentKey), "should set document key");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.fieldName, 'baz', "should set field name");
    });

    test("Entity path getter", function () {
        var key = 'foo/bar'.toDocumentKey(),
            path = key.getEntityPath();

        ok(path.isA(sntls.Path), "should return Path instance");
        deepEqual(path.asArray, ['foo', 'bar'], "should set path contents correctly");
    });

    test("Metadata path getter", function () {
        var key = 'foo/bar'.toDocumentKey(),
            path = key.getMetaPath();

        ok(path.isA(sntls.Path), "should return CachePath instance");
        deepEqual(path.asArray, ['document', 'foo'], "should set path contents correctly");
    });

    test("Metadata tester", function () {
        expect(1);

        var key = 'foo/bar'.toDocumentKey();

        b$.metadata.addMocks({
            getNode: function (path) {
                equal(path.toString(), 'document>foo>hasDocumentMeta', "should fetch value from correct path");
            }
        });

        key.hasDocumentMeta();

        b$.metadata.removeMocks();
    });

    test("Conversion to String", function () {
        equal(b$.DocumentKey.create('foo', 'bar').toString(), 'foo/bar', 'should concatenate type / ID with slash');
        equal(b$.DocumentKey.create('f/oo', 'b/ar').toString(), 'f%2Foo/b%2Far', 'should URI encode type / ID');
    });
}());
