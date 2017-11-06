

<html>
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <!-- Prebid Config Section START -->
  <!-- Make sure this is inserted before your GPT tag -->
  <script> 
    var PREBID_TIMEOUT = 2000;

    var adUnits = [{
        code: 'mrec',
        sizes: [300, 250],
        bids: [{
            bidder: 'appnexus',
            params: {
               placementId: '12324414'
            }
        }]
    },{
        code: 'billboard',
        sizes: [728, 90],
        bids: [{
            bidder: 'appnexus',
            params: {
               placementId: '12324415'
            }
        }]
    }];
    
    var pbjs = pbjs || {};
    pbjs.que = pbjs.que || [];

  </script>
  <!-- Prebid Config Section END -->
  
  <!-- Prebid Boilerplate Section START. No Need to Edit. -->
  <script type="text/javascript" src="//acdn.adnxs.com/prebid/not-for-prod/prebid.js" async></script>
  <script>
    var googletag = googletag || {};
    googletag.cmd = googletag.cmd || [];
    googletag.cmd.push(function() {
        googletag.pubads().disableInitialLoad();
    });

    pbjs.que.push(function() {
        pbjs.addAdUnits(adUnits);
        pbjs.requestBids({
            bidsBackHandler: sendAdserverRequest
        });
    });

    function sendAdserverRequest() {
        if (pbjs.adserverRequestSent) return;
        pbjs.adserverRequestSent = true;
        googletag.cmd.push(function() {
            pbjs.que.push(function() {
                pbjs.setTargetingForGPTAsync();

                
                // -- 1. Remove Prebid's page-level slot refresh
                // googletag.pubads().refresh();          



                // -- 2. Trigger prebid_refresh_queue instead

                if (window.prebid_refresh_queue && Array.isArray(window.prebid_refresh_queue))
                    PrebidRefreshQueuedEvents = window.prebid_refresh_queue;
                window.prebid_refresh_queue = {
                    "push": function () {
                        var events = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            events[_i] = arguments[_i];
                        }
                        if (typeof events === "undefined")
                            return;
                        for (var i = 0; i < events.length; i++) {
                            var evt = events[i];
                            if (typeof evt === "function") {
                                evt();
                            }
                        }
                    }
                };
                window.prebid_refresh_queue.push.apply(window.prebid_refresh_queue, PrebidRefreshQueuedEvents); 

            });
        });
    }

    setTimeout(function() {
        sendAdserverRequest();
    }, PREBID_TIMEOUT);

  </script>
  <!-- Prebid Boilerplate Section END -->

  <script>
    (function () {
        var gads = document.createElement('script');
        gads.async = true;
        gads.type = 'text/javascript';
        var useSSL = 'https:' == document.location.protocol;
        gads.src = (useSSL ? 'https:' : 'http:') +
                '//www.googletagservices.com/tag/js/gpt.js';
        var node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(gads, node);
    })();
  </script>


</head>

<body>
<h1>Prebid with lazy load</h1>

<h5>Billboard</h5>
<div id='billboard'></div>

<h5>Mrec</h5>
<div id='mrec'></div>

<div style="color: red">
Billboard will display in <strong><span id="billboard-timeout"></span></strong><br/>
Mrec will display in <strong><span id="mrec-timeout"></span></strong><br/>
</div>

<script>

    googletag.cmd.push(function () {

        var mrecSlot = googletag.defineSlot('/19968336/header-bid-tag-0', [300, 250], 'mrec').addService(googletag.pubads());
        var billboardSlot = googletag.defineSlot('/19968336/header-bid-tag1', [728, 90], 'billboard').addService(googletag.pubads());

        googletag.pubads().collapseEmptyDivs();
        googletag.pubads().enableSingleRequest();
        googletag.pubads().disableInitialLoad();

        googletag.enableServices();
    
        delayLoadAd(mrecSlot, 5000, '#mrec-timeout');
        delayLoadAd(billboardSlot, 3000, '#billboard-timeout');
    });

    function delayLoadAd(slot, time, statusId) {
        var timeout = time;
        var adInterval = setInterval(function () {
            timeout = timeout - 1000;

            if (timeout == 0) {
                // 3. Enclose the display call within prebid_refresh_queue (after Prebid finishes its auction)
                window.prebid_refresh_queue = window.prebid_refresh_queue || {};
                window.prebid_refresh_queue.push(function() {
                    googletag.cmd.push(function() { 
                        googletag.pubads().refresh([slot], { changeCorrelator: false });
                    });
                    clearInterval(adInterval);  
                });
            }

            $(statusId).text(timeout/1000);
        }, 1000);
    }

</script>
</body>
</html>
