/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'config', function () {
    "use strict";

    /**
     * Non-evented cache for entities describing document types and their fields.
     * @type {sntls.Tree}
     */
    bookworm.config = sntls.Tree.create({
        /** Config node, contains information about document types and their fields. */
        document: {
            //@formatter:off
//          /** Sample config document. */
//          user: {
//              name: {
//                  /** Field contains string */
//                  fieldType: 'string'
//              },
//              age: {
//                  /** Field contains number */
//                  fieldType: 'number'
//              },
//              emails: {
//                  /** Field contains collection */
//                  fieldType: 'collection',
//                  /** Items are strings */
//                  itemType: 'string'
//              }
//          }
            //@formatter:on
        }
    });
});

troop.postpone(bookworm, 'entities', function () {
    "use strict";

    /**
     * Evented cache for application-domain entities.
     * @type {flock.EventedTree}
     */
    bookworm.entities = flock.EventedTree.create();
});

troop.postpone(bookworm, 'index', function () {
    "use strict";

    /**
     * Non-evented cache for application-domain indexes.
     * @type {sntls.Tree}
     */
    bookworm.index = sntls.Tree.create();
});
