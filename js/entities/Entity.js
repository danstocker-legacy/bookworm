/*global dessert, troop, sntls, dache */
troop.postpone(dache, 'Entity', function () {
    "use strict";

    var slice = Array.prototype.slice;

    /**
     * @name dache.Entity.create
     * @function
     * @param {dache.EntityKey} entityKey
     * @returns {dache.Entity}
     */

    /**
     * Base class for models.
     * @class
     * @extends troop.Base
     */
    dache.Entity = troop.Base.extend()
        .addMethods(/** @lends dache.Entity */{
            /**
             * @param {dache.EntityKey} entityKey
             * @ignore
             */
            init: function (entityKey) {
                dessert.isEntityKey(entityKey, "Invalid entity key");

                /**
                 * Key that identifies the entity.
                 * @type {dache.EntityKey}
                 */
                this.entityKey = entityKey;
            },

            /**
             * Fetches entity node from cache.
             * Arguments will be appended to the entity path.
             * @returns {*}
             */
            getNode: function () {
                var entityPath = this.entityKey.getEntityPath();

                if (arguments.length) {
                    entityPath = entityPath.append(slice.call(arguments).toPath());
                }

                return dache.documents.getNode(entityPath);
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

                return sntls.Tree.getNode.call(dache.documents, entityPath);
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
             * @returns {dache.Entity}
             */
            touchNode: function () {
                this.getNode();
                return this;
            },

            /**
             * Replaces entity node with the specified value.
             * Extra arguments will be appended to the entity path.
             * @param {*} value
             * @returns {dache.Entity}
             */
            setNode: function (value) {
                var dataPath = this.entityKey.getEntityPath();

                if (arguments.length) {
                    dache.documents.setNode(dataPath.append(slice.call(arguments, 1).toPath()), value);
                }

                return this;
            }
        });
});
