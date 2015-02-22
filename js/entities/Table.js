/*global dessert, troop, sntls, jorder, bookworm */
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
        .addPrivateMethods(/** @lends bookworm.Table# */{
            /** @private */
            _initCache: function () {
                if (!this.getSilentNode()) {
                    this.setNode([]);
                }
            }
        })
        .addMethods(/** @lends bookworm.Table# */{
            /**
             * @param {bookworm.TableKey} tableKey
             * @ignore
             */
            init: function (tableKey) {
                dessert.isTableKey(tableKey, "Invalid document key");
                base.init.call(this, tableKey);

                this._initCache();

                /** @type {jorder.Table} */
                this.sourceTable = jorder.Table.create(this.getSilentNode());

                /**
                 * Fields that uniquely identify a row.
                 * @type {jorder.Index}
                 */
                this.uniqueIndex = this.spawnUniqueIndex();

                /**
                 * Table key associated with current entity.
                 * @name bookworm.Table#entityKey
                 * @type {bookworm.TableKey}
                 */
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
