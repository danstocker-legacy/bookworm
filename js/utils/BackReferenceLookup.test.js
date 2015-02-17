/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("BackReferenceLookup");

    test("Querying field back references", function () {
        bookworm.entities.addMocks({
            queryPathValuePairsAsHash: function (query) {
                equal(query.toString(), 'document>foo>|>baz', "should query path-value pairs for matching fields");
                return sntls.Collection.create({
                    'document>foo>bar>baz': 'hello/world'
                });
            }
        });

        var backReferences = bookworm.BackReferenceLookup._queryFieldBackReferences('foo', 'baz');

        bookworm.entities.removeMocks();

        ok(backReferences.isA(sntls.Collection), "should return a Collection instance");
        deepEqual(backReferences.items, {
            'foo/bar/baz': 'hello/world'
        }, "should return collection of field ref - document ref associations");
    });

    test("Querying item back references", function () {
        bookworm.entities.addMocks({
            queryPathValuePairsAsHash: function (query) {
                equal(query.toString(), 'document>foo>|>baz>|', "should query path-value pairs for matching items");
                return sntls.Collection.create({
                    'document>foo>bar>baz>0': 'hello/world'
                });
            }
        });

        var backReferences = bookworm.BackReferenceLookup._queryItemBackReferences('foo', 'baz');

        bookworm.entities.removeMocks();

        ok(backReferences.isA(sntls.Collection), "should return a Collection instance");
        deepEqual(backReferences.items, {
            'foo/bar/baz/0': 'hello/world'
        }, "should return collection of item ref - document ref associations");
    });

    test("Querying item ID back references", function () {
        bookworm.entities.addMocks({
            queryPathsAsHash: function (query) {
                equal(query.toString(), 'document>foo>|>baz>|', "should query path-value pairs for matching items");
                return sntls.Collection.create([
                    'document>foo>bar>baz>hello/world'.toPath()
                ]);
            }
        });

        var backReferences = bookworm.BackReferenceLookup._queryItemIdBackReferences('foo', 'baz');

        bookworm.entities.removeMocks();

        ok(backReferences.isA(sntls.Collection), "should return a Collection instance");
        deepEqual(backReferences.items, {
            'foo/bar/baz/hello%2Fworld': 'hello/world'
        }, "should return collection of reference item ref - document ref associations");
    });

    test("Querying all back references", function () {
        expect(9);

        var lookup = bookworm.BackReferenceLookup.create();

        bookworm.config.addMocks({
            queryPathsAsHash: function (query) {
                strictEqual(query, bookworm.BackReferenceLookup.referenceFieldsQuery,
                    "should query reference fields");
                return [
                    'document>document>foo>bar>fieldType',
                    'document>document>foo>baz>itemType',
                    'document>document>hello>world>itemIdType'
                ].toHash();
            }
        });

        lookup.addMocks({
            _queryFieldBackReferences: function (documentType, fieldName) {
                equal(documentType, 'foo', "should pass correct document type to field back ref query");
                equal(fieldName, 'bar', "should pass correct field name to field back ref query");
                return sntls.Collection.create({
                    'foo/1/bar': 'hello/world'
                });
            },

            _queryItemBackReferences: function (documentType, fieldName) {
                equal(documentType, 'foo', "should pass correct document type to item back ref query");
                equal(fieldName, 'baz', "should pass correct field name to item back ref query");
                return sntls.Collection.create({
                    'foo/2/baz': 'hello/world'
                });
            },

            _queryItemIdBackReferences: function (documentType, fieldName) {
                equal(documentType, 'hello', "should pass correct document type to item back ref query");
                equal(fieldName, 'world', "should pass correct field name to item back ref query");
                return sntls.Collection.create({
                    'hello/0/world': 'hello/world'
                });
            }
        });

        var backReferences = lookup._queryBackReferences();

        bookworm.config.removeMocks();
        lookup.removeMocks();

        ok(backReferences.isA(sntls.Collection), "should return Collection instance");
        deepEqual(backReferences.items, {
            'foo/1/bar'    : 'hello/world',
            'foo/2/baz'    : 'hello/world',
            'hello/0/world': 'hello/world'
        }, "should fetch reference - document associations");
    });

    test("Instantiation", function () {
        expect(3);

        var backReferences = [];

        bookworm.BackReferenceLookup.clearInstanceRegistry();

        bookworm.BackReferenceLookup.addMocks({
            _queryBackReferences: function () {
                ok(true, "should query all back references from cache");
                return sntls.Collection.create({
                    foo: 'hello',
                    bar: 'world'
                });
            },

            _addBackReference: function (referredRef, referrerRef) {
                backReferences.push([referredRef, referrerRef]);
            }
        });

        var lookup = bookworm.BackReferenceLookup.create();

        bookworm.BackReferenceLookup.removeMocks();

        deepEqual(backReferences, [
            ['hello', 'foo'],
            ['world', 'bar']
        ], "should pass collected back references to setter");

        strictEqual(bookworm.BackReferenceLookup.create(), lookup, "should be singleton");
    });

    test("Back reference addition", function () {
        expect(3);

        var lookup = bookworm.BackReferenceLookup.create();

        lookup.addMocks({
            _addBackReference: function (referredRef, referrerRef) {
                equal(referredRef, 'hello/world', "should pass referred reference to addition");
                equal(referrerRef, 'foo/bar/baz', "should pass referrer reference to addition");
            }
        });

        strictEqual(
            lookup.addBackReference('hello/world'.toDocumentKey(), 'foo/bar/baz'.toFieldKey()),
            lookup,
            "should be chainable");

        lookup.removeMocks();
    });

    test("Back reference removal", function () {
        expect(2);

        var lookup = bookworm.BackReferenceLookup.create();

        lookup.addMocks({
            _removeBackReference: function (referredRef) {
                equal(referredRef, 'hello/world', "should pass referred reference to removal");
            }
        });

        strictEqual(
            lookup.removeBackReference('hello/world'.toDocumentKey()),
            lookup,
            "should be chainable");

        lookup.removeMocks();
    });
}());
