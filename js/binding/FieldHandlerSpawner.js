/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'FieldHandlerSpawner', function () {
    "use strict";

    var base = bookworm.HandlerSpawner,
        self = base.extend();

    /**
     * @name bookworm.FieldHandlerSpawner.create
     * @function
     * @returns {bookworm.FieldHandlerSpawner}
     */

    /**
     * TODO: Rename to DelegateHandlerSpawner.
     * @class
     * @extends bookworm.HandlerSpawner
     */
    bookworm.FieldHandlerSpawner = self
        .addMethods(/** @lends bookworm.FieldHandlerSpawner# */{
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
        .addSurrogate(bookworm, 'FieldHandlerSpawner', function (bindingType) {
            return bindingType === 'delegate';
        });
});