/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'AttributeKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * @name bookworm.AttributeKey.create
     * @function
     * @param {bookworm.EntityKey} parentKey Identifies the entity the attribute belongs to.
     * @param {string} attributeName Identifies the attribute relative to the parent entity.
     * @returns {bookworm.AttributeKey}
     */

    /**
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.AttributeKey = self
        .setEventPath(['document'].toPath().prepend(base.eventPath))
        .addMethods(/** @lends bookworm.AttributeKey# */{
            /**
             * @param {bookworm.EntityKey} parentKey
             * @param {string} attributeName
             * @ignore
             */
            init: function (parentKey, attributeName) {
                /**
                 * @type {bookworm.EntityKey}
                 */
                this.parentKey = parentKey;

                /**
                 * @type {string}
                 */
                this.attributeName = attributeName;

                this.setEventPath([attributeName].toPath().prepend(parentKey.eventPath));
            },

            /**
             * Tells whether the specified `AttributeKey` instance is equivalent to the current one.
             * @param {bookworm.AttributeKey} attributeKey
             * @returns {boolean}
             */
            equals: function (attributeKey) {
                return attributeKey &&
                       this.parentKey.equals(attributeKey.parentKey) &&
                       this.attributeName === attributeKey.attributeName;
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {bookworm.AttributeKey} expr */
        isAttributeKey: function (expr) {
            return bookworm.AttributeKey.isBaseOf(expr);
        },

        /** @param {bookworm.AttributeKey} [expr] */
        isAttributeKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.AttributeKey.isBaseOf(expr);
        }
    });
}());
