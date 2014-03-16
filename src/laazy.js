/**
 * laazy - inject lazy properties that are calculated on demand (just when accessed) into any object
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.0.1
 * @version 0.0.1
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
		root.laazy = _module.exports;
	}
}(this, function(require, exports, module) {
	"use strict";

	function getter(owner, name, resolver) {
		return function() {
			var result = resolver(name, owner);
			delete owner[name];
			owner[name] = result;
			return result;
		};
	}

	function laazyfier(resolver, owner, prop) {
		var props = Array.isArray(prop) ? prop : [prop],
				owners = Array.isArray(owner) ? owner : [owner],
				indexp, indexo;
		for (indexp in props) {
			prop = props[indexp];
			for (indexo in owners) {
				owner = owners[indexo];
				Object.defineProperty(owner, prop, {
					enumerable: true,
					configurable: true,
					get: getter(owner, prop, resolver)
				});
			}
		}
		return laazy;
	}

	function laazy(resolver, owner, prop) {
		// curry the first and second params
		switch(arguments.length) {
			case 1:
				return function(lowner, lprop) {
					laazyfier(resolver, lowner, lprop);
				};
			case 2:
				return function(lprop) {
					laazyfier(resolver, owner, lprop);
				};
			case 3:
				laazyfier(resolver, owner, prop);
				break;
		}
	}

	// delegate resolver -> return a resolver delegating the property reading from the delegate
	laazy.delegate = function(delegate) {
		return function(name) {
			return delegate[name];
		};
	};

	// exports laazy
	module.exports = laazy;
}));
