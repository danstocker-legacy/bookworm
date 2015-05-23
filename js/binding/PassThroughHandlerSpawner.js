/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'PassThroughHandlerSpawner', function () {
    "use strict";

    var base = bookworm.HandlerSpawner,
        self = base.extend();

    /**
     * @name bookworm.PassThroughHandlerSpawner.create
     * @function
     * @returns {bookworm.PassThroughHandlerSpawner}
     */

    /**
     * @class
     * @extends bookworm.HandlerSpawner
     */
    bookworm.PassThroughHandlerSpawner = self
        .addMethods(/** @lends bookworm.PassThroughHandlerSpawner# */{
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
        .addSurrogate(bookworm, 'PassThroughHandlerSpawner', function (bindingType) {
            return bindingType === 'pass-through';
        });
});
