    // initialize pbjs
    var pbjs = pbjs || {};
    pbjs.que = pbjs.que || [];
 	var verticalOutput = "entertainment";
    var prebidSizeMapping = {};

    function definePrebidSizeMapping(sizesMapping, adType) {
        if (sizesMapping[adType] == null) { return sizesMapping['global'] }
        return sizesMapping[adType];
    }

    function getPrebidSizeMapping() {
        return {
            // Define all the size mapping according to the google mapping
            billboard: [
                { minViewPort: [0, 0], sizes: [[600, 197]] },
                { minViewPort: [970, 0], sizes: [[728, 90], [970, 250]] }
            ],

            billboard_tv: [
                { minViewPort: [0, 0], sizes: [[600, 197]] },
                { minViewPort: [970, 0], sizes: [[970, 31]] }
            ],       

            banner: [
                { minViewPort: [0, 0], sizes: [[300, 50]] },
                { minViewPort: [970, 0], sizes: [[728, 90]] }
            ],

            island: [
                { minViewPort: [0, 0], sizes: [[300, 50]] },
                { minViewPort: [970, 0], sizes: [[300, 600], [300, 250]] }
            ],      

            global: [
                { minViewPort: [0, 0], sizes: [[300, 250], [600, 197]] },
                { minViewPort: [970, 0], sizes: [[728, 90], [970, 250], [970, 31], [728, 90], [300, 600], [300, 250]] }
            ]
        }
    }    

    googletag.pubads().getSlots().map(function(slot) {
    	var elementId = slot.getSlotElementId();
    	prebidSizeMapping[elementId] = definePrebidSizeMapping(getPrebidSizeMapping(), adType);
    });
    
    // setup googletag
    var googletag = googletag || {};
    googletag.cmd = googletag.cmd || [];
    googletag.cmd.push(function() {
        googletag.pubads().disableInitialLoad();

        googletag.pubads().enableSingleRequest();
        googletag.enableServices();
 
        // function that calls the ad-server
        function callAdserver() {
            if (pbjs.adserverCalled) return;
            pbjs.adserverCalled = true;
            googletag.pubads().refresh();
        }
 
        // request pbjs bids when it loads
        pbjs.que.push(function() {
            pbjs.rp.requestBids({
                callback: callAdserver,
                gptSlotObjects: googletag.pubads(). getSlots(),
	            data: {
	              vertical: verticalOutput,
	              prebid: "true"
	            },
                sizeMappings: prebidSizeMapping
            });
        });
 
        // failsafe in case PBJS doesn't load
        setTimeout(function() {
            callAdserver();
        }, 2500);
    });
