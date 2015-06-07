/*global dessert, troop, sntls, bookworm, rubberband */
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
     * @extends rubberband.Stringifiable
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
             * Fetches fields entity from the document the current field belongs to.
             * @returns {bookworm.Entity}
             */
            getParentEntity: function () {
                return this.entityKey.documentKey.toDocument()
                    .getFieldsEntity();
            },

            /**
             * Fetches entity associated with the field's value.
             * Returns self by default.
             * @returns {bookworm.Entity}
             */
            getValueEntity: function () {
                return this;
            },

            /**
             * Fetches field value node from cache.
             * Identical to the node by default.
             * @returns {*}
             */
            getValue: function () {
                return this.getValueEntity().getNode();
            },

            /**
             * Fetches field value node from cache without triggering access events.
             * @returns {*}
             */
            getSilentValue: function () {
                return this.getValueEntity().getSilentNode();
            },

            /**
             * Sets field value node to the specified value.
             * @param {*} value
             * @returns {bookworm.Field}
             */
            setValue: function (value) {
                this.getValueEntity().setNode(value);
                return this;
            },

            /**
             * Returns the stringified value of the field.
             * @returns {string}
             */
            toString: function () {
                return rubberband.Stringifier.stringify(this.getValue());
            }
        });
});

troop.amendPostponed(bookworm, 'Entity', function () {
    "use strict";

    bookworm.Entity
        .addSurrogate(bookworm, 'Field', function (entityKey) {
            return entityKey.instanceOf(bookworm.FieldKey);
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
