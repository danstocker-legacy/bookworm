/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Document");

    test("Instantiation", function () {
        raises(function () {
            bookworm.Document.create();
        }, "should raise exception on missing document key argument");

        raises(function () {
            bookworm.Document.create('foo');
        }, "should raise exception on invalid document key argument");
    });

    test("Conversion from String", function () {
        var document = 'foo/bar'.toDocument();

        ok(document.isA(bookworm.Document), "should return Document instance");
        equal(document.entityKey.toString(), 'foo/bar', "should set document key");
    });

    test("Conversion from Array", function () {
        var document = ['foo', 'bar'].toDocument();

        ok(document.isA(bookworm.Document), "should return Document instance");
        equal(document.entityKey.toString(), 'foo/bar', "should set document key");
    });

    test("Conversion from DocumentKey", function () {
        var documentKey = ['foo', 'bar'].toDocumentKey(),
            document = documentKey.toDocument();

        ok(document.isA(bookworm.Document), "should return Document instance");
        strictEqual(document.entityKey, documentKey, "should set document key");
    });

    test("Entity surrogate", function () {
        var entity = bookworm.Entity.create('foo/bar'.toDocumentKey());

        ok(entity.isA(bookworm.Document), "should return Document instance");
        equal(entity.entityKey.toString(), 'foo/bar', "should set correct key");
    });

    test("Conversion from EntityKey", function () {
        var documentKey = ['foo', 'bar'].toDocumentKey(),
            document = documentKey.toEntity();

        ok(document.isA(bookworm.Document), "should return Document instance");
        strictEqual(document.entityKey, documentKey, "should set document key");
    });

    test("Fields entity getter", function () {
        var document = 'foo/bar'.toDocument();
        strictEqual(document.getFieldsEntity(), document, "should return self");
    });

    test("Field entity getter", function () {
        var document = 'foo/bar'.toDocument(),
            field = document.getField('baz');

        ok(field.isA(bookworm.Field), "should return Field instance");
        equal(field.entityKey.toString(), 'foo/bar/baz', "should set field key on returned entity");
    });
}());
