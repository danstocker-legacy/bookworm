/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity Key");

    test("Instantiation", function () {
        var entityKey = bookworm.EntityKey.create();

       ok(entityKey.hasOwnProperty('subscriptionRegistry'), "should initialize Evented trait");
    });

    test("Attribute key getter", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            attributeKey;

        attributeKey = documentKey.getAttributeKey()
    });
}());
