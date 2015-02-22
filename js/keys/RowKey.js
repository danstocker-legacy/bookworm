/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'RowKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * @name bookworm.RowKey.create
     * @function
     * @params {string} tableName,
     * @params {number|string} rowId
     * @returns {bookworm.RowKey}
     */

    /**
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.RowKey = self
        .addMethods(/** @lends bookworm.RowKey# */{
            /**
             * @params {string} tableName
             * @params {number|string} rowId
             * @ignore
             */
            init: function (tableName, rowId) {
                /**
                 * Identifies the table.
                 * @type {bookworm.TableKey}
                 */
                this.tableKey = tableName.toTableKey();

                /**
                 * Identifies the row within the table.
                 * @type {number|string}
                 */
                this.rowId = rowId;
            },

            /**
             * @param {bookworm.RowKey} rowKey
             * @returns {boolean}
             */
            equals: function (rowKey) {
                return rowKey &&
                       this.tableKey.equals(rowKey.tableKey) &&
                       this.rowId === rowKey.rowId;
            },

            /**
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                return this.tableKey.getEntityPath().appendKey(String(this.rowId));
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
             * @returns {string}
             */
            toString: function () {
                return encodeURIComponent(this.tableKey.toString()) + '/' +
                       encodeURIComponent(this.rowId);
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path
        .addMethods(/** @lends sntls.Path# */{
            /**
             * Converts `Path` to `RowKey` instance. Here the path is not a cache path.
             * @returns {bookworm.RowKey}
             */
            toRowKey: function () {
                return this.asArray.toRowKey();
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {bookworm.RowKey} expr */
        isRowKey: function (expr) {
            return bookworm.RowKey.isBaseOf(expr);
        },

        /** @param {bookworm.RowKey} [expr] */
        isRowKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.RowKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {bookworm.RowKey} */
            toRowKey: function () {
                var parts = this.split('/');
                return bookworm.RowKey.create(
                    parts[0] && decodeURIComponent(parts[0]),
                    parts[1] && decodeURIComponent(parts[1])
                );
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /** @returns {bookworm.RowKey} */
            toRowKey: function () {
                return bookworm.RowKey.create(this[0], this[1]);
            }
        },
        false, false, false
    );
}());
