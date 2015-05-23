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
                change : 'change',
                replace: 'replace',
                field  : 'field'
            }
        })
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
             * Subscribes method to be triggered on any change event passing through the node.
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
                    'change');

                return this;
            },

            /**
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
                    'change');

                return this;
            },

            /**
             * Subscribes method to be triggered only when specified node is replaced.
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            bindToEntityReplace: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'replace');

                return this;
            },

            /**
             * @param {bookworm.EntityKey} entityKey
             * @param {string} methodName
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityReplace: function (entityKey, methodName) {
                dessert
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    bookworm.Entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'replace');

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
                    'field');

                return this;
            },

            /**
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
                    'field');

                return this;
            },

            /**
             * Unsubscribes from all bound entities.
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
