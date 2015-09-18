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
        expect(4);

        'foo/bar'.toDocument().setNode({
            collection: {
                baz: 'BAZ'
            }
        });

        var item = 'foo/bar/collection/baz'.toItem();

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                ok(this.equals('foo/bar/collection'.toFieldKey()), "should fetch parent field's type");
                return 'collection';
            }
        });

        bookworm.Entity.addMocks({
            setNode: function (node) {
                ok(this.entityKey.equals('foo/bar/collection/baz'.toItemKey()), "should replace item node");
                equal(node, "QUX", "should pass item value to setter");
            }
        });

        strictEqual(item.setNode("QUX"), item, "should be chainable");

        bookworm.FieldKey.removeMocks();
        bookworm.Entity.removeMocks();
    });

    test("Node addition", function () {
        expect(4);

        'foo/bar'.toDocument().setNode({
            collection: {
                baz: 'BAZ'
            }
        });

        var item = 'foo/bar/collection/qux'.toItem();

        bookworm.FieldKey.addMocks({
            getFieldType: function () {
                ok(this.equals('foo/bar/collection'.toFieldKey()), "should fetch parent field's type");
                return 'collection';
            }
        });

        bookworm.Entity.addMocks({
            appendNode: function (node) {
                ok(this.entityKey.equals('foo/bar/collection/qux'.toItemKey()), "should append collection node");
                deepEqual(node, {
                    qux: "QUX"
                }, "should pass items node to setter");
            }
        });

        strictEqual(item.setNode("QUX"), item, "should be chainable");

        bookworm.FieldKey.removeMocks();
        bookworm.Entity.removeMocks();
    });
}());
