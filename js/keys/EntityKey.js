/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'EntityKey', function () {
    "use strict";

    /**
     * @name bookworm.EntityKey.create
     * @function
     * @returns {bookworm.EntityKey}
     */

    /**
     * Abstract class for identifying Entities.
     * A EntityKey may be resolved to a cache path.
     * @class
     * @extends troop.Base
     */
    bookworm.EntityKey = troop.Base.extend();

    /**
     * Tells whether specified key is identical to the current one.
     * @name bookworm.EntityKey#equals
     * @function
     * @param {bookworm.EntityKey} key
     * @returns {boolean}
     */

    /**
     * Resolves key to the cache path of the Entity.
     * @name bookworm.EntityKey#getEntityPath
     * @function
     * @returns {sntls.Path}
     */

    /**
     * Resolves key to the cache path associated with the specified entity attribute.
     * @name bookworm.EntityKey#getAttributePath
     * @function
     * @param {string} attribute
     * @returns {sntls.Path}
     */

    /**
     * Retrieves config node path associated with the current key.
     * @name bookworm.EntityKey#getConfigPath
     * @function
     * @returns {sntls.Path}
     */
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** Tells whether expression is an EntityKey */
        isEntityKey: function (expr) {
            return bookworm.EntityKey.isBaseOf(expr);
        },

        /** Tells whether expression is optionally an EntityKey */
        isEntityKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.EntityKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to EntityKey instance.
             * @returns {bookworm.EntityKey}
             */
            toEntityKey: function () {
                var parts = this.split('/')
                    .map(function (part) {
                        return decodeURIComponent(part);
                    });
                return bookworm.EntityKey.create.apply(bookworm.EntityKey, parts);
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts Array to EntityKey instance.
             * @returns {bookworm.EntityKey}
             */
            toEntityKey: function () {
                return bookworm.EntityKey.create.apply(bookworm.EntityKey, this);
            }
        },
        false, false, false
    );
}());
