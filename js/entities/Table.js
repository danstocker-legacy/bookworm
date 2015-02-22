/*global dessert, troop, sntls, bookworm */
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
     * @class
     * @extends bookworm.Entity
     */
    bookworm.Table = self
        .addMethods(/** @lends bookworm.Table# */{
            /**
             * @param {bookworm.TableKey} tableKey
             * @ignore
             */
            init: function (tableKey) {
                dessert.isTableKey(tableKey, "Invalid document key");
                base.init.call(this, tableKey);

                /**
                 * Table key associated with current entity.
                 * @name bookworm.Table#entityKey
                 * @type {bookworm.TableKey}
                 */
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
