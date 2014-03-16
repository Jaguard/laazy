/**
 * karma.files - Define Karma files for global (non-RequireJS) in specified order
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

"use strict";

module.exports = [
	// add runtime config for global resolver
	"test/karma/runtime.js",
	// include dependencies in proper order
	// ex: "bower_components/**/*.js",
	// add src classes in proper order
	"src/laazy.js",
	// add tests helpers in proper order
	"test/helper.js",
	// add tests specs in any order
	"test/**/*.spec.js"
];
