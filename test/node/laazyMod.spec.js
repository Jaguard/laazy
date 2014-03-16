/**
 * laazyMod.spec - Node.js Jasmine tests for lazy loaded modules
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

/* global describe, it, expect */

"use strict";

var laazy = require("../../src/laazy"),
		helperMod = require("./helperMod");

describe("'laazy' module + requires() ...", function() {
	it("should lazy load Node.js modules", function() {
		var obj = {},
				mod = "./mod",
				laazyMod = "./laazyMod";
		// asssure the modules are unloaded
		helperMod.unloadModule(mod);
		helperMod.unloadModule(laazyMod);
		laazy(helperMod.lazyRequire(mod), obj, "mod");
		expect("mod" in obj).toBe(true);
		// the module should not be loaded yet
		expect(helperMod.isModuleLoaded(mod)).toBe(false);
		expect(helperMod.isModuleLoaded(laazyMod)).toBe(false);
		// access the module, the lazy submod should not be loaded
		expect(obj.mod).toBeDefined();
		expect(helperMod.isModuleLoaded(mod)).toBe(true);
		expect(helperMod.isModuleLoaded(laazyMod)).toBe(false);
		expect(obj.mod.laazyMod).toBeDefined();
		expect(helperMod.isModuleLoaded(laazyMod)).toBe(true);
		helperMod.dumpProjectModules();
	});
});
