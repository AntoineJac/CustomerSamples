/**
 * This javascript deals with populating elements on the page. There are some predefined
 * behaviours regarding ads that will always on the page.
 */
(function(ns, undefined) {

    var debug = false,
        slots = {};


    function log() {
        if (debug) {
            console.log(arguments);
        }
    }
    
    /**
     * Billboard has the feature falling back to banner if it's not available. It's implemented in slotRenderEnded event
     * The parameters below specify the target(kw) of the fallback banner
     * This hardcoded parameters may be changed in a re-factory when the requirement is more clear(eg, they want to configure it and in which way they want to configure)
     * by Jack Luo 29.08.2016
     */
    var BILLBOARD_FALLBACK_TARGETING = 'ad1';


    /**
     * Small screens are screens smaller than this.
     */
    var SMALL_SCREEN_THRESHOLD = 970;

    /**
     * Will increment with each INITIAL ad call, not for ads beyond that
     */
    var tile = 0;

    /**
     * List of ads to be displayed
     */
    var displayAds = [];

    /**
     * Size mapping used to filter Prebid ad request
     */
    var prebidSizeMapping = {};

    /**
     * Set to true after services have been enabled and the first ads
     * render has been completed.
     */
    var initialised = false;

    /**
     * Define prebid variable
     */
    var pbjs = pbjs || {};
    pbjs.que = pbjs.que || [];
    var headerBiddingSlots = [];
    var nonHeaderBiddingSlots = [];

    function getAdSizes() {
        // Note, for some reason GPT returns 400 error if [0, 0] size is in the request.
        // So set the size to null then ignore the defineslot for null in initialiseAdvertisement
        // 18.18.2016 -Jack Luo
        return {
            pushdown: [970, 250],

            billboard_tv: (isSmallScreen() ? [600, 197] : [970, 31]),

            // small billboard has not been implemented yet. 18.18.2016 -Jack Luo
            billboard: (isSmallScreen() ? [600, 197] : [[728, 90], [970, 250]]),
            banner: (
                isSmallScreen()
                    ? [300, 50]
                    : [728, 90]
            ),

            gallery: [300, 250],

            island: (
                isSmallScreen()
                    ? [[300, 250], 'fluid']
                    : [[300, 600], [300, 250], 'fluid']
            )
        }
    }

    /**
     * Retrieve the metatag content from the head element (not using jQuery because
     * it wouldn't be available at that point).
     *
     * @param name      the name of the metatag to find
     * @returns {String} the value of the metatag or null if not found.
     */
    function getMetatag(name) {
        var head = document.getElementsByTagName('head')[0];
        var meta = head.getElementsByTagName('meta');

        for (var idx = 0; idx < meta.length; ++idx) {
            if (meta[idx].getAttribute('name') === name) {
                return meta[idx].getAttribute('content');
            }
        }
        return null;
    }


    /**
     * @returns {String} the sitename specified in the meta tags
     */
    function getSiteName() {
        return getMetatag('sitename');
    }

    /**
     * @returns {String} with the breadcrumb
     */
    function getBreadcrumb() {
        return getMetatag('breadcrumb');
    }

    /**
     * @returns {boolean} true if the page is set to 'sponsored'
     */
    function isSponsored() {
        return getMetatag('sponsored');
    }

    /**
     * @returns {boolean} true if the page is set to enable Prebid
     */
    function isPrebidEnable() {
        return getMetatag('prebid');
    }    
    
    /**
     * @return {String} primaryContentType
     */
    function getPrimaryContentType() {
        return getMetatag('primaryContentType');
    }

    /**
     * @returns true if we're on a small screen
     */
    function isSmallScreen() {
        return $("body").width() < SMALL_SCREEN_THRESHOLD;
    }
    
    /**
     * check wcmmode.edit which is passed in from sightly page.
     */
    function isAuthor() {
        return document.body.classList.contains('authoring');
    }

    /**
     * Ads in the page can specify targeting information. If none was
     * provided, some default targeting is placed on island unit 1 and 2.
     *
     * @param element is the element to check for targetintg
     * @param elementId is the identifier of the element
     * @returns {string}
     */
    function getTargetingValue(element, elementId) {
        var targeting = element.getAttribute('data-targeting');

        if (!targeting) {
            if (elementId == 'island-unit-1') {
                targeting = 'ad1';
            }
            if (elementId == 'island-unit-2') {
                targeting = 'ad2';
            }
        }
        return targeting;
    }


    /**
     * @returns the sizes that are used for a specific type of ad. There is an override
     * for the first island unit.
     */
    function getRequiredAdSizes(sizes, adType) {
        return sizes[adType];
    }

    /**
     * Initialises the advertisement definition found. The element
     * specifies the data-advertisement="<adType>" and data-targeting.
     *
     * @param element   is the DOM element to get the ad for.
     */
    function initialiseAdvertisement(element) {

        // Do a quick check to make sure GTP is loaded
        if (!googletag) {
            throw new ReferenceError('googletag object has not been initiated');
        }

        var
            adType = element.getAttribute('data-advertisement'),
            elementId = element.getAttribute('id'),
            activePrebid = element.getAttribute('prebid')
        ;
        

        var site = getSiteName();
        var targeting = getTargetingValue(element, elementId);
        var activeSize = getRequiredAdSizes(getAdSizes(), adType);

        if (activePrebid) {
            prebidSizeMapping.elementId = definePrebidSizeMapping(getPrebidSizeMapping(), adType);
        }

        log("AdType: ", adType);
        log("Site: ", site);
        log("Element: ", elementId);
        log("Targeting: ", targeting);
        log("Tile#: ", tile);
        log("Size: ", activeSize);
        log("Prebid: ", activePrebid);

        // billboard logic:
        // 1. On desktop AEM just provide an ad container, whatever contents in it (an image, a gif, a collapsible ad like what the current pushdown billboard is) is controlled in doubleclick.
        // 2. On mobile, AEM add a "x" icon on the ad container to enable user to close the ad for good on the page. Note, in this case, doubleclick should not serve a collapsible ad because the extra "x"(or collapse icon) will be conflict with the one from container(well, not really conflicting but will confuse users or overlap with each other).
        // 3. On mobile, pushdown billboard is sticky but not the mini-banner.
        if (adType === 'billboard' && isSmallScreen()) {
            targeting = BILLBOARD_FALLBACK_TARGETING;
            $(element).parent().addClass('AdWrapper--close-show');
        }
        if (activeSize) {
            var slot =
                googletag
                    .defineSlot('/4100/' + site, activeSize, elementId)
                    .addService(googletag.pubads())
                    .setTargeting('tile', tile);

            // companion ad only for desktop
            var isBillboard = elementId.indexOf('billboard') != -1;
            var isBanner = elementId.indexOf('banner') != -1;
            if (!isSmallScreen() && (isBillboard || isBanner)) {
                log("adding companion ads for banner");
                slot.addService(googletag.companionAds());
            }

            if (targeting) {
                log("Set targeting", targeting);
                slot.setTargeting('kw', targeting);
            }

            slots[elementId] = slot;            

            if (initialised && activePrebid) {
                refreshPrebid(slot);
            } else if (activePrebid) {
                headerBiddingSlots.push(slot);
            } else if (initialised) {
                googletag.display(elementId);
                googletag.refresh([slot]);
            } else {
                nonHeaderBiddingSlots.push(slot);
            }

            ++tile;
        } else {
            hideCollapsibleContainerInNonEditMode($(element));
        }
    }

    /**
     * The callback function called by Prebid to display ads 
     */
    function sendAdServerRequest(headerBiddingSlots) {
        googletag.cmd.push(function() {
            if (pbjs.adserverRequestSent) {
                return;
            }
            pbjs.adserverRequestSent = true;
            pbjs.que.push(function() {
                pbjs.setTargetingForGPTAsync();
                googletag.pubads().refresh(headerBiddingSlots);
            });
        });
    }

    /**
     * The callback function called by Prebid to display ads 
     */
    function refreshAdServerRequest(prebidSlot) {
        googletag.cmd.push(function() {
            if (pbjs.prebidSlot[0].getSlotElementId()) {
                return;
            }
            pbjs.prebidSlot[0].getSlotElementId() = true;
            pbjs.que.push(function() {
                pbjs.setTargetingForGPTAsync();
                googletag.pubads().refresh(prebidSlot);
            });
        });
    }    

    /**
     * @returns the sizes that are used to filter Prebid ad request
     * according to width size
     */
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

    /**
     * Initialises the prebid bid request.
     * Callback specifies the function to be called after timeout or bids are returned
     * gptSlotObjects are the slot enable for Prebid
     * sizeMappings are sizes to be filtered according to screen size
     * data is an object to pass segments you want to send to bidders 
     */
    function initialisePrebid() {
        // Request the bids
        pbjs.rp.requestBids({
            callback: sendAdServerRequest,
            gptSlotObjects: headerBiddingSlots,
            sizeMappings:  prebidSizeMapping,
            data: {}
        });        

        // Failsafe timeout which is DM timeout (2000ms) + 500ms
        setTimeout(function() {
            sendAdServerRequest(headerBiddingSlots);
        }, 2500);        
    }

    /**
     * Refresh the prebid bid request.
     */
    function refreshPrebid(slot) {
        // Convert slot in array
        slot = slot ? [slot]

        pbjs.slot[0].getSlotElementId() = false;

        // Request the bids
        pbjs.rp.requestBids({
            callback: refreshAdServerRequest,
            gptSlotObjects: slot,
            sizeMappings:  prebidSizeMapping,
            data: {}
        });        

        // Failsafe timeout which is DM timeout (2000ms) + 500ms
        setTimeout(function() {
            sendAdServerRequest(slot);
        }, 2500);        
    }    

    /**
     * Do global initialisation of google advertisement plugin
     */
    function initialiseGoogleAds() {

        // Do a quick check to make sure GTP is loaded
        if (!googletag) {
            throw new ReferenceError('googletag object has not been initiated');
        }

        var crumb = (getBreadcrumb() || "").toLowerCase(),
            parts = crumb.split(">");

        // iterate and set up to seven section names, write null if they are unknown
        for (var idx = 0; idx < 7; ++idx) {
            var sectionName = parts.length > idx ? parts[idx] : null;

            if (!sectionName) {
                break;
            }

            // sanitise the section names
            sectionName = sectionName.replace(/[^A-Za-z0-9]/g, '-').replace(/-{2,}/g, '-');

            log("Targeting sect" + (idx + 1) + " with " + sectionName);
            googletag.pubads().setTargeting('sect' + (idx + 1), sectionName);
        }

        // There's requirement targeting front page of sections. If it's front page then set pagetype=category, otherwise =content
        var pageType = null;
        if (parts.length === 1 && parts[0] !== 'home') {
            pageType = 'category';
        } else if (parts.length > 1) {
            pageType = 'content';
        }
        if (pageType != null) {
            googletag.pubads().setTargeting('pagetype', pageType);
        }
        var primaryContentType = getPrimaryContentType();
        googletag
            .pubads()
            .setTargeting('article-content-type', primaryContentType)
            .setTargeting('sponsored', isSponsored());
    }
    /**
     *  Only show background skins on desktop
     */
    function initialiseSkinAdvertisement() {

        var site = getSiteName();
        log("Site", site);

        googletag
            .defineSlot('/4100/' + site, [6, 2], 'skin-unit-1')
            .addService(googletag.pubads())
            .setTargeting('tile', tile++)
            .setTargeting('sponsored', isSponsored())
            .setTargeting('screenWidth', (isSmallScreen() ? 'small' : 'large'));

    }
    
    function getAdTypeByElementId(id) {
        return document.getElementById(id).getAttribute('data-advertisement');
    }
    
    /**
     * If it's threefans site then should not have the feature of billboard fallback to leader board.
     * At the moment, it's detected by meta brandname = 'threefans'
     */
    function hasBillboardFallback() {
        return getMetatag('brandname') != 'threefans';
    }

    function replaceBillboardWithBanner(billboardId) {
        var elBillboard = $('#' + billboardId);
        // banner in mobile should not be sticky, and should not be able to close, remove the class if it exists
        if (isSmallScreen()) {
            elBillboard.parent().removeClass('AdWrapper--close-show').parent().removeClass('js-NavBarAdWrapper-fixed');
        }

        var bannerId = 'banner-' + new Date().getTime();

        var adType = 'banner';
        var site = getSiteName();
        var targeting = BILLBOARD_FALLBACK_TARGETING;
        var activeSize = getRequiredAdSizes(getAdSizes(), adType);

        var elBanner = $('<div></div>').attr({
            'id': bannerId,
            'data-advertisement': adType,
            'data-targeting': targeting
        });
        elBillboard.after(elBanner);
        elBillboard.remove();

        slot = googletag.defineSlot('/4100/' + site, activeSize, bannerId)
          .addService(googletag.pubads())
          .setTargeting('tile', tile++)
          .setTargeting('sponsored', isSponsored());

        // companion ad only for desktop
        if (!isSmallScreen()) {
            slot.addService(googletag.companionAds());
        }

        if (targeting) {
            slot.setTargeting('kw', targeting);
        }

        slots[bannerId] = slot;
        googletag.destroySlots([slots[billboardId]]);
        delete slots[billboardId];

        googletag.display(bannerId);
    }

    /**
     *  Finalise setting up the ads after the content has been loaded properly.
     */
    function runAdConfiguration() {
        for (var idx = 0; idx < displayAds.length; ++idx) {

            var elementId = displayAds[idx];
            var domElement = document.getElementById(elementId);

            initialiseAdvertisement(domElement);
        }
    }


    /**
     * Iterate over all ads and display them
     */
    function displayRegisteredAds() {
        for (var idx = 0; idx < displayAds.length; ++idx) {
            googletag.display(displayAds[idx]);
        }
    }
    
    /**
     * This is tricky. Ad contains wrap in data-fn='collapse' containers needed to be hidden if the ad is empty in some scenarios,
     * because the container is outside the scope of the ad component, so can't be controlled in sightly page.
     * If the container's hidden in author mode, users can't even see the component which preventing configuring it.
     * wcmmode.edit is passed by data-wcmmode-edit attribute.
     * adElement: jquery object
     */
    function hideCollapsibleContainerInNonEditMode(adElement) {
        if (!isAuthor()) {
            adElement.closest("[data-fn='collapse']").hide();
        }
    }

    /**
     * Add document onReady handler
     */
    document.addEventListener("DOMContentLoaded", function() {

        runAdConfiguration();

        // // Custom popup tracking
        googletag
            .defineSlot('/4100/' + getSiteName(), [1, 2], 'custom-popup-tracking')
            .addService(googletag.pubads())
            .setTargeting('sponsored', isSponsored());

        if (!isSmallScreen()) {
            initialiseSkinAdvertisement();
        }

        // run the base code to enable the services
        initialiseGoogleAds();

        // 1. Enable for production to improve performance
        // 2/ Used to hide ads that aren't being loaded e.g billboards
        googletag.pubads().enableSingleRequest();
        googletag.pubads().collapseEmptyDivs(true);

        // Add googletag.events.SlotRenderEndedEvent listener to handle the condition when no ads are served into a
        // specific slot. Must first find slot the event belongs to.
        googletag.pubads().addEventListener('slotRenderEnded', function(event) {
            var id = event.slot.getSlotElementId();
            // not empty? don't bother finding it.
            if (!event.isEmpty) {
                if (getAdTypeByElementId(id) === 'billboard') {
                    MWS.StickyAd.stickyAd();
                }
                // if it's billboard or banner then remove display:none
                var adType = getAdTypeByElementId(id);
                if (adType === 'billboard' || adType === 'banner') {
                    $('div.NavBarAd.NavBarAd-primary').css('display', '');
                }
                return;
            } else if (getAdTypeByElementId(id) === 'billboard' && hasBillboardFallback()) {
                // If it's not threefans(determined by meta brandname==threefans) and it's from billboard then replace it with leaderboard(banner)
                replaceBillboardWithBanner(id);
            }

            if (slots[id]) {
                hideCollapsibleContainerInNonEditMode($('#' + id));
            }
        });

        googletag.enableServices();

        // 1. Disable load is Prebid is activated
        if (isPrebidEnable()) {
            googletag.pubads().disableInitialLoad();
            initialisePrebid();
        }

        displayRegisteredAds();

        // Refresh directly non prebid ad slot
        googletag.pubads().refresh(nonHeaderBiddingSlots);

        initialised = true;

    });


    // expose the functions on the MWS namespace
    ns.MWS = ns.MWS || {};
    ns.MWS.Ads = {
        display : function(id) {
            
            if (initialised) {
                initialiseAdvertisement(document.getElementById(id));
                //googletag.display(id);
            } else {
                log("Pushing to array");
                displayAds.push(id);
            }
        }
    };

})(window);
