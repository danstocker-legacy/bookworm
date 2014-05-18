/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'Field', function () {
    "use strict";

    var base = dache.Entity,
        self = base.extend();

    /**
     * @name dache.Field.create
     * @function
     * @param {dache.FieldKey} fieldKey
     * @returns {dache.Field}
     */

    /**
     * @class
     * @extends dache.Entity
     */
    dache.Field = self
        .addMethods(/** @lends dache.Field# */{
            /**
             * @param {dache.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                dessert.isFieldKey(fieldKey, "Invalid field key");

                base.init.call(this, fieldKey);

                /**
                 * Field key associated with current entity.
                 * Same as entityKey.
                 * @type {dache.FieldKey}
                 */
                this.fieldKey = fieldKey;
            },

            /**
             * Fetches field metadata node from cache.
             * @param {string} metaName
             * @returns {*}
             */
            getFieldMeta: function (metaName) {
                return this.fieldKey.hasFieldMeta() ?
                    this.getNode(metaName) :
                    undefined;
            },

            /**
             * Fetches field value node from cache.
             * @returns {*}
             */
            getFieldValue: function () {
                return this.fieldKey.hasFieldMeta() ?
                    this.getNode('value') :
                    this.getNode();
            },

            /**
             * Replaces field value node with the specified value.
             * @param {*} value
             * @returns {dache.Field}
             */
            setFieldValue: function (value) {
                if (this.fieldKey.hasFieldMeta()) {
                    this.setNode(value, 'value');
                } else {
                    this.setNode(value);
                }

                return this;
            }
        });
});

troop.amendPostponed(dache, 'FieldKey', function (/**dache*/model) {
    "use strict";

    dache.FieldKey
        .addMethods(/** @lends dache.FieldKey */{
            /**
             * Creates Field instance based on the current field key.
             * @returns {dache.Field}
             */
            toField: function () {
                return model.Field.create(this);
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
             * @returns {dache.Field}
             */
            toField: function () {
                return dache.Field.create(this.toFieldKey());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates Field instance based on the current Array of string as key.
             * @returns {dache.Field}
             */
            toField: function () {
                return dache.Field.create(this.toFieldKey());
            }
        },
        false, false, false
    );
}());
