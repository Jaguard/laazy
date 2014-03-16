/**
 * karma.config - Karma configuration that works both for RequireJS and Global/Browser/non-RequireJS tests with JUnit, Code Coverage/Cobertura and BrowserStack support
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

"use strict";

var	gutil = require("gulp-util"),
		log = gutil.log,
		args = gutil.env,
		env = process.env,
		colors = gutil.colors;

// populate extras configuration
function populateExtras(karmaConfig) {
	var bs_user, bs_key,
			extras = karmaConfig.extras = {};
	// JUnit enablement (using --junit on CLI)
	if (args.junit) {
		extras.junit = true;
	}
	// code coverage enablement (using --cc on CLI)
	if (args.cc) {
		extras.cc = true;
	}
	// RequireJS mode, by default true (disable with --no-requirejs in CLI)
	extras.requirejs = args.requirejs !== false;
	// colors mode, by default true (disable with --no-color in CLI)
	extras.colors = args.color !== false;
	// force/detect CI server
	if (args.ci || env.CI || env.HUDSON || env.JENKINS) {
		extras.ci = true;
		// force junit
		extras.junit = true;
		// force code coverage
		extras.cc = true;
	}
	// set browsers
	if (args.browsers) {
		extras.browsers = args.browsers.split(",");
	}
	// set reporters
	if (args.reporters) {
		extras.reporters = args.reporters.split(",");
	}
	// BrowserStack enablement (using --bs on CLI with bs_user, bs_key in CLI or env)
	if (args.bs) {
		bs_user = args.bs_user || env.BS_USER;
		bs_key = args.bs_key || env.BS_KEY;
		if (bs_user && bs_key) {
			extras.bs = true;
			extras.bs_user = bs_user;
			extras.bs_key = bs_key;
		}
	}
	// config the port
	if (args.port) {
		extras.port = args.port;
	}
	// config log level
	if (args.ll) {
		extras.logLevel = args.ll;
	}
	// log(colors.green("Initial Karma config"), extras);
	return extras;
}

// populate default Karma configuration
function defaultConfig(karmaConfig) {
	var extras = karmaConfig.extras,
			requirejs = extras.requirejs;
	return {
		// all the files will be served relative to project root
		basePath: require("path").resolve(__dirname, "../.."),
		// use Jasmine and depending on config, requirejs
		frameworks: requirejs ? ["jasmine", "requirejs"] : ["jasmine"],
		// list of files/patterns to load in the browser
		// [1] - RequireJS Karma config will be included/injected, all others will be served on demand
		// [2] - Global/non-RequireJS will be loaded from external config since needs order
		files: !requirejs ? require("./karma.files.js") : [
			// include dependencies (not included for RequireJS, configured as paths)
			// ex: { pattern: "bower_components/**/*.js", included: false },
			// runtime config
			"test/karma/runtime.requirejs.js",
			// add src classes (not included for RequireJS)
			{ pattern: "src/**/*.js", included: false },
			// add Retests/specs & helpers (not included for RequireJS)
			{ pattern: "test/**/*.js", included: false },
		],
		// list the files/patterns to be excluded
		exclude: [
			// exclude Karma specific files
			"test/karma/karma*.js",
			// exclude the oposite runtime
			"test/karma/" + (!requirejs ? "runtime.requirejs.js" : "runtime.js"),
			// exclude Node.js pure tests
			"test/node/**/*.js"
		],
		// web server port
		port: extras.port || 9876,
		// enable colors in the reporters and logs output
		colors: extras.colors,
		// level of logging: karmaConfig.LOG_DISABLE || karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN || karmaConfig.LOG_INFO || karmaConfig.LOG_DEBUG
		// logLevel: extras.logLevel || karmaConfig.LOG_DEBUG,
		logLevel: extras.logLevel || karmaConfig.LOG_DEBUG,
		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: extras.captureTimeout || 10000,
		// One of these browsers: PhantomJS, Chrome, ChromeCanary, Firefox, Opera, IE, Safari
		browsers: extras.browsers || ["PhantomJS"],
		// config reporters: "dots", "progress", "junit", "growl", "coverage"
		reporters: extras.reporters || ["dots", "growl"],
	};
}

// configure Karma
function karma(karmaConfig) {
	var extras = populateExtras(karmaConfig), // setup extras
			config = defaultConfig(karmaConfig), // default config
			reporters = config.reporters;
	// log(colors.green("Default Karma config"), config);
	// config JUnit if enabled
	if (extras.junit) {
		reporters.push("junit");
		// JUnit reporter configuration
		config.junitReporter = {
			suite: "unit",
			outputFile: "target/tests-results/karma-test-results.xml"
		};
	}
	// config code coverage if enabled
	if (extras.cc) {
		reporters.push("coverage");
		// registr coverage preprocesor
		config.preprocessors = {
			"src/**/*.js": "coverage",
			"test/**/*.js": "coverage"
		};
		// Code coverage reporter configuration: "html" (default), "lcov", "text", "text-summary", "cobertura" https://github.com/gotwarlost/istanbul , http://gotwarlost.github.io/istanbul/public/apidocs/
		config.coverageReporter = {
			type: "cobertura",
			dir: "target/tests-results/cobertura"
		};
	}
	// for CI mode automatically disable the autowatch and enable single run
	if (extras.ci) {
		// disable the watch mode under CI
		config.autoWatch = false;
		// execute and exit unde CI
		config.singleRun = true;
	}
	// config BrowserStack if enabled
	if (extras.bs) {
		// global config of your BrowserStack account
		config.browserStack = {
			username: extras.bs_user,
			accessKey: extras.bs_key
		};
		// load custom BrowserStack launchers from external module
		config.customLaunchers = require("./karma.bs");
		// replace the browsers using the custom BrowserStack ones
		config.browsers = Object.keys(config.customLaunchers);
	}
	log(colors.green("Karma config"), config);
	// set the Karma configuration
	karmaConfig.set(config);
}

// export Karma configurer
module.exports = karma;
