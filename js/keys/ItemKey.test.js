/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Item Key");

    test("Instantiation", function () {
        var itemKey = bookworm.ItemKey.create('hello', 'world', 'foo', 'bar');

        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");
    });

    test("Conversion from String", function () {
        var itemKey = 'hello/world/foo/bar'.toItemKey();

        ok(itemKey.isA(bookworm.ItemKey), "should return ItemKey instance");
        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");

        itemKey = 'hello/world/foo/b\\/ar'.toItemKey();
        equal(itemKey.itemId, 'b/ar', "should URI decode item ID");
    });

    test("Conversion from Array", function () {
        var itemKey = ['hello', 'world', 'foo', 'bar'].toItemKey();

        ok(itemKey.isA(bookworm.ItemKey), "should return ItemKey instance");
        equal(itemKey.documentKey.documentType, 'hello', "should set document type");
        equal(itemKey.documentKey.documentId, 'world', "should set document ID");
        equal(itemKey.fieldName, 'foo', "should set field name");
        equal(itemKey.itemId, 'bar', "should set item ID");
    });

    test("Conversion from EntityKey", function () {
        var key = bookworm.EntityKey.create('foo', 'bar');

        ok(key.isA(bookworm.DocumentKey), "should return DocumentKey instance");
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

        strictEqual(fieldKey.getBase(), bookworm.FieldKey, "should return FieldKey instance (not subclass)");
        equal(fieldKey.fieldName, 'hello', "should set field name");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
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

        path = itemKey.getEntityPath();

        bookworm.FieldKey.removeMocks();

        strictEqual(path, entityPath, "should return correct item entity path");
    });

    test("Attribute path getter", function () {
        expect(3);

        var itemKey = 'foo/bar/baz/A'.toItemKey(),
            entityPath = 'entity>path'.toPath(),
            attributePath = {},
            path;

        itemKey.addMocks({
            getEntityPath: function () {
                equal(this.toString(), 'foo/bar/baz/A', "should fetch entity path for current key");
                return entityPath;
            }
        });

        entityPath.addMocks({
            appendKey: function (key) {
                equal(key, 'hello', "should append attribute to entity path");
                return attributePath;
            }
        });

        path = itemKey.getAttributePath('hello');

        strictEqual(path, attributePath, "should return attribute path");
    });

    test("Item type getter", function () {
        expect(1);

        var key = 'foo/bar/baz/hello'.toItemKey();

        bookworm.FieldKey.addMocks({
            getConfigPath: function () {
                return 'config>path'.toPath();
            }
        });

        bookworm.config.addMocks({
            getNode: function (path) {
                equal(path.toString(), 'config>path>itemType', "should fetch item type from field config");
            }
        });

        key.getItemType();

        bookworm.FieldKey.removeMocks();
        bookworm.config.removeMocks();
    });

    test("Value path getter", function () {
        expect(2);

        var itemKey = 'foo/bar/baz/A'.toItemKey(),
            entityPath = {},
            path;

        itemKey.addMocks({
            getEntityPath: function () {
                equal(this.toString(), 'foo/bar/baz/A', "should fetch entity path for current key");
                return entityPath;
            }
        });

        path = itemKey.getValuePath();

        strictEqual(path, entityPath, "should return entity path");
    });

    test("Config path getter", function () {
        var itemKey = 'foo/bar/baz/A'.toItemKey(),
            path = itemKey.getConfigPath();

        ok(path.isA(sntls.Path), "should return Path instance");
        ok(path.equals(itemKey.getFieldKey().getConfigPath()), "should return same config path as FieldKey");
    });

    test("Conversion to String", function () {
        equal(bookworm.ItemKey.create('hello', 'world', 'foo', 'bar').toString(), 'hello/world/foo/bar',
            "should return correct item path string");
        equal(bookworm.ItemKey.create('hello', 'world', 'foo', 'b/ar').toString(), 'hello/world/foo/b\\/ar',
            "should URI encode path contents");
    });
}());
