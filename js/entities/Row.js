/*global dessert, troop, sntls, flock, jorder, bookworm */
troop.postpone(bookworm, 'Row', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend();

    /**
     * Creates a Row instance.
     * Row is used internally by Table. Do not instantiate.
     * TODO: Remove conversion methods?
     * @name bookworm.Row.create
     * @function
     * @param {bookworm.RowKey} rowKey
     * @returns {bookworm.Row}
     */

    /**
     * Implements table row manipulation.
     * Used internally by Table. Not to be used directly.
     * @class
     * @extends bookworm.Entity
     * @ignore
     */
    bookworm.Row = self
        .addMethods(/** @lends bookworm.Row# */{
            /**
             * @param {bookworm.RowKey} rowKey
             * @ignore
             */
            init: function (rowKey) {
                dessert.isRowKey(rowKey, "Invalid row key");
                base.init.call(this, rowKey);

                /**
                 * Local shortcut to the jorder table in which the row is.
                 * @type {jorder.Table}
                 */
                this.jorderTable = rowKey.tableKey.toTable().jorderTable;

                /**
                 * Row key associated with current entity.
                 * @name bookworm.Row#entityKey
                 * @type {bookworm.RowKey}
                 */
            },

            /**
             * Sets the specified row node, updating indexes.
             * If row node is in conflict with the current row signature, could lead to inconsistent state.
             * @param {object} rowNode
             * @returns {bookworm.Row}
             */
            setNode: function (rowNode) {
                var beforeNode = this.getSilentNode(),
                    entityPath = this.entityKey.getEntityPath(),
                    entities = bookworm.entities;

                entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE)
                    .setBefore(beforeNode)
                    .setAfter(rowNode)
                    .triggerSync(entityPath);

                this.jorderTable.setItem(this.entityKey.getRowId(), rowNode);

                entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
                    .setBefore(beforeNode)
                    .setAfter(rowNode)
                    .triggerSync(entityPath);

                return this;
            },

            /**
             * Clears the current row, updating indexes.
             * @returns {bookworm.Row}
             */
            unsetKey: function () {
                var beforeNode = this.getSilentNode(),
                    entities = bookworm.entities,
                    entityPath = this.entityKey.getEntityPath();

                entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE)
                    .setBefore(beforeNode)
                    .triggerSync(entityPath);

                this.jorderTable.deleteItem(this.entityKey.getRowId());

                entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
                    .setBefore(beforeNode)
                    .triggerSync(entityPath);

                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'Entity', function () {
    "use strict";

    bookworm.Entity
        .addSurrogate(bookworm, 'Row', function (entityKey) {
            return entityKey.instanceOf(bookworm.RowKey);
        });
});

troop.amendPostponed(bookworm, 'RowKey', function () {
    "use strict";

    bookworm.RowKey
        .addMethods(/** @lends bookworm.RowKey */{
            /**
             * @returns {bookworm.Row}
             */
            toRow: function () {
                return bookworm.Row.create(this);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {bookworm.Row}
             */
            toRow: function () {
                return bookworm.Row.create(this.toRowKey());
            }
        },
        false, false, false);

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * @returns {bookworm.Row}
             */
            toRow: function () {
                return bookworm.Row.create(this.toRowKey());
            }
        },
        false, false, false);
}());
