/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'ReplaceHandlerSpawner', function () {
    "use strict";

    var base = bookworm.HandlerSpawner,
        self = base.extend();

    /**
     * @name bookworm.ReplaceHandlerSpawner.create
     * @function
     * @returns {bookworm.ReplaceHandlerSpawner}
     */

    /**
     * @class
     * @extends bookworm.HandlerSpawner
     */
    bookworm.ReplaceHandlerSpawner = self
        .addMethods(/** @lends bookworm.ReplaceHandlerSpawner# */{
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
        .addSurrogate(bookworm, 'ReplaceHandlerSpawner', function (bindingType) {
            return bindingType === 'replace';
        });
});