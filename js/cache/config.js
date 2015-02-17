/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'config', function () {
    "use strict";

    /**
     * <p>Non-evented cache for entities describing document types and their fields.</p>
     * <p>Built in types:</p>
     * <ul>
     *     <li>fieldType: string (default), reference, number, boolean, collection, ordered-collection</li>
     *     <li>itemType: string (default), reference, number, boolean</li>
     *     <li>itemIdType: string (default), reference</li>
     * </ul>
     * @type {sntls.Tree}
     */
    bookworm.config = sntls.Tree.create({
        document: {
            document: {
                //@formatter:off
//                /** Sample config document. */
//                user: {
//                    name  : {
//                        /** Field contains string */
//                        fieldType: 'string'
//                    },
//                    age   : {
//                        /** Field contains number */
//                        fieldType: 'number'
//                    },
//                    emails: {
//                        /** Field contains collection */
//                        fieldType: 'collection',
//                        /** Items are strings */
//                        itemType : 'string'
//                    },
//                    friends: {
//                        /** Field contains collection */
//                        fieldType: 'collection',
//                        /** Items are booleans */
//                        itemType : 'boolean',
//                        /** Item IDs are references */
//                        itemIdType : 'reference'
//                    }
//                }
                //@formatter:on
            }
        }
    });
});
