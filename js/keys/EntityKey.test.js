/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity Key");

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
