<!-- Start of Rubicon Project Tag -->

rp_account = '[user_RubiconAccount]'; // put real number if always the same tag
rp_site = '[user_Rubiconsite]';
rp_zonesize = '[user_RubiconZone]';
rp_adtype = 'js';
rp_smartfile = '[SMART FILE URL]';
rp_floor = '[user_Floor]' // variable du template

document.write('<scr' + 'ipt type="text/javascript" src="http://ads.rubiconproject.com/ad/' + rp_site + '.js"></sc' + 'ript>');

<!--  End Rubicon Project Tag -->


<!-- Start of Campaign Tag -->
var n=0;   // this variable is a timeout for Rubicon

(function waitForRubicon() {
    if (typeof Rubicon !== "undefined") {

        if (typeof Passback !== "undefined") {

            [sas_creative];  // Will be replaced by your redirect script or the JS code
            // Copy paste Smart template if you would like to use a rich media

            var head = document.getElementsByTagName('head').item(0);
            var script = document.createElement("script");
            script.setAttribute('src', '[sas_insertionCountPixelUrl]');
            script.setAttribute('type', 'text/javascript');
            document.body.appendChild(script);

        } else {
            //Optionnl to count the number of Rubicon impressions by trigger an impression pixel created in Smart
            var head = document.getElementsByTagName('head').item(0);
            var script = document.createElement("script");
            script.setAttribute('src', 'PixelImpressionsCountingInsertion');
            script.setAttribute('type', 'text/javascript');
            document.body.appendChild(script);
            // End of the optinal part
        }


    }

    else if (n>3) { 
<php? 
// ---code php pour bloquer le domaine http://optimized-by.rubiconproject.com --- 
?> 
    		[sas_creative];  // Will be replaced by your redirect script or the JS code
            // Copy paste Smart template if you would like to use a rich media

            var head = document.getElementsByTagName('head').item(0);
            var script = document.createElement("script");
            script.setAttribute('src', '[sas_insertionCountPixelUrl]');
            script.setAttribute('type', 'text/javascript');
            document.body.appendChild(script);
        } 



     else {
        setTimeout(function() {
        	n++;
            waitForRubicon();
        }, 250);
    }
}());


<!--  End Campaign Tag -->