/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'RowKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * @name bookworm.RowKey.create
     * @function
     * @params {string} tableName,
     * @params {number|string} rowSignature Row signature relative to the specified table's unique index.
     * @returns {bookworm.RowKey}
     */

    /**
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.RowKey = self
        .addPrivateMethods(/** @lends bookworm.RowKey# */{
            /**
             * Retrieves the row ID currently associated with the row.
             * @returns {string|number}
             * @private
             */
            _getRowId: function () {
                return this.tableKey.toTable()
                    .uniqueIndex
                    .getRowIdsForKeys([this.rowSignature])[0];
            },

            /**
             * Retrieves the next row's row ID.
             * @returns {number}
             * @private
             */
            _getNextRowId: function () {
                return this.tableKey.toTable()
                    .jorderTable
                    .items
                    .length;
            }
        })
        .addMethods(/** @lends bookworm.RowKey# */{
            /**
             * @params {string} tableName
             * @params {number|string} rowSignature
             * @ignore
             */
            init: function (tableName, rowSignature) {
                /**
                 * Identifies the table.
                 * @type {bookworm.TableKey}
                 */
                this.tableKey = tableName.toTableKey();

                /**
                 * Identifies the row within the table.
                 * @type {number|string}
                 */
                this.rowSignature = rowSignature;

                /**
                 * Position of row within the table.
                 * @type {string|number}
                 */
                this.rowId = rowSignature ? this._getRowId() : undefined;
            },

            /**
             * @param {bookworm.RowKey} rowKey
             * @returns {boolean}
             */
            equals: function (rowKey) {
                return rowKey &&
                       this.tableKey.equals(rowKey.tableKey) &&
                       this.rowSignature === rowKey.rowSignature;
            },

            /**
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                return this.tableKey.getEntityPath().appendKey(String(this.getRowId()));
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
                       encodeURIComponent(this.rowSignature);
            },

            /**
             * @returns {string|number}
             */
            getRowId: function () {
                var rowId = this.rowId;
                return typeof rowId !== 'undefined' ?
                    rowId :
                    this._getNextRowId();
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
