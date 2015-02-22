/*global dessert, troop, sntls, flock, jorder, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Table", {
        setup: function () {
            bookworm.Table.clearInstanceRegistry();
        },

        teardown: function () {
            bookworm.Table.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        expect(6);

        raises(function () {
            bookworm.Table.create();
        }, "should raise exception on missing document key argument");

        raises(function () {
            bookworm.Table.create('foo');
        }, "should raise exception on invalid document key argument");

        bookworm.Table.addMocks({
            _initCache: function () {
                equal(this.entityKey.toString(), 'foo', "should initialize table node in cache");
            }
        });

        var table = bookworm.Table.create('foo'.toTableKey());

        bookworm.Table.removeMocks();

        ok(table.uniqueIndex.isA(jorder.Index), "should set uniqueIndex property");
        ok(table.sourceTable.isA(jorder.Table), "should set sourceTable property");

        strictEqual(bookworm.Table.create('foo'.toTableKey()), table, "should be memoized");
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
