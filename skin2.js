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

var divAntoine = document.createElement('div');
divAntoine.id = 'testAntoine';
document.body.insertBefore(divAntoine, document.body.firstChild);


var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
pbjs.adserverRequestSent = false

googletag.cmd.push(function() {
         googletag.pubads().disableInitialLoad();
         googletag.defineSlot('/4362169/Ad_test', [300,250], 'testAntoine').addService(googletag.pubads());
         googletag.pubads().enableSingleRequest();
         googletag.pubads().collapseEmptyDivs();
         googletag.enableServices();
});

function sendAdserverRequest() {
    if (pbjs.adserverRequestSent) return;
    pbjs.adserverRequestSent = true;
    googletag.cmd.push(function() {
        pbjs.que.push(function() {
            pbjs.setTargetingForGPTAsync();
            googletag.pubads().refresh();
        });
    });
}         
