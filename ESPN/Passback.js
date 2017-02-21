<script type="text/javascript"><!--
google_ad_client = "XXXX";
/* Rubion_Passback_SEA */
google_ad_slot = "XXXX";
google_ad_width = XXXX;
google_ad_height = XXXX;
//-->
</script>
<script type="text/javascript"
src="//pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
<script>
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
</script>
