/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'Document', function () {
    "use strict";

    var base = dache.Entity,
        self = base.extend();

    /**
     * @name dache.Document.create
     * @function
     * @param {dache.DocumentKey} documentKey
     * @returns {dache.Document}
     */

    /**
     * @class
     * @extends dache.Entity
     */
    dache.Document = self
        .addMethods(/** @lends dache.Document# */{
            /**
             * @param {dache.DocumentKey} documentKey
             * @ignore
             */
            init: function (documentKey) {
                dessert.isDocumentKey(documentKey, "Invalid document key");

                base.init.call(this, documentKey);

                /**
                 * Document key associated with current entity.
                 * Same as entityKey.
                 * @type {dache.DocumentKey}
                 */
                this.documentKey = documentKey;
            }
        });
});

troop.amendPostponed(dache, 'DocumentKey', function () {
    "use strict";

    dache.DocumentKey
        .addMethods(/** @lends dache.DocumentKey */{
            /**
             * Creates Document instance based on the current document key.
             * @returns {dache.Document}
             */
            toDocument: function () {
                return dache.Document.create(this);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Creates Document instance based on the current string as key.
             * @returns {dache.Document}
             */
            toDocument: function () {
                return dache.Document.create(this.toDocumentKey());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates Document instance based on the current Array of strings as key.
             * @returns {dache.Document}
             */
            toDocument: function () {
                return dache.Document.create(this.toDocumentKey());
            }
        },
        false, false, false
    );
}());
