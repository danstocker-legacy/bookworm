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
        expect(10);

        var row = 'foo/bar'.toRow();

        function onBeforeChange(event) {
            equal(event.originalPath.toString(), 'table>foo>1',
                "should trigger before change event on row entity path");
            deepEqual(event.beforeValue, {id: 1, a: 'hello'},
                "should pass row node as before value");
            deepEqual(event.afterValue, {id: 1, a: 'hi'},
                "should pass row node as after value");
        }

        function onChange(event) {
            equal(event.originalPath.toString(), 'table>foo>1',
                "should trigger change event on row entity path");
            deepEqual(event.beforeValue, {id: 1, a: 'hello'},
                "should pass row node as before value");
            deepEqual(event.afterValue, {id: 1, a: 'hi'},
                "should pass row node as after value");
        }

        bookworm.entities
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE, 'table'.toPath(), onBeforeChange)
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'table'.toPath(), onChange);

        row.addMocks({
            getSilentNode: function () {
                ok(true, "should fetch before node silently");
                return {id: 1, a: 'hello'};
            }
        });

        row.entityKey.addMocks({
            getRowId: function () {
                return 1;
            }
        });

        row.jorderTable.addMocks({
            setItem: function (key, value) {
                equal(key, 1, "should set row in jorder table");
                deepEqual(value, {id: 1, a: 'hi'}, "should pass row node to jorder table item setter");
            }
        });

        strictEqual(row.setNode({id: 1, a: 'hi'}), row, "should be chainable");

        bookworm.entities
            .unsubscribeFrom(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE, 'table'.toPath(), onBeforeChange)
            .unsubscribeFrom(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'table'.toPath(), onChange);

        row.jorderTable.removeMocks();
    });

    test("Key unsetter", function () {
        expect(9);

        var row = 'foo/bar'.toRow();

        function onBeforeChange(event) {
            equal(event.originalPath.toString(), 'table>foo>1',
                "should trigger before change event on row entity path");
            deepEqual(event.beforeValue, {id: 1, a: 'hello'},
                "should pass row node as after value");
            equal(event.afterValue, undefined,
                "should pass row node as after value");
        }

        function onChange(event) {
            equal(event.originalPath.toString(), 'table>foo>1',
                "should trigger change event on row entity path");
            deepEqual(event.beforeValue, {id: 1, a: 'hello'},
                "should pass row node as before value");
            equal(event.afterValue, undefined,
                "should pass undefined as after value");
        }

        bookworm.entities
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE, 'table'.toPath(), onBeforeChange)
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'table'.toPath(), onChange);

        row.addMocks({
            getSilentNode: function () {
                ok(true, "should fetch before node silently");
                return {id: 1, a: 'hello'};
            }
        });

        row.entityKey.addMocks({
            getRowId: function () {
                return 1;
            }
        });

        row.jorderTable.addMocks({
            deleteItem: function (key) {
                equal(key, 1, "should delete row in jorder table");
            }
        });

        strictEqual(row.unsetKey(), row, "should be chainable");

        row.jorderTable.removeMocks();
    });
}());
