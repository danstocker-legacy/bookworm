/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'DelegateHandlerSpawner', function () {
    "use strict";

    var base = bookworm.HandlerSpawner,
        self = base.extend();

    /**
     * @name bookworm.DelegateHandlerSpawner.create
     * @function
     * @returns {bookworm.DelegateHandlerSpawner}
     */

    /**
     * @class
     * @extends bookworm.HandlerSpawner
     */
    bookworm.DelegateHandlerSpawner = self
        .addMethods(/** @lends bookworm.DelegateHandlerSpawner# */{
            /**
             * @param {bookworm.EntityBound} instance
             * @param {string} methodName
             * @param {bookworm.EntityKey} entityKey
             * @returns {Function}
             */
            spawnHandler: function (instance, methodName, entityKey) {
                return function (event) {
                    var entityPath = entityKey.getEntityPath(),
                        affectedKey = event.sender,
                        affectedPath = affectedKey.getEntityPath(),
                        beforeNode,
                        afterNode;

                    if (affectedKey.equals(entityKey)) {
                        // observed entity changed
                        // same as if we were subscribing on the event itself
                        event.setAffectedKey(entityKey);
                        instance[methodName](event);
                    } else if (entityPath.isRelativeTo(affectedPath)) {
                        // entity on the parent chain changed

                        beforeNode = sntls.Tree.create()
                            .setNode(affectedPath, event.beforeNode)
                            .getNode(entityPath);
                        afterNode = bookworm.entities.getNode(entityPath);

                        if (beforeNode !== afterNode) {
                            // entity has changed

                            // creating event that carries correct information
                            event = event.clone()
                                .setAffectedKey(entityKey)
                                .setBeforeNode(beforeNode)
                                .setAfterNode(afterNode);

                            instance[methodName](event);
                        }
                    }
                };
            }
        });
});

troop.amendPostponed(bookworm, 'HandlerSpawner', function () {
    "use strict";

    bookworm.HandlerSpawner
        .addSurrogate(bookworm, 'DelegateHandlerSpawner', function (bindingType) {
            return bindingType === 'delegate';
        });
});