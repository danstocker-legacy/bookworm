/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'StrictHandlerSpawner', function () {
    "use strict";

    var base = bookworm.HandlerSpawner,
        self = base.extend();

    /**
     * @name bookworm.StrictHandlerSpawner.create
     * @function
     * @returns {bookworm.StrictHandlerSpawner}
     */

    /**
     * @class
     * @extends bookworm.HandlerSpawner
     */
    bookworm.StrictHandlerSpawner = self
        .addMethods(/** @lends bookworm.StrictHandlerSpawner# */{
            /**
             * @param {bookworm.EntityBound} instance
             * @param {string} methodName
             * @param {bookworm.FieldKey} entityKey
             * @returns {Function}
             */
            spawnHandler: function (instance, methodName, entityKey) {
                return function (event) {
                    if (event.sender.equals(entityKey)) {
                        instance[methodName](event);
                    }
                };
            }
        });
});

troop.amendPostponed(bookworm, 'HandlerSpawner', function () {
    "use strict";

    bookworm.HandlerSpawner
        .addSurrogate(bookworm, 'StrictHandlerSpawner', function (bindingType) {
            return bindingType === 'strict';
        });
});