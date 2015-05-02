/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity Key");

    test("Instantiation", function () {
        var entityPath = 'foo>bar'.toPath();

        bookworm.EntityKey.addMocks({
            getEntityPath: function () {
                return entityPath;
            }
        });

        var entityKey = bookworm.EntityKey.create();

        bookworm.EntityKey.removeMocks();

        equal(entityKey.eventPath.toString(), 'entity>foo>bar',
            "should set event path");
    });

    test("String conversion", function () {
        expect(1);

        bookworm.EntityKey.addMocks({
            create: function () {
                deepEqual(arguments, {0: 'foo', 1: 'bar'},
                    "should call EntityKey constructor with correct arguments");
            }
        });

        'foo/bar'.toEntityKey();

        bookworm.EntityKey.removeMocks();

    });

    test("String conversion with URI decoding", function () {
        expect(1);

        bookworm.EntityKey.addMocks({
            create: function () {
                deepEqual(arguments, {0: 'f/o', 1: 'bar'},
                    "should call EntityKey constructor with URI decoded arguments");
            }
        });

        'f%2Fo/bar'.toEntityKey();

        bookworm.EntityKey.removeMocks();
    });

    test("Array conversion", function () {
        expect(1);

        bookworm.EntityKey.addMocks({
            create: function () {
                deepEqual(arguments, {0: 'foo', 1: 'bar'},
                    "should call EntityKey constructor with correct arguments");
            }
        });

        ['foo', 'bar'].toEntityKey();

        bookworm.EntityKey.removeMocks();
    });
}());
