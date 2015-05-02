/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Entity', function () {
    "use strict";

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
     * TODO: Add .appendNode()
     * @class
     * @extends troop.Base
     */
    bookworm.Entity = troop.Base.extend()
        .addConstants(/** @lends bookworm.Entity */{
            /**
             * Signals that an absent entity has been accessed.
             * @constant
             */
            EVENT_ENTITY_ACCESS: 'bookworm.entity.access',

            /**
             * Signals that an entity node was changed.
             * @constant
             */
            EVENT_ENTITY_CHANGE: 'bookworm.entity.change',

            /**
             * Signals that an entity node is about to be appended.
             * @constant
             */
            EVENT_ENTITY_BEFORE_APPEND: 'bookworm.entity.change.before-append',

            /**
             * Signals that an entity node was appended.
             * @constant
             */
            EVENT_ENTITY_AFTER_APPEND: 'bookworm.entity.change.after-append'
        })
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
                var entityPath = this.entityKey.getEntityPath(),
                    entityNode = bookworm.entities.getNode(entityPath);

                if (typeof entityNode === 'undefined') {
                    // triggering event about absent node
                    this.entityKey.triggerSync(this.EVENT_ENTITY_ACCESS);
                }

                return entityNode;
            },

            /**
             * Fetches entity node from cache, wrapped in a Hash instance.
             * @returns {sntls.Hash}
             */
            getNodeAsHash: function () {
                return sntls.Hash.create(this.getNode());
            },

            /**
             * Fetches entity node from cache without triggering access events.
             * @returns {*}
             */
            getSilentNode: function () {
                var entityPath = this.entityKey.getEntityPath();
                return bookworm.entities.getNode(entityPath);
            },

            /**
             * Fetches entity node from cache, wrapped in a Hash instance, without triggering access events.
             * @returns {sntls.Hash}
             */
            getSilentNodeAsHash: function () {
                return sntls.Hash.create(this.getSilentNode());
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
             * @param {*} node
             * @returns {bookworm.Entity}
             */
            setNode: function (node) {
                var entityKey = this.entityKey,
                    beforeNode = this.getSilentNode();

                if (node !== beforeNode) {
                    bookworm.entities.setNode(entityKey.getEntityPath(), node);

                    entityKey.spawnEvent(this.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(beforeNode)
                        .setAfterNode(node)
                        .triggerSync();
                }

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
            unsetNode: function () {
                var entityKey = this.entityKey,
                    entityPath = entityKey.getEntityPath(),
                    beforeNode = this.getSilentNode();

                if (typeof beforeNode !== 'undefined') {
                    bookworm.entities.unsetNode(entityPath);

                    entityKey.spawnEvent(this.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(beforeNode)
                        .triggerSync();
                }

                return this;
            }
        });
});
