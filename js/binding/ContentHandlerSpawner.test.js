/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("ContentHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = bookworm.HandlerSpawner.create('content');

        ok(handlerSpawner.isA(bookworm.ContentHandlerSpawner),
            "should return ContentHandlerSpawner instance");
    });
}());
