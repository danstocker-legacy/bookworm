/*global dessert, troop, sntls, evan, bookworm */
troop.postpone(bookworm, 'StringUtils', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @class
     * @extends troop.Base
     */
    bookworm.StringUtils = self
        .addMethods(/** @lends bookworm.StringUtils */{
            /**
             * Splits string along delimiter safely, ignoring backslash-escaped versions of the delimiter.
             * @param {string} str
             * @param {string} delimiter
             * @returns {string[]}
             */
            safeSplit: function (str, delimiter) {
                var reSplit = new RegExp(
                        '([^\\\\\\' + delimiter + ']*(?:\\\\' + delimiter + '|\\\\)?[^\\\\' + delimiter + ']*)(?=' + delimiter + '|$)'),
                    components = str.split(reSplit),
                    componentCount = components.length,
                    result = [],
                    i;

                // filtering out splitting artifacts
                for (i = 1; i < componentCount; i += 2) {
                    result.push(components[i]);
                }

                return result;
            },

            /**
             * Escapes the specified characters with backslash.
             * TODO: Remove string conversion in next minor version.
             * @param {string} str
             * @param {string} charsToEscape
             * @returns {string}
             */
            escape: function (str, charsToEscape) {
                var optionsExpression = charsToEscape.split('').join('|'),
                    reEscape = new RegExp(optionsExpression, 'g');
                return String(str).replace(reEscape, '\\$&');
            },

            /**
             * Un-escapes backslash-escaped characters.
             * TODO: Remove string conversion in next minor version.
             * @param {string} str
             * @param {string} charsToUnescape
             * @returns {string}
             */
            unescape: function (str, charsToUnescape){
                var optionsExpression = charsToUnescape.split('').join('|'),
                    reEscape = new RegExp('\\\\(\\' + optionsExpression + ')', 'g');
                return String(str).replace(reEscape, '$1');
            }
        });
});
