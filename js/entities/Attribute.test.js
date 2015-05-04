/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Attribute");

    test("Instantiation", function () {
        raises(function () {
            bookworm.Attribute.create();
        }, "should raise exception on missing attribute key argument");

        raises(function () {
            bookworm.Attribute.create('foo');
        }, "should raise exception on invalid attribute key argument");
    });

    test("Conversion from AttributeKey", function () {
        var attributeKey = ['foo', 'bar'].toDocumentKey().getAttributeKey('baz'),
            attribute = attributeKey.toAttribute();

        ok(attribute.isA(bookworm.Attribute), "should return Attribute instance");
        strictEqual(attribute.entityKey, attributeKey, "should set entityKey property");
    });

    test("Entity surrogate", function () {
        var attributeKey = 'foo/bar'.toDocumentKey().getAttributeKey('baz'),
            attribute = bookworm.Entity.create(attributeKey);

        ok(attribute.isA(bookworm.Attribute), "should return Attribute instance");
        strictEqual(attribute.entityKey, attributeKey, "should set entityKey property");
    });

    test("Conversion from EntityKey", function () {
        var attributeKey = 'foo/bar'.toDocumentKey().getAttributeKey('baz'),
            attribute = attributeKey.toEntity();

        ok(attribute.isA(bookworm.Attribute), "should return Attribute instance");
        strictEqual(attribute.entityKey, attributeKey, "should set attributeKey property");
    });
}());
