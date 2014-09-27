/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Field', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend();

    /**
     * Creates a Field instance.
     * @name bookworm.Field.create
     * @function
     * @param {bookworm.FieldKey} fieldKey
     * @returns {bookworm.Field}
     */

    /**
     * The Field entity class implements an API for document field nodes in the cache. Allows access and modification
     * of the field's value and attributes.
     * @class
     * @extends bookworm.Entity
     */
    bookworm.Field = self
        .addMethods(/** @lends bookworm.Field# */{
            /**
             * @param {bookworm.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                dessert.isFieldKey(fieldKey, "Invalid field key");

                base.init.call(this, fieldKey);

                /**
                 * Field key associated with current entity.
                 * @name bookworm.Field#entityKey
                 * @type {bookworm.FieldKey}
                 */
            },

            /**
             * Fetches field attribute node from cache.
             * @param {string} attribute
             * @returns {*}
             */
            getAttribute: function (attribute) {
                var attributePath = this.entityKey.getAttributePath(attribute);
                return bookworm.documents.getNode(attributePath);
            },

            /**
             * Sets field attribute node in cache.
             * @param {string} attribute
             * @param {*} attributeNode
             * @returns {*}
             */
            setAttribute: function (attribute, attributeNode) {
                var attributePath = this.entityKey.getAttributePath(attribute);
                bookworm.documents.setNode(attributePath, attributeNode);
                return this;
            },

            /**
             * Fetches field value node from cache.
             * @returns {*}
             */
            getValue: function () {
                return bookworm.documents.getNode(this.entityKey.getValuePath());
            },

            /**
             * Sets field value node to the specified value.
             * @param {*} value
             * @returns {bookworm.Field}
             */
            setValue: function (value) {
                bookworm.documents.setNode(this.entityKey.getValuePath(), value);
                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'FieldKey', function () {
    "use strict";

    bookworm.FieldKey
        .addMethods(/** @lends bookworm.FieldKey */{
            /**
             * Converts `FieldKey` to `Field`.
             * @returns {bookworm.Field}
             */
            toField: function () {
                return bookworm.Field.create(this);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `Field` instance, assuming the string is a serialized `FieldKey`.
             * @returns {bookworm.Field}
             */
            toField: function () {
                return bookworm.Field.create(this.toFieldKey());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` to `Field` instance, assuming the array is a field key in array notation.
             * @returns {bookworm.Field}
             */
            toField: function () {
                return bookworm.Field.create(this.toFieldKey());
            }
        },
        false, false, false
    );
}());
