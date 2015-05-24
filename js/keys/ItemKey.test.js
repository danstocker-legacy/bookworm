/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("ItemKey");

    test("Instantiation", function () {
        var itemKey = bookworm.ItemKey.create('hello', 'world', 'foo', 'bar');

        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");
        equal(itemKey.eventPath.toString(), 'entity>document>hello>world>foo>bar',
            "should set event path");
    });

    test("Conversion from String", function () {
        var itemKey = 'hello/world/foo/bar'.toItemKey();

        ok(itemKey.isA(bookworm.ItemKey), "should return ItemKey instance");
        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");

        itemKey = 'hello/world/foo/b%2Far'.toItemKey();
        equal(itemKey.itemId, 'b/ar', "should URI decode item ID");

        itemKey = 'hello/world/foo'.toItemKey();
        equal(typeof itemKey, 'undefined', "should return undefined for invalid key string");
    });

    test("Conversion from Array", function () {
        var itemKey;

        itemKey = ['hello', 'world', 'foo', 'bar'].toItemKey();
        ok(itemKey.isA(bookworm.ItemKey), "should return ItemKey instance");
        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");

        itemKey = ['hello', 'world', 'foo'].toItemKey();
        equal(typeof itemKey, 'undefined', "should return undefined for invalid item ID");

        itemKey = ['hello', 'world', undefined, 'bar'].toItemKey();
        equal(typeof itemKey, 'undefined', "should return undefined for invalid field name");

        itemKey = ['hello', undefined, 'foo', 'bar'].toItemKey();
        equal(typeof itemKey, 'undefined', "should return undefined for invalid document ID");

        itemKey = [undefined, 'world', 'foo', 'bar'].toItemKey();
        equal(typeof itemKey, 'undefined', "should return undefined for invalid document type");
    });

    test("Equivalence tester", function () {
        ok('hello/world/foo/bar'.toItemKey().equals('hello/world/foo/bar'.toItemKey()), "should pass for identical contents");
        ok(!'hello/world/foo/bar'.toItemKey().equals('hi/world/foo/bar'.toItemKey()), "should fail for different document types");
        ok(!'hello/world/foo/bar'.toItemKey().equals('hello/all/foo/bar'.toItemKey()), "should fail for different document ID");
        ok(!'hello/world/foo/bar'.toItemKey().equals('hello/world/boo/bar'.toItemKey()), "should fail for different field names");
        ok(!'hello/world/foo/bar'.toItemKey().equals('hello/world/foo/baz'.toItemKey()), "should fail for different item ID");
    });

    test("Entity path getter", function () {
        expect(3);

        var itemKey = 'foo/bar/baz/A'.toItemKey(),
            fieldEntityPath = 'field>entity'.toPath(),
            entityPath = {},
            path;

        bookworm.FieldKey.addMocks({
            getEntityPath: function () {
                strictEqual(this, itemKey, "should get entity key from field key");
                return fieldEntityPath;
            }
        });

        fieldEntityPath.addMocks({
            appendKey: function (itemId) {
                equal(itemId, itemKey.itemId, "should append item ID to field entity path");
                return entityPath;
            }
        });

        strictEqual(itemKey.getEntityPath(), entityPath, "should return correct item entity path");

        bookworm.FieldKey.removeMocks();
    });

    test("Field key getter", function () {
        var itemKey = ['foo', 'bar', 'hello', 'world'].toItemKey(),
            fieldKey = itemKey.getFieldKey();

        strictEqual(fieldKey.getBase(), bookworm.FieldKey, "should return FieldKey instance (not subclass)");
        equal(fieldKey.fieldName, 'hello', "should set field name");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
    });

    test("Value path getter", function () {
        expect(2);

        var itemKey = 'foo/bar/baz/A'.toItemKey(),
            entityPath = {};

        itemKey.addMocks({
            getEntityPath: function () {
                equal(this.toString(), 'foo/bar/baz/A', "should fetch entity path for current key");
                return entityPath;
            }
        });

        strictEqual(itemKey.getValuePath(), entityPath, "should return entity path");
    });

    test("Conversion to String", function () {
        equal(bookworm.ItemKey.create('hello', 'world', 'foo', 'bar').toString(), 'hello/world/foo/bar',
            "should return correct item path string");
        equal(bookworm.ItemKey.create('hello', 'world', 'foo', 'b/ar').toString(), 'hello/world/foo/b%2Far',
            "should URI encode path contents");
    });
}());
