/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'FieldKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * @name bookworm.FieldKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @param {string} fieldName
     * @returns {bookworm.FieldKey}
     */

    /**
     * Represents a key to a document node.
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.FieldKey = self
        .addPrivateMethods(/** @lends bookworm.FieldKey# */{
            /**
             * Retrieves FieldKey pointing to the config node associated with the current
             * documentType / fieldName combination.
             * @returns {bookworm.FieldKey}
             * @private
             */
            _getConfigFieldKey: function () {
                return ['document', this.documentKey.documentType, this.fieldName].toFieldKey();
            }
        })
        .addMethods(/** @lends bookworm.FieldKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @ignore
             */
            init: function (documentType, documentId, fieldName) {
                /**
                 * Document key reference.
                 * @type {bookworm.DocumentKey}
                 */
                this.documentKey = bookworm.DocumentKey.create(documentType, documentId);

                /**
                 * Name of current field.
                 * @type {string}
                 */
                this.fieldName = fieldName;
            },

            /**
             * @param {bookworm.FieldKey} fieldKey
             */
            equals: function (fieldKey) {
                return this.documentKey.equals(fieldKey.documentKey) &&
                       this.fieldName === fieldKey.fieldName;
            },

            /**
             * Creates an ItemKey instance based on the current field key and the specified item ID.
             * @param {string} itemId
             * @returns {bookworm.ItemKey}
             */
            getItemKey: function (itemId) {
                var documentKey = this.documentKey;

                return bookworm.ItemKey.create(
                    documentKey.documentType,
                    documentKey.documentId,
                    this.fieldName,
                    itemId
                );
            },

            /**
             * Determines absolute path to the current Field's entity node.
             * In case field node sits on a different path relative to the Document node
             * for a certain documentType / fieldName combination,
             * subclass FieldKey and override .getEntityPath() to reflect the correct path.
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                return this.documentKey
                    .getEntityPath()
                    .appendKey(this.fieldName);
            },

            /**
             * Determines absolute path to the specified attribute of the current Field.
             * In case attribute node sits on a different path relative the Field node
             * for a certain documentType / fieldName combination,
             * subclass FieldKey and override .getAttributePath() to reflect the correct path.
             * @param {string} attribute
             * @returns {sntls.Path}
             */
            getAttributePath: function (attribute) {
                return this.getEntityPath()
                    .appendKey(attribute);
            },

            /**
             * Retrieves the value of a specific attribute (fieldType) on the config document matching
             * the current documentType / fieldName. When no such field attribute is found,
             * returns the config field value itself.
             * @returns {string}
             */
            getFieldType: function () {
                var config = bookworm.config,
                    configFieldKey = this._getConfigFieldKey();

                return config.getNode(configFieldKey.getAttributePath('fieldType')) ||
                       config.getNode(configFieldKey.getEntityPath());
            },

            /**
             * Determines absolute path to the current Field entity's value node.
             * In case field value node sits on a different path relative the Field node
             * for a certain documentType / fieldName combination,
             * subclass FieldKey and override .getValuePath() to reflect the correct path.
             * By default, the value path is same as the entity path.
             * @returns {sntls.Path}
             */
            getValuePath: function () {
                return this.getEntityPath();
            },

            /**
             * @returns {sntls.Path}
             */
            getConfigPath: function () {
                return this._getConfigFieldKey()
                    .getEntityPath();
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return this.documentKey.toString() + '/' + encodeURIComponent(this.fieldName);
            }
        });
});

troop.amendPostponed(bookworm, 'EntityKey', function () {
    "use strict";

    bookworm.EntityKey
        .addSurrogate(bookworm, 'FieldKey', function () {
            return arguments.length === 3;
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path
        .addMethods(/** @lends sntls.Path */{
            /**
             * Converts cache Path to FieldKey instance.
             * @returns {bookworm.FieldKey}
             */
            toFieldKey: function () {
                return this.asArray.toFieldKey();
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** Tells whether expression is a FieldKey */
        isFieldKey: function (expr) {
            return bookworm.FieldKey.isBaseOf(expr);
        },

        /** Tells whether expression is a FieldKey (and not one of its subclasses) */
        isFieldKeyStrict: function (expr) {
            return bookworm.FieldKey.isBaseOf(expr) &&
                   expr.getBase() === bookworm.FieldKey;
        },

        /** Tells whether expression is optionally a FieldKey */
        isFieldKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.FieldKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to a FieldKey
             * @returns {bookworm.FieldKey}
             */
            toFieldKey: function () {
                var parts = this.split('/');

                return bookworm.FieldKey.create(
                    decodeURIComponent(parts[0]),
                    decodeURIComponent(parts[1]),
                    decodeURIComponent(parts[2])
                );
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts Array of strings to a FieldKey instance.
             * @returns {bookworm.FieldKey}
             */
            toFieldKey: function () {
                return bookworm.FieldKey.create(this[0], this[1], this[2]);
            }
        },
        false, false, false
    );
}());
