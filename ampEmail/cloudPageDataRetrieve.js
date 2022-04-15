<script runat="server" language="JavaScript">
  
  // Load the SFMC Core Library
  Platform.Load("core", "1");

  // Arrays of allowed values for both Sender Address and Sender Origin
  // Sender Address is the from address when you send an email, make sure your expected from address is included in the list
  // Sender Origin represents the domain originating the request
  // The Marketing Cloud origin is in place to allow testing in Subscriber Preview, update that value to match your stack
  var isAllowed = {
    senderAddress:[
      'amp@gmail.dev', 
      'AMPInternalPilot@salesforce.com',
      'ajacquemin@salesforce.com'
    ],
    senderOrigin:[
      'https://playground.amp.dev',
      'https://amp.gmail.dev',
      'https://mail.google.com',
      'https://user-content.s4.marketingcloudapps.com',
      'https://user-content.s4.sfmc-content.com'
    ]
  }

  // Getting headers from the request made to the Code Resource
  var emailSender = Platform.Request.GetRequestHeader("AMP-Email-Sender")
  var emailOrigin = Platform.Request.GetRequestHeader("Origin")
  var sourceOrigin = Platform.Request.GetQueryStringParameter("__amp_source_origin");
  
  //Helper function to check arrays
  Array.includes = function(req, arr) {
    for(i = 0; i < arr.length; i++) {
      if (!ret || ret == false) { 
        ret = req.toUpperCase() == arr[i].toUpperCase() ? true: false;
        }
      }
    return ret;
  }

  // Check the email sender and origin from the request against the allowed values in `isAllowed`
  // If anything fails, an error is raised and the request returns no data
  if(emailSender) {
    if(Array.includes(emailSender, isAllowed.senderAddress)) {
      HTTPHeader.SetValue("AMP-Email-Allow-Sender", emailSender)
    } else {
      Platform.Function.RaiseError("Sender Not Allowed",true,"statusCode","3");
    }
  } else if(emailOrigin) {
    if(Array.includes(emailOrigin, isAllowed.senderOrigin)) {
      if (sourceOrigin) {
        HTTPHeader.SetValue("Access-Control-Allow-Origin", emailOrigin);
        HTTPHeader.SetValue("Access-Control-Expose-Headers", "AMP-Access-Control-Allow-Source-Origin");
        HTTPHeader.SetValue("AMP-Access-Control-Allow-Source-Origin", sourceOrigin);
        // added for testing in certain environments
        HTTPHeader.SetValue("Access-Control-Allow-Credentials", "true");        
      }
    } else {
      Platform.Function.RaiseError("Origin Not Allowed",true,"statusCode","3");
    }
  } else {
    // If neither header is present raise an error and return no data
    Platform.Function.RaiseError("Origin and Sender Not Present",true,"statusCode","3");
  }
  
  // Your Code Here.
  // Once we are below the header checks you can add what ever SSJS you would like to include.


  var dataDE = DataExtension.Init("test_amp_products");
  var objDE = dataDE.Rows.Retrieve();

  var obj = {
    "items": [
      {
        "prod_items": objDE
      }
    ]
  };

  Write(Stringify(obj));
</script>
