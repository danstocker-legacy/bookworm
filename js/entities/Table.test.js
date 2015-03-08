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
        expect(8);

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
        ok(typeof table.sourceFieldKey, 'undefined', "should add sourceFieldKey property");
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
        expect(13);

        var table = 'foo'.toTable();

        raises(function () {
            table.setNode();
        }, "should raise exception on missing arguments");

        raises(function () {
            table.setNode({});
        }, "should raise exception on invalid arguments");

        table.addMocks({
            getSilentNode: function () {
                ok(true, "should fetch before node silently");
                return [
                    {id: 1, a: 'hello'},
                    {id: 2, a: 'world'},
                    {id: 3, a: 'foo'},
                    {id: 4, a: 'bar'}
                ];
            }
        });

        sntls.Tree.addMocks({
            setNode: function (path, tableNode) {
                strictEqual(this, bookworm.entities, "should set table node");
                equal(path.toString(), 'table>foo', "should pass table entity path");
                deepEqual(tableNode, [
                    {id: 3, a: 'baz'},
                    {id: 1, a: 'hi'},
                    {id: 5, a: 'foo'}
                ], "should pass new table node");
            }
        });

        function onBeforeChange(event) {
            equal(event.originalPath.toString(), 'table>foo', "should trigger before change event on table entity path");
            deepEqual(event.beforeValue, [
                {id: 1, a: 'hello'},
                {id: 2, a: 'world'},
                {id: 3, a: 'foo'},
                {id: 4, a: 'bar'}
            ], "should pass table node as before value");
            deepEqual(event.afterValue, [
                {id: 3, a: 'baz'},
                {id: 1, a: 'hi'},
                {id: 5, a: 'foo'}
            ], "should pass table node as after value");
        }

        function onChange(event) {
            equal(event.originalPath.toString(), 'table>foo', "should trigger change event on table entity path");
            deepEqual(event.beforeValue, [
                {id: 1, a: 'hello'},
                {id: 2, a: 'world'},
                {id: 3, a: 'foo'},
                {id: 4, a: 'bar'}
            ], "should pass table node as before value");
            deepEqual(event.afterValue, [
                {id: 3, a: 'baz'},
                {id: 1, a: 'hi'},
                {id: 5, a: 'foo'}
            ], "should pass table node as after value");
        }

        bookworm.entities
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE, 'table'.toPath(), onBeforeChange)
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'table'.toPath(), onChange);

        strictEqual(table.setNode([
            {id: 3, a: 'baz'},
            {id: 1, a: 'hi'},
            {id: 5, a: 'foo'}
        ]), table, "should be chainable");

        bookworm.entities
            .unsubscribeFrom(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE, 'table'.toPath(), onBeforeChange)
            .unsubscribeFrom(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'table'.toPath(), onChange);

        sntls.Tree.removeMocks();
    });

    test("Key unsetter", function () {
        expect(3);

        var table = 'foo'.toTable(),
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
            unsetKey: function () {
                ok(true, "should unset key");
            }
        });

        strictEqual(table.unsetKey(rows), table, "should be chainable");

        bookworm.Entity.removeMocks();
    });

    test("Setting plain collection as source", function () {
        expect(6);

        var table = 'moo'.toTable();

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                return 'collection';
            }
        });

        bookworm.Field.addMocks({
            getValue: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should fetch collection node");
                return {
                    a: {name: 'A', id: 1},
                    b: {name: 'B', id: 2},
                    c: {name: 'C', id: 3},
                    d: {name: 'D', id: 4}
                };
            }
        });

        table.addMocks({
            setNode: function (tableNode) {
                deepEqual(tableNode, [
                    {name: 'A', id: 1},
                    {name: 'B', id: 2},
                    {name: 'C', id: 3},
                    {name: 'D', id: 4}
                ], "should store extracted table node in cache");
            },

            bindToEntityChange: function (entityKey, methodName) {
                equal(entityKey.toString(), 'foo/bar/baz', "should bind to field key");
                equal(methodName, 'onSourceFieldChange', "should bind correct handler method");
            }
        });

        strictEqual(table.setSourceFieldKey('foo/bar/baz'.toFieldKey()), table,
            "should be chainable");

        bookworm.FieldKey.removeMocks();
        bookworm.Field.removeMocks();

        equal(table.sourceFieldKey.toString(), 'foo/bar/baz', "should set sourceFieldKey");
    });

    test("Setting reference collection as source (value)", function () {
        expect(3);

        var table = 'moo'.toTable();

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                return 'collection';
            }
        });

        bookworm.ItemKey.addMocks({
            getItemType: function () {
                return 'reference';
            }
        });

        bookworm.Field.addMocks({
            getValue: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should fetch collection node");
                return {
                    a: 'hello/world',
                    b: 'hi/all'
                };
            }
        });

        table.addMocks({
            setNode: function (tableNode) {
                deepEqual(tableNode, [
                    {name: 'A', id: 1},
                    {name: 'B', id: 2}
                ], "should store extracted table node in cache");
            }
        });

        'hello/world'.toDocument()
            .setNode({name: 'A', id: 1});
        'hi/all'.toDocument()
            .setNode({name: 'B', id: 2});

        strictEqual(table.setSourceFieldKey('foo/bar/baz'.toFieldKey()), table,
            "should be chainable");

        bookworm.FieldKey.removeMocks();
        bookworm.ItemKey.removeMocks();
        bookworm.Field.removeMocks();
    });

    test("Setting reference collection as source (key)", function () {
        expect(3);

        var table = 'moo'.toTable();

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                return 'collection';
            }
        });

        bookworm.ItemKey.addMocks({
            getItemIdType: function () {
                return 'reference';
            }
        });

        bookworm.Field.addMocks({
            getValue: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should fetch collection node");
                return {
                    'hello/world': 0,
                    'hi/all'     : 1
                };
            }
        });

        table.addMocks({
            setNode: function (tableNode) {
                deepEqual(tableNode, [
                    {name: 'A', id: 1},
                    {name: 'B', id: 2}
                ], "should store extracted table node in cache");
            }
        });

        'hello/world'.toDocument()
            .setNode({name: 'A', id: 1});
        'hi/all'.toDocument()
            .setNode({name: 'B', id: 2});

        strictEqual(table.setSourceFieldKey('foo/bar/baz'.toFieldKey()), table,
            "should be chainable");

        bookworm.FieldKey.removeMocks();
        bookworm.ItemKey.removeMocks();
        bookworm.Field.removeMocks();
    });

    test("Clearing source field key", function () {
        expect(4);

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                return 'collection';
            }
        });

        var table = 'moo'.toTable()
            .setSourceFieldKey('foo/bar/baz'.toFieldKey());

        bookworm.FieldKey.removeMocks();

        table.addMocks({
            unsetKey: function () {
                ok(true, "should clear table node");
                return this;
            },

            unbindFromEntityChange: function (fieldKey) {
                equal(fieldKey.toString(), 'foo/bar/baz');
            }
        });

        strictEqual(table.clearSourceFieldKey(), table, "should be chainable");

        equal(typeof table.sourceFieldKey, 'undefined', "should clear sourceFieldKey property");
    });

    test("Row entity getter", function () {
        var table = 'foo'.toTable(),
            row = table.getRow('bar');

        ok(row.isA(bookworm.Row), "should return Row instance");
        equal(row.entityKey.toString(), 'foo/bar', "should set correct entity key");
    });

    test("Appending node", function () {
        expect(6);

        var table = 'foo'.toTable()
            .setNode([
                {id: 1, a: 'hello'},
                {id: 2, a: 'world'},
                {id: 3, a: 'foo'},
                {id: 4, a: 'bar'}
            ]);

        function onBeforeChange(event) {
            equal(event.originalPath.toString(), 'table>foo', "should trigger before change event on table entity path");
            deepEqual(event.beforeValue, [
                {id: 1, a: 'hello'},
                {id: 2, a: 'world'},
                {id: 3, a: 'foo'},
                {id: 4, a: 'bar'}
            ], "should pass table node as before value");
        }

        function onChange(event) {
            equal(event.originalPath.toString(), 'table>foo', "should trigger change event on table entity path");
            deepEqual(event.afterValue, [
                {id: 1, a: 'hi'},
                {id: 2, a: 'world'},
                {id: 3, a: 'baz'},
                {id: 4, a: 'bar'},
                {id: 5, a: 'foo'}
            ], "should pass table node as after value");
        }

        bookworm.entities
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE, 'table'.toPath(), onBeforeChange)
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'table'.toPath(), onChange);

        strictEqual(
            table.appendNode([
                {id: 3, a: 'baz'},
                {id: 1, a: 'hi'},
                {id: 5, a: 'foo'}
            ]),
            table,
            "should be chainable");

        bookworm.entities
            .unsubscribeFrom(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE, 'table'.toPath(), onBeforeChange)
            .unsubscribeFrom(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'table'.toPath(), onChange);

        deepEqual(table.getNode(), [
            {id: 1, a: 'hi'},
            {id: 2, a: 'world'},
            {id: 3, a: 'baz'},
            {id: 4, a: 'bar'},
            {id: 5, a: 'foo'}
        ], "should set table node");
    });
}());
