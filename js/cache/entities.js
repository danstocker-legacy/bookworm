/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'entities', function () {
    "use strict";

    /**
     * Contains entities.
     * @type {sntls.Tree}
     */
    bookworm.entities = sntls.Tree.create();
});
