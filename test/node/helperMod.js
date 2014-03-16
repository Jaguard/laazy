/**
 * helperMod - Helper for lazy loaded modules
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

"use strict";

var helperMod = exports;

helperMod.lazyRequire = function(name) {
	return function() {
		return require(name);
	};
};

helperMod.resolverNamedValue = function(value) {
	return function(name) {
		return name + "-" + value;
	};
};

helperMod.resolverValue = function(value) {
	return function() {
		return value;
	};
};

helperMod.spy = function(fun, callThrough) {
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

helperMod.modulePath = function(mod) {
	try {
		return require.resolve(mod);
	} catch(e) {
		console.error(e);
		return undefined;
	}
};

helperMod.loadedModule = function(mod) {
	return require.cache[helperMod.modulePath(mod)];
};

helperMod.isModuleLoaded = function(mod) {
	return helperMod.loadedModule(mod) !== undefined;
};

helperMod.unloadModule = function(mod) {
	if (helperMod.isModuleLoaded(mod)) {
		delete require.cache[helperMod.modulePath(mod)];
		return true;
	}
	return false;
};

helperMod.reloadModule = function(mod) {
	helperMod.unloadModule(mod);
	return require(mod);
};

helperMod.dumpProjectModules = function() {
	var path = require("path"),
			cwd = process.cwd(),
			projPaths = ["test", "src"].reduce(function(acc, name) {
				acc[path.join(cwd, name)] = true;
				return acc;
			}, {}),
			modulePath, projRoot;
	for (modulePath in require.cache) {
		for (projRoot in projPaths) {
			if (modulePath.indexOf(projRoot) === 0) {
				console.log(modulePath + " => " + require.cache[modulePath].parent.filename);
			}
		}
	}
};
