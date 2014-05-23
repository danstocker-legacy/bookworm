/*global dessert, troop, sntls, flock, bookworm */
troop.postpone(bookworm, 'metadata', function () {
    "use strict";

    /**
     * Non-evented cache for documents describing document types and their fields.
     * @type {sntls.Tree}
     */
    bookworm.metadata = sntls.Tree.create({
        /** Metadata node, contains information about document types and their fields. */
        document: {
            /** Basic document meta, describes all other metadata documents. */
            document: {
                /**
                 * Metadata documents have document meta by default.
                 * It's necessary to store metadata flags on the rest of the metadata documents.
                 */
                hasDocumentMeta: true
            }

            //@formatter:off
//          /** Sample metadata document. */
//          user: {
//              /**
//              * Specifies that document has no metadata:
//              * field nodes come right under the document node.
//              */
//              hasDocumentMeta: false,
//              fields: {
//                  name: {
//                      /** Field contains string */
//                      fieldType: 'string',
//                      /** Specifies that 'name' field has NO metadata associated with it. */
//                      hasFieldMeta: false
//                  },
//                  age: {
//                      /** Field contains number */
//                      fieldType: 'number',
//                      /** Specifies that 'name' field has metadata associated with it. */
//                      hasFieldMeta: true
//                  },
//                  emails: {
//                      /** Field contains collection */
//                      fieldType: 'collection',
//                      /** There is no metadata associated with the collection */
//                      hasFieldMeta: false,
//                      /** Items are strings */
//                      itemType: 'string',
//                      /** There is metadata associated with items */
//                      hasItemMeta: true
//                  }
//              }
//          }
            //@formatter:on
        }
    });
});

troop.postpone(bookworm, 'documents', function () {
    "use strict";

    /**
     * Evented cache for application-domain documents.
     * @type {flock.EventedTree}
     */
    bookworm.documents = flock.EventedTree.create({
        //@formatter:off
        /** Sample document **/
//      user: {
//          /**
//           * Document type was specified not to have metadata.
//           * Fields come right under the document node.
//           */
//          1: {
//              /**
//               * 'name' field was specified not to have metadata.
//               * Field value is associated directly with key.
//               */
//              name: "john",
//              /**
//               * 'age' field was specified to have metadata.
//               * Value is stored on sub-node.
//               */
//              age: {
//                  /** When field has metadata, value is always stored under 'value'. */
//                  value: 32
//              },
//              /**
//               * 'email' field was specified not to have metadata.
//               * Value is collection and is associated with the key.
//               */
//              emails: {
//                  /**
//                   * Items for this collection were specified to have metadata.
//                   * Item values are stored on sub-node.
//                   */
//                  'john@johnsdomain.com':{
//                      qualifier: 'home',
//                      /** When item has metadata, value is always stored under 'value'. */
//                      value:'john@johnsdomain.com'
//                  },
//                  'john@johnsworkplace.com':{
//                      qualifier: 'work',
//                      value: 'john@johnsworkplace.com'
//                  }
//              }
//          }
//      }
        //@formatter:on
    });
});

troop.postpone(bookworm, 'index', function () {
    "use strict";

    /**
     * Non-evented cache for application-domain indexes.
     * @type {sntls.Tree}
     */
    bookworm.index = sntls.Tree.create();
});
