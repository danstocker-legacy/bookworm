/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespaces.js',
            'js/EntityKey.js',
            'js/DocumentKey.js',
            'js/exports.js'
        ],

        test: [
            'js/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true,
            evan   : true,
            flock  : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
