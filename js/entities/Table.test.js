/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Table");

    test("Instantiation", function () {
        raises(function () {
            bookworm.Table.create();
        }, "should raise exception on missing document key argument");

        raises(function () {
            bookworm.Table.create('foo');
        }, "should raise exception on invalid document key argument");
    });

    test("Conversion from String", function () {
        var table = 'foo'.toTable();

        ok(table.isA(bookworm.Table), "should return Table instance");
        equal(table.entityKey.toString(), 'foo', "should set entity key");
    });

    test("Conversion from TableKey", function () {
        var table = 'foo'.toTableKey().toTable();

        ok(table.isA(bookworm.Table), "should return Table instance");
        equal(table.entityKey.toString(), 'foo', "should set entity key");
    });

    test("Entity surrogate", function () {
        var table = bookworm.Entity.create('foo'.toEntityKey());

        ok(table.isA(bookworm.Table), "should return Table instance");
        equal(table.entityKey.toString(), 'foo', "should set entity key");
    });
}());
