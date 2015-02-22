/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("RowKey");

    test("Instantiation", function () {
        var key = bookworm.RowKey.create('hello', 'world');

        ok(key.tableKey.isA(bookworm.TableKey), "should set tableKey property");
        equal(key.tableKey.toString(), 'hello', "should set tableKey contents");
        equal(key.rowSignature, 'world', "should set row ID");
    });

    test("Conversion from String", function () {
        var key;

        key = 'foo/bar'.toRowKey();
        ok(key.isA(bookworm.RowKey), "should return RowKey instance");
        equal(key.tableKey.toString(), 'foo', "should set tableKey contents");
        equal(key.rowSignature, 'bar', "should set row ID");

        key = 'foo/b%2Far'.toRowKey();
        equal(key.rowSignature, 'b/ar', "should decode encoded chars in document ID");

        key = 'foo'.toRowKey();
        equal(typeof key.rowSignature, 'undefined', "should set undefined row ID for invalid key string");
    });

    test("Conversion from Array", function () {
        var key;

        key = ['foo', 'bar'].toRowKey();
        ok(key.isA(bookworm.RowKey), "should return RowKey instance");
        equal(key.tableKey.toString(), 'foo', "should set tableKey contents");
        equal(key.rowSignature, 'bar', "should set row ID");
    });

    test("Conversion from cache Path", function () {
        var path = ['foo', 'bar'].toPath(),
            key = path.toRowKey();

        ok(key.isA(bookworm.RowKey), "should return RowKey instance");
        equal(key.tableKey.toString(), 'foo', "should set tableKey contents");
        equal(key.rowSignature, 'bar', "should set row ID");
    });

    test("Equivalence tester", function () {
        ok(!'foo/bar'.toRowKey().equals(undefined), "should fail for undefined");
        ok('foo/bar'.toRowKey().equals('foo/bar'.toRowKey()), "should pass for keys w/ same type / ID");
        ok(!'foo/bar'.toRowKey().equals('foo/baz'.toRowKey()), "should fail for different IDs");
        ok(!'foo/bar'.toRowKey().equals('fuu/bar'.toRowKey()), "should fail for different types");
    });

    test("Entity path getter for existing row", function () {
        expect(3);

        bookworm.RowKey.addMocks({
            _getRowId: function () {
                equal(this.toString(), 'foo/bar', "should fetch current row ID");
                return 5;
            }
        });

        var key = 'foo/bar'.toRowKey(),
            path = key.getEntityPath();

        bookworm.RowKey.removeMocks();

        ok(path.isA(sntls.Path), "should return Path instance");
        deepEqual(path.asArray, ['table', 'foo', '5'], "should set path contents correctly");
    });

    test("Entity path getter for new row", function () {
        expect(4);

        bookworm.RowKey.addMocks({
            _getRowId: function () {
                equal(this.toString(), 'foo/bar', "should attempt to fetch current row ID");
            },

            _getNextRowId: function () {
                equal(this.toString(), 'foo/bar', "should fetch next row ID");
                return 7;
            }
        });

        var key = 'foo/bar'.toRowKey(),
            path = key.getEntityPath();

        bookworm.RowKey.removeMocks();

        ok(path.isA(sntls.Path), "should return Path instance");
        deepEqual(path.asArray, ['table', 'foo', '7'], "should set path contents correctly");
    });

    test("Attribute path getter", function () {
        expect(3);

        var rowKey = 'foo/bar'.toRowKey(),
            entityPath = 'entity>path'.toPath(),
            attributePath = {},
            path;

        rowKey.addMocks({
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

        path = rowKey.getAttributePath('hello');

        strictEqual(path, attributePath, "should return attribute path");
    });

    test("Conversion to String", function () {
        equal(bookworm.RowKey.create('foo', 'bar').toString(), 'foo/bar', 'should concatenate type / ID with slash');
        equal(bookworm.RowKey.create('f/oo', 'b/ar').toString(), 'f%2Foo/b%2Far', 'should URI encode type / ID');
    });
}());
