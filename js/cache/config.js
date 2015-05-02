/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'config', function () {
    "use strict";

    /**
     * Contains meta-entities describing document types and their fields.
     * Built in types:
     * a) fieldType: string (default), reference, number, boolean, collection, ordered-collection
     * b) itemType: string (default), reference, number, boolean
     * c) itemIdType: string (default), reference
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
