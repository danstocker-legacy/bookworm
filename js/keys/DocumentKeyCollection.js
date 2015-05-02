/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'DocumentKeyCollection', function () {
    "use strict";

    /**
     * Creates a DocumentKeyCollection instance.
     * @name bookworm.DocumentKeyCollection.create
     * @function
     * @param {object} [items]
     * @returns {bookworm.DocumentKeyCollection}
     */

    /**
     * The DocumentKeyCollection offers a simplified way of dealing with multiple document keys.
     * TODO: Add tests.
     * @example
     * // retrieves a collection of `Document` instances based on the specified document keys
     * ['user/1234', 'user/4321'].toDocumentKeyCollection().toDocument();
     * @class
     * @extends {sntls.Collection}
     * @extends {bookworm.DocumentKey}
     */
    bookworm.DocumentKeyCollection = sntls.Collection.of(bookworm.DocumentKey);
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash */{
            /**
             * Converts `Hash` instance to `DocumentKeyCollection` instance.
             * @returns {bookworm.DocumentKeyCollection}
             */
            toDocumentKeyCollection: function () {
                return bookworm.DocumentKeyCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts `Array` (of `DocumentKey` instances) to a `DocumentKeyCollection` instance.
             * @returns {bookworm.DocumentKeyCollection}
             * @example
             * ['foo/bar', 'foo/baz'].toDocumentKeyCollection() // collection of document keys
             */
            toDocumentKeyCollection: function () {
                return this
                    .toCollection()
                    .callOnEachItem('toDocumentKey')
                    .toDocumentKeyCollection();
            }
        },
        false, false, false);
}());
