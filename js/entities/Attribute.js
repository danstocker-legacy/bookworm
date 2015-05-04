/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Attribute', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend();

    /**
     * @name bookworm.Attribute.create
     * @function
     * @param {bookworm.AttributeKey} documentKey Identifies document.
     * @returns {bookworm.Attribute}
     */

    /**
     * @class
     * @extends bookworm.Entity
     */
    bookworm.Attribute = self
        .addMethods(/** @lends bookworm.Attribute# */{
            /**
             * @param {bookworm.AttributeKey} attributeKey
             * @ignore
             */
            init: function (attributeKey) {
                dessert.isAttributeKey(attributeKey, "Invalid attribute key");
                base.init.call(this, attributeKey);

                /**
                 * Entity key associated with current attribute.
                 * @name bookworm.Attribute#entityKey
                 * @type {bookworm.AttributeKey}
                 */
            }
        });
});

troop.amendPostponed(bookworm, 'Entity', function () {
    "use strict";

    bookworm.Entity
        .addSurrogate(bookworm, 'Attribute', function (entityKey) {
            return entityKey.instanceOf(bookworm.AttributeKey);
        });
});

troop.amendPostponed(bookworm, 'AttributeKey', function () {
    "use strict";

    bookworm.AttributeKey
        .addMethods(/** @lends bookworm.AttributeKey */{
            /**
             * Converts `AttributeKey` to `Attribute`.
             * @returns {bookworm.Attribute}
             */
            toAttribute: function () {
                return bookworm.Attribute.create(this);
            }
        });
});
