/*global dessert, troop, sntls, flock, jorder, bookworm */
troop.postpone(bookworm, 'Table', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend();

    /**
     * @name bookworm.Table.create
     * @function
     * @param {bookworm.TableKey} tableKey
     * @returns {bookworm.Table}
     */

    /**
     * Override unique index spawner, define surrogate between Table and your class.
     * TODO: Trigger before-change, too?
     * @class
     * @extends bookworm.Entity
     */
    bookworm.Table = self
        .setInstanceMapper(function (tableName) {
            return tableName;
        })
        .addMethods(/** @lends bookworm.Table# */{
            /**
             * @param {bookworm.TableKey} tableKey
             * @ignore
             */
            init: function (tableKey) {
                dessert.isTableKey(tableKey, "Invalid document key");
                base.init.call(this, tableKey);

                /**
                 * Fields that uniquely identify a row.
                 * @type {jorder.Index}
                 */
                this.uniqueIndex = this.spawnUniqueIndex();

                /** @type {jorder.Table} */
                this.jorderTable = jorder.Table.create(this.getNode())
                    .addIndex(this.uniqueIndex);

                /**
                 * Table key associated with current entity.
                 * @name bookworm.Table#entityKey
                 * @type {bookworm.TableKey}
                 */
            },

            /**
             * @param {object[]} tableNode
             * @returns {bookworm.Table}
             */
            setNode: function (tableNode) {
                dessert.isArray(tableNode, "Invalid table node");

                var jorderTable = this.jorderTable
                    .clear()
                    .insertRows(tableNode);

                base.setNode.call(this, jorderTable.items);

                return this;
            },

            /** @returns {bookworm.Table} */
            unsetKey: function () {
                var jorderTable = this.jorderTable
                    .clear();

                base.setNode.call(this, jorderTable.items);

                return this;
            },

            /**
             * Default index spawner. In case your row ID field(s) differ from this,
             * 1) subclass Table,
             * 2) override .spawnUniqueIndex(),
             * 3) and provide a surrogate to your subclass.
             * @returns {jorder.Index}
             */
            spawnUniqueIndex: function () {
                return jorder.Index.create(['id']);
            },

            /**
             * Updates rows if they're present in the table, inserts them otherwise.
             * Assumes that each row is unique. Otherwise might behave unpredictably.
             * TODO: Find alternative for updateRowsByRow.
             * @param {object[]} rowsAfter
             * @returns {bookworm.Table}
             */
            updateRows: function (rowsAfter) {
                var uniqueIndex = this.uniqueIndex,
                    jorderTable = this.jorderTable,
                    rowSignature = uniqueIndex.rowSignature;

                rowsAfter.toCollection()
                    .forEachItem(function (row) {
                        var keys = rowSignature.getKeysForRow(row),
                            matchingRows = uniqueIndex.getRowIdsForKeys(keys);

                        if (matchingRows.length) {
                            jorderTable.updateRowsByRow(row, row, uniqueIndex);
                        } else {
                            jorderTable.insertRow(row);
                        }
                    });

                base.setNode.call(this, jorderTable.items);

                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'Entity', function () {
    "use strict";

    bookworm.Entity
        .addSurrogate(bookworm, 'Table', function (entityKey) {
            return entityKey.instanceOf(bookworm.TableKey);
        });
});

troop.amendPostponed(bookworm, 'TableKey', function () {
    "use strict";

    bookworm.TableKey
        .addMethods(/** @lends bookworm.TableKey */{
            /**
             * @returns {bookworm.Table}
             */
            toTable: function () {
                return bookworm.Table.create(this);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {bookworm.Table}
             */
            toTable: function () {
                return bookworm.Table.create(this.toTableKey());
            }
        },
        false, false, false
    );
}());
