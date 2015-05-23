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

    test("Binding to entity change", function () {
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

        strictEqual(entityBound.bindToEntityChange(documentKey, 'onEntityEvent'), entityBound,
            "should be chainable");

        // should trigger
        documentKey.toDocument().getField('baz')
            .setValue("Hello World!");

        entityBound.unbindFromEntityChange(documentKey, 'onEntityEvent');
    });

    test("Re-binding to entity change", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create()
                .bindToEntityChange(documentKey, 'onEntityEvent'),
            handler = entityBound.entityBindings.getNode([
                "foo/bar", "bookworm.entity.change", "onEntityEvent", "change"].toPath());

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler bound subsequently");
            }
        });

        entityBound.bindToEntityChange(documentKey, 'onEntityEvent');

        strictEqual(entityBound.entityBindings.getNode([
            "foo/bar", "bookworm.entity.change", "onEntityEvent", "change"].toPath()),
            handler,
            "should not alter current subscription");

        // should not trigger
        documentKey.toDocument().getField('baz')
            .setValue("Hello World!");

        entityBound.unbindFromEntityChange(documentKey, 'onEntityEvent');
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

        deepEqual(JSON.parse(JSON.stringify(entityBound.entityBindings.items)), {},
            "should remove binding info from registry");

        // should not trigger
        documentKey.toDocument().getField('baz')
            .setValue("Hello World!");
    });

    test("Binding to entity replacement", function () {
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

        strictEqual(entityBound.bindToEntityReplace(documentKey, 'onEntityEvent'), entityBound, "should be chainable");

        // should trigger
        documentKey.toDocument()
            .setNode({
                baz: "Hello World!"
            });

        // should not trigger
        documentKey.toDocument().getField('baz')
            .setValue("Hi All!");

        entityBound.unbindFromEntityReplace(documentKey, 'onEntityEvent');
    });

    test("Unbinding from entity replacement", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToEntityReplace(documentKey, 'onEntityEvent');

        strictEqual(entityBound.unbindFromEntityReplace(documentKey, 'onEntityEvent'), entityBound,
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

        strictEqual(entityBound.bindToFieldChange(fieldKey, 'onEntityEvent'), entityBound, "should be chainable");

        // should not trigger
        fieldKey.toField()
            .setValue("Hello World!");

        entityBound.unbindFromFieldChange(fieldKey, 'onEntityEvent');
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

        entityBound.bindToFieldChange(fieldKey, 'onEntityEvent');

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

        entityBound.unbindFromFieldChange(fieldKey, 'onEntityEvent');
    });

    test("Unbinding from field change", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            entityBound = EntityBound.create();

        entityBound.addMocks({
            onEntityEvent: function () {
                ok(false, "should not call handler");
            }
        });

        entityBound.bindToFieldChange(fieldKey, 'onEntityEvent');

        strictEqual(entityBound.unbindFromFieldChange(fieldKey, 'onEntityEvent'), entityBound,
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
            .bindToEntityChange('foo/bar'.toDocumentKey(), 'onEntityEvent')
            .bindToEntityReplace('foo/bar'.toDocumentKey(), 'onEntityEvent')
            .bindToFieldChange('foo/bar/baz'.toFieldKey(), 'onEntityEvent');

        strictEqual(entityBound.unbindAll(), entityBound, "should be chainable");

        deepEqual(entityBound.entityBindings.items, {},
            "should clear binding registry");
    });
}());
