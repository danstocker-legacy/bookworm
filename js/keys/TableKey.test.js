/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("TableKey");

    test("Instantiation", function () {
        var key = bookworm.TableKey.create('foo');

        equal(key.tableName, 'foo', "should set tableName property");
    });

    test("Conversion from String", function () {
        var key = 'foo'.toTableKey();

        ok(key.isA(bookworm.TableKey), "should return TableKey instance");
        equal(key.tableName, 'foo', "should set tableName property");
    });

    test("Conversion from EntityKey", function () {
        var key = bookworm.EntityKey.create('foo');

        ok(key.isA(bookworm.TableKey), "should return TableKey instance");
        equal(key.tableName, 'foo', "should set tableName property");
    });

    test("Equivalence tester", function () {
        var key = 'foo'.toTableKey();

        ok(!key.equals(), "should return false for undefined argument");
        ok(!key.equals('bar'.toTableKey()), "should return false for non matching table key");
        ok(key.equals('foo'.toTableKey()), "should return true for matching table key");
    });

    test("Entity path getter", function () {
        var key = 'foo'.toTableKey(),
            path = key.getEntityPath();

        ok(path.isA(sntls.Path), "should return a Path instance");
        equal(path.toString(), 'table>foo', "should set path contents");
    });

    test("Attribute path getter", function () {
        var key = 'foo'.toTableKey(),
            path = key.getAttributePath('bar');

        ok(path.isA(sntls.Path), "should return a Path instance");
        equal(path.toString(), 'table>foo>bar', "should set path contents");
    });

    test("Config path getter", function () {
        var key = 'foo'.toTableKey(),
            path = key.getConfigPath();

        ok(path.isA(sntls.Path), "should return a Path instance");
        equal(path.toString(), 'document>table>foo', "should set path contents");
    });

    test("Conversion to String", function () {
        var key = 'foo'.toTableKey();

        equal(key.toString(), 'foo', "should return tableName property");
    });
}());
