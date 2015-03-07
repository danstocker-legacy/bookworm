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
                dessert.isTableKey(tableKey, "Invalid table key");
                base.init.call(this, tableKey);

                /**
                 * Index that uniquely identifies a row.
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
             * Sets table contents to the specified node.
             * Updates indexes, triggers appropriate events.
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

            /**
             * Clears table contents. Updates indexes, triggers appropriate events.
             * FIXME: Doesn't actually unset the key.
             * @returns {bookworm.Table}
             */
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
             * Fetches a row instance for the specified row signature.
             * To be used internally only.
             * @param {string|number} rowSignature
             * @returns {bookworm.Row}
             * @ignore
             */
            getRow: function (rowSignature) {
                return bookworm.Row.create(this.entityKey.getRowKey(rowSignature));
            },

            /**
             * Updates rows if they're present in the table, inserts them otherwise.
             * Assumes that each row is unique. Otherwise might behave unpredictably.
             * @param {object[]} rowsAfter
             * @returns {bookworm.Table}
             */
            appendNode: function (rowsAfter) {
                var that = this,
                    rowSignature = this.uniqueIndex.rowSignature,
                    jorderTable = this.jorderTable,
                    tableNode = jorderTable.items;

                bookworm.entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE)
                    .setBefore(tableNode)
                    .setAfter(tableNode)
                    .triggerSync(this.entityKey.getEntityPath());

                rowsAfter.toCollection()
                    .mapKeys(rowSignature.getKeyForRow, rowSignature)
                    .forEachItem(function (rowNode, rowSignature) {
                        // adding / changing each row silently
                        var row = that.getRow(rowSignature);
                        jorderTable.setItem(row.entityKey.getRowId(), rowNode);
                    });

                bookworm.entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
                    .setBefore(tableNode)
                    .setAfter(tableNode)
                    .triggerSync(this.entityKey.getEntityPath());

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
