/*global dessert, troop, sntls, evan, shoeshine, bookworm */
troop.postpone(bookworm, 'FieldTypeLookup', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name bookworm.FieldTypeLookup.create
     * @function
     * @returns {bookworm.FieldTypeLookup}
     */

    /**
     * @class
     * @extends troop.Base
     */
    bookworm.FieldTypeLookup = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addConstants(/** @lends bookworm.FieldTypeLookup */{
            /**
             * @type {sntls.Path}
             * @constant
             */
            BY_FIELD_TYPE_ROOT: ['field', 'by-field-type'].toPath()
        })
        .addPrivateMethods(/** @lends bookworm.FieldTypeLookup# */{
            /**
             * @returns {sntls.Collection}
             * @private
             */
            _queryFieldTypes: function () {
                return bookworm.config.queryPathValuePairsAsHash('document>document>\\'.toQuery())
                    .toCollection();
            }
        })
        .addMethods(/** @lends bookworm.FieldTypeLookup# */{
            /** @ignore */
            init: function () {
                var that = this;

                this._queryFieldTypes()
                    .forEachItem(function (fieldType, configPathStr) {
                        var configPath = configPathStr.toPath(),
                            asArray = configPath.asArray,
                            documentType = asArray[2],
                            fieldName = asArray[3],
                            attribute = asArray[4],
                            indexPath = [fieldType, attribute, documentType, fieldName].toPath()
                                .prepend(that.BY_FIELD_TYPE_ROOT);

                        bookworm.index.setNode(indexPath, true);
                    });
            },

            /**
             * Retrieves an array of field names for the specified document type matching the specified field type.
             * @param {string} fieldType
             * @param {string} documentType
             * @returns {string[]}
             */
            getFieldNamesForFieldType: function (fieldType, documentType) {
                var indexPath = [fieldType, 'fieldType', documentType].toPath().prepend(this.BY_FIELD_TYPE_ROOT);
                return bookworm.index.getNodeAsHash(indexPath)
                    .getKeys();
            },

            /**
             * Retrieves an array of field names for the specified document type matching the specified item type.
             * @param {string} itemType
             * @param {string} documentType
             * @returns {string[]}
             */
            getFieldNamesForItemType: function (itemType, documentType) {
                var indexPath = [itemType, 'itemType', documentType].toPath().prepend(this.BY_FIELD_TYPE_ROOT);
                return bookworm.index.getNodeAsHash(indexPath)
                    .getKeys();
            },

            /**
             * Retrieves an array of field names for the specified document type matching the specified item ID type.
             * @param {string} itemIdType
             * @param {string} documentType
             * @returns {string[]}
             */
            getFieldNamesForItemIdType: function (itemIdType, documentType) {
                var indexPath = [itemIdType, 'itemIdType', documentType].toPath().prepend(this.BY_FIELD_TYPE_ROOT);
                return bookworm.index.getNodeAsHash(indexPath)
                    .getKeys();
            }
        });
});
