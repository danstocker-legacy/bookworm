/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("PassThroughHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = bookworm.HandlerSpawner.create('pass-through');

        ok(handlerSpawner.isA(bookworm.PassThroughHandlerSpawner),
            "should return PassThroughHandlerSpawner instance");
    });
}());
