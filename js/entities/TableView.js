/*global dessert, troop, sntls, evan, jorder, bookworm, app */
troop.postpone(bookworm, 'TableView', function () {
    "use strict";

    var base = bookworm.OrderedCollectionField,
        self = base.extend();

    /**
     * @name bookworm.TableView.create
     * @function
     * @param {bookworm.FieldKey} fieldKey
     * @returns {bookworm.TableView}
     */

    /**
     * Displays a view of a table entity, filtered down by a specified range and
     * sorting index.
     * TODO: Make it read only. (Override setters to throw exception.)
     * TODO: Make sure indexes are delegated to the table only as long as the view is used.
     * @class
     * @extends bookworm.OrderedCollectionField
     */
    bookworm.TableView = self
        .addPrivateMethods(/** @lends bookworm.TableView# */{
            /**
             * @param {jorder.Table} table
             * @param {jorder.Index} index
             * @returns {boolean}
             * @private
             * @memberOf bookworm.TableView
             */
            _isIndexInTable: function (table, index) {
                var rowSignature = index.rowSignature,
                    tableIndex = table && table.indexCollection
                        .getIndexForFields(
                            rowSignature.fieldNames,
                            rowSignature.signatureType,
                            index.sortedKeys.orderType);

                return !!tableIndex;
            },

            /**
             * @private
             */
            _updateIndexOnTable: function () {
                var tableKey = this.tableKey,
                    sortingIndex = this.sortingIndex,
                    sourceTable = tableKey && tableKey.toTable();

                if (sourceTable && sortingIndex && !this._isIndexInTable(sourceTable.jorderTable, sortingIndex)) {
                    // source table and sorting index are specified but index is not present in table
                    // adding sorting index to source table
                    sourceTable.jorderTable.addIndex(sortingIndex);
                }
            }
        })
        .addMethods(/** @lends bookworm.TableView# */{
            /**
             * @param {bookworm.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                base.init.call(this, fieldKey);

                /**
                 * @type {bookworm.TableKey}
                 */
                this.tableKey = undefined;

                /**
                 * View ROI. Zero length by default.
                 * @type {bookworm.Range}
                 */
                this.offsetRange = [0, 0].toRange();

                /**
                 * Name of fields to order by (in order of significance).
                 * @type {jorder.Index}
                 */
                this.sortingIndex = undefined;
            },

            /**
             * @param {bookworm.TableKey} tableKey
             * @returns {bookworm.TableView}
             */
            setTableKey: function (tableKey) {
                dessert.isTableKey(tableKey, "Invalid table key");

                this.tableKey = tableKey;

                this._updateIndexOnTable();

                return this;
            },

            /**
             * @param {bookworm.Range} offsetRange
             * @returns {bookworm.TableView}
             */
            setOffsetRange: function (offsetRange) {
                dessert.isRange(offsetRange, "Invalid offset range");
                this.offsetRange = offsetRange;
                return this;
            },

            /**
             * @param {jorder.Index} sortingIndex
             * @returns {bookworm.TableView}
             */
            setSortingIndex: function (sortingIndex) {
                dessert.isIndex(sortingIndex, "Invalid end offset");

                this.sortingIndex = sortingIndex;

                this._updateIndexOnTable();

                return this;
            },

            /**
             * Updates the collection based on the source table's current content,
             * the current sorting index, and the current offset range. The collection will be
             * populated with key-value pairs as items that are made up of the
             * row signature of the corresponding row as the *key* and the order offset
             * (relative to the first matching row) as the *value*.
             * @returns {bookworm.TableView}
             */
            updateView: function () {
                dessert.assert(
                    this.tableKey &&
                    this.sortingIndex,
                    "Attempting to update an uninitialized TableView");

                var tableKey = this.tableKey,
                    offsetRange = this.offsetRange,
                    sourceTable = tableKey.toTable(),
                    uniqueRowSignature = sourceTable.uniqueIndex.rowSignature,
                    sortingRowSignature = this.sortingIndex.rowSignature,
                    tableNode = sourceTable.getNode();

                if (tableNode && tableNode.length) {
                    // table has content
                    sourceTable.jorderTable
                        // querying rows that match the current ordering & offset
                        .queryByOffsetRangeAsHash(
                            sortingRowSignature.fieldNames,
                            offsetRange.lowerBound,
                            offsetRange.upperBound)

                        // obtaining unique keys for each row
                        // (these are row signatures according to the Table's unique index)
                        .toCollection()
                        .mapKeys(function (rowNode, index) {
                            return parseInt(index, 10) + offsetRange.lowerBound;
                        })
                        .passEachItemTo(uniqueRowSignature.getKeyForRow, uniqueRowSignature)

                        // swapping row IDs with order
                        .toStringDictionary()
                        .reverse()

                        // replacing field contents with new query results
                        .passItemsTo(this.setValue, this);
                } else {
                    // table has no content
                    this.setValue({});
                }

                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'Field', function (ns, className, /**bookworm*/model) {
    "use strict";

    bookworm.Field
        .addSurrogate(model, 'TableView', function (/**bookworm.FieldKey*/fieldKey) {
            return fieldKey.getFieldType() === 'table-view';
        });
}, bookworm);
