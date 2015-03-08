/*global dessert, troop, sntls, flock, jorder, bookworm */
troop.postpone(bookworm, 'Table', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend()
            .addTrait(bookworm.EntityBound);

    /**
     * @name bookworm.Table.create
     * @function
     * @param {bookworm.TableKey} tableKey
     * @returns {bookworm.Table}
     */

    /**
     * Represents an indexed table in the cache.
     * Tables may optionally have a source collection field, from which they get their data.
     * To specify a unique index other than the default, override .spawnUniqueIndex(),
     * and define surrogate between Table and your class.
     * @class
     * @extends bookworm.Entity
     * @extends bookworm.EntityBound
     */
    bookworm.Table = self
        .setInstanceMapper(function (tableName) {
            return tableName;
        })
        .addPrivateMethods(/** @lends bookworm.Table */{
            /**
             * Just fetches the collection values.
             * @param {bookworm.FieldKey} fieldKey
             * @returns {object[]}
             * @private
             */
            _getTableNodeForPlainCollection: function (fieldKey) {
                return fieldKey.toField()
                    .getItemsAsCollection()
                    .getValues();
            },

            /**
             * Resolves document references stored in item values.
             * @param {bookworm.FieldKey} fieldKey
             * @returns {object[]}
             * @private
             */
            _getTableNodeForValueReferences: function (fieldKey) {
                return fieldKey.toField()
                    .getItemsAsCollection()
                    .getValuesAsHash()
                    .toCollection()
                    .callOnEachItem('toDocument')
                    .callOnEachItem('getNode')
                    .items;
            },

            /**
             * Resolves document references stored in item values.
             * @param {bookworm.FieldKey} fieldKey
             * @returns {object[]}
             * @private
             */
            _getTableNodeForKeyReferences: function (fieldKey) {
                return fieldKey.toField()
                    .getItemsAsCollection()
                    .getKeysAsHash()
                    .toCollection()
                    .callOnEachItem('toDocument')
                    .callOnEachItem('getNode')
                    .items;
            },

            /**
             * @param {bookworm.FieldKey} fieldKey
             * @returns {Object[]}
             * @private
             */
            _getTableNode: function (fieldKey) {
                var itemKey = fieldKey.getItemKey('');
                if (itemKey.getItemType() === 'reference') {
                    // reference is stored in item value
                    return this._getTableNodeForValueReferences(fieldKey);
                } else if (itemKey.getItemIdType() === 'reference') {
                    // reference is stored in item key
                    return this._getTableNodeForKeyReferences(fieldKey);
                } else {
                    // item contains no reference
                    return this._getTableNodeForPlainCollection(fieldKey);
                }
            }
        })
        .addMethods(/** @lends bookworm.Table# */{
            /**
             * @param {bookworm.TableKey} tableKey
             * @ignore
             */
            init: function (tableKey) {
                dessert.isTableKey(tableKey, "Invalid table key");
                base.init.call(this, tableKey);
                bookworm.EntityBound.init.call(this);

                /**
                 * Index that uniquely identifies a row.
                 * @type {jorder.Index}
                 */
                this.uniqueIndex = this.spawnUniqueIndex();

                /**
                 * Identifies field where the table gets its data from.
                 * @type {bookworm.FieldKey}
                 */
                this.sourceFieldKey = undefined;

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
             * @returns {bookworm.Table}
             */
            clearInstanceRegistry: function () {
                var instanceId = 'singleton',
                    singleton = this.instanceRegistry[instanceId];

                if (singleton) {
                    singleton.clearSourceFieldKey();
                }

                base.clearInstanceRegistry.call(this);

                return this;
            },

            /**
             * Sets table contents to the specified node.
             * Updates indexes, triggers appropriate events.
             * @param {object[]} tableNode
             * @returns {bookworm.Table}
             */
            setNode: function (tableNode) {
                dessert.isArray(tableNode, "Invalid table node");

                var beforeNode = this.getSilentNode(),
                    entities = bookworm.entities,
                    entityPath = this.entityKey.getEntityPath(),
                    jorderTable = this.jorderTable;

                entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE)
                    .setBefore(beforeNode)
                    .setAfter(tableNode)
                    .triggerSync(entityPath);

                jorderTable
                    .clear()
                    .insertRows(tableNode);

                sntls.Tree.setNode.call(entities, entityPath, jorderTable.items);

                entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
                    .setBefore(beforeNode)
                    .setAfter(tableNode)
                    .triggerSync(entityPath);

                return this;
            },

            /**
             * Clears table contents. Updates indexes, triggers appropriate events.
             * @returns {bookworm.Table}
             */
            unsetKey: function () {
                this.jorderTable.clear();
                base.unsetKey.call(this);
                return this;
            },

            /**
             * Sets reference to source collection.
             * @param {bookworm.FieldKey} sourceFieldKey
             * @returns {bookworm.Table}
             */
            setSourceFieldKey: function (sourceFieldKey) {
                dessert.isFieldKey(sourceFieldKey, "Innvalid field key");

                var sourceFieldKeyBefore = this.sourceFieldKey,
                    collectionField = sourceFieldKey.toField();

                dessert.assert(collectionField.isA(bookworm.CollectionField),
                    "Not a collection field");

                if (!sourceFieldKey.equals(sourceFieldKeyBefore)) {
                    // setting contents
                    this.setNode(this._getTableNode(sourceFieldKey));

                    // re-binding to new field
                    if (sourceFieldKeyBefore) {
                        this.unbindFromEntityChange(sourceFieldKeyBefore);
                    }
                    this.bindToEntityChange(sourceFieldKey, 'onSourceFieldChange');

                    this.sourceFieldKey = sourceFieldKey;
                }

                return this;
            },

            /**
             * Clears reference to source collection, unbinds events.
             * @returns {bookworm.Table}
             */
            clearSourceFieldKey: function () {
                this.unsetKey();
                this.unbindFromEntityChange(this.sourceFieldKey);
                this.sourceFieldKey = undefined;
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
                    tableNode = jorderTable.items,
                    entities = bookworm.entities,
                    entityPath = this.entityKey.getEntityPath();

                entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE)
                    .setBefore(tableNode)
                    .setAfter(tableNode)
                    .triggerSync(entityPath);

                rowsAfter.toCollection()
                    .mapKeys(rowSignature.getKeyForRow, rowSignature)
                    .forEachItem(function (rowNode, rowSignature) {
                        // adding / changing each row silently
                        var row = that.getRow(rowSignature);
                        jorderTable.setItem(row.entityKey.getRowId(), rowNode);
                    });

                entities.spawnEvent(flock.ChangeEvent.EVENT_CACHE_CHANGE)
                    .setBefore(tableNode)
                    .setAfter(tableNode)
                    .triggerSync(entityPath);

                return this;
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onSourceFieldChange: function (event) {
                console.log("source collection changed", event.originalPath.toString());
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
