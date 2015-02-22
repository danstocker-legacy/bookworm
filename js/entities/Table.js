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
            },

            /**
             * @param {string[]} oldFieldNames
             * @param {string[]} newFieldNames
             * @private
             */
            _updateUniqueIndex: function (oldFieldNames, newFieldNames) {
                var indexCollection = this.sourceTable.indexCollection,
                    beforeIndex = indexCollection.getBestIndexForFields(oldFieldNames),
                    afterIndex = jorder.Index.create(newFieldNames);

                indexCollection
                    .deleteItem(beforeIndex)
                    .setItem(afterIndex);
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

                /**
                 * Table key associated with current entity.
                 * @name bookworm.Table#entityKey
                 * @type {bookworm.TableKey}
                 */

                /**
                 * Fields that uniquely identify a row.
                 * @type {string[]}
                 */
                this.uniqueFieldNames = undefined;

                this._initCache();

                /** @type {jorder.Table} */
                this.sourceTable = jorder.Table.create(this.getSilentNode());
            },

            /**
             * @param {string[]} uniqueFieldNames
             * @returns {bookworm.Table}
             */
            setUniqueFieldNames: function (uniqueFieldNames) {
                dessert.isArray(uniqueFieldNames, "Invalid unique field names");

                var oldFieldNames = this.uniqueFieldNames;

                this.uniqueFieldNames = uniqueFieldNames;

                this._updateUniqueIndex(oldFieldNames, uniqueFieldNames);

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
