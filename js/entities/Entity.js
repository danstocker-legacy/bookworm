/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'Entity', function () {
    "use strict";

    var shallowCopy = sntls.Utils.shallowCopy;

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
            EVENT_ENTITY_CHANGE: 'bookworm.entity.change'
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
             * Fetches an Entity that is the current entity's parent.
             * Returns undefined by default. Subclasses need to override.
             * @returns {bookworm.Entity}
             */
            getParentEntity: function () {
                return undefined;
            },

            /**
             * Fetches an Attribute entity for the specified attribute name.
             * @param {string} attributeName
             * @returns {bookworm.Entity}
             */
            getAttribute: function (attributeName) {
                return this.entityKey.getAttributeKey(attributeName).toEntity();
            },

            /**
             * Fetches entity node from cache.
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
             * Appends the specified node to the current node. Performs a shallow-merge.
             * In case of conflicts, the specified node's properties win out.
             * Triggering the event shallow copies the entire starting contents of the collection.
             * Do not use on large collections.
             * @param {object} node
             * @returns {bookworm.Entity}
             */
            appendNode: function (node) {
                var that = this,
                    entityKey = this.entityKey,
                    entityPath = entityKey.getEntityPath(),
                    entityNode = this.getSilentNode(),
                    beforeNode = shallowCopy(entityNode);

                bookworm.entities.appendNode(entityPath, node, function (entityPath, afterNode) {
                    entityKey.spawnEvent(that.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(beforeNode)
                        .setAfterNode(afterNode)
                        .triggerSync();
                });

                return this;
            },

            /**
             * Removes entity node from cache.
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
            },

            /**
             * Removes entity from cache, altering the parent node.
             * Performs shallow copy of the node, not recommended to use with large nodes,
             * eg. large collections.
             * @param {boolean} [splice] Whether to splice the parent node if it's an Array.
             * @returns {bookworm.Entity}
             */
            unsetKey: function (splice) {
                var that = this,
                    parentEntity = this.getParentEntity(),
                    parentNodeBefore = shallowCopy(parentEntity.getNode()),
                    entityPath = this.entityKey.getEntityPath();

                bookworm.entities.unsetKey(entityPath, splice, function (parentPath, parentNodeAfter) {
                    parentEntity.entityKey
                        .spawnEvent(that.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(parentNodeBefore)
                        .setAfterNode(parentNodeAfter)
                        .triggerSync();
                });

                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'EntityKey', function () {
    "use strict";

    bookworm.EntityKey
        .addMethods(/** @lends bookworm.EntityKey */{
            /** @returns {bookworm.Entity} */
            toEntity: function () {
                return bookworm.Entity.create(this);
            }
        });
});
