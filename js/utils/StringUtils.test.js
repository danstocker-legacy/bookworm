/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("StringUtils");

    test("Safe split", function () {
        deepEqual(bookworm.StringUtils.safeSplit('foo/bar/baz', '/'), ['foo', 'bar', 'baz'],
            "should split clean delimited string");
        deepEqual(bookworm.StringUtils.safeSplit('foo\\/bar/baz\\qux', '/'), ['foo\\/bar', 'baz\\qux'],
            "should split string with escaped delimiters correctly");
    });

    test("Escape", function () {
        equal(bookworm.StringUtils.escape(undefined, '/'), 'undefined',
            "should return 'undefined' for undefined input");
        equal(bookworm.StringUtils.escape('', '/'), '',
            "should return empty string for empty string input");
        equal(bookworm.StringUtils.escape(0, '/'), '0',
            "should return stringified number for numeric input");

        equal(bookworm.StringUtils.escape('foo/bar/baz', '/'), 'foo\\/bar\\/baz',
            "should return string with specified character escaped");
    });

    test("Unescape", function () {
        equal(bookworm.StringUtils.unescape(undefined, '/'), 'undefined',
            "should return 'undefined' for undefined input");
        equal(bookworm.StringUtils.unescape('', '/'), '',
            "should return empty string for empty string input");
        equal(bookworm.StringUtils.unescape(0, '/'), '0',
            "should return stringified number for numeric input");

        equal(bookworm.StringUtils.unescape('foo\\/bar\\/baz', '/'), 'foo/bar/baz',
            "should unescape clean encoded string");
        equal(bookworm.StringUtils.unescape('foo/bar\\/baz', '/'), 'foo/bar/baz',
            "should discard unescaped versions of the specified characters");
    });
}());
