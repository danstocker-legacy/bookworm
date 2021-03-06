/*global dessert, troop, sntls, evan, bookworm */
troop.postpone(bookworm, 'EntityKey', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

    /**
     * Creates an EntityKey instance.
     * Do not create EntityKey instances directly, only through its subclasses.
     * @name bookworm.EntityKey.create
     * @function
     * @returns {bookworm.EntityKey}
     */

    /**
     * Base class for entity keys.
     * Entity keys identify entities without relying on their actual content.
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     * @extends rubberband.Stringifiable
     */
    bookworm.EntityKey = self
        .setEventSpace(bookworm.entityEventSpace)
        .setEventPath('entity'.toPath())
        .addMethods(/** @lends bookworm.EntityKey# */{
            /** @ignore */
            init: function () {
                evan.Evented.init.call(this);
            },

            /**
             * Fetches an attribute key based on the current key as parent and the specified attribute name.
             * @param {string} attributeName
             * @returns {bookworm.AttributeKey}
             */
            getAttributeKey: function (attributeName) {
                return bookworm.AttributeKey.create(this, attributeName);
            }
        });

    /**
     * Tells whether specified entity key is identical to the current one.
     * @name bookworm.EntityKey#equals
     * @function
     * @param {bookworm.EntityKey} key
     * @returns {boolean}
     */

    /**
     * Fetches a key to the document that contains the config information about the current entity.
     * @name bookworm.EntityKey#getConfigKey
     * @function
     * @returns {bookworm.DocumentKey}
     */

    /**
     * Resolves key to a path that points to the entity node in the cache.
     * @name bookworm.EntityKey#getEntityPath
     * @function
     * @returns {sntls.Path}
     */
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {bookworm.EntityKey} expr */
        isEntityKey: function (expr) {
            return bookworm.EntityKey.isBaseOf(expr);
        },

        /** @param {bookworm.EntityKey} [expr] */
        isEntityKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.EntityKey.isBaseOf(expr);
        }
    });
}());
