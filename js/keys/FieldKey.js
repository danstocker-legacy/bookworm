/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'FieldKey', function () {
    "use strict";

    var base = dache.EntityKey,
        self = base.extend();

    /**
     * @name dache.FieldKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @param {string} fieldName
     * @returns {dache.FieldKey}
     */

    /**
     * Represents a key to a document node.
     * @class
     * @extends dache.EntityKey
     */
    dache.FieldKey = self
        .addMethods(/** @lends dache.FieldKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @ignore
             */
            init: function (documentType, documentId, fieldName) {
                /**
                 * Document key reference.
                 * @type {dache.DocumentKey}
                 */
                this.documentKey = dache.DocumentKey.create(documentType, documentId);

                /**
                 * Name of current field.
                 * @type {string}
                 */
                this.fieldName = fieldName;
            },

            /**
             * @param {dache.FieldKey} fieldKey
             */
            equals: function (fieldKey) {
                return this.documentKey.equals(fieldKey.documentKey) &&
                       this.fieldName === fieldKey.fieldName;
            },

            /**
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                var documentKey = this.documentKey,
                    result = documentKey.getEntityPath();

                if (documentKey.hasDocumentMeta()) {
                    result.appendKey('fields');
                }

                result.appendKey(this.fieldName);

                return result;
            },

            /**
             * @returns {sntls.Path}
             */
            getMetaPath: function () {
                var metaFieldKey = ['document', this.documentKey.documentType, this.fieldName].toFieldKey();
                return metaFieldKey.getEntityPath();
            },

            /**
             * Tells whether Field entity identified by the current key has metadata associated with it.
             * @returns {boolean}
             */
            hasFieldMeta: function () {
                return dache.metadata.getNode(this.getMetaPath().appendKey('hasFieldMeta'));
            },

            /**
             * Retrieves field type string for the Field entity identified by the current key.
             * @returns {string}
             */
            getFieldType: function () {
                var metadata = dache.metadata,
                    typeMetaPath = this.getMetaPath();

                return metadata.getNode(typeMetaPath.clone().appendKey('fieldType')) ||
                       metadata.getNode(typeMetaPath);
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return this.documentKey.toString() + '/' + encodeURIComponent(this.fieldName);
            }
        });
});

troop.amendPostponed(dache, 'EntityKey', function () {
    "use strict";

    dache.EntityKey
        .addSurrogate(dache, 'FieldKey', function () {
            return arguments.length === 3;
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path
        .addMethods(/** @lends sntls.Path */{
            /**
             * Converts cache Path to FieldKey instance.
             * @returns {dache.FieldKey}
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
            return dache.FieldKey.isBaseOf(expr);
        },

        /** Tells whether expression is a FieldKey (and not one of its subclasses) */
        isFieldKeyStrict: function (expr) {
            return dache.FieldKey.isBaseOf(expr) &&
                   expr.getBase() === dache.FieldKey;
        },

        /** Tells whether expression is optionally a FieldKey */
        isFieldKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   dache.FieldKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to a FieldKey
             * @returns {dache.FieldKey}
             */
            toFieldKey: function () {
                var parts = this.split('/');

                return dache.FieldKey.create(
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
             * @returns {dache.FieldKey}
             */
            toFieldKey: function () {
                return dache.FieldKey.create(this[0], this[1], this[2]);
            }
        },
        false, false, false
    );
}());
