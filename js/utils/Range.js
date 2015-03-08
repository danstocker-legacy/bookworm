/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Range', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name bookworm.Range.create
     * @function
     * @param {number|string} [lowerBound] Start of range. Undefined means open.
     * @param {number|string} [upperBound] End of range. Undefined means open.
     * @returns {bookworm.Range}
     */

    /**
     * Describes a range in a numeric or string axis. Immutable.
     * TODO: Add range manipulation methods: intersect, subtract, etc.
     * TODO: Move to jorder / sntls?
     * @class
     * @extends troop.Base
     */
    bookworm.Range = self
        .addMethods(/** @lends bookworm.Range# */{
            /**
             * @param {number|string} [lowerBound]
             * @param {number|string} [upperBound]
             * @ignore
             */
            init: function (lowerBound, upperBound) {
                dessert.assert(
                    typeof lowerBound === 'undefined' ||
                    typeof upperBound === 'undefined' ||
                    lowerBound <= upperBound,
                    "Invalid range bounds");

                /**
                 * Start of range.
                 * Undefined means open.
                 * @type {number|string}
                 */
                this.lowerBound = lowerBound;

                /**
                 * End of range.
                 * Undefined means open.
                 * @type {number|string}
                 */
                this.upperBound = upperBound;
            },

            /**
             * Tells whether the specified range describes the same bounds as the current one.
             * @param {bookworm.Range} range
             * @returns {boolean}
             */
            equals: function (range) {
                return range &&
                       this.lowerBound === range.lowerBound &&
                       this.upperBound === range.upperBound;
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {bookworm.Range} expr */
        isRange: function (expr) {
            return bookworm.Range.isBaseOf(expr);
        },

        /** @param {bookworm.Range} [expr] */
        isRangeOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.Range.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * @returns {bookworm.Range}
             */
            toRange: function () {
                var bound1 = this[0],
                    bound2 = this[1];

                return bound1 < bound2 ?
                    bookworm.Range.create(bound1, bound2) :
                    bookworm.Range.create(bound2, bound1);
            }
        },
        false, false, false);
}());
