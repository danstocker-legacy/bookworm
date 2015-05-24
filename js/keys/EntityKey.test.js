/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("EntityKey");

    test("Instantiation", function () {
        var entityKey = bookworm.EntityKey.create();

        ok(entityKey.hasOwnProperty('subscriptionRegistry'), "should initialize Evented trait");
    });

    test("Attribute key getter", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            attributeKey;

        attributeKey = documentKey.getAttributeKey('baz');

        ok(attributeKey.isA(bookworm.AttributeKey), "should return AttributeKey instance");
        equal(attributeKey.attributeName, 'baz', "should set attributeName property");
        strictEqual(attributeKey.parentKey, documentKey, "should set parentKey attribute");
    });
}());
