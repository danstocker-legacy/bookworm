/*global dessert, troop, sntls, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Item");

    test("Instantiation", function () {
        raises(function () {
            bookworm.Item.create();
        }, "should raise exception on missing item key argument");

        raises(function () {
            bookworm.Item.create('foo/bar/baz'.toFieldKey());
        }, "should raise exception on invalid item key argument");
    });

    test("Conversion from String", function () {
        var item = 'foo/bar/baz/hello'.toItem();

        ok(item.isA(bookworm.Item), "should return Item instance");
        equal(item.entityKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Conversion from Array", function () {
        var item = ['foo', 'bar', 'baz', 'hello'].toItem();

        ok(item.isA(bookworm.Item), "should return Item instance");
        equal(item.entityKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Conversion from ItemKey", function () {
        var itemKey = ['foo', 'bar', 'baz', 'hello'].toItemKey(),
            item = itemKey.toItem();

        ok(item.isA(bookworm.Item), "should return Item instance");
        equal(item.entityKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Entity surrogate", function () {
        var entity;

        entity = bookworm.Entity.create('foo/bar/baz/0'.toItemKey());
        ok(entity.isA(bookworm.Item), "should return Item instance for ItemKey");
        equal(entity.entityKey.toString(), 'foo/bar/baz/0', "should set correct key");

        entity = bookworm.Entity.create('foo/bar/baz/hello\\/world'.toReferenceItemKey());
        ok(entity.isA(bookworm.Item), "should return Item instance for ReferenceItemKey");
    });

    test("Conversion from EntityKey", function () {
        var itemKey = ['foo', 'bar', 'baz', 'hello'].toItemKey(),
            item = itemKey.toEntity();

        ok(item.isA(bookworm.Item), "should return Item instance");
        equal(item.entityKey.toString(), 'foo/bar/baz/hello', "should set item key");
    });

    test("Parent entity getter", function () {
        var item = ['foo', 'bar', 'baz', 'hello'].toItem(),
            parentEntity = item.getParentEntity(),
            itemsEntity = item.entityKey.getFieldKey().toField().getValueEntity();

        ok(parentEntity.isA(bookworm.Entity), "should return an Entity instance");
        ok(parentEntity.entityKey.equals(itemsEntity.entityKey),
            "should return associated items entity");
    });

    test("Node replacement", function () {
        expect(5);

        'foo/bar'.toDocument().setNode({
            collection: {
                baz: 'BAZ'
            }
        });

        var fieldKey = 'foo/bar/collection'.toFieldKey(),
            itemKey = fieldKey.getItemKey('baz'),
            item = itemKey.toEntity();

        function onFieldChange (event) {
            deepEqual(event.beforeNode, {
                baz: 'BAZ'
            }, "should set correct beforeNode on event");
            deepEqual(event.afterNode, {
                baz: 'QUX'
            }, "should set correct afterNode on event");
            ok(event.affectedKey.equals(itemKey), "should set affectedKey on event");
        }

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                ok(this.equals('foo/bar/collection'.toFieldKey()), "should fetch parent field's type");
                return 'collection';
            }
        });

        fieldKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_CHANGE, onFieldChange);

        strictEqual(item.setNode("QUX"), item, "should be chainable");

        bookworm.FieldKey.removeMocks();

        fieldKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_CHANGE, onFieldChange);
    });

    test("Node addition", function () {
        expect(5);

        'foo/bar'.toDocument().setNode({
            collection: {
                baz: 'BAZ'
            }
        });

        var fieldKey = 'foo/bar/collection'.toFieldKey(),
            itemKey = fieldKey.getItemKey('qux'),
            item = itemKey.toEntity();

        function onFieldChange (event) {
            deepEqual(event.beforeNode, {
                baz: 'BAZ'
            }, "should set correct beforeNode on event");
            deepEqual(event.afterNode, {
                baz: 'BAZ',
                qux: 'QUX'
            }, "should set correct afterNode on event");
            ok(event.affectedKey.equals(itemKey), "should set affectedKey on event");
        }

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                ok(this.equals('foo/bar/collection'.toFieldKey()), "should fetch parent field's type");
                return 'collection';
            }
        });

        fieldKey.subscribeTo(bookworm.Entity.EVENT_ENTITY_CHANGE, onFieldChange);

        strictEqual(item.setNode("QUX"), item, "should be chainable");

        bookworm.FieldKey.removeMocks();

        fieldKey.unsubscribeFrom(bookworm.Entity.EVENT_ENTITY_CHANGE, onFieldChange);
    });
}());
