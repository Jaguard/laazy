/**
 * runtime.requirejs - RequireJS configuration for Karma runner
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

"use strict";

/* global window, requirejs */

var karma = window.__karma__,
		log = console.debug;

// override scripts loading, show RequireJS version
function hookRequireJS() {
	var $load = requirejs.load;
	log("Karma runtime: RequireJS v" + requirejs.version);
	requirejs.load = function(context, moduleId, url) {
		log("Loading module '" + moduleId + "' from '" + url + "'");
		return $load(context, moduleId, url);
	};
	// define resource loaded hook
	requirejs.onResourceLoad = function(context, map, depMaps) {
		function depInfo(map) {
			var specials = /* jshint -W015 */ {
						require: true,
						module: true,
						exports: true
					},
					res = {
						id: map.id
					},
					index;
			if (Array.isArray(map)) {
				res = [];
				for (index in map) {
					res.push(depInfo(map[index]));
				}
			} else if (!specials[map.name]) {
				if (map.prefix) {
					res.prefix = map.prefix;
				}
				res.name = map.name;
				res.originalName = map.originalName;
				res.url = map.url;
				if (map.parentMap) {
					res.parent = map.parentMap.id;
				}
			}
			return res;
		}
		log("Module loaded: ", depInfo(map), " with " + depMaps.length + " dependencies:", depInfo(depMaps));
	};
}

// collect all spec/test files
function collectSpecs(karma) {
	var specs = [],
			SPEC_REX = /\.spec\.js$/,
			SPEC_MODULE = /^\/base\/(.+).js$/,
			file;
	// select specs
	for (file in karma.files) {
		if (SPEC_REX.test(file)) {
			specs.push(file.match(SPEC_MODULE)[1]);
		}
	}
	log("Test/spec modules [" + specs.length + "]", specs);
	return specs;
}

// hook RequireJS
hookRequireJS();
// collect test/specs, store them in karma global as well
karma.specs = collectSpecs(karma);

// Configure RequireJS to load all tests as dependencies (http://requirejs.org/docs/api.html#config)
requirejs.config({
	// Karma serves files from "/base"
	baseUrl: "/base",
	waitSeconds: 15, // for debug make it bigger
	enforceDefine: true, // assure all modules use define or are shims
	// load all tests as RequireJS dependencies
	deps: karma.specs,
	// start the tests using Karma
	callback: function() {
		log("Start Karma for [" + arguments.length + "] modules!");
		karma.start();
	}
});
