/**
 * mod - Test module loading a lazy module
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

"use strict";

var laazy = require("../../src/laazy"),
		helperMod = require("./helperMod"),
		mod = exports;

// static exports
mod.static = "value";
laazy(helperMod.lazyRequire("./laazyMod"), mod, "laazyMod");
