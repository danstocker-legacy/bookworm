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
        expect(7);

        raises(function () {
            bookworm.Table.create();
        }, "should raise exception on missing document key argument");

        raises(function () {
            bookworm.Table.create('foo');
        }, "should raise exception on invalid document key argument");

        bookworm.Table.addMocks({
            getNode: function () {
                equal(this.entityKey.toString(), 'foo', "should get current table node");
                return undefined;
            }
        });

        var table = bookworm.Table.create('foo'.toTableKey());

        bookworm.Table.removeMocks();

        ok(table.uniqueIndex.isA(jorder.Index), "should set uniqueIndex property");
        ok(table.jorderTable.isA(jorder.Table), "should set jorderTable property");

        var uniqueIndex = table.jorderTable.indexCollection.getFirstValue();

        deepEqual(
            uniqueIndex.rowSignature.fieldNames,
            table.uniqueIndex.rowSignature.fieldNames,
            "should add unique index to jorder table");

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
        var table = bookworm.Entity.create('foo'.toTableKey());

        ok(table.isA(bookworm.Table), "should return Table instance");
        equal(table.entityKey.toString(), 'foo', "should set entity key");
    });

    test("Node setter", function () {
        expect(6);

        var table = bookworm.Entity.create('foo'.toEntityKey()),
            rows = [
                {id: 1, a: 'hello'},
                {id: 2, a: 'world'},
                {id: 3, a: 'foo'},
                {id: 4, a: 'bar'}
            ];

        raises(function () {
            table.setNode();
        }, "should raise exception on missing arguments");

        raises(function () {
            table.setNode({});
        }, "should raise exception on invalid arguments");

        table.jorderTable.addMocks({
            clear: function () {
                ok(true, "should clear jorder table");
                return this;
            },

            insertRows: function (tableNode) {
                strictEqual(tableNode, rows, "should insert rows array into jorder table");
                return this;
            }
        });

        bookworm.Entity.addMocks({
            setNode: function (node) {
                strictEqual(node, this.jorderTable.items, "should set node");
            }
        });

        strictEqual(table.setNode(rows), table, "should be chainable");

        bookworm.Entity.removeMocks();
    });

    test("Node unsetter", function () {
        expect(3);

        var table = bookworm.Entity.create('foo'.toEntityKey()),
            rows = [
                {id: 1, a: 'hello'},
                {id: 2, a: 'world'},
                {id: 3, a: 'foo'},
                {id: 4, a: 'bar'}
            ];

        table.jorderTable.addMocks({
            clear: function () {
                ok(true, "should clear jorder table");
                return this;
            }
        });

        bookworm.Entity.addMocks({
            setNode: function (node) {
                strictEqual(node, this.jorderTable.items, "should set node");
            }
        });

        strictEqual(table.setNode(rows), table, "should be chainable");

        bookworm.Entity.removeMocks();
    });

    test("Content update", function () {
        var table = bookworm.Entity.create('foo'.toEntityKey());

        table.setNode([
            {id: 1, a: 'hello'},
            {id: 2, a: 'world'},
            {id: 3, a: 'foo'},
            {id: 4, a: 'bar'}
        ]);

        strictEqual(
            table.updateRows([
                {id: 3, a: 'baz'},
                {id: 1, a: 'hi'},
                {id: 5, a: 'foo'}
            ]),
            table,
            "should be chainable");

        deepEqual(table.getNode(), [
            {id: 1, a: 'hi'},
            {id: 2, a: 'world'},
            {id: 3, a: 'baz'},
            {id: 4, a: 'bar'},
            {id: 5, a: 'foo'}
        ], "should set table node");
    });
}());
