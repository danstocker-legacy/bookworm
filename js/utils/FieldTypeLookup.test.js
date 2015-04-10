/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("FieldTypeLookup", {
        setup: function () {
            bookworm.FieldTypeLookup.clearInstanceRegistry();
        },

        teardown: function () {
            bookworm.FieldTypeLookup.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        expect(3);

        var storedPaths = [];

        bookworm.FieldTypeLookup.addMocks({
            _queryFieldTypes: function () {
                ok(true, "should query all field types");
                return sntls.Collection.create({
                    'document>document>user>name>fieldType': 'reference'
                });
            }
        });

        bookworm.index.addMocks({
            setNode: function (indexPath) {
                storedPaths.push(indexPath.toString());
                return this;
            }
        });

        var lookup = bookworm.FieldTypeLookup.create();

        bookworm.index.removeMocks();

        deepEqual(storedPaths, [
            'field>by-attribute>reference>fieldType>user>name',
            'attribute>by-field>reference>user>name>fieldType'
        ],
            "should add correct paths to index");

        bookworm.FieldTypeLookup
            .removeMocks()
            .addMocks({
                _queryFieldTypes: function () {
                    return sntls.Collection.create();
                }
            });

        strictEqual(bookworm.FieldTypeLookup.create(), lookup, "should be singleton");

        bookworm.FieldTypeLookup.removeMocks();
    });

    test("Attributes getter", function () {
        expect(2);

        var lookup = bookworm.FieldTypeLookup.create();

        bookworm.index.addMocks({
            getNode: function (indexPath) {
                equal(indexPath.toString(), 'attribute>by-field>reference>user>name',
                    "should get correct node from index");
                return {
                    fieldType: true
                };
            }
        });

        deepEqual(lookup.getAttributesForFieldType('reference', 'user', 'name'), {
            fieldType: true
        }, "should return correct attributes as object keys");

        bookworm.index.removeMocks();
    });

    test("Querying fields matching any type", function () {
        expect(2);

        var lookup = bookworm.FieldTypeLookup.create();

        bookworm.index.addMocks({
            getNodeAsHash: function (indexPath) {
                equal(indexPath.toString(), 'attribute>by-field>reference>user',
                    "should get correct node from index");
                return sntls.Hash.create({
                    name  : true,
                    mother: true,
                    father: true
                });
            }
        });

        deepEqual(lookup.getFieldNamesForType('reference', 'user'), ['name', 'mother', 'father'],
            "should return correct field names in an array");

        bookworm.index.removeMocks();
    });

    test("Querying fields matching field type", function () {
        expect(2);

        var lookup = bookworm.FieldTypeLookup.create();

        bookworm.index.addMocks({
            getNodeAsHash: function (indexPath) {
                equal(indexPath.toString(), 'field>by-attribute>reference>fieldType>user',
                    "should get correct node from index");
                return sntls.Hash.create({
                    mother: true,
                    father: true
                });
            }
        });

        deepEqual(lookup.getFieldNamesForFieldType('reference', 'user'), ['mother', 'father'],
            "should return correct field names in an array");

        bookworm.index.removeMocks();
    });

    test("Querying fields matching item type", function () {
        expect(2);

        var lookup = bookworm.FieldTypeLookup.create();

        bookworm.index.addMocks({
            getNodeAsHash: function (indexPath) {
                equal(indexPath.toString(), 'field>by-attribute>reference>itemType>user',
                    "should get correct node from index");
                return sntls.Hash.create({
                    siblings: true
                });
            }
        });

        deepEqual(lookup.getFieldNamesForItemType('reference', 'user'), ['siblings'],
            "should return correct field names in an array");

        bookworm.index.removeMocks();
    });

    test("Querying fields matching item ID type", function () {
        expect(2);

        var lookup = bookworm.FieldTypeLookup.create();

        bookworm.index.addMocks({
            getNodeAsHash: function (indexPath) {
                equal(indexPath.toString(), 'field>by-attribute>reference>itemIdType>user',
                    "should get correct node from index");
                return sntls.Hash.create({
                    children: true
                });
            }
        });

        deepEqual(lookup.getFieldNamesForItemIdType('reference', 'user'), ['children'],
            "should return correct field names in an array");

        bookworm.index.removeMocks();
    });
}());
