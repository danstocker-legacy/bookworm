/*global dessert, troop, sntls, evan, bookworm */
troop.postpone(bookworm, 'entityEventSpace', function () {
    "use strict";

    /**
     * Event space dedicated to entity events.
     * @type {evan.EventSpace}
     */
    bookworm.entityEventSpace = evan.EventSpace.create();
});
