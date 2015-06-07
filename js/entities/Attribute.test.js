/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Attribute");

    test("Instantiation", function () {
        raises(function () {
            bookworm.Attribute.create();
        }, "should raise exception on missing document key argument");

        raises(function () {
            bookworm.Attribute.create('foo');
        }, "should raise exception on invalid document key argument");
    });

    test("Conversion from AttributeKey", function () {
        var attributeKey = bookworm.AttributeKey.create('foo/bar'.toDocumentKey(), 'baz'),
            attribute = attributeKey.toAttribute();

        ok(attribute.isA(bookworm.Attribute), "should return Attribute instance");
        strictEqual(attribute.entityKey, attributeKey, "should set attribute key");
    });

    test("Entity surrogate", function () {
        var attributeKey = bookworm.AttributeKey.create('foo/bar'.toDocumentKey(), 'baz'),
            entity = bookworm.Entity.create(attributeKey);

        ok(entity.isA(bookworm.Attribute), "should return Attribute instance");
        strictEqual(entity.entityKey, attributeKey, "should set attribute key");
    });

    test("Conversion from EntityKey", function () {
        var attributeKey = bookworm.AttributeKey.create('foo/bar'.toDocumentKey(), 'baz'),
            entity = attributeKey.toEntity();

        ok(entity.isA(bookworm.Attribute), "should return Attribute instance");
        strictEqual(entity.entityKey, attributeKey, "should set attribute key");
    });
}());
