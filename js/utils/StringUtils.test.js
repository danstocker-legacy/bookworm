/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("StringUtils");

    test("Safe split", function () {
        console.log("split 1", JSON.stringify(bookworm.StringUtils.safeSplit('foo/bar/baz', '/'), null, 2));
        deepEqual(bookworm.StringUtils.safeSplit('foo/bar/baz', '/'), ['foo', 'bar', 'baz'],
            "should split clean delimited string");

        console.log("split 2", JSON.stringify(bookworm.StringUtils.safeSplit('foo/', '/'), null, 2));
        deepEqual(bookworm.StringUtils.safeSplit('foo/', '/'), ['foo', ''],
            "should preserve trailing empty string component");

        deepEqual(bookworm.StringUtils.safeSplit('/foo', '/'), ['', 'foo'],
            "should preserve leading empty string component");

        console.log("split 3", JSON.stringify(bookworm.StringUtils.safeSplit('foo\\/\\/bar/baz\\\\qux', '/'), null, 2));
        deepEqual(bookworm.StringUtils.safeSplit('foo\\/\\/bar/baz\\\\qux', '/'), ['foo\\/\\/bar', 'baz\\\\qux'],
            "should split string with escaped delimiters correctly");
    });

    test("Escaping", function () {
        equal(bookworm.StringUtils.escapeChars(undefined, '/'), 'undefined',
            "should return 'undefined' for undefined input");
        equal(bookworm.StringUtils.escapeChars('', '/'), '',
            "should return empty string for empty string input");
        equal(bookworm.StringUtils.escapeChars(0, '/'), '0',
            "should return stringified number for numeric input");

        equal(bookworm.StringUtils.escapeChars('foo/bar/baz', '/'), 'foo\\/bar\\/baz',
            "should return string with specified character escaped");
    });

    test("Unescaping", function () {
        equal(bookworm.StringUtils.unescapeChars(undefined, '/'), 'undefined',
            "should return 'undefined' for undefined input");
        equal(bookworm.StringUtils.unescapeChars('', '/'), '',
            "should return empty string for empty string input");
        equal(bookworm.StringUtils.unescapeChars(0, '/'), '0',
            "should return stringified number for numeric input");

        equal(bookworm.StringUtils.unescapeChars('foo\\/bar\\/baz', '/'), 'foo/bar/baz',
            "should unescape clean encoded string");
        equal(bookworm.StringUtils.unescapeChars('foo/bar\\/baz', '/'), 'foo/bar/baz',
            "should discard unescaped versions of the specified characters");
    });
}());
