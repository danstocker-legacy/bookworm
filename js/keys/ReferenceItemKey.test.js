/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Reference Item Key");

    test("Instantiation", function () {
        var itemKey = bookworm.ReferenceItemKey.create('hello', 'world', 'foo', 'bar/baz');

        equal(itemKey.itemId, 'bar/baz', "should set item ID");
        ok(itemKey.referenceKey.equals('bar/baz'.toDocumentKey()), "should set reference key");
    });

    test("Conversion from String", function () {
        var itemKey = 'hello/world/foo/bar%2Fbaz'.toReferenceItemKey();

        equal(itemKey.itemId, 'bar/baz', "should set item ID");
        ok(itemKey.referenceKey.equals('bar/baz'.toDocumentKey()), "should set reference key");
    });

    test("Conversion from Array", function () {
        var itemKey = ['hello', 'world', 'foo', 'bar/baz'].toReferenceItemKey();

        equal(itemKey.itemId, 'bar/baz', "should set item ID");
        ok(itemKey.referenceKey.equals('bar/baz'.toDocumentKey()), "should set reference key");
    });

    test("ItemKey surrogate", function () {
        var itemKey = bookworm.ItemKey.create('hello', 'world', 'foo', 'bar/baz');

        ok(itemKey.isA(bookworm.ReferenceItemKey), "should return ReferenceKey instance");
        equal(itemKey.itemId, 'bar/baz', "should set item ID");
        ok(itemKey.referenceKey.equals('bar/baz'.toDocumentKey()), "should set reference key");
    });
}());
