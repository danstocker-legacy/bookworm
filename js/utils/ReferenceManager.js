/*global dessert, troop, sntls, evan, flock, bookworm, app */
troop.postpone(bookworm, 'ReferenceManager', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Makes sure references to removed documents are also removed.
     * @class
     * @extends troop.Base
     */
    bookworm.ReferenceManager = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addPrivateMethods(/** @lends bookworm.ReferenceManager# */{
            /**
             * Clears the specified referencing entity.
             * @param {bookworm.FieldKey|bookworm.ItemKey} entityKey
             * @private
             */
            _clearReference: function (entityKey) {
                var entity = entityKey.toEntity();
                if (entityKey.instanceOf(bookworm.FieldKey) || entityKey.instanceOf(bookworm.ItemKey)) {
                    // setting field / item value to undefined
                    entity.setValue(undefined);
                } else if (entityKey.isA(bookworm.ReferenceItemKey)) {
                    // removing item from collection
                    entity.unsetKey();
                } else {
                    dessert.assert(false, "Invalid referencing entity");
                }
            }
        })
        .addMethods(/** @lends bookworm.ReferenceManager# */{
            /**
             * Removes back references for the specified document.
             * @param {bookworm.DocumentKey} documentKey
             * @returns {bookworm.ReferenceManager}
             */
            removeBackReferences: function (documentKey) {
                bookworm.ReferenceLookup.create()
                    .getBackReferences(documentKey)
                    .callOnEachItem('toEntityKey')
                    .forEachItem(this._clearReference);

                return this;
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onCacheChange: function (event) {
                var affectedPath = event.originalPath.clone(),
                    affectedKey = affectedPath.trimLeft().toEntityKey();

                if (affectedKey.isA(bookworm.DocumentKey) && event.isDelete()) {
                    // document is being removed
                    // removing referencing fields & items
                    this.removeBackReferences(affectedKey);
                }
            }
        });
});

troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    if (bookworm.useBackReferences) {
        bookworm.entities
            .subscribeTo(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'document'.toPath(), function (event) {
                bookworm.ReferenceManager
                    .onCacheChange(event);
            });
    }
});
