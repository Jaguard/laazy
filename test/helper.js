/**
 * helper - Helper module defining utility functions
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

// Wrapped under IIF for different environments (RequireJS/AMD, Node.js/CommonJS, browser) using CommonJS convension: http://requirejs.org/docs/commonjs.html
(function(root, factory) {
	"use strict";

	/* global define, exports, module */
	if ((typeof define === "function") && define.amd) {
		// define as an RequireJS/AMD module
		define(factory);
	} else if (typeof exports === "object") {
		// execute under Node.js/CommonJS environment
		factory(require, exports, module);
	} else {
		// export under the root/window/browser, will mock the require() (or use root/window.$require_resolver if exists), module and exports
		var _module = { exports: {} },
			_require = root.$require_resolver || function(name) {
				return root[name];
			};
		factory(_require, _module.exports, _module);
		// register the exports under root
		root.helper = _module.exports;
	}
}(this, function(require, exports) {
	"use strict";

	var helper = exports;

	helper.isString = function(obj) {
		return typeof obj === "string";
	};

	helper.isFunction = function(obj) {
		return typeof obj === "function";
	};

	helper.hasOwnProperties = function(obj) {
		var prop;
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return true;
			}
		}
		return false;
	};

	helper.resolverNamedValue = function(value) {
		return function(name) {
			return name + "-" + value;
		};
	};

	helper.resolverValue = function(value) {
		return function() {
			return value;
		};
	};

	helper.spy = function(fun, callThrough) {
		/* global spyOn */
		var spy = spyOn({ fun: fun }, "fun");
		// add invocations() method to return number of calls
		spy.invocations = function() {
			return spy.calls.length;
		};
		// add reset() to reset number of calls
		spy.reset = function() {
			spy.calls = [];
			spy.callCount = 0;
			spy.wasCalled = false;
			spy.argsForCall = [];
			spy.mostRecentCall = {};
		};
		if (callThrough !== false) {
			spy.andCallThrough();
		}
		return spy;
	};

}));
