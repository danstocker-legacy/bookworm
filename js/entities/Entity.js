/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Entity', function () {
    "use strict";

    var slice = Array.prototype.slice;

    /**
     * Creates an Entity instance.
     * Entity instantiation is expected to be done via subclasses, unless there are suitable surrogates defined.
     * @name bookworm.Entity.create
     * @function
     * @param {bookworm.EntityKey} entityKey Identifies entity.
     * @returns {bookworm.Entity}
     */

    /**
     * The Entity class serves as the base class for all entities. It provides an API to access and modify the cache
     * node represented by the entity.
     * @class
     * @extends troop.Base
     */
    bookworm.Entity = troop.Base.extend()
        .addMethods(/** @lends bookworm.Entity# */{
            /**
             * @param {bookworm.EntityKey} entityKey
             * @ignore
             */
            init: function (entityKey) {
                /**
                 * Key that identifies the entity.
                 * @type {bookworm.EntityKey}
                 */
                this.entityKey = entityKey;
            },

            /**
             * Fetches entity node from cache.
             * Arguments will be appended to the entity path.
             * @example
             * // will fetch the node under 'foo>bar' relative to the entity root
             * entity.getNode('foo', 'bar');
             * @returns {*}
             */
            getNode: function () {
                var entityPath = this.entityKey.getEntityPath();

                if (arguments.length) {
                    entityPath = entityPath.append(slice.call(arguments).toPath());
                }

                return bookworm.entities.getNode(entityPath);
            },

            /**
             * Fetches entity node from cache, wrapped in a Hash instance.
             * Arguments will be appended to the entity path.
             * @returns {sntls.Hash}
             */
            getNodeAsHash: function () {
                return sntls.Hash.create(this.getNode.apply(this, arguments));
            },

            /**
             * Fetches entity node from cache without triggering access events.
             * Arguments will be appended to the entity path.
             * @returns {*}
             */
            getSilentNode: function () {
                var entityPath = this.entityKey.getEntityPath();

                if (arguments.length) {
                    entityPath = entityPath.append(slice.call(arguments).toPath());
                }

                return sntls.Tree.getNode.call(bookworm.entities, entityPath);
            },

            /**
             * Fetches entity node from cache, wrapped in a Hash instance, without triggering access events.
             * Arguments will be appended to the entity path.
             * @returns {sntls.Hash}
             */
            getSilentNodeAsHash: function () {
                return sntls.Hash.create(this.getSilentNode.apply(this, arguments));
            },

            /**
             * Touches entity node, triggering access event when absent, but not returning the node itself.
             * @returns {bookworm.Entity}
             */
            touchNode: function () {
                this.getNode();
                return this;
            },

            /**
             * Replaces entity node with the specified value.
             * Extra arguments will be appended to the entity path.
             * @example
             * // will set 'hello world' on the path 'foo>bar' relative to the entity root
             * entity.setNode('hello world', 'foo', 'bar');
             * @param {*} value
             * @returns {bookworm.Entity}
             */
            setNode: function (value) {
                var dataPath = this.entityKey.getEntityPath();

                if (arguments.length > 1) {
                    dataPath = dataPath.append(slice.call(arguments, 1).toPath());
                }

                bookworm.entities.setNode(dataPath, value);

                return this;
            },

            /**
             * Removes entity node from cache.
             * Arguments will be appended to the entity path.
             * @example
             * // will remove the node under 'foo>bar' relative to the entity root
             * entity.unsetKey('foo', 'bar');
             * @returns {bookworm.Entity}
             */
            unsetKey: function () {
                var dataPath = this.entityKey.getEntityPath();

                if (arguments.length) {
                    dataPath = dataPath.append(slice.call(arguments).toPath());
                }

                bookworm.entities.unsetKey(dataPath);

                return this;
            }
        });
});
