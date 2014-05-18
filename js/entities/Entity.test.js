/*global dessert, troop, sntls, flock, dache */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity");

    test("Instantiation", function () {
        var entityKey = 'foo/bar'.toDocumentKey(),
            entity = dache.Entity.create(entityKey);

        strictEqual(entity.entityKey, entityKey, "should set entity key");
    });

    test("Node getter", function () {
        var entity = dache.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            paths = [];

        dache.documents.addMocks({
            getNode: function (path) {
                paths.push(path.toString());
                return entityNode;
            }
        });

        strictEqual(entity.getNode(), entityNode, "should return node retrieved from cache");
        entity.getNode('baz');

        dache.documents.removeMocks();

        deepEqual(paths, [
            'foo>bar',
            'foo>bar>baz'
        ], "should append extra arguments to cache path");
    });

    test("Hash node getter", function () {
        expect(3);

        var entity = dache.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            result;

        dache.Entity.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'hello', 1: 'world'}, "should pass extra arguments to node getter");
                return entityNode;
            }
        });

        result = entity.getNodeAsHash('hello', 'world');

        dache.Entity.removeMocks();

        ok(result.isA(sntls.Hash), "should return Hash instance");
        strictEqual(result.items, entityNode, "should return Hash with entity node inside");
    });

    test("Silent node getter", function () {
        expect(3);

        var entity = dache.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {};

        sntls.Tree.addMocks({
            getNode: function (path) {
                strictEqual(this, dache.documents, "should fetch node from ");
                equal(path.toString(), 'foo>bar>baz', "should call Tree node getter with appended path");
                return entityNode;
            }
        });

        strictEqual(entity.getSilentNode('baz'), entityNode, "should return node retrieved from cache");

        sntls.Tree.removeMocks();
    });

    test("Silent Hash node getter", function () {
        expect(3);

        var entity = dache.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            result;

        dache.Entity.addMocks({
            getSilentNode: function () {
                deepEqual(arguments, {0: 'hello', 1: 'world'}, "should pass extra arguments to silent node getter");
                return entityNode;
            }
        });

        result = entity.getSilentNodeAsHash('hello', 'world');

        dache.Entity.removeMocks();

        ok(result.isA(sntls.Hash), "should return Hash instance");
        strictEqual(result.items, entityNode, "should return Hash with entity node inside");
    });

    test("Entity node tester", function () {
        expect(2);

        var entity = dache.Entity.create('foo/bar'.toDocumentKey());

        dache.Entity.addMocks({
            getNode: function () {
                ok(true, "should call node setter");
            }
        });

        strictEqual(entity.touchNode(), entity, "should be chainable");

        dache.Entity.removeMocks();
    });

    test("Node setter", function () {
        expect(3);

        var entity = dache.Entity.create('foo/bar'.toDocumentKey());

        dache.documents.addMocks({
            setNode: function (path, value) {
                equal(path.toString(), 'foo>bar>world', "should set node in cache on the entity's extended path");
                equal(value, 'hello', "should set correct value in cache");
            }
        });

        strictEqual(entity.setNode('hello', 'world'), entity, "should be chainable");

        dache.documents.removeMocks();
    });
}());
