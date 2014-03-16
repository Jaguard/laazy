/**
 * runtime - Global (non RequireJS) configuration for Karma runner
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

"use strict";

/* global window */

var karma = window.__karma__,
		log = console.debug;

// hook global $require_resolver
function hookRequireResolver() {
	log("Karma runtime: Global/Window");
	// define global require resolver
	window.$require_resolver = function(name) {
		name = name.substring(name.lastIndexOf("/") + 1);
		name = name.replace(".", "_");
		log("Require: " + name);
		return window[name];
	};
}

// collect all spec/test files
function collectSpecs(karma) {
	var specs = [],
			SPEC_REX = /\.spec\.js$/,
			SPEC_MODULE = /^\/base\/(.+)$/,
			file;
	// select specs
	for (file in karma.files) {
		if (SPEC_REX.test(file)) {
			specs.push(file.match(SPEC_MODULE)[1]);
		}
	}
	log("Test/spec scripts [" + specs.length + "]", specs);
	return specs;
}

// hook global $require_resolver into window
hookRequireResolver();
// collect test/specs, store them in karma global as well
karma.specs = collectSpecs(karma);
