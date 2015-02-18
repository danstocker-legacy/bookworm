/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("ReferenceManager");

    test("Clearing reference field", function () {
        expect(2);

        bookworm.Field.addMocks({
            setValue: function (value) {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should modify referencing field");
                equal(typeof value, 'undefined', "should set referencing field to undefined");
            }
        });

        bookworm.ReferenceManager._clearReference('foo/bar/baz'.toFieldKey());

        bookworm.Field.removeMocks();
    });

    test("Clearing reference item", function () {
        expect(2);

        bookworm.Item.addMocks({
            setValue: function (value) {
                equal(this.entityKey.toString(), 'foo/bar/baz/0', "should modify referencing item");
                equal(typeof value, 'undefined', "should set referencing item to undefined");
            }
        });

        bookworm.ReferenceManager._clearReference('foo/bar/baz/0'.toItemKey());

        bookworm.Item.removeMocks();
    });

    test("Clearing reference item ID", function () {
        expect(1);

        bookworm.Item.addMocks({
            unsetKey: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz/hello%2Fworld', "should remove referencing item");
            }
        });

        bookworm.ReferenceManager._clearReference('foo/bar/baz/hello%2Fworld'.toReferenceItemKey());

        bookworm.Item.removeMocks();
    });

    test("Back reference removal", function () {
        expect(3);

        var clearedEntities = [];

        bookworm.ReferenceLookup.addMocks({
            getBackReferences: function () {
                ok(true, "should retrieve back references for removed document");
                return [
                    'foo/bar/baz',
                    'foo/bar/baz/0',
                    'foo/bar/baz/hello%2Fworld'
                ].toCollection();
            }
        });

        bookworm.ReferenceManager.addMocks({
            _clearReference: function (entityKey) {
                clearedEntities.push(entityKey.toString());
            }
        });

        strictEqual(
            bookworm.ReferenceManager.removeBackReferences('hello/world'.toDocumentKey()),
            bookworm.ReferenceManager,
            "should be chainable");

        bookworm.ReferenceLookup.removeMocks();
        bookworm.ReferenceManager.removeMocks();

        deepEqual(clearedEntities, [
            'foo/bar/baz',
            'foo/bar/baz/0',
            'foo/bar/baz/hello%2Fworld'
        ], "should remove back references");
    });

    test("Cache change handler", function () {
        expect(1);

        bookworm.ReferenceManager.addMocks({
            removeBackReferences: function (documentKey) {
                equal(documentKey.toString(), 'hello/world',
                    "should remove back references for affected document key");
            }
        });

        bookworm.entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore({})
            .triggerSync('hello/world'.toDocumentKey().getEntityPath());

        bookworm.entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setAfter({})
            .triggerSync('foo/bar'.toDocumentKey().getEntityPath());

        bookworm.entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore({})
            .triggerSync('foo/bar/baz'.toFieldKey().getEntityPath());

        bookworm.ReferenceManager.removeMocks();
    });
}());
