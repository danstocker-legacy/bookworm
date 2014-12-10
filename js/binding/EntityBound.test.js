/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity Binding");

    var BoundClass = troop.Base.extend()
        .addTrait(bookworm.EntityBound)
        .addMethods({
            init: function () {
                bookworm.EntityBound.init.call(this);
            },

            onEntityEvent: function () {
            }
        });

    test("Binding signature getter", function () {
        equal(
            bookworm.EntityBound._getBindingSignature('bar/baz'.toDocumentKey(), 'foo'),
            'bar/baz|foo',
            "should concatenate the event name and key"
        );

        equal(
            bookworm.EntityBound._getBindingSignature('bar/baz'.toDocumentKey(), 'foo|'),
            'bar/baz|foo%7C',
            "should URI encode the event name in the output string"
        );
    });

    test("Binding signature parser", function () {
        deepEqual(
            bookworm.EntityBound._parseBindingSignature('foo/bar|hello'),
            ['foo/bar'.toDocumentKey(), 'hello'],
            "should extract the event name and document key instance from signature"
        );

        deepEqual(
            bookworm.EntityBound._parseBindingSignature('foo/bar/baz|hello'),
            ['foo/bar/baz'.toFieldKey(), 'hello'],
            "should extract the event name and field key instance from signature"
        );
    });

    // TODO: add test case for non-bubbling binding
    test("Internal event binder", function () {
        expect(5);

        var bound = BoundClass.create();

        bookworm.entities.addMocks({
            subscribeTo: function (eventName, cachePath, handler) {
                equal(eventName, 'hello', "should pass event name to subscription");
                equal(cachePath.toString(), 'document>foo>bar', "should pass cache path to subscription");
                equal(typeof handler, 'function', "shoudl pass handler to subscription");
            }
        });

        bound.cacheBindings.addMocks({
            addItem: function (bindingSignature, handler) {
                equal(typeof handler, 'function', "should add handler to binding registry");
                equal(bindingSignature, 'foo/bar|hello', "should add handler with correct signature");
            }
        });

        bound._bindToEntity('foo/bar'.toDocumentKey(), 'hello', 'onEntityEvent');

        bookworm.entities.removeMocks();
    });

    test("Internal event unbinder", function () {
        expect(4);

        var bound = BoundClass.create();
        bound._bindToEntity('foo/bar'.toDocumentKey(), 'hello', 'onEntityEvent');

        bookworm.entities.addMocks({
            unsubscribeFrom: function (eventName, cachePath, handler) {
                equal(eventName, 'hello', "should pass event name to unsubsciption");
                equal(cachePath.toString(), 'document>foo>bar', "should pass cache path to unsubscription");
                equal(typeof handler, 'function', "should pass subscribed handler to unsubscription");
            }
        });

        bound.cacheBindings.addMocks({
            removeItem: function (bindingSignature) {
                equal(bindingSignature, 'foo/bar|hello', "should remove handler from bindings");
            }
        });

        bound._unbindFromEntity('foo/bar'.toDocumentKey(), 'hello');

        // attempting to unbind again
        bound.cacheBindings.addMocks({
            getItem: function (bindingSignature) {
                return bindingSignature === 'foo/bar|hello' ?
                    undefined :
                    true;
            }
        });

        bound._unbindFromEntity('foo/bar'.toDocumentKey(), 'hello');

        bookworm.entities.removeMocks();
    });

    test("Bounding tester", function () {
        var bound = BoundClass.create();

        ok(!bound.isBound(), "should return false for instances never bound");

        bound._bindToEntity('foo/bar'.toDocumentKey(), 'hello', 'onEntityEvent');

        ok(bound.isBound(), "should return true for bound instance");

        bound._unbindFromEntity('foo/bar'.toDocumentKey(), 'hello');

        ok(!bound.isBound(), "should return false for previously bound but unbound instance");
    });

    test("Binding to custom entity event", function () {
        expect(5);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal binding");
                equal(eventName, 'baz', "should pass event name to internal binding");
                equal(methodName, 'onEntityEvent', "should pass method name to internal binding");
                equal(discardBubbling, false, "should set to allow capturing bubbling events");
            }
        });

        result = bound.bindToEntity('foo/bar'.toDocumentKey(), 'baz', 'onEntityEvent');

        strictEqual(result, bound, "should be chainable");
    });

    test("Binding to custom entity node event", function () {
        expect(5);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal binding");
                equal(eventName, 'baz', "should pass event name to internal binding");
                equal(methodName, 'onEntityEvent', "should pass method name to internal binding");
                equal(discardBubbling, true, "should not allow capturing bubbling events");
            }
        });

        result = bound.bindToEntityNode('baz', 'foo/bar'.toDocumentKey(), 'onEntityEvent');

        strictEqual(result, bound, "should be chainable");
    });

    test("Unbinding from custom entity event", function () {
        expect(3);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _unbindFromEntity: function (entityKey, eventName) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal unbinding");
                equal(eventName, 'baz', "should pass event name to internal unbinding");
            }
        });

        result = bound.unbindFromEntity('foo/bar'.toDocumentKey(), 'baz');

        strictEqual(result, bound, "should be chainable");
    });

    test("Binding to entity change", function () {
        expect(5);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal binding");
                equal(eventName, flock.ChangeEvent.EVENT_CACHE_CHANGE,
                    "should pass event name to internal binding");
                equal(methodName, 'onEntityEvent', "should pass method name to internal binding");
                equal(discardBubbling, false, "should set to allow capturing bubbling events");
            }
        });

        result = bound.bindToEntityChange('foo/bar'.toDocumentKey(), 'onEntityEvent');

        strictEqual(result, bound, "should be chainable");
    });

    test("Binding to entity node change", function () {
        expect(5);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal binding");
                equal(eventName, flock.ChangeEvent.EVENT_CACHE_CHANGE,
                    "should pass event name to internal binding");
                equal(methodName, 'onEntityEvent', "should pass method name to internal binding");
                equal(discardBubbling, true, "should not allow capturing bubbling events");
            }
        });

        result = bound.bindToEntityNodeChange('foo/bar'.toDocumentKey(), 'onEntityEvent');

        strictEqual(result, bound, "should be chainable");
    });

    test("Binding to entity before-change", function () {
        expect(5);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal binding");
                equal(eventName, flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE,
                    "should pass event name to internal binding");
                equal(methodName, 'onEntityEvent', "should pass method name to internal binding");
                equal(discardBubbling, false, "should set to allow capturing bubbling events");
            }
        });

        result = bound.bindToEntityBeforeChange('foo/bar'.toDocumentKey(), 'onEntityEvent');

        strictEqual(result, bound, "should be chainable");
    });

    test("Binding to entity node before-change", function () {
        expect(5);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal binding");
                equal(eventName, flock.ChangeEvent.EVENT_CACHE_BEFORE_CHANGE,
                    "should pass event name to internal binding");
                equal(methodName, 'onEntityEvent', "should pass method name to internal binding");
                equal(discardBubbling, true, "should not allow capturing bubbling events");
            }
        });

        result = bound.bindToEntityNodeBeforeChange('foo/bar'.toDocumentKey(), 'onEntityEvent');

        strictEqual(result, bound, "should be chainable");
    });

    test("Unbinding from entity change", function () {
        expect(3);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _unbindFromEntity: function (entityKey, eventName) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal unbinding");
                equal(eventName, flock.ChangeEvent.EVENT_CACHE_CHANGE,
                    "should pass event name to internal unbinding");
            }
        });

        result = bound.unbindFromEntityChange('foo/bar'.toDocumentKey());

        strictEqual(result, bound, "Is chainable");

        BoundClass.removeMocks();
    });

    test("Binding to entity access", function () {
        expect(5);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal binding");
                equal(eventName, flock.AccessEvent.EVENT_CACHE_ACCESS,
                    "should pass event name to internal binding");
                equal(methodName, 'onEntityEvent', "should pass method name to internal binding");
                equal(discardBubbling, false, "should set to allow capturing bubbling events");
            }
        });

        result = bound.bindToEntityAccess('foo/bar'.toDocumentKey(), 'onEntityEvent');

        strictEqual(result, bound, "should be chainable");
    });

    test("Binding to entity node access", function () {
        expect(5);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _bindToEntity: function (entityKey, eventName, methodName, discardBubbling) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal binding");
                equal(eventName, flock.AccessEvent.EVENT_CACHE_ACCESS,
                    "should pass event name to internal binding");
                equal(methodName, 'onEntityEvent', "should pass method name to internal binding");
                equal(discardBubbling, true, "should not allow capturing bubbling events");
            }
        });

        result = bound.bindToEntityNodeAccess('foo/bar'.toDocumentKey(), 'onEntityEvent');

        strictEqual(result, bound, "should be chainable");
    });

    test("Unbinding from entity access", function () {
        expect(3);

        var bound = BoundClass.create(),
            result;

        bound.addMocks({
            _unbindFromEntity: function (entityKey, eventName) {
                equal(entityKey.toString(), 'foo/bar', "should pass entity key to internal unbinding");
                equal(eventName, flock.AccessEvent.EVENT_CACHE_ACCESS,
                    "should pass event name to internal unbinding");
            }
        });

        result = bound.unbindFromEntityAccess('foo/bar'.toDocumentKey());

        strictEqual(result, bound, "Is chainable");

        BoundClass.removeMocks();
    });

    test("Unbinding all entity events", function () {
        var bound = BoundClass.create()
                .bindToEntityChange('foo/bar'.toDocumentKey(), 'onEntityEvent')
                .bindToEntityChange('foo/bar/baz'.toFieldKey(), 'onEntityEvent')
                .bindToEntityChange('hello/world'.toDocumentKey(), 'onEntityEvent')
                .bindToEntityAccess('foo/bar'.toDocumentKey(), 'onEntityEvent'),
            keyEventPairs = [],
            result;

        bound.addMocks({
            _unbindFromEntity: function (entityKey, eventName) {
                keyEventPairs.push([entityKey.toString(), eventName]);
            }
        });

        result = bound.unbindAll();

        strictEqual(result, bound, "should be chainable");

        deepEqual(
            keyEventPairs,
            [
                ['foo/bar', flock.ChangeEvent.EVENT_CACHE_CHANGE],
                ['foo/bar/baz', flock.ChangeEvent.EVENT_CACHE_CHANGE],
                ['hello/world', flock.ChangeEvent.EVENT_CACHE_CHANGE],
                ['foo/bar', flock.AccessEvent.EVENT_CACHE_ACCESS]
            ],
            "should unbind from all entity key / event name pairs"
        );
    });

    test("Re-unbinding all entity events", function () {
        expect(1);

        var bound = BoundClass.create();

        bound.addMocks({
            isBound: function () {
                ok(true, "should check whether instance is already bound");
                return false;
            },

            _unbindFromEntity: function () {
                ok(true, "shouldn't unbind from any event");
            }
        });

        bound.unbindAll();
    });
}());
