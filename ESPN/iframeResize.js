<script>
function get_container_iframe1()
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

	         get_container_iframe1().width= "728px !important";
	         get_container_iframe1().height= "90px !important";

</script>
<!--  Begin Rubicon Project Tag -->
<!--  Site: ESPN   Zone: ESPN - 970x66 Test   Size: Leaderboard  -->
<script language="JavaScript" type="text/javascript">
var resize = "true";
rp_account   = 'XXXX';
rp_site      = 'XXXX';
rp_zonesize  = 'XXXX';
rp_adtype    = 'js';
rp_smartfile = '[SMART FILE URL]';
</script>
<script type="text/javascript" src="//ads.rubiconproject.com/ad/XXXX.js"></script>
<!--  End Rubicon Project Tag -->
