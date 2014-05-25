/*global dessert, troop, sntls, flock, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity Key");

    test("String conversion", function () {
        expect(1);

        b$.EntityKey.addMocks({
            create: function () {
                deepEqual(arguments, {0: 'foo', 1: 'bar'},
                    "should call EntityKey constructor with correct arguments");
            }
        });

        'foo/bar'.toEntityKey();

        b$.EntityKey.removeMocks();

    });

    test("String conversion with URI decoding", function () {
        expect(1);

        b$.EntityKey.addMocks({
            create: function () {
                deepEqual(arguments, {0: 'f/o', 1: 'bar'},
                    "should call EntityKey constructor with URI decoded arguments");
            }
        });

        'f%2Fo/bar'.toEntityKey();

        b$.EntityKey.removeMocks();
    });

    test("Array conversion", function () {
        expect(1);

        b$.EntityKey.addMocks({
            create: function () {
                deepEqual(arguments, {0: 'foo', 1: 'bar'},
                    "should call EntityKey constructor with correct arguments");
            }
        });

        ['foo', 'bar'].toEntityKey();

        b$.EntityKey.removeMocks();
    });
}());
