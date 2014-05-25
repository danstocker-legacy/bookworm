/*global dessert, troop, sntls, flock, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Item Key");

    test("Instantiation", function () {
        var itemKey = b$.ItemKey.create('hello', 'world', 'foo', 'bar');

        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");
    });

    test("Conversion from String", function () {
        var itemKey = 'hello/world/foo/bar'.toItemKey();

        ok(itemKey.isA(b$.ItemKey), "should return ItemKey instance");
        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");

        itemKey = 'hello/world/foo/b%2Far'.toItemKey();
        equal(itemKey.itemId, 'b/ar', "should URI decode item ID");
    });

    test("Conversion from Array", function () {
        var itemKey = ['hello', 'world', 'foo', 'bar'].toItemKey();

        ok(itemKey.isA(b$.ItemKey), "should return ItemKey instance");
        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");
    });

    test("Conversion from EntityKey", function () {
        var key = b$.EntityKey.create('foo', 'bar');

        ok(key.isA(b$.DocumentKey), "should return DocumentKey instance");
        equal(key.documentType, 'foo', "should set document type");
        equal(key.documentId, 'bar', "should set document ID");
    });

    test("Equivalence tester", function () {
        ok('hello/world/foo/bar'.toItemKey().equals('hello/world/foo/bar'.toItemKey()), "should pass for identical contents");
        ok(!'hello/world/foo/bar'.toItemKey().equals('hi/world/foo/bar'.toItemKey()), "should fail for different document types");
        ok(!'hello/world/foo/bar'.toItemKey().equals('hello/all/foo/bar'.toItemKey()), "should fail for different document ID");
        ok(!'hello/world/foo/bar'.toItemKey().equals('hello/world/boo/bar'.toItemKey()), "should fail for different field names");
        ok(!'hello/world/foo/bar'.toItemKey().equals('hello/world/foo/baz'.toItemKey()), "should fail for different item ID");
    });

    test("Field key getter", function () {
        var itemKey = ['foo', 'bar', 'hello', 'world'].toItemKey(),
            fieldKey = itemKey.getFieldKey();

        strictEqual(fieldKey.getBase(), b$.FieldKey, "should return FieldKey instance (not subclass)");
        equal(fieldKey.fieldName, 'hello', "should set field name");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
    });

    test("Entity path getter", function () {
        var itemKey = 'hello/world/foo/bar'.toItemKey(),
            path = itemKey.getEntityPath();

        ok(path.isA(sntls.Path), "should return Path instance");
        deepEqual(path.asArray, ['hello', 'world', 'foo', 'bar'], "should set path contents");
    });

    test("Item type getter", function () {
        expect(1);

        var key = 'foo/bar/baz/hello'.toItemKey();

        b$.FieldKey.addMocks({
            getMetaPath: function () {
                return 'meta>path'.toPath();
            }
        });

        b$.metadata.addMocks({
            getNode: function (path) {
                equal(path.toString(), 'meta>path>itemType', "should fetch item type from field metadata");
            }
        });

        key.getItemType();

        b$.FieldKey.removeMocks();
        b$.metadata.removeMocks();
    });

    test("Conversion to String", function () {
        equal(b$.ItemKey.create('hello', 'world', 'foo', 'bar').toString(), 'hello/world/foo/bar',
            "should return correct item path string");
        equal(b$.ItemKey.create('hello', 'world', 'foo', 'b/ar').toString(), 'hello/world/foo/b%2Far',
            "should URI encode path contents");
    });
}());
