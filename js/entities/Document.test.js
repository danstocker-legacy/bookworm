/*global dessert, troop, sntls, flock, bookworm */
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

    test("Attribute node getter", function () {
        expect(3);

        var document = 'foo/bar'.toDocument(),
            attributePath = {},
            attributeNode = {};

        document.entityKey.addMocks({
            getAttributePath: function (attribute) {
                equal(attribute, 'hello', "should get attribute path for specified attribute");
                return attributePath;
            }
        });

        bookworm.entities.addMocks({
            getNode: function (path) {
                strictEqual(path, attributePath,
                    "should fetch the node from attribute path");
                return attributeNode;
            }
        });

        strictEqual(document.getDocumentAttribute('hello'), attributeNode, "should return attribute node");

        bookworm.entities.removeMocks();
    });

    test("Field entity getter", function () {
        var document = 'foo/bar'.toDocument(),
            field = document.getField('baz');

        ok(field.isA(bookworm.Field), "should return Field instance");
        equal(field.entityKey.toString(), 'foo/bar/baz', "should set field key on returned entity");
    });
}());
