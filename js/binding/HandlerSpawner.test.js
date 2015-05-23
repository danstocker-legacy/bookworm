/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("HandlerSpawner");

    test("Instantiation", function () {
        var handlerSpawner = bookworm.HandlerSpawner.create('foo');

        equal(handlerSpawner.bindingType, 'foo', "should set bindingType property");
    });
}());
