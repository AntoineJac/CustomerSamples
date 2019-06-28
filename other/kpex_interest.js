var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

// Define prebid variable
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];
var headerBiddingSlots = [];
var nonHeaderBiddingSlots = [];

// For interest.co.nz = business, mediaworks will be different for each sections (detecting from url)
var verticalOutput = "business"; 

/* Start of the gpt code */
googletag.cmd.push(function() {

  var billboard_mapping = googletag.sizeMapping().
    addSize([1024, 0], [[970, 250], [909, 128], [760, 120], [728, 90]]).
    addSize([800, 0], [[760, 120], [728, 90]]).
    addSize([768, 0], [728, 90]).
    addSize([0, 0], [300, 250]).
    build();
  var sidebar_mapping = googletag.sizeMapping().
    addSize([0, 0], []).
    addSize([1366, 0], [[300, 600], [300, 250]]).
    build();
  var story_mapping = googletag.sizeMapping().
    addSize([1024, 0], [[760, 120], [728, 90], [300, 250]]).
    addSize([0, 0], [300, 250]).
    build();

  var slotBillboard_1 = googletag.defineSlot('/2332506/interest_19_ROS_Billboard', [[909, 128], [970, 250], [300, 250], [728, 90], [760, 120]], 'div-gpt-ad-1554342893264-0').
  defineSizeMapping(billboard_mapping).
  addService(googletag.pubads());

  var slotBillboard_2 = googletag.defineSlot('/2332506/interest_19_Homepage_Billboard', [[970, 250], [760, 120], [909, 128], [300, 250], [728, 90]], 'div-gpt-ad-1554424311568-0').
  defineSizeMapping(billboard_mapping).
  addService(googletag.pubads());

  var slotBillboard_3 = googletag.defineSlot('/2332506/interest_19_Homepage_Billboard', [[728, 90], [760, 120], [300, 250], [970, 250], [909, 128]], 'div-gpt-ad-1554424702548-0').
  defineSizeMapping(billboard_mapping).
  addService(googletag.pubads());

  var slotBillboard_4 = googletag.defineSlot('/2332506/interest_19_Homepage_Billboard', [[300, 250], [728, 90], [909, 128], [970, 250], [760, 120]], 'div-gpt-ad-1554424798626-0').
  defineSizeMapping(billboard_mapping).
  addService(googletag.pubads());


  var slotMred_1 = googletag.defineSlot('/2332506/interest_19_POS1_MREC', [[300, 600], [300, 250]], 'div-gpt-ad-1554427224873-0').
  defineSizeMapping(sidebar_mapping).
  addService(googletag.pubads());

  var slotMred_2 = googletag.defineSlot('/2332506/interest_19_POS2_MREC', [[300, 600], [300, 250]], 'div-gpt-ad-1554427795355-0').
  defineSizeMapping(sidebar_mapping).
  addService(googletag.pubads());

  var slotLeadMrec_1 = googletag.defineSlot('/2332506/interest_19_Story_Leaderboard_MREC', [[728, 90], [760, 120], [300, 250]], 'div-gpt-ad-1554433161181-0')
  .defineSizeMapping(story_mapping).
  addService(googletag.pubads());

  // Disable initial load for Prebid
  googletag.pubads().disableInitialLoad();
  googletag.pubads().enableAsyncRendering();
  googletag.pubads().enableSingleRequest();
  googletag.pubads().collapseEmptyDivs();
  googletag.enableServices();

  // Call ads for slots not waiting for header bidding, not doing anything if nonHeaderBiddingSlots is null
  googletag.pubads().refresh(nonHeaderBiddingSlots);

  /* Start of the Prebid Code - Integration with Rubicon Demand Manager */

  // Define all the size mapping according to the google mapping
  var billboard_mapping_prebid = [
    { minViewPort: [0, 0], sizes: [[300, 250]] },
    { minViewPort: [768, 0], sizes: [[728, 90]] },
    { minViewPort: [800, 0], sizes: [[760, 120], [728, 90]] },    
    { minViewPort: [1024, 0], sizes: [[970, 250], [970, 90], [728, 90]] }
  ];

  var sidebar_mapping_prebid = [
    { minViewPort: [0, 0], sizes: [] },
    { minViewPort: [1366, 0], sizes: [[300, 600], [300, 250]] }
  ];

  var story_mapping_prebid = [
    { minViewPort: [0, 0], sizes: [[300, 250]] },
    { minViewPort: [1024, 0], sizes: [[760, 120], [728, 90], [300, 250]] }
  ];

  var global_mapping_prebid = [
    { minViewPort: [0, 0], sizes: [[300, 250]] },
    { minViewPort: [1024, 0], sizes: [[970, 250], [970, 90], [300, 600], [760, 120], [728, 90], [300, 250]] }
  ]; 

  // Create a size mapping for Demand Manager
  var sizeMappings = {
    "div-gpt-ad-1554342893264-0": billboard_mapping_prebid,
    "div-gpt-ad-1554424311568-0": billboard_mapping_prebid,
    "div-gpt-ad-1554424702548-0": billboard_mapping_prebid,
    "div-gpt-ad-1554424798626-0": billboard_mapping_prebid,
    "div-gpt-ad-1554427224873-0": sidebar_mapping_prebid,
    "div-gpt-ad-1554427795355-0": sidebar_mapping_prebid,
    "div-gpt-ad-1554433161181-0": story_mapping_prebid,
    "__global__": global_mapping_prebid
  }

  // Define which slot to monetise via Prebid 
  headerBiddingSlots.push(slotBillboard_1, slotBillboard_2, slotBillboard_3, slotBillboard_4);
  headerBiddingSlots.push(slotMred_1, slotMred_2);
  headerBiddingSlots.push(slotLeadMrec_1);

  // Request the bids
  pbjs.rp.requestBids({
    callback: sendAdServerRequest,
    gptSlotObjects: headerBiddingSlots,
    sizeMappings:  sizeMappings,
    data: {
      vertical: verticalOutput,
      prebid: "true"
    }
  });

  /* End of the Prebid Code */

});
/* End of the gpt code */


/* Start of the Prebid Code - Send adserver request function */
pbjs.adserverRequestSent = false;

// Callback function
var sendAdServerRequest = function(headerBiddingSlots) {
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
};

// Failsafe timeout which is DM timeout (2000ms) + 500ms
setTimeout(function() {
  sendAdServerRequest(headerBiddingSlots);
}, 2500);
/* End of the Prebid Code - Send adserver request function */


