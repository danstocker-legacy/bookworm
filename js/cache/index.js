/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'index', function () {
    "use strict";

    /**
     * Contains indexes and lookups.
     * @type {sntls.Tree}
     */
    bookworm.index = sntls.Tree.create();
});
