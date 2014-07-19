/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'EntityBound', function () {
    "use strict";

    /**
     * Trait that binds instances of the host class to events firing inside the document cache
     * on specific entities.
     * @class
     * @extends troop.Base
     */
    bookworm.EntityBound = troop.Base.extend()
        .addPrivateMethods(/** @lends bookworm.EntityBound# */{
            /**
             * @param {bookworm.EntityKey} entityKey
             * @param {string} eventName
             * @returns {string}
             * @private
             */
            _getBindingSignature: function (entityKey, eventName) {
                return entityKey + '|' + encodeURI(eventName);
            },

            /**
             * @param {string} bindingSignature
             * @returns {Array}
             * @private
             */
            _parseBindingSignature: function (bindingSignature) {
                var result = bindingSignature.split('|');
                result[0] = result[0].toEntityKey();
                result[1] = decodeURI(result[1]);
                return result;
            },

            /**
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} eventName Identifies event to bind to.
             * @param {string} methodName Identifies handler method on current class.
             * @param {boolean} [discardBubbling=false] Whether not to capture bubbling events.
             * @private
             */
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                dessert
                    .isEntityKey(entityKey, "Invalid key to bind to")
                    .isFunction(this[methodName], "Invalid method name for cache binding");

                var that = this,
                    bindingSignature = this._getBindingSignature(entityKey, eventName),
                    dataPath = entityKey.getEntityPath(),
                    handler = discardBubbling ?
                        // in strict mode, only original event paths are accepted
                        function (/**evan.Event*/event, data) {
                            if (event.originalPath.equals(dataPath)) {
                                that[methodName](event, data);
                            }
                        } :
                        // in non-strict mode,
                        function (/**evan.Event*/event, data) {
                            that[methodName](event, data);
                        };

                // subscribing to changes
                bookworm.documents.subscribeTo(eventName, dataPath, handler);

                // adding entry to subscription registry
                this.cacheBindings.addItem(bindingSignature, handler);
            },

            /**
             * General event unbinding. Unbinds all subscriptions in the cache associated with
             * the specified entity key.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} eventName Identifies event to bind to.
             * @private
             */
            _unbindFromEntity: function (entityKey, eventName) {
                var bindingSignature = this._getBindingSignature(entityKey, eventName),
                    handlers = this.cacheBindings.getItem(bindingSignature),
                    i;

                if (handlers) {
                    // has subscription(s) fitting the signature

                    // boxing lone handler
                    if (!(handlers instanceof Array)) {
                        handlers = [handlers];
                    }

                    // going over handlers and unsubscribing from each
                    for (i = 0; i < handlers.length; i++) {
                        bookworm.documents
                            .unsubscribeFrom(eventName, entityKey.getEntityPath(), handlers[i]);
                    }

                    // removing all handlers associated w/ key from subscription registry
                    this.cacheBindings.removeItem(bindingSignature);
                }
            }
        })
        .addMethods(/** @lends bookworm.EntityBound# */{
            /**
             * Call from host class .init().
             */
            init: function () {
                /** @type {sntls.Dictionary} */
                this.cacheBindings = sntls.Dictionary.create();
            },

            /**
             * Tells whether current cache bound instance is bound to any entity keys.
             * @returns {boolean}
             */
            isBound: function () {
                return this.cacheBindings.getKeyCount() > 0;
            },

            /**
             * Binds to a specified entity event.
             * Any event originating from within the entity's node will be captured by the handler.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} eventName Identifies event to bind to.
             * @param {string} methodName Identifies handler method on current class.
             * @returns {bookworm.EntityBound}
             */
            bindToEntity: function (entityKey, eventName, methodName) {
                this._bindToEntity(entityKey, eventName, methodName, false);
                return this;
            },

            /**
             * Binds to a specified entity event.
             * Only events triggered on the entity's node will be captured by the handler.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} eventName Identifies event to bind to.
             * @param {string} methodName Identifies handler method on current class.
             * @returns {bookworm.EntityBound}
             */
            bindToEntityNode: function (eventName, entityKey, methodName) {
                this._bindToEntity(entityKey, eventName, methodName, true);
                return this;
            },

            /**
             * Removes all bindings from current instance associated with the specified entity key and event name.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} eventName Identifies event to bind to.
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntity: function (entityKey, eventName) {
                this._unbindFromEntity(entityKey, eventName);
                return this;
            },

            /**
             * Binds to change events occurring on the specified entity key.
             * Any event originating from within the entity's node will be captured by the handler.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} methodName Identifies handler method on current class.
             * @returns {bookworm.EntityBound}
             */
            bindToEntityChange: function (entityKey, methodName) {
                this._bindToEntity(entityKey, flock.ChangeEvent.EVENT_CACHE_CHANGE, methodName, false);
                return this;
            },

            /**
             * Binds to change events occurring on the specified entity key.
             * Only events triggered on the entity's node will be captured by the handler.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} methodName Identifies handler method on current class.
             * @returns {bookworm.EntityBound}
             */
            bindToEntityNodeChange: function (entityKey, methodName) {
                this._bindToEntity(entityKey, flock.ChangeEvent.EVENT_CACHE_CHANGE, methodName, true);
                return this;
            },

            /**
             * Removes all change event bindings from current instance associated with the specified entity key.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityChange: function (entityKey) {
                this._unbindFromEntity(entityKey, flock.ChangeEvent.EVENT_CACHE_CHANGE);
                return this;
            },

            /**
             * Binds to access events occurring on the specified entity key.
             * Any event originating from within the entity's node will be captured by the handler.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} methodName Identifies handler method on current class.
             * @returns {bookworm.EntityBound}
             */
            bindToEntityAccess: function (entityKey, methodName) {
                this._bindToEntity(entityKey, flock.AccessEvent.EVENT_CACHE_ACCESS, methodName, false);
                return this;
            },

            /**
             * Binds to change events occurring on the specified entity key.
             * Only events triggered on the entity's node will be captured by the handler.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @param {string} methodName Identifies handler method on current class.
             * @returns {bookworm.EntityBound}
             */
            bindToEntityNodeAccess: function (entityKey, methodName) {
                this._bindToEntity(entityKey, flock.AccessEvent.EVENT_CACHE_ACCESS, methodName, true);
                return this;
            },

            /**
             * Removes all access event bindings from current instance associated with the specified entity key.
             * @param {bookworm.EntityKey} entityKey Identifies entity to bind to.
             * @returns {bookworm.EntityBound}
             */
            unbindFromEntityAccess: function (entityKey) {
                this._unbindFromEntity(entityKey, flock.AccessEvent.EVENT_CACHE_ACCESS);
                return this;
            },

            /**
             * Removes all entity event bindings from current instance.
             * @returns {bookworm.EntityBound}
             */
            unbindAll: function () {
                var that = this;

                if (this.isBound()) {
                    this.cacheBindings
                        .toCollection()
                        .forEachItem(function (handlers, bindingSignature) {
                            var args = that._parseBindingSignature(bindingSignature);
                            that._unbindFromEntity.apply(that, args);
                        });
                }

                return this;
            }
        });
});
