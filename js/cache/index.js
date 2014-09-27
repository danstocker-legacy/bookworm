/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'index', function () {
    "use strict";

    /**
     * Non-evented cache for application-domain indexes.
     * @type {sntls.Tree}
     */
    bookworm.index = sntls.Tree.create();
});
