/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Field', function () {
    "use strict";

    var base = bookworm.Entity,
        self = base.extend();

    /**
     * @name bookworm.Field.create
     * @function
     * @param {bookworm.FieldKey} fieldKey
     * @returns {bookworm.Field}
     */

    /**
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
                 * Same as entityKey.
                 * @type {bookworm.FieldKey}
                 */
                this.fieldKey = fieldKey;
            },

            /**
             * Fetches field metadata node from cache.
             * @param {string} metaName
             * @returns {*}
             */
            getFieldMeta: function (metaName) {
                return this.getNode(metaName);
            },

            /**
             * Fetches field value node from cache.
             * @returns {*}
             */
            getFieldValue: function () {
                return this.getNode();
            },

            /**
             * Replaces field value node with the specified value.
             * @param {*} value
             * @returns {bookworm.Field}
             */
            setFieldValue: function (value) {
                this.setNode(value);
                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'FieldKey', function () {
    "use strict";

    bookworm.FieldKey
        .addMethods(/** @lends bookworm.FieldKey */{
            /**
             * Creates Field instance based on the current field key.
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
             * Creates Field instance based on the current string as key.
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
             * Creates Field instance based on the current Array of string as key.
             * @returns {bookworm.Field}
             */
            toField: function () {
                return bookworm.Field.create(this.toFieldKey());
            }
        },
        false, false, false
    );
}());
