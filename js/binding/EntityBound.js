/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'EntityBound', function () {
    "use strict";

    /**
     * The EntityBound trait binds instances of the host class to entity events.
     * @class
     * @extends troop.Base
     */
    bookworm.EntityBound = troop.Base.extend()
        .addPrivateMethods(/** @lends bookworm.EntityBound# */{
            /**
             * @param {bookworm.EntityKey} targetKey
             * @param {bookworm.EntityKey} captureKey
             * @param {string} eventName
             * @param {string} methodName
             * @param {string} bindingType
             * @private
             */
            _bindToEntity: function (targetKey, captureKey, eventName, methodName, bindingType) {
                var entityBindings = this.entityBindings,
                    bindingPath = [targetKey.toString(), eventName, methodName, bindingType].toPath(),
                    bindingInfo = entityBindings.getNode(bindingPath),
                    handler;

                if (!bindingInfo) {
                    handler = bookworm.HandlerSpawner.create(bindingType)
                        .spawnHandler(this, methodName, targetKey);
                    captureKey.subscribeTo(eventName, handler);
                    entityBindings.setNode(bindingPath, {
                        targetKey  : targetKey,
                        captureKey : captureKey,
                        eventName  : eventName,
                        methodName : methodName,
                        bindingType: bindingType,
                        handler    : handler
                    });
                }
            },

            /**
             * @param {bookworm.EntityKey} targetKey
             * @param {bookworm.EntityKey} captureKey
             * @param {string} eventName
             * @param {string} methodName
             * @param {string} bindingType
             * @private
             */
            _unbindFromEntity: function (targetKey, captureKey, eventName, methodName, bindingType) {
                var entityBindings = this.entityBindings,
                    bindingPath = [targetKey.toString(), eventName, methodName, bindingType].toPath(),
                    bindingInfo = entityBindings.getNode(bindingPath),
                    handler;

                if (bindingInfo) {
                    handler = bindingInfo.handler;
                    captureKey.unsubscribeFrom(eventName, handler);
                    entityBindings.unsetPath(bindingPath);
                }
            }
        })
        .addMethods(/** @lends bookworm.EntityBound# */{
            /** Call from host class .init(). */
            init: function () {
                /** @type {sntls.Tree} */
                this.entityBindings = sntls.Tree.create();
            },

            /**
             * Subscribes method to be triggered on the specified custom event passing through the entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} eventName
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToEntityContent: function (entityKey, eventName, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isString(eventName, "Invalid event name")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(entityKey, entityKey, eventName, methodName, 'content');

                return this;
            },

            /**
             * Unsubscribes method from the specified custom event passing through the entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} eventName
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityContent: function (entityKey, eventName, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isString(eventName, "Invalid event name")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(entityKey, entityKey, eventName, methodName, 'content');

                return this;
            },

            /**
             * Subscribes method to be triggered on the specified custom event is triggered on the specified entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} eventName
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToEntity: function (entityKey, eventName, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isString(eventName, "Invalid event name")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(entityKey, entityKey, eventName, methodName, 'strict');

                return this;
            },

            /**
             * Unsubscribes method from the specified custom event triggered on the specified entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} eventName
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntity: function (entityKey, eventName, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isString(eventName, "Invalid event name")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(entityKey, entityKey, eventName, methodName, 'strict');

                return this;
            },

            /**
             * Subscribes method to be triggered on any access event passing through the entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToEntityContentAccess: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_ACCESS,
                    methodName,
                    'content');

                return this;
            },

            /**
             * Unsubscribes method from access events passing through the entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityContentAccess: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_ACCESS,
                    methodName,
                    'content');

                return this;
            },

            /**
             * Subscribes method to be triggered when the specified entity is accessed.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToEntityAccess: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_ACCESS,
                    methodName,
                    'strict');

                return this;
            },

            /**
             * Unsubscribes method from access events triggered on the specified entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityAccess: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_ACCESS,
                    methodName,
                    'strict');

                return this;
            },

            /**
             * Subscribes method to be triggered on any change event passing through the entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToEntityContentChange: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'content');

                return this;
            },

            /**
             * Unsubscribes method from change events passing through the entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityContentChange: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'content');

                return this;
            },

            /**
             * Subscribes method to be triggered only when specified entity is replaced.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToEntityChange: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'strict');

                return this;
            },

            /**
             * Unsubscribes method from change events triggered on the specified entity.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityChange: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'strict');

                return this;
            },

            /**
             * Subscribes method to be triggered when field or document changes.
             * Adds `affectedKey` payload / property to event.
             * @param {bookworm.FieldKey} fieldKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToFieldChange: function (fieldKey, methodName) {
                dessert
                    .isFieldKeyStrict(fieldKey, "Invalid field key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    fieldKey,
                    fieldKey.documentKey,
                    bookworm.Entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'delegate');

                return this;
            },

            /**
             * Unsubscribes method from field changes.
             * @param {bookworm.FieldKey} fieldKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromFieldChange: function (fieldKey, methodName) {
                dessert
                    .isFieldKeyStrict(fieldKey, "Invalid field key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    fieldKey,
                    fieldKey.documentKey,
                    bookworm.Entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'delegate');

                return this;
            },

            /**
             * Removes and unsubscribes all bindings associated with the current instance.
             * @returns {bookworm.EntityBound}
             */
            unbindAll: function () {
                var that = this;

                // querying all binding parameters
                this.entityBindings
                    .queryValuesAsHash('|>|>|>|'.toQuery())
                    .toCollection()
                    .forEachItem(function (bindingInfo) {
                        that._unbindFromEntity(
                            bindingInfo.targetKey,
                            bindingInfo.captureKey,
                            bindingInfo.eventName,
                            bindingInfo.methodName,
                            bindingInfo.bindingType);
                    });

                return this;
            }
        });
});
