/*global dessert, troop, sntls, flock, dache */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Document");

    test("Instantiation", function () {
        raises(function () {
            dache.Document.create();
        }, "should raise exception on missing document key argument");

        raises(function () {
            dache.Document.create('foo');
        }, "should raise exception on invalid document key argument");

        var document = dache.Document.create('foo/bar'.toDocumentKey());

        strictEqual(document.documentKey, document.entityKey, "should set document key");
    });

    test("Conversion from String", function () {
        var document = 'foo/bar'.toDocument();

        ok(document.isA(dache.Document), "should return Document instance");
        equal(document.documentKey.toString(), 'foo/bar', "should set document key");
    });

    test("Conversion from Array", function () {
        var document = ['foo', 'bar'].toDocument();

        ok(document.isA(dache.Document), "should return Document instance");
        equal(document.documentKey.toString(), 'foo/bar', "should set document key");
    });

    test("Conversion from DocumentKey", function () {
        var documentKey = ['foo', 'bar'].toDocumentKey(),
            document = documentKey.toDocument();

        ok(document.isA(dache.Document), "should return Document instance");
        strictEqual(document.documentKey, documentKey, "should set document key");
    });
}());
