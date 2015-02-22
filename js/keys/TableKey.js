/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'TableKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * @name bookworm.TableKey.create
     * @function
     * @params {string} tableName
     * @returns {bookworm.TableKey}
     */

    /**
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.TableKey = self
        .addMethods(/** @lends bookworm.TableKey# */{
            /**
             * @params {string} tableName
             * @ignore
             */
            init: function (tableName) {
                /**
                 * Identifies the table.
                 * @type {string}
                 */
                this.tableName = tableName;
            },

            /**
             * @param {bookworm.TableKey} tableKey
             * @returns {boolean}
             */
            equals: function (tableKey) {
                return tableKey &&
                       this.tableName === tableKey.tableName;
            },

            /**
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                return ['table', String(this.tableName)].toPath();
            },

            /**
             * @param {string} attribute Identifies table attribute.
             * @returns {sntls.Path}
             */
            getAttributePath: function (attribute) {
                return this.getEntityPath()
                    .appendKey(attribute);
            },

            /**
             * Determines the absolute path to the config node of the current document.
             * @returns {sntls.Path}
             */
            getConfigPath: function () {
                return ['table', String(this.tableName)].toDocumentKey().getEntityPath();
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return this.tableName;
            }
        });
});

troop.amendPostponed(bookworm, 'EntityKey', function () {
    "use strict";

    bookworm.EntityKey
        .addSurrogate(bookworm, 'TableKey', function () {
            return arguments.length === 1;
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {bookworm.TableKey} expr */
        isTableKey: function (expr) {
            return bookworm.TableKey.isBaseOf(expr);
        },

        /** @param {bookworm.TableKey} [expr] */
        isTableKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.TableKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {bookworm.TableKey}
             */
            toTableKey: function () {
                return bookworm.TableKey.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
