/*global dessert, troop, sntls, flock, dache */
troop.postpone(dache, 'metadata', function () {
    "use strict";

    /**
     * Non-evented cache for documents describing document types and their fields.
     * @type {sntls.Tree}
     */
    dache.metadata = sntls.Tree.create({
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
//          /**
//           * Sample metadata document.
//           */
//          user: {
//              /**
//               * Specifies that document has no metadata:
//               * field nodes come right under the document node.
//               */
//              hasDocumentMeta: false,
//              fields: {
//                  name: {
//                      /** Field type */
//                      type: 'string',
//                      /** Specifies that 'name' field has NO metadata associated with it. */
//                      hasFieldMeta: false
//                  },
//                  age: {
//                      /** Field type */
//                      type: 'number',
//                      /** Specifies that 'name' field has metadata associated with it. */
//                      hasFieldMeta: true
//                  }
//              }
//          }
            //@formatter:on
        }
    });
});

troop.postpone(dache, 'documents', function () {
    "use strict";

    /**
     * Evented cache for application-domain documents.
     * @type {flock.EventedTree}
     */
    dache.documents = flock.EventedTree.create({
        //@formatter:off
//      /** Sample document **/
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
//                  value: 32
//              }
//          }
//      }
        //@formatter:on
    });
});

troop.postpone(dache, 'index', function () {
    "use strict";

    /**
     * Non-evented cache for application-domain indexes.
     * @type {sntls.Tree}
     */
    dache.index = sntls.Tree.create();
});
