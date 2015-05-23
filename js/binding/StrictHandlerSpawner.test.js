/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("StrictHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = bookworm.HandlerSpawner.create('strict');

        ok(handlerSpawner.isA(bookworm.StrictHandlerSpawner),
            "should return StrictHandlerSpawner instance");
    });
}());
