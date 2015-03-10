/*global dessert, troop, sntls, evan, flock, jorder, bookworm, app */
troop.postpone(bookworm, 'TableView', function () {
    "use strict";

    var base = bookworm.OrderedCollectionField,
        self = base.extend();

    /**
     * Creates a TableView instance.
     * In most cases, all Field subclasses are instantiated via Field,
     * having provided a suitable field type in bookworm.config.
     * The following example will yield a TableView instance, as long as
     * the fieldType attribute of the field 'baz' in documents 'foo', is 'table-view'.
     * @example
     * 'foo/bar/baz'.toField()
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
        .setInstanceMapper(function (fieldKey) {
            return fieldKey && fieldKey.toString();
        })
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
            },

            /**
             * Silently removes the field node.
             * @private
             */
            _invalidateView: function () {
                sntls.Tree.unsetKey.call(bookworm.entities, this.entityKey.getEntityPath());
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
                 * Identifies the view's source table.
                 * @type {bookworm.TableKey}
                 */
                this.tableKey = undefined;

                /**
                 * View ROI. Zero length by default.
                 * @type {bookworm.Range}
                 */
                this.offsetRange = [0, 0].toRange();

                /**
                 * Jorder index to be used for sorting.
                 * @type {jorder.Index}
                 */
                this.sortingIndex = undefined;
            },

            /**
             * Sets the source table reference. May create / update indexes on the source table.
             * Invalidates the view.
             * @param {bookworm.TableKey} tableKey
             * @returns {bookworm.TableView}
             */
            setTableKey: function (tableKey) {
                dessert.isTableKey(tableKey, "Invalid table key");

                if (!tableKey.equals(this.tableKey)) {
                    this.tableKey = tableKey;
                    this._updateIndexOnTable();
                    this._invalidateView();
                }

                return this;
            },

            /**
             * Sets the range that the view displays. Invalidates the view.
             * @param {bookworm.Range} offsetRange
             * @returns {bookworm.TableView}
             */
            setOffsetRange: function (offsetRange) {
                dessert.isRange(offsetRange, "Invalid offset range");

                if (!offsetRange.equals(this.offsetRange)) {
                    this.offsetRange = offsetRange;
                    this._invalidateView();
                }

                return this;
            },

            /**
             * Sets the sorting index. May create / update index(es) on the current source table.
             * Invalidates the view.
             * @param {jorder.Index} sortingIndex
             * @returns {bookworm.TableView}
             */
            setSortingIndex: function (sortingIndex) {
                dessert.isIndex(sortingIndex, "Invalid end offset");

                if (this.sortingIndex !== sortingIndex) {
                    this.sortingIndex = sortingIndex;
                    this._updateIndexOnTable();
                    this._invalidateView();
                }

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
            },

            /**
             * @ignore
             * @param {flock.AccessEvent} event
             */
            onAccess: function (event) {
                evan.eventPropertyStack.pushOriginalEvent(event);

                if (this.tableKey && this.sortingIndex) {
                    // table view is initialized
                    this.updateView();
                }

                evan.eventPropertyStack.popOriginalEvent();
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

troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    bookworm.entities
        .subscribeTo(flock.AccessEvent.EVENT_CACHE_ACCESS, 'document'.toPath(), function (event) {
            var originalPath = event.originalPath,
                fieldKey = originalPath.clone().trimLeft().toEntityKey(),
                field;

            if (fieldKey.isA(bookworm.FieldKey)) {
                // access attempt happened on field
                field = fieldKey.toField();
                if (field.isA(bookworm.TableView)) {
                    // accessed field is a table view
                    field.onAccess(event);
                }
            }
        });
});
