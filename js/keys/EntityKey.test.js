/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity Key");

    test("Instantiation", function () {
        var entityKey = bookworm.EntityKey.create();

       ok(entityKey.hasOwnProperty('subscriptionRegistry'), "should initialize Evented trait");
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

    test("Attribute key getter", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            attributeKey;

        attributeKey = documentKey.getAttributeKey()
    });
}());
