/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'EntityKey', function () {
    "use strict";

    /**
     * @name dache.EntityKey.create
     * @function
     * @returns {dache.EntityKey}
     */

    /**
     * Abstract class for identifying Entities.
     * A EntityKey may be resolved to a cache path, relying on metadata information about the Entity.
     * @class
     * @extends troop.Base
     */
    dache.EntityKey = troop.Base.extend();

    /**
     * Tells whether specified key is identical to the current one.
     * @name dache.EntityKey#equals
     * @function
     * @param {dache.EntityKey} key
     * @returns {boolean}
     */

    /**
     * Resolves key to the cache path of the Entity.
     * @name dache.EntityKey#getEntityPath
     * @function
     * @returns {sntls.Path}
     */

    /**
     * Retrieves meta node path associated with the current key.
     * @name dache.EntityKey#getMetaPath
     * @function
     * @returns {sntls.Path}
     */
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** Tells whether expression is an EntityKey */
        isEntityKey: function (expr) {
            return dache.EntityKey.isBaseOf(expr);
        },

        /** Tells whether expression is optionally an EntityKey */
        isEntityKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   dache.EntityKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to EntityKey instance.
             * @returns {dache.EntityKey}
             */
            toEntityKey: function () {
                var parts = this.split('/')
                    .map(function (part) {
                        return decodeURIComponent(part);
                    });
                return dache.EntityKey.create.apply(dache.EntityKey, parts);
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts Array to EntityKey instance.
             * @returns {dache.EntityKey}
             */
            toEntityKey: function () {
                return dache.EntityKey.create.apply(dache.EntityKey, this);
            }
        },
        false, false, false
    );
}());
