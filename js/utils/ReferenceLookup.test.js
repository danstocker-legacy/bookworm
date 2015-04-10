/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("ReferenceLookup");

    test("Querying field back references", function () {
        bookworm.entities.addMocks({
            queryPathValuePairsAsHash: function (query) {
                equal(query.toString(), 'document>foo>|>baz', "should query path-value pairs for matching fields");
                return sntls.Collection.create({
                    'document>foo>bar>baz': 'hello/world'
                });
            }
        });

        var backReferences = bookworm.ReferenceLookup._queryFieldReferences('foo', 'baz');

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

        var backReferences = bookworm.ReferenceLookup._queryItemReferences('foo', 'baz');

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

        var backReferences = bookworm.ReferenceLookup._queryItemIdReferences('foo', 'baz');

        bookworm.entities.removeMocks();

        ok(backReferences.isA(sntls.Collection), "should return a Collection instance");
        deepEqual(backReferences.items, {
            'foo/bar/baz/hello%2Fworld': 'hello/world'
        }, "should return collection of reference item ref - document ref associations");
    });

    test("Querying all back references", function () {
        expect(9);

        var lookup = bookworm.ReferenceLookup.create();

        bookworm.config.addMocks({
            queryPathsAsHash: function (query) {
                strictEqual(query, bookworm.ReferenceLookup.referenceFieldsQuery,
                    "should query reference fields");
                return [
                    'document>document>foo>bar>fieldType'.toPath(),
                    'document>document>foo>baz>itemType'.toPath(),
                    'document>document>hello>world>itemIdType'.toPath()
                ].toHash();
            }
        });

        lookup.addMocks({
            _queryFieldReferences: function (documentType, fieldName) {
                equal(documentType, 'foo', "should pass correct document type to field back ref query");
                equal(fieldName, 'bar', "should pass correct field name to field back ref query");
                return sntls.Collection.create({
                    'foo/1/bar': 'hello/world'
                });
            },

            _queryItemReferences: function (documentType, fieldName) {
                equal(documentType, 'foo', "should pass correct document type to item back ref query");
                equal(fieldName, 'baz', "should pass correct field name to item back ref query");
                return sntls.Collection.create({
                    'foo/2/baz': 'hello/world'
                });
            },

            _queryItemIdReferences: function (documentType, fieldName) {
                equal(documentType, 'hello', "should pass correct document type to item back ref query");
                equal(fieldName, 'world', "should pass correct field name to item back ref query");
                return sntls.Collection.create({
                    'hello/0/world': 'hello/world'
                });
            }
        });

        var backReferences = lookup._queryReferences();

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

        bookworm.ReferenceLookup.clearInstanceRegistry();

        bookworm.ReferenceLookup.addMocks({
            _queryReferences: function () {
                ok(true, "should query all back references from cache");
                return sntls.Collection.create({
                    foo: 'hello',
                    bar: 'world'
                });
            },

            _addReference: function (referredRef, referrerRef) {
                backReferences.push([referredRef, referrerRef]);
            }
        });

        var lookup = bookworm.ReferenceLookup.create();

        bookworm.ReferenceLookup.removeMocks();

        deepEqual(backReferences, [
            ['hello', 'foo'],
            ['world', 'bar']
        ], "should pass collected back references to setter");

        strictEqual(bookworm.ReferenceLookup.create(), lookup, "should be singleton");
    });

    test("Reference addition", function () {
        expect(3);

        var lookup = bookworm.ReferenceLookup.create();

        lookup.addMocks({
            _addReference: function (referredRef, referrerRef) {
                equal(referredRef, 'hello/world', "should pass referred reference to addition");
                equal(referrerRef, 'foo/bar/baz', "should pass referrer reference to addition");
            }
        });

        strictEqual(
            lookup.addReference('hello/world'.toDocumentKey(), 'foo/bar/baz'.toFieldKey()),
            lookup,
            "should be chainable");

        lookup.removeMocks();
    });

    test("Reference removal", function () {
        expect(2);

        var lookup = bookworm.ReferenceLookup.create();

        lookup.addMocks({
            _removeReference: function (referredRef) {
                equal(referredRef, 'hello/world', "should pass referred reference to removal");
            }
        });

        strictEqual(
            lookup.removeReference('hello/world'.toDocumentKey()),
            lookup,
            "should be chainable");

        lookup.removeMocks();
    });

    // TODO: Add tests for item values & item keys version.
    test("Querying references on single field", function () {
        expect(3);

        'foo/bar/baz'.toField()
            .setNode('hello/world');

        var lookup = bookworm.ReferenceLookup.create();

        bookworm.FieldTypeLookup.addMocks({
            getAttributesForFieldType: function (fieldType, documentType, fieldName) {
                equal(documentType, 'foo', "should pass document type to FieldTypeLookup");
                equal(fieldName, 'baz', "should pass field name to FieldTypeLookup");
                return {
                    fieldType: true
                };
            }
        });

        deepEqual(
            lookup.getReferencesFromField('foo/bar/baz'.toFieldKey()),
            ['hello/world'],
            "should return array with references");

        bookworm.FieldTypeLookup.removeMocks();
    });

    test("Querying references on document", function () {
        expect(3);

        'foo/bar'.toDocument()
            .setNode({
                baz   : 'hello/world',
                name  : 'anon',
                valueC: ['foo/1', 'foo/2'],
                keyC  : {
                    'foo/3': true,
                    'foo/4': true
                },
                otherC: [1, 2, 3, 4]
            });

        var lookup = bookworm.ReferenceLookup.create();

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                if (this.fieldName === 'valueC' || this.fieldName === 'keyC') {
                    return 'collection';
                } else {
                    return 'string';
                }
            }
        });

        bookworm.FieldTypeLookup.addMocks({
            getFieldNamesForType     : function (fieldType, documentType) {
                equal(fieldType, 'reference', "should get reference field list for document type");
                equal(documentType, 'foo', "should pass correct document type to FieldTypeLookup");
                return ['baz', 'valueC', 'keyC'];
            },
            getAttributesForFieldType: function (fieldType, documentType, fieldName) {
                return {
                    baz   : {
                        fieldType: true
                    },
                    valueC: {
                        itemType: true
                    },
                    keyC  : {
                        itemIdType: true
                    }
                }[fieldName];
            }
        });

        deepEqual(
            lookup.getReferencesFromDocument('foo/bar'.toDocumentKey()).sort(),
            ['hello/world', 'foo/1', 'foo/2', 'foo/3', 'foo/4'].sort(),
            "should return array with references");

        bookworm.FieldKey.removeMocks();
        bookworm.FieldTypeLookup.removeMocks();
    });

    test("Reference field change handler", function () {
        expect(5);

        var lookup = bookworm.ReferenceLookup.create();

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                equal(this.toString(), 'foo/bar/baz', "should get field type");
                return 'reference';
            }
        });

        lookup.addMocks({
            _removeReference: function (referredRef, referrerRef) {
                equal(referredRef, 'hello/world', "should remove reference from old document");
                equal(referrerRef, 'foo/bar/baz', "should pass referrer to removal");
            },

            _addReference: function (referredRef, referrerRef) {
                equal(referredRef, 'hi/all', "should add reference to new document");
                equal(referrerRef, 'foo/bar/baz', "should pass referrer to addition");
            }
        });

        bookworm.entities.eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore('hello/world')
            .setAfter('hi/all')
            .triggerSync('foo/bar/baz'.toFieldKey().getEntityPath());

        bookworm.FieldKey.removeMocks();
        lookup.removeMocks();
    });

    test("Reference item value change handler", function () {
        expect(5);

        var lookup = bookworm.ReferenceLookup.create();

        bookworm.ItemKey.addMocks({
            getItemType: function () {
                equal(this.toString(), 'foo/bar/baz/0', "should get field type");
                return 'reference';
            }
        });

        lookup.addMocks({
            _removeReference: function (referredRef, referrerRef) {
                equal(referredRef, 'hello/world', "should remove reference from old document");
                equal(referrerRef, 'foo/bar/baz/0', "should pass referrer to removal");
            },

            _addReference: function (referredRef, referrerRef) {
                equal(referredRef, 'hi/all', "should add reference to new document");
                equal(referrerRef, 'foo/bar/baz/0', "should pass referrer to addition");
            }
        });

        bookworm.entities.eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore('hello/world')
            .setAfter('hi/all')
            .triggerSync('foo/bar/baz/0'.toItemKey().getEntityPath());

        bookworm.ItemKey.removeMocks();
        lookup.removeMocks();
    });

    test("Reference item addition handler", function () {
        expect(2);

        var lookup = bookworm.ReferenceLookup.create();

        lookup.addMocks({
            _addReference: function (referredRef, referrerRef) {
                equal(referredRef, 'hello/world', "should add reference to new document");
                equal(referrerRef, 'foo/bar/baz/hello%2Fworld', "should pass referrer to addition");
            }
        });

        bookworm.entities.eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setAfter('hello/world')
            .triggerSync('foo/bar/baz/hello%2Fworld'.toItemKey().getEntityPath());

        lookup.removeMocks();
    });

    test("Reference item removal handler", function () {
        expect(2);

        var lookup = bookworm.ReferenceLookup.create();

        lookup.addMocks({
            _removeReference: function (referredRef, referrerRef) {
                equal(referredRef, 'hello/world', "should remove reference from old document");
                equal(referrerRef, 'foo/bar/baz/hello%2Fworld', "should pass referrer to removal");
            }
        });

        bookworm.entities.eventSpace.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
            .setBefore('hello/world')
            .triggerSync('foo/bar/baz/hello%2Fworld'.toItemKey().getEntityPath());

        lookup.removeMocks();
    });
}());
