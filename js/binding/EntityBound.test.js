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

            onEntityEvent: function () {
            }
        });

    test("Instantiation", function () {
        var entityBound = EntityBound.create();
        ok(entityBound.entityBindings.isA(sntls.Tree), "should set entityBindings property");
    });

    test("Binding to entity change", function () {
        expect(7);

        var entityBound = EntityBound.create(),
            documentKey = 'foo/bar'.toDocumentKey(),
            finalHandler = function () {};

        entityBound.entityBindings.addMocks({
            getNode: function (path) {
                ok(path.equals(['foo/bar', 'bookworm.entity.change', 'onEntityEvent', 'normal'].toPath()),
                    "should fetch handler from binding registry");
                return undefined;
            },
            setNode: function (path, value) {
                ok(path.equals(['foo/bar', 'bookworm.entity.change', 'onEntityEvent', 'normal'].toPath()),
                    "should store handler in registry");
                strictEqual(value, finalHandler, "should pass final handler to registry");
            }
        });

        entityBound.addMocks({
            _spawnNormalEntityHandler: function (methodName) {
                equal(methodName, 'onEntityEvent', "should spawn handler for method");
                return finalHandler;
            }
        });

        documentKey.addMocks({
            subscribeTo: function (eventName, handler) {
                equal(eventName, 'bookworm.entity.change', "should subscribe to entity change");
                strictEqual(handler, finalHandler, "should pass final handler to subscription");
            }
        });

        strictEqual(entityBound.bindToEntityChange(documentKey, 'onEntityEvent'), entityBound, "should be chainable");
    });

    test("Re-binding to entity change", function () {
        expect(1);

        var entityBound = EntityBound.create(),
            documentKey = 'foo/bar'.toDocumentKey(),
            finalHandler = function () {};

        entityBound.entityBindings.addMocks({
            getNode: function (path) {
                ok(path.equals(['foo/bar', 'bookworm.entity.change', 'onEntityEvent', 'normal'].toPath()),
                    "should fetch handler from binding registry");
                return finalHandler;
            },
            setNode: function () {
                ok(false, "should not set new handler");
            }
        });

        entityBound.addMocks({
            _spawnNormalEntityHandler: function () {
                ok(false, "should not spawn new handler");
            }
        });

        documentKey.addMocks({
            subscribeTo: function () {
                ok(false, "should not subscribe to key");
            }
        });

        entityBound.bindToEntityChange(documentKey, 'onEntityEvent');
    });

    test("Unbinding from entity change", function () {
        expect(5);

        var documentKey = 'foo/bar'.toDocumentKey(),
            entityBound = EntityBound.create()
                .bindToEntityChange(documentKey, 'onEntityEvent'),
            finalHandler = function () {};

        entityBound.entityBindings.addMocks({
            getNode  : function (path) {
                ok(path.equals(['foo/bar', 'bookworm.entity.change', 'onEntityEvent', 'normal'].toPath()),
                    "should fetch handler from binding registry");
                return finalHandler;
            },
            unsetPath: function (path) {
                ok(path.equals(['foo/bar', 'bookworm.entity.change', 'onEntityEvent', 'normal'].toPath()),
                    "should remove subscription from registry");
            }
        });

        documentKey.addMocks({
            unsubscribeFrom: function (eventName, handler) {
                equal(eventName, 'bookworm.entity.change', "should unsubscribe from change on key");
                strictEqual(handler, finalHandler, "should pass handler to unsubscription");
            }
        });

        strictEqual(entityBound.unbindFromEntityChange(documentKey, 'onEntityEvent'), entityBound, "should be chainable");
    });
}());
