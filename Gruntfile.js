/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/globals/entityEventSpace.js',
            'js/cache/config.js',
            'js/cache/entities.js',
            'js/cache/index.js',
            'js/events/EntityChangeEvent.js',
            'js/keys/EntityKey.js',
            'js/keys/DocumentKey.js',
            'js/keys/DocumentKeyCollection.js',
            'js/keys/FieldKey.js',
            'js/keys/ItemKey.js',
            'js/keys/ReferenceItemKey.js',
            'js/entities/Entity.js',
            'js/entities/Document.js',
            'js/entities/Field.js',
            'js/entities/CollectionField.js',
            'js/entities/OrderedCollectionField.js',
            'js/entities/Item.js',
            'js/binding/EntityBound.js',
            'js/exports.js'
        ],

        test: [
            'js/keys/jsTestDriver.conf',
            'js/entities/jsTestDriver.conf',
            'js/events/jsTestDriver.conf',
            'js/binding/jsTestDriver.conf'
        ],

        globals: {
            dessert   : true,
            troop     : true,
            sntls     : true,
            evan      : true,
            rubberband: true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
