/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("ReplaceHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = bookworm.HandlerSpawner.create('replace');

        ok(handlerSpawner.isA(bookworm.ReplaceHandlerSpawner),
            "should return ReplaceHandlerSpawner instance");
    });
}());
