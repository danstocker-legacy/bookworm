/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("AttributeKey");

    test("Instantiation", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            attributeKey = bookworm.AttributeKey.create(documentKey, 'baz');

        strictEqual(attributeKey.parentKey, documentKey, "should set parentKey property");
        equal(attributeKey.attributeName, 'baz', "should set attributeName property");

        equal(attributeKey.eventPath.toString(), 'entity>document>foo>bar>baz',
            "should set event path");
    });

    test("Equivalence tester", function () {
        var attributeKey1 = bookworm.AttributeKey.create('foo/bar'.toDocumentKey(), 'baz'),
            attributeKey2 = bookworm.AttributeKey.create('foo/bar/baz'.toFieldKey(), 'baz'),
            attributeKey3 = bookworm.AttributeKey.create('foo/bar'.toDocumentKey(), 'hello'),
            attributeKey4 = bookworm.AttributeKey.create('foo/bar'.toDocumentKey(), 'baz');

        ok(!attributeKey1.equals(undefined), "should fail on undefined");
        ok(!attributeKey1.equals(attributeKey2), "should fail on parent key mismatch");
        ok(!attributeKey1.equals(attributeKey3), "should fail on attribute name mismatch");
        ok(attributeKey1.equals(attributeKey4), "should succeed when both parent key and attribute name match");
    });

    test("Entity path getter", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            attributeKey = bookworm.AttributeKey.create(documentKey, 'baz');

        ok(attributeKey.getEntityPath().equals('document>foo>bar>baz'.toPath()),
            "should append attribute name to document path");
    });
}());
