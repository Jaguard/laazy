/**
 * laazy.spec - Jasmine tests for laazy compatible with (AMD/RequireJS, CommonJS/Node.js, browser)
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
		root.laazy_spec = _module.exports;
	}
}(this, function(require) {
	/* global describe, it, expect, beforeEach */

	"use strict";

	var laazy = require("../src/laazy"),
			helper = require("./helper");

	describe("'laazy' module", function() {
		var obj;

		beforeEach(function() {
			obj = {};
		});

		describe("lazzy function ...", function() {
			it("has 3 params", function() {
				expect(typeof laazy).toBe("function");
				expect(laazy.length).toBe(3);
			});
			it("should create a curried function if invoked with one param", function() {
				var laazy1 = laazy(helper.resolverValue("jaguard"));
				expect(typeof laazy1).toBe("function");
				expect(laazy1.length).toBe(2);
				laazy1(obj, ["p1", "p2"]);
				expect("p1" in obj).toBe(true);
				expect("p2" in obj).toBe(true);
				expect(Object.keys(obj).length).toBe(2);
			});
			it("should create a curried function if invoked with two params", function() {
				var laazy2 = laazy(helper.resolverValue("jaguard"), obj);
				expect(typeof laazy2).toBe("function");
				expect(laazy2.length).toBe(1);
				laazy2(["p1", "p2"]);
				expect("p1" in obj).toBe(true);
				expect("p2" in obj).toBe(true);
				expect(Object.keys(obj).length).toBe(2);
			});
		});

		describe("function 'property' parameter can be ...", function() {
			it("a string (string param)", function() {
				laazy(helper.resolverValue("jaguard"), obj, "name");
				expect("name" in obj).toBe(true);
				expect(obj.name).toBe("jaguard");
			});
			it("an array of strings (array param)", function() {
				laazy(helper.resolverValue(1), obj, ["p1", "p2"]);
				expect("p1" in obj).toBe(true);
				expect("p2" in obj).toBe(true);
				expect(Object.keys(obj).length).toBe(2);
			});
		});

		describe("function 'owner' parameter can be ...", function() {
			it("an object (object param)", function() {
				laazy(helper.resolverValue("jaguard"), obj, "name");
				expect("name" in obj).toBe(true);
				expect(obj.name).toBe("jaguard");
			});
			it("an array of objects (array param)", function() {
				var other = {};
				laazy(helper.resolverValue(1), [obj, other], ["p1", "p2"]);
				expect("p1" in obj).toBe(true);
				expect("p2" in obj).toBe(true);
				expect("p1" in other).toBe(true);
				expect("p2" in other).toBe(true);
				expect(Object.keys(obj).length).toBe(2);
				expect(Object.keys(other).length).toBe(2);
			});
		});

		describe("resolvers ...", function() {
			it("should resolve values", function() {
				laazy(helper.resolverNamedValue("X"), obj, ["p1", "p2"]);
				expect(obj.p1).toBe("p1-X");
				expect(obj.p2).toBe("p2-X");
			});
			it("should resolve functions", function() {
				laazy(helper.resolverValue(function() {}), obj, "f");
				expect(helper.isFunction(obj.f)).toBe(true);
			});
			it("should call functions", function() {
				laazy(helper.resolverValue(function(val) {
					return val;
				}), obj, "echo");
				expect(obj.echo("jaguard")).toBe("jaguard");
			});
			it("while resolved, values will be identical to the resolved value", function() {
				laazy(helper.resolverValue(obj), obj, "same");
				// different access will return the same value
				expect(obj.same).toBe(obj);
				expect(obj.same).toBe(obj);
			});
			it("should be called just one time when resolved", function() {
				var spy = helper.spy(helper.resolverValue("jaguard"));
				laazy(spy, obj, "name");
				expect("name" in obj).toBe(true);
				expect(spy).not.toHaveBeenCalled();
				expect(obj.name).toBe("jaguard");
				expect(obj.name).toBe("jaguard");
				expect(obj.name).toBe("jaguard");
				expect(spy.invocations()).toBe(1);
			});
			it("should lazily resolve values", function() {
				var spy = helper.spy(helper.resolverNamedValue(0));
				laazy(spy, obj, ["p2", "p1"]);
				// force iteration
				expect("p1" in obj).toBe(true);
				expect("p2" in obj).toBe(true);
				expect(helper.hasOwnProperties(obj)).toBe(true);
				expect(spy).not.toHaveBeenCalled();
				expect(obj.p1).toBe("p1-0");
				expect(obj.p1).toBe("p1-0");
				expect(spy.invocations()).toBe(1);
				expect(obj.p2).toBe("p2-0");
				expect(obj.p2).toBe("p2-0");
				expect(spy.invocations()).toBe(2);
				spy.reset();
				expect(obj.p1).toBeDefined();
				expect(obj.p2).toBeDefined();
				expect(spy).not.toHaveBeenCalled();
			});
			it("should lazily resolve functions without invocation", function() {
				var echo = function(param) {
							return param;
						},
						spy = helper.spy(helper.resolverValue(echo));
				laazy(spy, obj, "echo");
				// force iteration
				expect("echo" in obj).toBe(true);
				expect(helper.hasOwnProperties(obj)).toBe(true);
				expect(spy).not.toHaveBeenCalled();
				expect(helper.isFunction(obj.echo)).toBe(true);
				expect(obj.echo).toBeDefined();
				expect(obj.echo).toBe(echo);
				// the resolver should be invocked just one time
				expect(spy).toHaveBeenCalled();
				expect(spy.invocations()).toBe(1);
			});
			it("should lazily call functions", function() {
				var echo = function(param) {
							return param;
						},
						spied = helper.spy(echo),
						spy = helper.spy(helper.resolverValue(spied));
				laazy(spy, obj, "echo");
				// force iteration
				expect("echo" in obj).toBe(true);
				expect(helper.hasOwnProperties(obj)).toBe(true);
				expect(spy).not.toHaveBeenCalled();
				expect(spied).not.toHaveBeenCalled();
				expect(helper.isFunction(obj.echo)).toBe(true);
				expect(spy).toHaveBeenCalled();
				// the resolver should be invocked just one time
				expect(spy.invocations()).toBe(1);
				expect(spied).not.toHaveBeenCalled();
				// explicitelly invoked
				expect(obj.echo(1)).toBe(1);
				expect(spied.invocations()).toBe(1);
				expect(spy.invocations()).toBe(1);
				expect(obj.echo(2)).toBe(2);
				expect(spied.invocations()).toBe(2);
			});
		});

		describe("delegate resolver ...", function() {
			it("is a function with 1 param", function() {
				expect(typeof laazy.delegate).toBe("function");
				expect(laazy.delegate.length).toBe(1);
			});
			it("should return a function with 1 param (owner ommited)", function() {
				var resolver = laazy.delegate(obj);
				expect(typeof resolver).toBe("function");
				expect(resolver.length).toBe(1);
			});
			it("should return the property from the delegate", function() {
				var delegate = laazy.delegate({ p1: "v1", p2: "v2" });
				laazy(delegate, obj, ["p1", "p2"]);
				// different access will return the same value
				expect(obj.p1).toBe("v1");
				expect(obj.p2).toBe("v2");
			});
		});
	});
}));
