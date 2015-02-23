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
        var row = 'foo/bar'.toRow();

        ok(row.isA(bookworm.Row), "should return Row instance");
        equal(row.entityKey.toString(), 'foo/bar', "should set entityKey property");
    });

    test("Conversion from RowKey", function () {
        var row = 'foo/bar'.toRowKey().toRow();

        ok(row.isA(bookworm.Row), "should return Row instance");
        equal(row.entityKey.toString(), 'foo/bar', "should set entityKey property");
    });

    test("Entity surrogate", function () {
        var row = bookworm.Entity.create('foo/bar'.toRowKey());

        ok(row.isA(bookworm.Row), "should return Row instance");
        equal(row.entityKey.toString(), 'foo/bar', "should set entityKey property");
    });

    test("Node setter", function () {
        expect(4);

        var row = 'foo/bar'.toRow(),
            rowNode = {id: 1, name: 'hello'};

        row.entityKey.addMocks({
            getRowId: function () {
                ok(true, "should fetch row ID");
                return 1;
            }
        });

        row.jorderTable.addMocks({
            setItem: function (key, value) {
                equal(key, 1, "should set row in jorder table");
                strictEqual(value, rowNode, "should pass row node to jorder table item setter");
            }
        });

        strictEqual(row.setNode(rowNode), row, "should be chainable");

        row.entityKey.removeMocks();
        row.jorderTable.removeMocks();
    });

    test("Key unsetter", function () {
        expect(3);

        var row = 'foo/bar'.toRow();

        row.entityKey.addMocks({
            getRowId: function () {
                ok(true, "should fetch row ID");
                return 1;
            }
        });

        row.jorderTable.addMocks({
            deleteItem: function (key) {
                equal(key, 1, "should set row in jorder table");
            }
        });

        strictEqual(row.unsetKey(), row, "should be chainable");

        row.entityKey.removeMocks();
        row.jorderTable.removeMocks();
    });
}());
