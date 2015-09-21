/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("EntityBound");

    var EntityBound = troop.Base.extend()
        .addTrait(bookworm.EntityBound)
        .addMethods({
            init: function () {
                bookworm.EntityBound.init.call(this);
            },

            onEntityEvent: function () {}
        });

    test("Instantiation", function () {
        var entityBound = EntityBound.create();
        ok(entityBound.entityBindings.isA(sntls.Tree), "should set entityBindings property");
    });

    test("Binding to custom entity content event", function () {
        expect(3);

        var entityBound = EntityBound.create(),
            documentKey = 'foo/bar'.toDocumentKey();

        documentKey.toDocument()
            .setNode({});

        entityBound.addMocks({
            onEntityEvent: function (event) {
                ok(event.sender.equals('foo/bar/baz'.toFieldKey()), "should trigger event");
                equal(event.eventName, 'qux', "should trigger specified event");
            }
        });

        strictEqual(entityBound.bindToEntityContent(documentKey, 'qux', 'onEntityEvent'), entityBound,
            "should be chainable");

        // should trigger
        documentKey.toDocument().getField('baz')
            .entityKey
            .triggerSync('qux');

        entityBound.unbindAll();
    });

    test("Unbinding from custom entity content event", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToEntityContent(documentKey, 'qux', 'onEntityEvent');

        strictEqual(entityBound.unbindFromEntityContent(documentKey, 'qux', 'onEntityEvent'), entityBound,
            "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should remove binding info from registry");

        // should not trigger
        documentKey.toDocument().getField('baz')
            .entityKey
            .triggerSync('qux');
    });

    test("Binding to custom entity event", function () {
        expect(3);

        var entityBound = EntityBound.create(),
            documentKey = 'foo/bar'.toDocumentKey();

        documentKey.toDocument()
            .setNode({});

        entityBound.addMocks({
            onEntityEvent: function (event) {
                ok(event.sender.equals('foo/bar'.toDocumentKey()), "should trigger event");
                equal(event.eventName, 'qux', "should trigger specified event");
            }
        });

        strictEqual(entityBound.bindToEntity(documentKey, 'qux', 'onEntityEvent'), entityBound, "should be chainable");

        // should trigger
        documentKey.toDocument()
            .entityKey
            .triggerSync('qux');

        // should not trigger
        documentKey.toDocument().getField('baz')
            .entityKey
            .triggerSync('qux');

        entityBound.unbindAll();
    });

    test("Unbinding from custom entity event", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToEntity(documentKey, 'qux', 'onEntityEvent');

        strictEqual(entityBound.unbindFromEntity(documentKey, 'qux', 'onEntityEvent'), entityBound,
            "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should remove binding info from registry");

        // should not trigger
        documentKey.toDocument()
            .entityKey
            .triggerSync('qux');
    });

    test("Binding to entity content access", function () {
        expect(2);

        var entityBound = EntityBound.create(),
            documentKey = 'foo/bar'.toDocumentKey();

        documentKey.toDocument()
            .setNode({});

        entityBound.addMocks({
            onEntityEvent: function (event) {
                ok(event.sender.equals('foo/bar/baz'.toFieldKey()), "should trigger event");
            }
        });

        strictEqual(entityBound.bindToEntityContentAccess(documentKey, 'onEntityEvent'), entityBound,
            "should be chainable");

        // should trigger
        documentKey.toDocument().getField('baz')
            .getValue();

        entityBound.unbindAll();
    });

    test("Unbinding from entity content access", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToEntityContentAccess(documentKey, 'onEntityEvent');

        strictEqual(entityBound.unbindFromEntityContentAccess(documentKey, 'onEntityEvent'), entityBound,
            "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should remove binding info from registry");

        // should not trigger
        documentKey.toDocument().getField('baz')
            .getValue();
    });

    test("Binding to entity access", function () {
        expect(2);

        var entityBound = EntityBound.create(),
            documentKey = 'foo/bar'.toDocumentKey();

        documentKey.toDocument()
            .unsetNode();

        entityBound.addMocks({
            onEntityEvent: function (event) {
                ok(event.sender.equals('foo/bar'.toDocumentKey()), "should trigger event");
            }
        });

        strictEqual(entityBound.bindToEntityAccess(documentKey, 'onEntityEvent'), entityBound, "should be chainable");

        // should trigger
        documentKey.toDocument()
            .getNode();

        // should not trigger
        documentKey.toDocument().getField('baz')
            .getValue();

        entityBound.unbindAll();
    });

    test("Unbinding from entity access", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToEntityAccess(documentKey, 'onEntityEvent');

        strictEqual(entityBound.unbindFromEntityAccess(documentKey, 'onEntityEvent'), entityBound,
            "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should remove binding info from registry");

        // should not trigger
        documentKey.toDocument()
            .getNode();
    });

    test("Binding to entity content change", function () {
        expect(3);

        var entityBound = EntityBound.create(),
            documentKey = 'foo/bar'.toDocumentKey();

        documentKey.toDocument()
            .setNode({});

        entityBound.addMocks({
            onEntityEvent: function (event) {
                equal(typeof event.beforeNode, 'undefined', "should set beforeNode on event");
                equal(event.afterNode, 'Hello World!', "should set afterNode on event");
            }
        });

        strictEqual(entityBound.bindToEntityContentChange(documentKey, 'onEntityEvent'), entityBound,
            "should be chainable");

        // should trigger
        documentKey.toDocument().getField('baz')
            .setValue("Hello World!");

        entityBound.unbindAll();
    });

    test("Re-binding to entity content change", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create()
                .bindToEntityContentChange(documentKey, 'onEntityEvent'),
            handler = entityBound.entityBindings.getNode([
                "foo/bar", "bookworm.entity.change", "onEntityEvent", "change"].toPath());

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler bound subsequently");
            }
        });

        entityBound.bindToEntityContentChange(documentKey, 'onEntityEvent');

        strictEqual(entityBound.entityBindings.getNode([
            "foo/bar", "bookworm.entity.change", "onEntityEvent", "change"].toPath()),
            handler,
            "should not alter current subscription");

        // should not trigger
        documentKey.toDocument().getField('baz')
            .setValue("Hello World!");

        entityBound.unbindAll();
    });

    test("Unbinding from entity content change", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToEntityContentChange(documentKey, 'onEntityEvent');

        strictEqual(entityBound.unbindFromEntityContentChange(documentKey, 'onEntityEvent'), entityBound,
            "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should remove binding info from registry");

        // should not trigger
        documentKey.toDocument().getField('baz')
            .setValue("Hello World!");
    });

    test("Binding to entity change", function () {
        expect(3);

        var entityBound = EntityBound.create(),
            documentKey = 'foo/bar'.toDocumentKey();

        documentKey.toDocument()
            .setNode({});

        entityBound.addMocks({
            onEntityEvent: function (event) {
                deepEqual(event.beforeNode, {}, "should set beforeNode on event");
                deepEqual(event.afterNode, {
                    baz: "Hello World!"
                }, "should set afterNode on event");
            }
        });

        strictEqual(entityBound.bindToEntityChange(documentKey, 'onEntityEvent'), entityBound, "should be chainable");

        // should trigger
        documentKey.toDocument()
            .setNode({
                baz: "Hello World!"
            });

        // should not trigger
        documentKey.toDocument().getField('baz')
            .setValue("Hi All!");

        entityBound.unbindAll();
    });

    test("Unbinding from entity change", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToEntityChange(documentKey, 'onEntityEvent');

        strictEqual(entityBound.unbindFromEntityChange(documentKey, 'onEntityEvent'), entityBound,
            "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should remove binding info from registry");

        // should not trigger
        documentKey.toDocument()
            .setNode({
                baz: "Hello World!"
            });
    });

    test("Binding to field and changing field", function () {
        expect(4);

        var entityBound = EntityBound.create(),
            fieldKey = 'foo/bar/baz'.toFieldKey();

        fieldKey.documentKey.toDocument()
            .setNode({});

        entityBound.addMocks({
            onEntityEvent: function (event) {
                ok(fieldKey.equals(event.affectedKey), "should set affectedKey on event");
                equal(typeof event.beforeNode, 'undefined', "should set beforeNode on event");
                equal(event.afterNode, "Hello World!", "should set afterNode on event");
            }
        });

        strictEqual(entityBound.bindToDelegatedEntityChange(fieldKey, 'onEntityEvent'), entityBound, "should be chainable");

        // should not trigger
        fieldKey.toField()
            .setValue("Hello World!");

        entityBound.unbindAll();
    });

    test("Binding to field and changing document", function () {
        expect(3);

        var entityBound = EntityBound.create(),
            fieldKey = 'foo/bar/baz'.toFieldKey();

        fieldKey.documentKey.toDocument()
            .setNode({});

        entityBound.addMocks({
            onEntityEvent: function (event) {
                ok(fieldKey.equals(event.affectedKey), "should set affectedKey on event");
                equal(typeof event.beforeNode, 'undefined', "should set beforeNode on event");
                equal(event.afterNode, "Hello World!", "should set afterNode on event");
            }
        });

        entityBound.bindToDelegatedEntityChange(fieldKey, 'onEntityEvent');

        // should trigger
        fieldKey.documentKey.toDocument()
            .setNode({
                baz: "Hello World!"
            });

        // should not trigger
        fieldKey.documentKey.toDocument()
            .setNode({
                baz: "Hello World!"
            });

        entityBound.unbindAll();
    });

    test("Unbinding from field change", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToDelegatedEntityChange(fieldKey, 'onEntityEvent');

        strictEqual(entityBound.unbindFromDelegatedEntityChange(fieldKey, 'onEntityEvent'), entityBound,
            "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should remove binding info from registry");

        // should not trigger
        fieldKey.documentKey.toDocument()
            .setNode({
                baz: "Hello World!"
            });
    });

    test("Unbinding from all keys", function () {
        var entityBound = EntityBound.create()
            .bindToEntityContentChange('foo/bar'.toDocumentKey(), 'onEntityEvent')
            .bindToEntityChange('foo/bar'.toDocumentKey(), 'onEntityEvent')
            .bindToDelegatedEntityChange('foo/bar/baz'.toFieldKey(), 'onEntityEvent');

        strictEqual(entityBound.unbindAll(), entityBound, "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should clear binding registry");
    });
}());
