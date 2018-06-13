var HB_TIMEOUT = 2000;

Criteo.RequestBids(CriteoAdUnits, function(){adServerCallback('criteo')}, HB_TIMEOUT);

pbjs.requestBids({
 bidsBackHandler: function() { adServerCallback('prebid')}
 });


setTimeout(function() {
	adServerCallback('timeout');
}, HB_TIMEOUT);


window.hb_status = {
	n_adserver_callback: [],
	adserverRequestSent: false
};


var adServerCallback = function (source) {
	if (window.hb_status.adserverRequestSent) return;

	window.hb_status.n_adserver_callback.push(source);

	if (source == 'prebid') {
		googletag.cmd.push(function() {
			pbjs.que.push(function() {
				pbjs.setTargetingForGPTAsync();
			});

		});
	} else if (source == 'criteo') {
		googletag.cmd.push(function() {
			Criteo.SetDFPKeyValueTargeting();
		});
	}

	if (window.hb_status.n_adserver_callback.length >= 2 || "timeout" == source) {
		googletag.cmd.push(function() {
			googletag.pubads().refresh();
			window.hb_status.adserverRequestSent = true;
		});
	};
}
