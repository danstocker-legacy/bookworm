/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("ChangeHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = bookworm.HandlerSpawner.create('change');

        ok(handlerSpawner.isA(bookworm.ChangeHandlerSpawner),
            "should return ChangeHandlerSpawner instance");
    });
}());
