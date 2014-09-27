/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'entities', function () {
    "use strict";

    /**
     * Evented cache for application-domain entities.
     * @type {flock.EventedTree}
     */
    bookworm.entities = flock.EventedTree.create();
});
