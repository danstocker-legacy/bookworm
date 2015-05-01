/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'config', function () {
    "use strict";

    /**
     * Contains meta-entities describing document types and their fields.
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
//                    }
//                }
                //@formatter:on
            }
        }
    });
});
