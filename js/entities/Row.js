/*global dessert, troop, sntls, flock, jorder, bookworm */
troop.postpone(bookworm, 'Row', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend();

    /**
     * @name bookworm.Row.create
     * @function
     * @param {bookworm.RowKey} rowKey
     * @returns {bookworm.Row}
     */

    /**
     * @class
     * @extends bookworm.Entity
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
                 * Row key associated with current entity.
                 * @name bookworm.Row#entityKey
                 * @type {bookworm.RowKey}
                 */
            },

            /**
             * @param {object[]} rowNode
             * @returns {bookworm.Row}
             */
            setNode: function (rowNode) {
                return this;
            },

            /** @returns {bookworm.Row} */
            unsetKey: function () {
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
