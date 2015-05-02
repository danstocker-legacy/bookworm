/*global dessert, troop, sntls, evan, bookworm */
/*global module, test, expect, ok, raises, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual */
(function () {
    "use strict";

    module("EntityChangeEvent");

    test("Instantiation", function () {
        var eventSpace = evan.EventSpace.create(),
            event = /** @type {bookworm.EntityChangeEvent} */ bookworm.EntityChangeEvent.create(
                'foo',
                eventSpace);

        equal(typeof event.beforeNode, 'undefined', "should set before value to undefined");
        equal(typeof event.afterNode, 'undefined', "should set After value is not defined");
    });

    test("Conversion from Event", function () {
        var event;

        event = evan.Event.create('foo.bar', evan.EventSpace.create());
        ok(!bookworm.EntityChangeEvent.isBaseOf(event),
            "should not return EntityChangeEvent instance for non-matching event names");

        event = evan.Event.create('bookworm.entity.change.foo', evan.EventSpace.create());
        ok(bookworm.EntityChangeEvent.isBaseOf(event),
            "should return EntityChangeEvent instance for matching event name");
    });

    test("Spawning event", function () {
        var eventSpace = bookworm.entityEventSpace.create(),
            event = eventSpace.spawnEvent('bookworm.entity.change.foo');

        ok(bookworm.EntityChangeEvent.isBaseOf(event), "should return EntityChangeEvent instance");
    });

    test("Cloning", function () {
        var eventSpace = evan.EventSpace.create(),
            originalEvent = eventSpace.spawnEvent('bookworm.entity.change')
                .setBeforeNode('foo')
                .setAfterNode('bar'),
            cloneEvent = originalEvent.clone('foo>bar>baz'.toPath());

        ok(cloneEvent.isA(bookworm.EntityChangeEvent), "should return EntityChangeEvent instance");
        equal(originalEvent.beforeNode, 'foo', "should set beforeNode on clone");
        equal(originalEvent.afterNode, 'bar', "should set afterNode on clone");
    });

    test("Before node setter", function () {
        var eventSpace = evan.EventSpace.create(),
            event = eventSpace.spawnEvent('bookworm.entity.change');

        strictEqual(event.setBeforeNode('foo'), event, "should be chainable");
        equal(event.beforeNode, 'foo', "should set beforeNode property");
    });

    test("After node setter", function () {
        var eventSpace = evan.EventSpace.create(),
            event = eventSpace.spawnEvent('bookworm.entity.change');

        strictEqual(event.setAfterNode('foo'), event, "should be chainable");
        equal(event.afterNode, 'foo', "should set afterNode property");
    });

        test("Insertion tester", function () {
            var eventSpace = evan.EventSpace.create(),
                entityChangeEvent;

            entityChangeEvent = eventSpace.spawnEvent('bookworm.entity.change');
            ok(!entityChangeEvent.isInsert(),
                "should return false when neither beforeNode nor afterNode is set");

            entityChangeEvent = eventSpace.spawnEvent('bookworm.entity.change')
                .setBeforeNode('foo');
            ok(!entityChangeEvent.isInsert(),
                "should return false when beforeNode is set");

            entityChangeEvent = eventSpace.spawnEvent('bookworm.entity.change')
                .setAfterNode('bar');
            ok(entityChangeEvent.isInsert(),
                "should return true when only afterNode is set");

            entityChangeEvent = eventSpace.spawnEvent('bookworm.entity.change')
                .setBeforeNode('foo')
                .setAfterNode('bar');
            ok(!entityChangeEvent.isInsert(),
                "should return false when both beforeNode and afterNode are set");
        });

        test("Deletion tester", function () {
            var eventSpace = evan.EventSpace.create(),
                entityChangeEvent;

            entityChangeEvent = eventSpace.spawnEvent('bookworm.entity.change');
            ok(!entityChangeEvent.isDelete(),
                "should return false when neither beforeNode nor afterNode is set");

            entityChangeEvent = eventSpace.spawnEvent('bookworm.entity.change')
                .setBeforeNode('foo');
            ok(entityChangeEvent.isDelete(),
                "should return true when only beforeNode is set");

            entityChangeEvent = eventSpace.spawnEvent('bookworm.entity.change')
                .setAfterNode('bar');
            ok(!entityChangeEvent.isDelete(),
                "should return false when only afterNode is set");

            entityChangeEvent = eventSpace.spawnEvent('bookworm.entity.change')
                .setBeforeNode('foo')
                .setAfterNode('bar');
            ok(!entityChangeEvent.isDelete(),
                "should return false when both beforeNode and afterNode are set");
        });
}());
