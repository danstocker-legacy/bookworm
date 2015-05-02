/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'ItemKey', function () {
    "use strict";

    var base = bookworm.FieldKey,
        self = base.extend();

    /**
     * Creates an ItemKey instance.
     * ItemKey instances may also be created via conversion from string or array.
     * @name bookworm.ItemKey.create
     * @function
     * @param {string} documentType Identifies type of document the current item belongs to.
     * @param {string} documentId Identifies the document (within document type) the current item belongs to.
     * @param {string} fieldName Identifies field (within document) the current item belongs to.
     * @param {string} itemId Identifies item (within field).
     * @returns {bookworm.ItemKey}
     */

    /**
     * The ItemKey class identifies item entity nodes in the cache.
     * `ItemKey` subclasses `FieldKey` so that any method that accepts `FieldKey` as argument, would also accept
     * `ItemKey`. Whatever works with fields, should also work with collection items.
     * @class
     * @extends bookworm.FieldKey
     */
    bookworm.ItemKey = self
        .addMethods(/** @lends bookworm.ItemKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @param {string} itemId
             * @ignore
             */
            init: function (documentType, documentId, fieldName, itemId) {
                base.init.call(this, documentType, documentId, fieldName);

                /**
                 * Identifies item in collection.
                 * @type {string}
                 */
                this.itemId = itemId;

                this.eventPath.appendKey(itemId);
            },

            /**
             * Tells whether specified `ItemKey` instance is equivalent to the current one.
             * @param {bookworm.ItemKey} itemKey
             * @returns {boolean}
             */
            equals: function (itemKey) {
                return bookworm.FieldKey.equals.call(this, itemKey) &&
                       this.itemId === itemKey.itemId;
            },

            /**
             * Creates a field key that is parent of the item identified by the current key.
             * @returns {bookworm.FieldKey}
             */
            getFieldKey: function () {
                var documentKey = this.documentKey;
                return [documentKey.documentType, documentKey.documentId, this.fieldName].toFieldKey();
            },

            /**
             * Determines absolute path for the item identified by the current key.
             * In case the item entity node sits on a different path
             * relative to the field node for a certain `documentType` / `fieldName` combination,
             * subclass `ItemKey` and override `.getEntityPath()` to reflect the correct path.
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                return base.getEntityPath.call(this)
                    .appendKey(String(this.itemId));
            },

            /**
             * Retrieves item type string for the item entity identified by the current key.
             * @returns {string}
             */
            getItemType: function () {
                return bookworm.config.getNode(this.getConfigPath().appendKey('itemType'));
            },

            /**
             * Serializes current item key.
             * @example
             * bookworm.ItemKey.create('user', '1234', 'phones', 'work').toString() // "user/1234/phones/work"
             * @returns {string}
             */
            toString: function () {
                return bookworm.FieldKey.toString.call(this) + '/' + encodeURIComponent(this.itemId);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {bookworm.ItemKey} expr */
        isItemKey: function (expr) {
            return bookworm.ItemKey.isBaseOf(expr);
        },

        /** @param {bookworm.ItemKey} [expr] */
        isItemKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.ItemKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `ItemKey`. Assumes the string to be serialized `ItemKey`.
             * @returns {bookworm.ItemKey}
             */
            toItemKey: function () {
                var parts = this.split('/');

                return bookworm.ItemKey.create(
                    decodeURIComponent(parts[0]),
                    decodeURIComponent(parts[1]),
                    decodeURIComponent(parts[2]),
                    decodeURIComponent(parts[3])
                );
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` (of strings) to `ItemKey`. Assumes the array is an item key in array notation.
             * @returns {bookworm.ItemKey}
             */
            toItemKey: function () {
                return bookworm.ItemKey.create(this[0], this[1], this[2], this[3]);
            }
        },
        false, false, false
    );
}());
