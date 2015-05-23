/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'EntityBound', function () {
    "use strict";

    /**
     * The EntityBound trait binds instances of the host class to entity events.
     * @class
     * @extends troop.Base
     */
    bookworm.EntityBound = troop.Base.extend()
        .addConstants(/** @lends bookworm.EntityBound */{
            /**
             * @type {object}
             * @constant
             */
            entityBindingTypes: {
                normal   : 'normal',
                replace  : 'replace',
                cascading: 'cascading'
            }
        })
        .addPrivateMethods(/** @lends bookworm.EntityBound# */{
            /**
             * @param {string} methodName
             * @returns {Function}
             * @private
             */
            _spawnNormalEntityHandler: function (methodName) {
                return this[methodName].bind(this);
            }
        })
        .addMethods(/** @lends bookworm.EntityBound# */{
            /** Call from host class .init(). */
            init: function () {
                /** @type {sntls.Tree} */
                this.entityBindings = sntls.Tree.create();
            },

            /**
             * Subscribes method to be triggered on any change event passing through the node.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToEntityChange: function (entityKey, methodName) {
                dessert.isFunction(this[methodName], "Attempting to bind to non-method");

                var entityBindings = this.entityBindings,
                    EVENT_ENTITY_CHANGE = bookworm.Entity.EVENT_ENTITY_CHANGE,
                    bindingPath = [entityKey.toString(), EVENT_ENTITY_CHANGE, methodName, 'normal'].toPath(),
                    handler = entityBindings.getNode(bindingPath);

                if (!handler) {
                    handler = this._spawnNormalEntityHandler(methodName);
                    entityKey.subscribeTo(EVENT_ENTITY_CHANGE, handler);
                    entityBindings.setNode(bindingPath, handler);
                }

                return this;
            },

            /**
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityChange: function (entityKey, methodName) {
                dessert.isFunction(this[methodName], "Attempting to bind to non-method");

                var entityBindings = this.entityBindings,
                    EVENT_ENTITY_CHANGE = bookworm.Entity.EVENT_ENTITY_CHANGE,
                    bindingPath = [entityKey.toString(), EVENT_ENTITY_CHANGE, methodName, 'normal'].toPath(),
                    handler = entityBindings.getNode(bindingPath);

                if (handler) {
                    entityKey.unsubscribeFrom(EVENT_ENTITY_CHANGE, handler);
                    entityBindings.unsetPath(bindingPath, handler);
                }

                return this;
            }
        });
});
