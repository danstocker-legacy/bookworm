/*global dessert, troop, sntls, flock, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Document");

    test("Instantiation", function () {
        raises(function () {
            b$.Document.create();
        }, "should raise exception on missing document key argument");

        raises(function () {
            b$.Document.create('foo');
        }, "should raise exception on invalid document key argument");

        var document = b$.Document.create('foo/bar'.toDocumentKey());

        strictEqual(document.documentKey, document.entityKey, "should set document key");
    });

    test("Conversion from String", function () {
        var document = 'foo/bar'.toDocument();

        ok(document.isA(b$.Document), "should return Document instance");
        equal(document.documentKey.toString(), 'foo/bar', "should set document key");
    });

    test("Conversion from Array", function () {
        var document = ['foo', 'bar'].toDocument();

        ok(document.isA(b$.Document), "should return Document instance");
        equal(document.documentKey.toString(), 'foo/bar', "should set document key");
    });

    test("Conversion from DocumentKey", function () {
        var documentKey = ['foo', 'bar'].toDocumentKey(),
            document = documentKey.toDocument();

        ok(document.isA(b$.Document), "should return Document instance");
        strictEqual(document.documentKey, documentKey, "should set document key");
    });

    test("Meta node getter", function () {
        expect(4);

        var document = 'foo/bar'.toDocument(),
            metaNode = {};

        b$.Document.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'hello'},
                    "should fetch the metadata node from right under the entity node");
                return metaNode;
            }
        });

        b$.DocumentKey.addMocks({
            hasDocumentMeta: function () {
                equal(this.toString(), 'foo/bar', "should test for document metadata");
                return true;
            }
        });

        strictEqual(document.getDocumentMeta('hello'), metaNode, "should return meta node");

        b$.DocumentKey.removeMocks();

        b$.DocumentKey.addMocks({
            hasDocumentMeta: function () {
                return false;
            }
        });

        equal(typeof document.getDocumentMeta('hello'), 'undefined',
            "should return undefined when document has no metadata");

        b$.DocumentKey.removeMocks();

        b$.Document.removeMocks();
    });

    test("Field entity getter", function () {
        var document = 'foo/bar'.toDocument(),
            field = document.getField('baz');

        ok(field.isA(b$.Field), "should return Field instance");
        equal(field.fieldKey.toString(), 'foo/bar/baz', "should set field key on returned entity");
    });
}());
