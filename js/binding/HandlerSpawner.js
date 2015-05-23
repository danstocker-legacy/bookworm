/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'HandlerSpawner', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name bookworm.HandlerSpawner.create
     * @function
     * @param {string} bindingType
     * @returns {bookworm.HandlerSpawner}
     */

    /**
     * @class
     * @extends troop.Base
     */
    bookworm.HandlerSpawner = self
        .addMethods(/** @lends bookworm.HandlerSpawner# */{
            /**
             * @param {string} bindingType
             * @ignore
             */
            init: function (bindingType) {
                /** @type {string} */
                this.bindingType = bindingType;
            }
        });

    /**
     * @name bookworm.HandlerSpawner#spawnHandler
     * @function
     * @param {bookworm.EntityBound} instance
     * @param {string} methodName
     * @returns {Function}
     */
});
