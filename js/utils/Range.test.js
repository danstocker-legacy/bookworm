/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Range");

    test("Instantiation with no arguments", function () {
        var range = bookworm.Range.create();
        equal(range.lowerBound, undefined, "should set undefined lower bound");
        equal(range.upperBound, undefined, "should set undefined upper bound");
    });

    test("Instantiation with no upper bound", function () {
        var range = bookworm.Range.create(4);
        equal(range.lowerBound, 4, "should set lower bound");
        equal(range.upperBound, undefined, "should set undefined upper bound");
    });

    test("Instantiation with no lower bound", function () {
        var range= bookworm.Range.create(undefined, 4);
        equal(range.lowerBound, undefined, "should set undefined lower bound");
        equal(range.upperBound, 4, "should set upper bound");
    });

    test("Instantiation with reversed bounds", function () {
        raises(function () {
            bookworm.Range.create(7, 4);
        }, "should raise exception on invalid numeric bounds");

        raises(function () {
            bookworm.Range.create("B", "A");
        }, "should raise exception on invalid string bounds");
    });

    test("Instantiation with correct bound order", function () {
        var range= bookworm.Range.create(3, 4);
        equal(range.lowerBound, 3, "should set lower bound");
        equal(range.upperBound, 4, "should set upper bound");
    });

    test("Instantiation with identical bounds", function () {
        var range;
        range = bookworm.Range.create(3, 3);
        equal(range.lowerBound, 3, "should set lower bound");
        equal(range.upperBound, 3, "should set upper bound");
    });

    test("Conversion from array", function () {
        var range = [1, 2].toRange();

        ok(range.isA(bookworm.Range), "should return Range instance");
        equal(range.lowerBound, 1, "should set lower bound");
        equal(range.upperBound, 2, "should set upper bound");
    });

    test("Conversion from array with reversed bounds", function () {
        var range = [2, 1].toRange();

        ok(range.isA(bookworm.Range), "should return Range instance");
        equal(range.lowerBound, 1, "should set lower bound");
        equal(range.upperBound, 2, "should set upper bound");
    });
}());
