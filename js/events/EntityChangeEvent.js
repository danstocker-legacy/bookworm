/*global dessert, troop, sntls, evan, bookworm */
troop.postpone(bookworm, 'EntityChangeEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * Instantiates class.
     * @name bookworm.EntityChangeEvent.create
     * @param {string} eventName Event name
     * @param {evan.EventSpace} eventSpace Event space associated with event
     * @function
     * @returns {bookworm.EntityChangeEvent}
     */

    /**
     * @class
     * @extends evan.Event
     */
    bookworm.EntityChangeEvent = self
        .addMethods(/** @lends bookworm.EntityChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {evan.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Node value before change.
                 * @type {*}
                 */
                this.beforeNode = undefined;

                /**
                 * Node value after change.
                 * @type {*}
                 */
                this.afterNode = undefined;
            },

            /**
             * Clones entity change event.
             * @param {sntls.Path} [currentPath]
             * @returns {evan.Event}
             */
            clone: function (currentPath) {
                return base.clone.call(this, currentPath)
                    .setBeforeNode(this.beforeNode)
                    .setAfterNode(this.afterNode);
            },

            /**
             * Sets event load before the change.
             * @param {*} value
             * @returns {bookworm.EntityChangeEvent}
             */
            setBeforeNode: function (value) {
                this.beforeNode = value;
                return this;
            },

            /**
             * Sets event load after the change.
             * @param {*} value
             * @returns {bookworm.EntityChangeEvent}
             */
            setAfterNode: function (value) {
                this.afterNode = value;
                return this;
            },

            /**
             * Tells whether change event represents an insert.
             * @returns {boolean}
             */
            isInsert: function () {
                return typeof this.beforeNode === 'undefined' &&
                       typeof this.afterNode !== 'undefined';
            },

            /**
             * Tells whether change event represents a deletion.
             * @returns {boolean}
             */
            isDelete: function () {
                return typeof this.beforeNode !== 'undefined' &&
                       typeof this.afterNode === 'undefined';
            }
        });
});

troop.amendPostponed(evan, 'Event', function () {
    "use strict";

    evan.Event.addSurrogate(bookworm, 'EntityChangeEvent', function (eventName) {
        var prefix = 'bookworm.entity.change';
        return eventName.substr(0, prefix.length) === prefix;
    });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /**
         * @param {bookworm.EntityChangeEvent} expr
         */
        isEntityChangeEvent: function (expr) {
            return bookworm.EntityChangeEvent.isBaseOf(expr);
        },

        /**
         * @param {bookworm.EntityChangeEvent} expr
         */
        isEntityChangeEventOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.EntityChangeEvent.isBaseOf(expr);
        }
    });
}());
