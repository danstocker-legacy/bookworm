/*global dessert, troop, sntls, flock, b$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Entity");

    test("Instantiation", function () {
        var entityKey = 'foo/bar'.toDocumentKey(),
            entity = b$.Entity.create(entityKey);

        strictEqual(entity.entityKey, entityKey, "should set entity key");
    });

    test("Node getter", function () {
        var entity = b$.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            paths = [];

        b$.entities.addMocks({
            getNode: function (path) {
                paths.push(path.toString());
                return entityNode;
            }
        });

        strictEqual(entity.getNode(), entityNode, "should return node retrieved from cache");
        entity.getNode('baz');

        b$.entities.removeMocks();

        deepEqual(paths, [
            'document>foo>bar',
            'document>foo>bar>baz'
        ], "should append extra arguments to cache path");
    });

    test("Hash node getter", function () {
        expect(3);

        var entity = b$.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            result;

        b$.Entity.addMocks({
            getNode: function () {
                deepEqual(arguments, {0: 'hello', 1: 'world'}, "should pass extra arguments to node getter");
                return entityNode;
            }
        });

        result = entity.getNodeAsHash('hello', 'world');

        b$.Entity.removeMocks();

        ok(result.isA(sntls.Hash), "should return Hash instance");
        strictEqual(result.items, entityNode, "should return Hash with entity node inside");
    });

    test("Silent node getter", function () {
        expect(3);

        var entity = b$.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {};

        sntls.Tree.addMocks({
            getNode: function (path) {
                strictEqual(this, b$.entities, "should fetch node from ");
                equal(path.toString(), 'document>foo>bar>baz', "should call Tree node getter with appended path");
                return entityNode;
            }
        });

        strictEqual(entity.getSilentNode('baz'), entityNode, "should return node retrieved from cache");

        sntls.Tree.removeMocks();
    });

    test("Silent Hash node getter", function () {
        expect(3);

        var entity = b$.Entity.create('foo/bar'.toDocumentKey()),
            entityNode = {},
            result;

        b$.Entity.addMocks({
            getSilentNode: function () {
                deepEqual(arguments, {0: 'hello', 1: 'world'}, "should pass extra arguments to silent node getter");
                return entityNode;
            }
        });

        result = entity.getSilentNodeAsHash('hello', 'world');

        b$.Entity.removeMocks();

        ok(result.isA(sntls.Hash), "should return Hash instance");
        strictEqual(result.items, entityNode, "should return Hash with entity node inside");
    });

    test("Entity node tester", function () {
        expect(2);

        var entity = b$.Entity.create('foo/bar'.toDocumentKey());

        b$.Entity.addMocks({
            getNode: function () {
                ok(true, "should call node setter");
            }
        });

        strictEqual(entity.touchNode(), entity, "should be chainable");

        b$.Entity.removeMocks();
    });

    test("Node setter", function () {
        expect(3);

        var entity = b$.Entity.create('foo/bar'.toDocumentKey());

        b$.entities.addMocks({
            setNode: function (path, value) {
                equal(path.toString(), 'document>foo>bar>world', "should set node in cache on the entity's extended path");
                equal(value, 'hello', "should set correct value in cache");
            }
        });

        strictEqual(entity.setNode('hello', 'world'), entity, "should be chainable");

        b$.entities.removeMocks();
    });

    test("Node removal", function () {
        expect(2);

        var entity = b$.Entity.create('foo/bar'.toDocumentKey());

        b$.entities.addMocks({
            unsetKey: function (path) {
                equal(path.toString(), 'document>foo>bar>world', "should remove key from cache at the entity's extended path");
            }
        });

        strictEqual(entity.unsetKey('world'), entity, "should be chainable");

        b$.entities.removeMocks();
    });
}());
