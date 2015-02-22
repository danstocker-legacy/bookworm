/*global dessert, troop, sntls, flock, jorder, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Row");

    test("Instantiation", function () {
        raises(function () {
            bookworm.Row.create();
        }, "should raise exception on missing document key argument");

        raises(function () {
            bookworm.Row.create('foo');
        }, "should raise exception on invalid document key argument");
    });

    test("Conversion from String", function () {
        var table = 'foo/bar'.toRow();

        ok(table.isA(bookworm.Row), "should return Row instance");
        equal(table.entityKey.toString(), 'foo/bar', "should set entityKey property");
    });

    test("Conversion from RowKey", function () {
        var table = 'foo/bar'.toRowKey().toRow();

        ok(table.isA(bookworm.Row), "should return Row instance");
        equal(table.entityKey.toString(), 'foo/bar', "should set entityKey property");
    });

    test("Entity surrogate", function () {
        var table = bookworm.Entity.create('foo/bar'.toRowKey());

        ok(table.isA(bookworm.Row), "should return Row instance");
        equal(table.entityKey.toString(), 'foo/bar', "should set entityKey property");
    });

    test("Node setter", function () {
    });

    test("Node unsetter", function () {
    });
}());
