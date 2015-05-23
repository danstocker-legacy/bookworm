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
     * @class
     * @extends bookworm.HandlerSpawner
     */
    bookworm.FieldHandlerSpawner = self
        .addMethods(/** @lends bookworm.FieldHandlerSpawner# */{
            /**
             * @param {bookworm.EntityBound} instance
             * @param {string} methodName
             * @param {bookworm.FieldKey} fieldKey
             * @returns {Function}
             */
            spawnHandler: function (instance, methodName, fieldKey) {
                return function (event) {
                    var affectedKey = event.sender,
                        fieldPath,
                        beforeNode,
                        afterNode;

                    if (affectedKey.equals(fieldKey)) {
                        // field changed
                        // same as if we were subscribing on the event itself
                        event.setAffectedKey(fieldKey);
                        instance[methodName](event);
                    } else if (affectedKey.equals(fieldKey.documentKey)) {
                        // document changed

                        fieldPath = fieldKey.getEntityPath();
                        beforeNode = sntls.Tree.create()
                            .setNode(affectedKey.getEntityPath(), event.beforeNode)
                            .getNode(fieldPath);
                        afterNode = bookworm.entities.getNode(fieldPath);

                        if (beforeNode !== afterNode) {
                            // field has changed

                            // creating event that carries correct information
                            event = event.clone()
                                .setAffectedKey(fieldKey)
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
            return bindingType === 'field';
        });
});