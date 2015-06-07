/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity");

    test("Instantiation", function () {
        var entityKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(entityKey);

        strictEqual(entity.entityKey, entityKey, "should set entity key");
    });

    test("Entity key conversion", function () {
        var entityKey = 'foo/bar'.toDocumentKey(),
            entity = entityKey.toEntity();

        ok(entity.isA(bookworm.Entity), "should return Entity instance");
        strictEqual(entity.entityKey, entityKey, "should set entity key");
    });

    test("Parent entity getter", function () {
        var entity = bookworm.Entity.create(bookworm.EntityKey.create());

        strictEqual(typeof entity.getParentEntity(), 'undefined', "should return undefined");
    });

    test("Attribute entity getter", function () {
        var entity = 'foo/bar'.toDocument(),
            attribute = entity.getAttribute('baz');

        ok(attribute.isA(bookworm.Entity), "should return Entity instance");
        ok(attribute.entityKey.equals('foo/bar'.toDocumentKey().getAttributeKey('baz')), "should set key on attribute");
    });

    test("Node getter", function () {
        expect(2);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey),
            entityNode = {};

        bookworm.entities.addMocks({
            getNode: function (path) {
                ok(path.equals(documentKey.getEntityPath()), "should get node from cache");
                return entityNode;
            }
        });

        strictEqual(entity.getNode(), entityNode, "should return node retrieved from cache");

        bookworm.entities.removeMocks();
    });

    test("Absent node getter", function () {
        expect(2);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey);

        bookworm.entities.addMocks({
            getNode: function (path) {
            }
        });

        function onAccess() {
            ok(true, "should trigger access event");
        }

        documentKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_ACCESS, onAccess);

        equal(typeof entity.getNode(), 'undefined', "should return undefined");

        documentKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_ACCESS, onAccess);
        bookworm.entities.removeMocks();
    });

    test("Hash node getter", function () {
        expect(2);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey),
            entityNode = {};

        bookworm.entities.addMocks({
            getNode: function () {
                return entityNode;
            }
        });

        var hash = entity.getNodeAsHash();
        ok(hash.isA(sntls.Hash), "should return Hash instance");
        strictEqual(hash.items, entityNode, "should return node retrieved from cache");

        bookworm.entities.removeMocks();
    });

    test("Silent node getter", function () {
        expect(2);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey),
            entityNode = {};

        bookworm.entities.addMocks({
            getNode: function (path) {
                ok(path.equals(documentKey.getEntityPath()), "should get node from cache");
                return entityNode;
            }
        });

        function onAccess() {
            ok(false, "should NOT trigger access event");
        }

        documentKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_ACCESS, onAccess);

        strictEqual(entity.getSilentNode(), entityNode, "should return node retrieved from cache");

        documentKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_ACCESS, onAccess);
        bookworm.entities.removeMocks();
    });

    test("Silent Hash node getter", function () {
        expect(2);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey),
            entityNode = {};

        bookworm.entities.addMocks({
            getNode: function () {
                return entityNode;
            }
        });

        var hash = entity.getSilentNodeAsHash();
        ok(hash.isA(sntls.Hash), "should return Hash instance");
        strictEqual(hash.items, entityNode, "should return node retrieved from cache");

        bookworm.entities.removeMocks();
    });

    test("Entity node tester", function () {
        expect(2);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey);

        bookworm.entities.addMocks({
            getNode: function (path) {
            }
        });

        function onAccess() {
            ok(true, "should trigger access event");
        }

        documentKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_ACCESS, onAccess);

        strictEqual(entity.touchNode(), entity, "should be chainable");

        documentKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_ACCESS, onAccess);
        bookworm.entities.removeMocks();
    });

    test("Setting node", function () {
        expect(7);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey);

        entity.addMocks({
            getSilentNode: function () {
                ok(true, "should fetch node silently");
                return undefined;
            }
        });

        bookworm.entities.addMocks({
            setNode: function (path, value) {
                ok(path.equals(documentKey.getEntityPath()),
                    "should set node in cache on the entity path path");
                equal(value, 'hello', "should set specified value in cache");
            }
        });

        function onChange(event) {
            ok(event.isA(bookworm.EntityChangeEvent), "should trigger change event");
            equal(typeof event.beforeNode, 'undefined', "should set beforeNode property on event");
            equal(event.afterNode, 'hello', "should set afterNode property on event");
        }

        documentKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_CHANGE, onChange);

        strictEqual(entity.setNode('hello'), entity, "should be chainable");

        documentKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_CHANGE, onChange);
        bookworm.entities.removeMocks();
    });

    test("Re-setting node", function () {
        expect(0);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey),
            entityNode = {};

        entity.addMocks({
            getSilentNode: function () {
                return entityNode;
            }
        });

        bookworm.entities.addMocks({
            setNode: function () {
                ok(false, "should NOT set entity node");
            }
        });

        function onChange(event) {
            ok(false, "should NOT trigger change event");
        }

        documentKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_CHANGE, onChange);

        entity.setNode(entityNode);

        documentKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_CHANGE, onChange);
        bookworm.entities.removeMocks();
    });

    test("Appending absent node", function () {
        expect(3);

        var document = 'foo/bar'.toDocument(),
            entityNode = {};

        document.addMocks({
            getSilentNode: function () {
                ok(true, "should fetch node silently");
                return undefined;
            },

            setNode: function (node) {
                strictEqual(node, entityNode, "should set node");
            }
        });

        strictEqual(document.appendNode(entityNode), document,
            "should be chainable");
    });

    test("Appending node", function () {
        expect(2);

        var document = 'foo/bar'.toDocument(),
            entityNode = {
                hello: 'world',
                hi   : 'test'
            },
            nodeToAppend = {
                hi: 'all'
            };

        document.addMocks({
            getSilentNode: function () {
                return entityNode;
            }
        });

        function onChange(event) {
            deepEqual(event.beforeNode, {
                hello: "world",
                hi   : "test"
            }, "should set beforeNode on event");
            deepEqual(event.afterNode, {
                hello: "world",
                hi   : "all"
            }, "should set afterNode on event");
        }

        document.entityKey
            .subscribeTo(document.EVENT_ENTITY_CHANGE, onChange);

        document.appendNode(nodeToAppend);

        document.entityKey
            .unsubscribeFrom(document.EVENT_ENTITY_CHANGE, onChange);
    });

    test("Node removal", function () {
        expect(6);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey),
            entityNode = {};

        entity.addMocks({
            getSilentNode: function () {
                ok(true, "should fetch node silently");
                return entityNode;
            }
        });

        bookworm.entities.addMocks({
            unsetNode: function (path) {
                ok(path.equals(documentKey.getEntityPath()),
                    "should set node to undefined");
            }
        });

        function onChange(event) {
            ok(event.isA(bookworm.EntityChangeEvent), "should trigger change event");
            strictEqual(event.beforeNode, entityNode, "should set beforeNode property on event");
            equal(typeof event.afterNode, 'undefined', "should set afterNode property on event");
        }

        documentKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_CHANGE, onChange);

        strictEqual(entity.unsetNode(), entity, "should be chainable");

        documentKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_CHANGE, onChange);
        bookworm.entities.removeMocks();
    });

    test("Node re-removal", function () {
        expect(0);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(documentKey),
            entityNode = {};

        entity.addMocks({
            getSilentNode: function () {
                return undefined;
            }
        });

        bookworm.entities.addMocks({
            unsetNode: function () {
                ok(false, "should NOT set entity node");
            }
        });

        function onChange(event) {
            ok(false, "should NOT trigger change event");
        }

        documentKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_CHANGE, onChange);

        entity.unsetNode(entityNode);

        documentKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_CHANGE, onChange);
        bookworm.entities.removeMocks();
    });

    test("Key removal", function () {
        expect(2);

        var document = 'foo/bar'.toDocument()
                .setNode({
                    hello: 'world',
                    hi   : 'all'
                }),
            field = document.getField('hello');

        function onChange(event) {
            deepEqual(event.beforeNode, {
                hello: "world",
                hi   : "all"
            }, "should set beforeNode on event");
            deepEqual(event.afterNode, {
                hi: "all"
            }, "should set afterNode on event");
        }

        document.entityKey
            .subscribeTo(document.EVENT_ENTITY_CHANGE, onChange);

        field.unsetKey();

        document.entityKey
            .unsubscribeFrom(document.EVENT_ENTITY_CHANGE, onChange);
    });
}());
