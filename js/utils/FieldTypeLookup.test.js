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
        expect(4);

        bookworm.FieldTypeLookup.addMocks({
            _queryFieldTypes: function () {
                ok(true, "should query all field types");
                return sntls.Collection.create({
                    'document>document>user>name>fieldType': 'reference'
                });
            }
        });

        bookworm.index.addMocks({
            setNode: function (indexPath, value) {
                equal(value, true, "should store true in index as leaf node");
                equal(indexPath.toString(), 'field>by-field-type>reference>fieldType>user>name',
                    "should add correct path to index");
            }
        });

        var lookup = bookworm.FieldTypeLookup.create();

        bookworm.index.removeMocks();

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

    test("Querying fields matching field type", function () {
        expect(2);

        var lookup = bookworm.FieldTypeLookup.create();

        bookworm.index.addMocks({
            getNodeAsHash: function (indexPath) {
                equal(indexPath.toString(), 'field>by-field-type>reference>fieldType>user',
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
                equal(indexPath.toString(), 'field>by-field-type>reference>itemType>user',
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
                equal(indexPath.toString(), 'field>by-field-type>reference>itemIdType>user',
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
