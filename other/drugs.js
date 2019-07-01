
/**
 * ---------------------------------------------------------------<br>
 * Drugs.com Display Ads module
 *
 * @module ddc-ads/display
 * @author Aaron Schmidt <aaron.schmidt@drugs.com>
 */

/**
 * Exports
 */
module.exports = {
	init: init,
	defineAdSlots: defineAdSlots,
	displayAds: displayAds
};

/**
 * Dependencies
 * @private
 */
var Package = {
	Config: require('../config'),
	Debug: require('../debug')
};



/**
 * Module variables
 */
var _config;
var _adSlots = [];
var _adLog = [];
var _prebid = {start: 0, responseHandled: false};
var _scroll = {location: 0, distance: 0};
var _timer = {log: 0};
var headerBiddingSlots = [];
var nonHeaderBiddingSlots = [];

/**
 * Initialisation method; expected to run on script startup.
 */
function init()
{
	Package.Debug.trace('DDC.Ads.Display.init', {level: 2});

	// Get config data for display ads
	_config = Package.Config.get(['ads', 'display']);
	if (!_config || !_config.units || !_config.units.length) {
		return;
	}

	run();
}

/**
 * Run display ad setup logic.
 */
function run()
{
	Package.Debug.trace('DDC.Ads.Display.run', {level: 2});

	if (!setupGoogleTag()) {
		return;
	}

	// Inject HTML if required
	buildAdHtml();

	// Ensure all referenced ad IDs exist in HTML source
	checkAdElementExists();

	// Customize layout/display for sidebar 160 and 300 ads
	checkSidebar160Ads();
	checkSidebar300Ads();

	// Remove ad units if wrapping <div> not found in DOM
	filterNonExistentUnits();

	// Save ad count to SITECONFIG (used inside Ads/Injection module)
	Package.Config.storeData('displayAdsRenderCount', _config.units.length);

	// Remove AdSense units before running DFP setup
	filterAdSenseUnits();

	var displayOptions = {loadDelayed: false, prebid: {enable: false, refreshEnable: false};

	// Run setup logic
	setup();

	// @todo Move logic into Package.Config
	window.SITEVARS = window.SITEVARS || {};
	window.SITEVARS.ads = window.SITEVARS.ads || {};
	window.SITEVARS.ads.mpulse = window.SITEVARS.ads.mpulse || {};
	window.SITEVARS.ads.mpulse.dfpCount = _config.units.length;
	window.SITEVARS.ads.mpulse.dfpCountR = _config.units.length * 0.00578 * 100;

	defineAdSlots(_config.units, _config.targeting);

	if (_config.amazon) {
		setupAmazon();
		displayOptions.loadDelayed = true;
	}
	if (_config.prebid.enable && _adSlots.length) {
		_config.units.forEach(function(unit) => {
			if (unit.prebid) {
				headerBiddingSlots.push(unit.slot);
			} else {
				nonHeaderBiddingSlots.push(unit.slot);
			}
		});

		setupPrebid();
		displayOptions.loadDelayed = true;
		displayOptions.prebid.enable = true;
		displayAds(_config.units, displayOptions);
	} else {
		displayAds(_config.units, displayOptions);
	}

	setupRefresh(displayOptions);
}

/**
 * Ensure the global 'googletag.cmd' exists and is accessible.
 * @returns {boolean}
 */
function setupGoogleTag()
{
	Package.Debug.trace('DDC.Ads.Display.setupGoogleTag');

	try {
		// Wrap in try/catch to ignore Firefox "permission denied" error :/
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];

		// Test for .push() method because Firefox
		return typeof window.googletag.cmd.push === 'function';
	}
	catch(ex) {}

	return false;
}

/**
 * Build and append ad HTML to DOM.
 */
function buildAdHtml()
{
	Package.Debug.trace('DDC.Ads.Display.buildAdHtml');

	_config.units.forEach(function(unit) {
		if (unit.layout && unit.layout.create && (!unit.layout.minWidth || window.innerWidth >= unit.layout.minWidth)) {
			var ad = document.createElement('div');
			ad.setAttribute('id', unit.code);
			var wrap = document.createElement('div');
			wrap.className = getAdClassList(unit);
			wrap.appendChild(ad);
			document.body.appendChild(wrap);
			if (unit.layout.bodyClass) {
				document.body.className += ' ' + unit.layout.bodyClass;
			}
		}
	});
}

/**
 *
 * @param {*} unit
 * @returns {string}
 */
function getAdClassList(unit)
{
	Package.Debug.trace('DDC.Ads.Display.getAdClassList');

	var classList = [];
	classList.push('display-ad');
	classList.push('display-ad-fixed');
	if (unit.bids) {
		classList.push('display-ad-bids');
	}
	if (unit.sizes) {
		unit.sizes.forEach(function(size) {
			classList.push('display-ad-' + size.join('x'));
		});
	}
	return classList.join(' ');
}

/**
 *
 */
function checkAdElementExists()
{
	Package.Debug.trace('DDC.Ads.Display.checkAdElementExists');

	_config.units = _config.units.filter(function(unit) {
		return !!document.getElementById(unit.code);
	});
}

/**
 *
 */
function checkSidebar160Ads()
{
	Package.Debug.trace('DDC.Ads.Display.checkSidebar160Ads');

	// Loop through all ad units
	_config.units = _config.units.filter(function(unit) {
		if (unit.layout && unit.layout.requiredFixedPosition) {
			var adWrap = getAncestorByClassName(unit.code, unit.layout.wrappingClass);
			if (adWrap && getCssValue(adWrap, 'position') !== 'fixed') {
				// Remove float CSS from siblings
				removeSiblingsFloat(adWrap);
				// Remove ad from DOM
				if (removeElement(adWrap)) {
					// Remove ad from array
					return false;
				}
			}
		}
		return true;
	});
}

/**
 *
 */
function checkSidebar300Ads()
{
	Package.Debug.trace('DDC.Ads.Display.checkSidebar300Ads');

	// Loop through all ad units (reverse order)
	for (var i = _config.units.length - 1; i >= 0; i--) {
		if (isLayoutInvalid(_config.units[i])) {
			// Remove ad from DOM
			var adWrap = getAncestorByClassName(_config.units[i].code, _config.units[i].layout.wrappingClass);
			if (removeElement(adWrap)) {
				// Remove ad from array
				_config.units.splice(i, 1);
			}
		}
	}
}

/**
 *
 * @param {*} unit
 * @returns {boolean}
 */
function isLayoutInvalid(unit)
{
	Package.Debug.trace('DDC.Ads.Display.isLayoutInvalid', unit.code);

	if (!unit.layout) {
		return false;
	}

	// Check if sidebar height is taller than content height
	if (unit.layout.requiresContentHeight && getHeight('sidebar') > getHeight('content')) {
		return true;
	}

	// Check if sidebar displays below content (tablet in portrait mode)
	if (unit.layout.requiresSidebarFloat && isTabletPortrait()) {
		return true;
	}

	// Check if ad is displayed within a certain percentage of the page
	if (unit.layout.percentageCutoff && getOffsetTopPercentage(unit) > unit.layout.percentageCutoff) {
		return true;
	}

	return false;
}

/**
 *
 * @param {*} unit
 */
function getOffsetTopPercentage(unit)
{
	Package.Debug.trace('DDC.Ads.Display.getOffsetTopPercentage', unit.code);

	// Get bounding rectangle for this ad unit
	var ad = document.getElementById(unit.code);
	var adRect = ad ? ad.getBoundingClientRect() : null;
	if (!adRect || !adRect.top) {
		return 0;
	}

	// Return ad's top offset position (as percentage) from top of document
	var adOffsetTop = adRect.top + (window.pageYOffset || 0);
	return adOffsetTop / document.body.clientHeight * 100;
}

/**
 *
 */
function filterNonExistentUnits()
{
	Package.Debug.trace('DDC.Ads.Display.filterNonExistentUnits');

	// Loop through all ad units
	_config.units = _config.units.filter(function(unit) {
		return !!document.getElementById(unit.code);
	});
}

/**
 *
 */
function filterAdSenseUnits()
{
	Package.Debug.trace('DDC.Ads.Display.filterAdSenseUnits');

	_config.units = _config.units.filter(function(unit) {
		if (unit.adSense) {
			// Setup adSense unit after short delay (ensure DOM ready)
			window.setTimeout(function() {
				setupAdSenseUnit(unit.code, unit.adSense);
			}, 1000);
			// Remove ad from array
			return false;
		}
		return true;
	});
}

/**
 *
 * @param {string} code
 * @param {*} ad
 */
function setupAdSenseUnit(code, ad)
{
	Package.Debug.trace('DDC.Ads.Display.setupAdSenseUnit', code);

	var el = document.getElementById(code);
	if (!el) {
		return;
	}

	// Inject AdSense HTML into target div
	el.innerHTML = buildAdSenseAdHtml(ad, ['adsbygoogle']);

	// Call google command to add new ad to queue
	(window.adsbygoogle = window.adsbygoogle || []).push({});
}

/**
 *
 * @note Method (somewhat) duplicated in ads/injection.js : buildAdSenseAdHtml()
 * @param {*} ad
 * @param {Array} classList
 * @returns {string}
 */
function buildAdSenseAdHtml(ad, classList)
{
	Package.Debug.trace('DDC.Ads.Display.buildAdSenseAdHtml', ad);

	var html = [];
	html.push("<ins class='" + classList.join(' ') + "'");
	html.push("style='display: block; width: " + ad.width + "px; height: " + ad.height + "px;'");
	html.push("data-ad-client='" + ad.client + "'");
	html.push("data-ad-channel='" + ad.channel + "'");
	html.push("data-ad-type='" + ad.type + "'");
	html.push("data-color-border='ffffff'");
	html.push("data-color-bg='ffffff'");
	html.push("data-color-link='0000ff'");
	html.push("data-color-text='000000'");
	html.push("data-color-url='008000'");
	html.push("data-analytics-domain-name='drugs.com'></ins>");

	return html.join("\n");
}

/**
 *
 */
function setup()
{
	Package.Debug.trace('DDC.Ads.Display.setup');

	if (!setupGoogleTag()) {
		return;
	}

	window.googletag.cmd.push(function() {
		if (typeof window.googletag.pubads === 'function') {
			window.googletag.pubads().disableInitialLoad();
			window.googletag.pubads().addEventListener('slotRenderEnded', logAdEvent);
		}
	});

	// Send log to API after 10 seconds regardless
	_timer.log = window.setTimeout(sendLog, 10000);
}

/**
 * Setup Amazon ad script.
 * @see Append '?amzn_debug_mode=1' to URL for testing
 */
function setupAmazon()
{
	Package.Debug.trace('DDC.Ads.Display.setupAmazon', _config.amazon);

	window.apstag = window.apstag || {
		_Q: [],
		init: function() {
			window.apstag._Q.push(["i", arguments]);
		},
		fetchBids: function() {
			window.apstag._Q.push(["f", arguments]);
		},
		setDisplayBids: function() {}
	};

	window.apstag.init({
		pubID: '3109',
		adServer: 'googletag'
	});

	window.apstag.fetchBids({
		slots: _config.amazon.slots,
		timeout: _config.amazon.timeout
	}, amazonResponseHandler);
}

/**
 * Handle response from Amazon ad script.
 * @param {*} bids
 */
function amazonResponseHandler(bids)
{
	Package.Debug.trace('DDC.Ads.Display.amazonResponseHandler', bids);

	if (!setupGoogleTag()) {
		return;
	}

	window.googletag.cmd.push(function() {
		window.apstag.setDisplayBids();
		loadAds();
	});
}

/**
 * Setup Prebid ad script.
 * @see http://prebid.org/dev-docs/publisher-api-reference.html#module_pbjs.requestBids
 */
function setupPrebid()
{
	Package.Debug.trace('DDC.Ads.Display.setupPrebid', _config.prebid);

	window.pbjs = window.pbjs || {};
	window.pbjs.que = window.pbjs.que || [];

	googletag.cmd.push(function() {
		_prebid.start = Date.now();
		//window.pbjs.setConfig(_config.prebid.config);
		//window.pbjs.addAdUnits(_config.units);
	    // Request the bids
	    pbjs.rp.requestBids({
				callback: function() { prebidResponseHandler({}, 'failsafe', headerBiddingSlots); },
				gptSlotObjects: headerBiddingSlots,
				data: {}
		});
	});

	setTimeout(function() {
		prebidResponseHandler({}, 'failsafe', headerBiddingSlots);
	}, _config.timeout + 250);
}

/**
 * Refresh Prebid ad script.
 * @see http://prebid.org/dev-docs/publisher-api-reference.html#module_pbjs.requestBids
 */
function refreshPrebid(code, slot)
{
	Package.Debug.trace('DDC.Ads.Display.refreshPrebid', _config.prebid);

	window.pbjs = window.pbjs || {};
	window.pbjs.que = window.pbjs.que || [];
	_prebid.code = false;

	googletag.cmd.push(function() {
		_prebid.start = Date.now();

	    // Request the bids
	    pbjs.rp.requestBids({
				callback: function() { prebidResponseHandler({}, 'failsafe', slot, code); }
				gptSlotObjects: slot,
				data: {}
		});
	});

	setTimeout(function() {
		prebidResponseHandlerRefresh({}, 'failsafe', slot, code);
	}, _config.timeout + 250);
}

/**
 * Handle response from Prebid ad script.
 */
function prebidResponseHandler(bids, timedOut, slots)
{
	// Ensure response only handled once
	if (_prebid.responseHandled) {
		return;
	}
	_prebid.responseHandled = true;

	var status = typeof timedOut === 'string' ? timedOut : (timedOut ? 'timed out' : 'complete');
	Package.Debug.trace('DDC.Ads.Display.prebidResponseHandler', status, Date.now() - _prebid.start);
	Package.Debug.dir(bids);

	if (!setupGoogleTag()) {
		return;
	}

	window.googletag.cmd.push(function() {
		if (window.pbjs && window.pbjs.setTargetingForGPTAsync) {
			window.pbjs.setTargetingForGPTAsync();
		}
		loadPrebidAds(slots);
	});
}

/**
 * Handle response from Prebid ad script.
 * Similar to previous method but the failsage is using slot id.
 */
function prebidResponseHandlerRefresh(bids, timedOut, slot, code)
{
	// Ensure response only handled once
	if (_prebid.responseHandled) {
		return;
	}
	_prebid.code = true;

	var status = typeof timedOut === 'string' ? timedOut : (timedOut ? 'timed out' : 'complete');
	Package.Debug.trace('DDC.Ads.Display.prebidResponseHandler', status, Date.now() - _prebid.start);
	Package.Debug.dir(bids);

	if (!setupGoogleTag()) {
		return;
	}

	window.googletag.cmd.push(function() {
		if (window.pbjs && window.pbjs.setTargetingForGPTAsync) {
			window.pbjs.setTargetingForGPTAsync();
		}
		loadPrebidAds(slot);
	});
}

/**
 *
 * @param {*} units
 * @param {*} targeting
 */
function defineAdSlots(units, targeting)
{
	Package.Debug.trace('DDC.Ads.Display.defineAdSlots', units.length, targeting);

	if (!setupGoogleTag()) {
		return;
	}

	window.googletag.cmd.push(function() {
		if (!window.googletag || !window.googletag.defineSlot || !window.googletag.pubads) {
			return;
		}

		// Define ad unit slots
		units.forEach(function(unit) {
			unit.slot = defineAdSlot(unit.section, unit.sizes, unit.code, unit.targeting);
		});

		// Set page-level targeting
		setTargeting(window.googletag.pubads, targeting);

		window.googletag.pubads().enableSingleRequest();
		window.googletag.enableServices();

		// Setup additional debugging
		monitorLoadTime();
	});
}

/**
 *
 * @param {string} section
 * @param {Array} sizes
 * @param {string} code
 * @param {*} targeting
 * @returns {*} slot
 * @see https://developers.google.com/doubleclick-gpt/reference#googletag.defineSlot
 */
function defineAdSlot(section, sizes, code, targeting)
{
	Package.Debug.trace('DDC.Ads.Display.defineAdSlot', section, sizes, code, targeting);

	var slot = window.googletag.defineSlot(section, sizes, code);
	if (!slot) {
		Package.Debug.trace('DDC.Ads.Display.defineAdSlot:failed', section, sizes, code, {level: 'error'});
		return null;
	}

	slot.addService(window.googletag.pubads());

	// Set slot-level targeting
	setTargeting(slot, targeting);

	_adSlots.push(slot);

	return slot;
}

/**
 *
 * @param {function|*} slot
 * @param {*} targeting
 * @see https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_setTargeting
 * @see https://developers.google.com/doubleclick-gpt/reference#googletag.Slot_setTargeting
 * @see https://support.google.com/admanager/answer/1638622
 */
function setTargeting(slot, targeting)
{
	Package.Debug.trace('DDC.Ads.Display.setTargeting', targeting);

	if (!slot || !targeting) {
		return;
	}

	// Loop through all keys in targeting object
	for (var key in targeting) {
		if (targeting.hasOwnProperty(key)) {
			if (typeof slot === 'function') {
				// Page-level targeting (slot = window.googletag.pubads)
				slot().setTargeting(key, targeting[key]);
			}
			else {
				// Slot-level targeting
				slot.setTargeting(key, targeting[key]);
			}
		}
	}
}

/**
 *
 */
function monitorLoadTime()
{
	Package.Debug.trace('DDC.Ads.Display.monitorLoadTime');

	if (!window.googletag || !window.googletag.pubads) {
		return;
	}

	window.googletag.pubads().addEventListener('slotRenderEnded', function(e) {
		var adSize = getAdSize(e);
		if (window.performance && typeof window.performance.mark === 'function') {
			window.performance.mark('AdLoaded_' + adSize);
		}
		Package.Debug.trace('DDC.Ads.Display.monitorLoadTime', adSize, 'Complete!');
	});
}

/**
 *
 * @param {*} e
 * @returns {string}
 */
function getAdSize(e)
{
	if (!e.size) {
		return '0x0';
	}

	if (typeof e.size === 'string') {
		return e.size.replace(',', 'x');
	}

	if (Array.isArray(e.size)) {
		return e.size.join('x');
	}

	return e.size.toString();
}

/**
 * Execute Google's display ad command for all ads.
 * @param {*} units
 * @param {*} options
 */
function displayAds(units, options)
{
	Package.Debug.trace('DDC.Ads.Display.displayAds', units.length, options);

	if (!setupGoogleTag()) {
		return;
	}

	options = options || {};

	window.googletag.cmd.push(function() {
		units.forEach(function(unit) {
			displayAd(unit.code);
			if (options.loadEach && unit.slot) {
				loadAds(unit.slot);
			}
		});
		if (options.prebid.enabled && nonHeaderBiddingSlots.length) {
			loadNonPrebidAds(nonHeaderBiddingSlots);
			return;
		}
		if (!options.loadEach && !options.loadDelayed) {
			loadAds();
		}
	});
}

/**
 * Execute Google's display command for the specified ad.
 */
function displayAd(code)
{
	Package.Debug.trace('DDC.Ads.Display.displayAd', code);

	window.googletag.display(code);
}

/**
 * Execute Google's refresh command for the specified slot (or all ad slots).
 * @param {*} slot
 */
function loadAds(slot)
{
	Package.Debug.trace('DDC.Ads.Display.loadAds', slot);

	// If specific slot is passed, convert to array, else refresh all ad slots
	slot = slot ? [slot] : _adSlots;
	window.googletag.pubads().refresh(slot);
}

/**
 * Execute Google's refresh command for the non header bidding slots.
 * @param {*} slot
 */
function loadNonPrebidAds(slots)
{
	Package.Debug.trace('DDC.Ads.Display.loadNonPrebidAds', slots);

	// refresh all non prebids ad slots
	window.googletag.pubads().refresh(slots);
}

/**
 * Execute Google's refresh command for the non header bidding slots.
 * @param {*} slot
 */
function loadPrebidAds(slots)
{
	Package.Debug.trace('DDC.Ads.Display.loadPrebidAds', slots);

	// refresh all non prebids ad slots
	window.googletag.pubads().refresh(slots);
}

/**
 *
 */
function setupRefresh(options)
{
	Package.Debug.trace('DDC.Ads.Display.setupRefresh');

	var enabled = false;

	_config.units.forEach(function(unit) {
		if (unit.refresh && unit.refresh.interval) {
			enabled = setupRefreshTimer(unit, options);
		}
	});

	// Setup listener for scroll event (note: avoid using Package.Scroller due to lack of jQuery support with FEO)
	if (enabled && window.addEventListener) {
		window.addEventListener('scroll', scrolling);
	}
}

/**
 *
 * @param {*} unit
 * @returns {number}
 */
function setupRefreshTimer(unit, options)
{
	Package.Debug.trace('DDC.Ads.Display.setupRefreshTimer', unit.code);

	var refresh = {count: 0, timer: 0};
	var scroll = {location: 0, distance: 0};

	// Setup interval timer to refresh after certain time + scroll distance
	refresh.timer = window.setInterval(function() {
		// Update scroll distance/location
		scroll.distance += Math.abs(scroll.location - _scroll.location);
		scroll.location = _scroll.location;
		// Stop timer after reaching max refreshes
		if (refresh.count > unit.refresh.max) {
			window.clearInterval(refresh.timer);
		}
		else if (!unit.refresh.scroll || scroll.distance > unit.refresh.scroll) {
			// Increment refresh count and reset scroll distance
			refresh.count++;
			scroll.distance = 0;
			// Refresh ad
			if (unit.prebid && options.prebid.refreshEnable) {
				refreshPrebidAd(unit.code, unit.slot);
			} else {
				refreshAd(unit.code, unit.slot);
			}
		}
	}, unit.refresh.interval);

	return refresh.timer;
}

/**
 *
 * @param {string} code
 * @param {*} slot
 */
function refreshAd(code, slot)
{
	Package.Debug.trace('DDC.Ads.Display.refreshAd', code);

	if (!setupGoogleTag()) {
		return;
	}

	window.googletag.cmd.push(function() {
		loadAds(slot);
	});
}

/**
 *
 * @param {string} code
 * @param {*} slot
 */
function refreshPrebidAd(code, slot)
{
	Package.Debug.trace('DDC.Ads.Display.refreshPrebidAd', code);

	if (!setupGoogleTag()) {
		return;
	}

	refreshPrebid(code, slot);
}

/**
 * Scrolling event handler.
 * @param {Event} e
 */
function scrolling(e)
{
	var target = e.currentTarget || window;
	var scrollY = target.scrollY || target.pageYOffset || 0;

	_scroll.distance += Math.abs(scrollY - _scroll.location);
	_scroll.location = scrollY;
}

/**
 *
 * @param {*} event
 */
function logAdEvent(event)
{
	Package.Debug.trace('DDC.Ads.Display.logAdEvent');

	var data = {
		lineItemId: event.sourceAgnosticLineItemId,
		creativeId: event.sourceAgnosticCreativeId,
		slotId: event.slot.getSlotElementId(),
		adUnit: event.slot.getAdUnitPath().replace('/7146/', ''),
		size: event.size,
		isEmpty: event.isEmpty
	};

	if (window.pbjs) {
		var bid = window.pbjs.getHighestCpmBids(data.slotId);
		data.prebid = bid[0] || {};
	}

	_adLog.push(data);
	if (_adLog.length === _adSlots.length) {
		sendLog();
	}
}

/**
 *
 */
function sendLog()
{
	Package.Debug.trace('DDC.Ads.Display.sendLog');

	window.clearTimeout(_timer.log);

	if (!_config.logUrl) {
		return;
	}

	var data = Package.Debug.getData();
	data.ads = _adLog;

	// Send ajax request to log error data
	if (window.jQuery) {
		var settings = {
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data)
		};
		$.ajax(_config.logUrl, settings);
	}
	else if (window.fetch) {
		var params = {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};
		fetch(_config.logUrl, params);
	}
}

/**
 * Get the closest parent of the target element containing the CSS class name.
 * @param {string} id
 * @param {string} className
 * @returns {*}
 */
function getAncestorByClassName(id, className)
{
	Package.Debug.trace('DDC.Ads.Display.getAncestorByClassName', id, className);

	var el = document.getElementById(id);
	if (!el) {
		return null;
	}

	while (el = el.parentElement) { // jshint ignore:line
		if (el && el.classList && el.classList.contains(className)) {
			return el;
		}
	}

	return null;
}

/**
 *
 * @param {*} el
 * @param {string} prop
 * @returns {*}
 */
function getCssValue(el, prop)
{
	Package.Debug.trace('DDC.Ads.Display.getCssValue', prop);

	return el ? window.getComputedStyle(el).getPropertyValue(prop) : null;
}

/**
 *
 * @param {string} id
 * @returns {*}
 */
function getHeight(id)
{
	Package.Debug.trace('DDC.Ads.Display.getHeight', id);

	var el = document.getElementById(id);
	return el ? el.clientHeight : null;
}

/**
 *
 * @param {*} el
 * @returns {*}
 */
function removeElement(el)
{
	Package.Debug.trace('DDC.Ads.Display.removeElement');

	return el ? el.parentNode.removeChild(el) : null;
}

/**
 *
 * @param {*} el
 */
function removeSiblingsFloat(el)
{
	Package.Debug.trace('DDC.Ads.Display.removeSiblingsFloat');

	if (!el.parentNode || !el.parentNode.childNodes || !el.parentNode.childNodes.length) {
		return;
	}

	// Remove float CSS from siblings
	for (var i = 0; i < el.parentNode.childNodes.length; i++) {
		var sibling = el.parentNode.childNodes[i];
		if (sibling.classList && sibling.classList.contains('sideBoxFloatLeft')) {
			sibling.classList.remove('sideBoxFloatLeft');
		}
	}
}

/**
 *
 * @returns {boolean}
 */
function isTabletPortrait()
{
	var pixelRatio = window.devicePixelRatio || 1;
	return window.innerHeight > window.innerWidth && (window.innerWidth / pixelRatio) <= 1024;
}
