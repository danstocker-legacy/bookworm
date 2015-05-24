/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'ContentHandlerSpawner', function () {
    "use strict";

    var base = bookworm.HandlerSpawner,
        self = base.extend();

    /**
     * @name bookworm.ContentHandlerSpawner.create
     * @function
     * @returns {bookworm.ContentHandlerSpawner}
     */

    /**
     * @class
     * @extends bookworm.HandlerSpawner
     */
    bookworm.ContentHandlerSpawner = self
        .addMethods(/** @lends bookworm.ContentHandlerSpawner# */{
            /**
             * @param {bookworm.EntityBound} instance
             * @param {string} methodName
             * @returns {Function}
             */
            spawnHandler: function (instance, methodName) {
                return instance[methodName].bind(instance);
            }
        });
});

troop.amendPostponed(bookworm, 'HandlerSpawner', function () {
    "use strict";

    bookworm.HandlerSpawner
        .addSurrogate(bookworm, 'ContentHandlerSpawner', function (bindingType) {
            return bindingType === 'content';
        });
});
