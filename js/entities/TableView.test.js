/*global dessert, troop, sntls, evan, jorder, bookworm, milkman, shoehine, candystore, poodle, app */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("TableView", {
        setup: function () {
            bookworm.Table.clearInstanceRegistry();
            bookworm.TableView.clearInstanceRegistry();
        },

        teardown: function () {
            bookworm.Table.clearInstanceRegistry();
            bookworm.TableView.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var view = bookworm.TableView.create('foo/bar/baz'.toFieldKey());

        ok(view.hasOwnProperty('tableKey'), "should add tableKey property");
        ok(view.hasOwnProperty('offsetRange'), "should add offsetRange property");
        equal(view.offsetRange.lowerBound, 0, "should set zero lower bound by default");
        equal(view.offsetRange.upperBound, 0, "should set zero upper bound by default");
        ok(view.hasOwnProperty('sortingIndex'), "should add sortingIndex property");
    });

    test("Field surrogate", function () {
        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                return 'table-view';
            }
        });

        var view = 'foo/bar/baz'.toField();

        bookworm.FieldKey.removeMocks();

        ok(view.isA(bookworm.TableView), "should return TableView");
    });

    test("Table key setter", function () {
        expect(5);

        var tableKey = 'moo'.toTableKey(),
            view = bookworm.TableView.create('foo/bar/baz'.toFieldKey());

        view.addMocks({
            _updateIndexOnTable: function () {
                ok(true, "should update index in new table");
            },
            _invalidateView: function () {
                ok(true, "should invalidate view");
            }
        });

        strictEqual(view.setTableKey(tableKey), view, "should be chainable");
        strictEqual(view.tableKey, tableKey, "should set tableKey property");

        view.setTableKey('moo'.toTableKey());
        ok(true, "should do nothing on setting the same table");
    });

    test("Offset range setter", function () {
        expect(6);

        var view = bookworm.TableView.create('foo/bar/baz'.toFieldKey()),
            range = [5, 10].toRange();

        raises(function () {
            view.setOffsetRange();
        }, "should raise exception on missing argument");

        raises(function () {
            view.setOffsetRange('foo');
        }, "should raise exception on invalid argument");

        view.addMocks({
            _invalidateView: function () {
                ok(true, "should invalidate view");
            }
        });

        strictEqual(view.setOffsetRange(range), view, "should be chainable");
        strictEqual(view.offsetRange, range, "should set offset range");

        view.setOffsetRange([5, 10].toRange());
        ok(true, "should do nothing on setting the same range");
    });

    test("Sorting index setter", function () {
        expect(5);

        var sortingIndex = ['moo'].toIndex(),
            view = bookworm.TableView.create('foo/bar/baz'.toFieldKey());

        view.addMocks({
            _updateIndexOnTable: function () {
                ok(true, "should update index in new table");
            },
            _invalidateView: function () {
                ok(true, "should invalidate view");
            }
        });

        strictEqual(view.setSortingIndex(sortingIndex), view, "should be chainable");
        strictEqual(view.sortingIndex, sortingIndex, "should set tableKey property");

        view.setSortingIndex(sortingIndex);
        ok(true, "should do nothing on setting the same sorting index (by reference)");
    });

    test("Updating invalid table view", function () {
        var view = bookworm.TableView.create('foo/bar/baz'.toFieldKey())
            .setOffsetRange([1, 2].toRange());

        view.addMocks({
            _updateIndexOnTable: function () {
            }
        });

        raises(function () {
            view.updateView();
        }, "should raise exception on missing properties");

        view.setTableKey('moo'.toTableKey());

        raises(function () {
            view.updateView();
        }, "should raise exception on missing properties");

        view.removeMocks();
    });

    test("Updating view", function () {
        expect(2);

        var tableNode = [
            {name: 'C', id: 'item0', value: 'bar'},
            {name: 'A', id: 'item1', value: 'baz'},
            {name: 'B', id: 'item2', value: 'foo'}
        ];

        bookworm.Table.addMocks({
            getNode: function () {
                return tableNode;
            }
        });

        // just making sure table "moo" is initialized with the right jorder data
        'moo'.toTable();

        var view = bookworm.TableView.create('foo/bar/baz'.toFieldKey())
            .setTableKey('moo'.toTableKey())
            .setSortingIndex(['name'].toIndex())
            .setOffsetRange([1, 3].toRange());

        view.addMocks({
            setValue: function (node) {
                deepEqual(node, {
                    item2: '1',
                    item0: '2'
                }, "should set field node");
            }
        });

        strictEqual(view.updateView(), view, "should be chainable");

        bookworm.Table.removeMocks();
        view.removeMocks();
    });

    test("Access handler", function () {
        expect(1);

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                return 'table-view';
            }
        });

        var fieldKey = 'foo/bar/baz'.toFieldKey();

        bookworm.TableView.addMocks({
            updateView: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should update table view");
            }
        });
        
        fieldKey.toField()
            .setSortingIndex(['name'].toIndex())
            .setTableKey('moo'.toTableKey())
            .unsetKey()
            .getNode();

        bookworm.FieldKey.removeMocks();
        bookworm.TableView.removeMocks();
    });
}());
