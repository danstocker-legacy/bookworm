/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'EntityKey', function () {
    "use strict";

    /**
     * Creates an EntityKey instance.
     * Do not create EntityKey instances directly, only through its subclasses,
     * unless suitable surrogates have been set up.
     * @name bookworm.EntityKey.create
     * @function
     * @returns {bookworm.EntityKey}
     */

    /**
     * Abstract class for identifying Entities.
     * A EntityKey may be resolved to an entity path.
     * @class
     * @extends troop.Base
     */
    bookworm.EntityKey = troop.Base.extend()
        .addMethods(/** @lends bookworm.EntityKey# */{
            /** @ignore */
            init: function () {
            },

            /** @returns {string} */
            toString: function () {
                return '';
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
     * Resolves key to a path that points to the entity node in the cache.
     * @name bookworm.EntityKey#getEntityPath
     * @function
     * @returns {sntls.Path}
     */

    /**
     * Resolves key to a path that points to the specified entity attribute in the cache.
     * @name bookworm.EntityKey#getAttributePath
     * @function
     * @param {string} attribute
     * @returns {sntls.Path}
     */

    /**
     * Retrieves config node path for the current key.
     * @name bookworm.EntityKey#getConfigPath
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

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `EntityKey` instance. Assumes that string is a serialized `EntityKey`.
             * @returns {bookworm.EntityKey}
             */
            toEntityKey: function () {
                var StringUtils = bookworm.StringUtils,
                    parts = StringUtils.safeSplit(this, '/')
                        .map(function (part) {
                            return StringUtils.unescapeChars(part, '/');
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
             * Converts `Array` to `EntityKey` instance. Assumes that array is an entity key in array notation.
             * @returns {bookworm.EntityKey}
             */
            toEntityKey: function () {
                return bookworm.EntityKey.create.apply(bookworm.EntityKey, this);
            }
        },
        false, false, false
    );
}());
