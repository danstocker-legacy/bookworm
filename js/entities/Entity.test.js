/*global dessert, troop, sntls, flock, bookworm */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity");

    test("Instantiation", function () {
        var entityKey = 'foo/bar'.toDocumentKey(),
            entity = bookworm.Entity.create(entityKey);

        strictEqual(entity.entityKey, entityKey, "should set entity key");
    });

    test("Node getter", function () {
        var entity = bookworm.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            paths = [];

        bookworm.documents.addMocks({
            getNode: function (path) {
                paths.push(path.toString());
                return entityNode;
            }
        });

        strictEqual(entity.getNode(), entityNode, "should return node retrieved from cache");
        entity.getNode('baz');

        bookworm.documents.removeMocks();

        deepEqual(paths, [
            'foo>bar',
            'foo>bar>baz'
        ], "should append extra arguments to cache path");
    });

    test("Hash node getter", function () {
        expect(3);

        var entity = bookworm.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            result;

        bookworm.Entity.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'hello', 1: 'world'}, "should pass extra arguments to node getter");
                return entityNode;
            }
        });

        result = entity.getNodeAsHash('hello', 'world');

        bookworm.Entity.removeMocks();

        ok(result.isA(sntls.Hash), "should return Hash instance");
        strictEqual(result.items, entityNode, "should return Hash with entity node inside");
    });

    test("Silent node getter", function () {
        expect(3);

        var entity = bookworm.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {};

        sntls.Tree.addMocks({
            getNode: function (path) {
                strictEqual(this, bookworm.documents, "should fetch node from ");
                equal(path.toString(), 'foo>bar>baz', "should call Tree node getter with appended path");
                return entityNode;
            }
        });

        strictEqual(entity.getSilentNode('baz'), entityNode, "should return node retrieved from cache");

        sntls.Tree.removeMocks();
    });

    test("Silent Hash node getter", function () {
        expect(3);

        var entity = bookworm.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            result;

        bookworm.Entity.addMocks({
            getSilentNode: function () {
                deepEqual(arguments, {0: 'hello', 1: 'world'}, "should pass extra arguments to silent node getter");
                return entityNode;
            }
        });

        result = entity.getSilentNodeAsHash('hello', 'world');

        bookworm.Entity.removeMocks();

        ok(result.isA(sntls.Hash), "should return Hash instance");
        strictEqual(result.items, entityNode, "should return Hash with entity node inside");
    });

    test("Entity node tester", function () {
        expect(2);

        var entity = bookworm.Entity.create('foo/bar'.toDocumentKey());

        bookworm.Entity.addMocks({
            getNode: function () {
                ok(true, "should call node setter");
            }
        });

        strictEqual(entity.touchNode(), entity, "should be chainable");

        bookworm.Entity.removeMocks();
    });

    test("Node setter", function () {
        expect(3);

        var entity = bookworm.Entity.create('foo/bar'.toDocumentKey());

        bookworm.documents.addMocks({
            setNode: function (path, value) {
                equal(path.toString(), 'foo>bar>world', "should set node in cache on the entity's extended path");
                equal(value, 'hello', "should set correct value in cache");
            }
        });

        strictEqual(entity.setNode('hello', 'world'), entity, "should be chainable");

        bookworm.documents.removeMocks();
    });
}());
