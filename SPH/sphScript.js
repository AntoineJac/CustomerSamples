	var lotame_id = typeof(ccauds) != "undefined" ? lotame_id = ccauds.Profile.pid : "";
    	var fluid = 'fluid';

     if (window.location.pathname != "/") {

     	document.write('<scr'+'ipt type="text/javascript" src="//ads.rubiconproject.com/header/10800.js" id="fastlane-express" data-flex="on">    </scr'+'ipt>');

        	var googletag = googletag || {};
			googletag.cmd = googletag.cmd || [];

      googletag.cmd.push(function() {
	        googletag.pubads().enableSyncRendering = function(){console.log("sync is disable and asyn is on")};
	    	googletag.pubads().enableAsyncRendering(); 

    });
  }


