# Bookworm

*Document entity framework*

[Wiki](https://github.com/danstocker/bookworm/wiki)

[Reference](http://danstocker.github.io/bookworm)

Bookworm is an isomorphic library that helps organizing the application’s model layer into a document oriented structure. Through entity classes the Bookworm API allows for access and modification of [sntls.Tree](https://github.com/danstocker/sntls)-based cache nodes. Instead of using absolute paths, Bookworm entities may be accessed relying only on their identifiers (keys).

The *document oriented structure* means that the model layer is organized into these units:

- the *document*, identified by a *document type* and *document ID*
    - a `DocumentKey` instance identifies a document
    - the `Document` class implements its API
    - for application-domain document functionality, subclass `Document`
- the *field*, identified by a document reference, and a *field name*
    - a `FieldKey` instance identifies a field
    - the `Field`, `CollectionField`, and `OrderedCollectionField` classes implement its API
- the *collection item*, identified by the (collection) field, and an *item ID*
    - an `ItemKey` instance identifies an item
    - the `Item` class implements its API

Fields and collection items may have the ‘reference’ type, pointing to other entities. (Common application is the collection of references.)

## Entity store

The Bookworm entity store is an in-memory datastore based on [sntls.Tree](http://danstocker.github.io/sntls/sntls.Tree.html).

The cache is composed of three containers:

- `bookworm.entities`: Contains *all* entities within the application. Entity classes provide access to the contents of this container.
- `bookworm.config`: Contains configuration information, most importantly field and collection item types. Look in *js/cache/config.js* or the non-minified distribution for the structure. The contents of this container is expected to be initialized before those parts of the application that use the Bookworm API.
- `bookworm.index`: Holds user-defined indexes for lookups, search, etc. No structure is imposed on this container, content is completely up to the application implementation.

## Entity keys

Entity keys, such as `DocumentKey`, `FieldKey`, and `ItemKey`, are evented. You may trigger and capture events on them. The library itself triggers events on keys whenever a corresponding entity is accessed (when absent) or changed.

## Examples

### Setting field value

    ‘user/1234/name’.toField().setValue(“John Smith”);

Will set the value “John Smith” on the node in `bookworm.entities` (instance of `sntls.Tree`) on the path that corresponds to the field ‘user/1234/name’. By default, this is mapped to the path `’document>documentType>documentId>fieldName’.toPath()`, but the mapping may be changed by subclassing `FieldKey` and providing a suitable surrogate.

### Checking a document’s presence

    !!’user/1234’.toDocument().getSilentNode();

Will not trigger access event signaling that the node is missing. Use `.getNode()` to allow access events to be triggered.

### Obtaining a field key from document key

    var userKey = ‘user/1234’.toDocumentKey(),
        nameKey = userKey.getFieldKey(‘name’);

is the same as:

    var nameKey = ‘user/1234/name’.toFieldKey();

### Subscribing to document changes

    'foo/bar'.toDocumentKey()
        .subscribeTo(bookworm.Entity.EVENT_ENTITY_CHANGE, function (event) {
            console.log("Entity " + event.sender + " changed.");
            console.log("Was: " + event.beforeNode);
            console.log("Now: " + event.afterNode);
        });
