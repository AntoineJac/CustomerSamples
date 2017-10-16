document.write('<img src="https://secure-assets.rubiconproject.com/static/psa/casala/CASALA_leaderboard_ad.gif">');
function get_container_iframe()
         {
          var rtn_iframe=null;
          var iframes=window.parent.document.getElementsByTagName('iframe');
          for (var i=0; i<iframes.length; ++i)
              {try
                   {var d=iframes[i].contentDocument || iframes[i].contentWindow.document || iframes[i].document; //ie | firefox etc | ie5
                    if (d===window.document)
                       {rtn_iframe=iframes[i];
                        break;
                       }
                   }
               catch(e) {}
              }
          return rtn_iframe;
         }
get_container_iframe().onload = function(){

	try { 
		if (resize){
	         get_container_iframe().width= "970px !important";
	         get_container_iframe().height= "66px !important";
	     }
 }
     catch(err){
     	console.log("resizeIsNotDefined");
}
};
