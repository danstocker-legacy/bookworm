/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'ChangeHandlerSpawner', function () {
    "use strict";

    var base = bookworm.HandlerSpawner,
        self = base.extend();

    /**
     * @name bookworm.ChangeHandlerSpawner.create
     * @function
     * @returns {bookworm.ChangeHandlerSpawner}
     */

    /**
     * @class
     * @extends bookworm.HandlerSpawner
     */
    bookworm.ChangeHandlerSpawner = self
        .addMethods(/** @lends bookworm.ChangeHandlerSpawner# */{
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
        .addSurrogate(bookworm, 'ChangeHandlerSpawner', function (bindingType) {
            return bindingType === 'change';
        });
});
