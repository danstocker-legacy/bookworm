/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("FieldHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = bookworm.HandlerSpawner.create('delegate');

        ok(handlerSpawner.isA(bookworm.FieldHandlerSpawner),
            "should return FieldHandlerSpawner instance");
    });
}());
