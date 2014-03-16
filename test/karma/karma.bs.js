/**
 * karma.bs - Define BrowserStack custom browsers
 *
 * @author Ciprian Popa (cyparu)
 * @since 0.1.0
 * @version 0.1.0
 */

"use strict";

module.exports = {
	bs_firefox_mac: {
		base: "BrowserStack",
		browser: "firefox",
		browser_version: "21.0",
		os: "OS X",
		os_version: "Mountain Lion"
	},
	bs_iphone5: {
		base: "BrowserStack",
		device: "iPhone 5",
		os: "ios",
		os_version: "6.0"
	}
};
