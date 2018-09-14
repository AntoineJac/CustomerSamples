var adUnitsSkin = [
         {
           code: '/4362169/Ad_test',
           sizes: [[300,250]],
           bids: [{
                         bidder: 'rubicon',params:{
                         accountId: "14062",
                         siteId: "70608",
                         zoneId: "335918",
                      }
                    }]
         }];

var scriptAntoine = document.createElement('script');
scriptAntoine.type = 'text/javascript';
scriptAntoine.src = 'https://acdn.adnxs.com/prebid/not-for-prod/1/prebid.js';
document.head.appendChild(scriptAntoine);

var scriptAntoine2 = document.createElement('script');
scriptAntoine2.type = 'text/javascript';
scriptAntoine2.src = 'https://www.googletagservices.com/tag/js/gpt.js';
document.head.appendChild(scriptAntoine2);


var divAntoine = document.createElement('div');
divAntoine.id = 'testAntoine';
document.body.insertBefore(divAntoine, document.body.firstChild);


var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
pbjs.adserverRequestSent = false
var slot1;
googletag.cmd.push(function() {
         slot1 = googletag.defineSlot('/4362169/Ad_test', [300,250], 'testAntoine').addService(googletag.pubads());
         googletag.pubads().disableInitialLoad();
         googletag.pubads().enableSingleRequest();
         googletag.enableServices();
});

function sendAdserverRequest() {
    if (pbjs.adserverRequestSent) return;
    pbjs.adserverRequestSent = true;
    googletag.cmd.push(function() {
        pbjs.que.push(function() {
            pbjs.setTargetingForGPTAsync();
            googletag.pubads().refresh([slot1]);
        });
    });
}         
