<script runat=server>
Platform.Load("Core","1");
var now = new Date()
var start = now.getTime();
var timeout = 1500000; //This is 25 minutes

// Enter your SF credentials here
var clientid = "clientid";
var clientsecretEncrypt = "clientsecretEncrypt";
var username = "username";
var passwordEncrypt = "passwordEncrypt";

// Enter your SF keys details here
var symetricKey = "symetricKey";
var saltKey = "saltKey";
var IVKey = "IVKey";

// Enter your SF DE logs here
var Stats_DE = "Stats_DE";

// Enter your SF ennvironement here
//For prod use https://login.salesforce.com/services
//For dev use https://test.salesforce.com/services
var host = "https://login.salesforce.com/services";
var api_version = "v53.0";

var prox = new Script.Util.WSProxy();

function decryptString(encStr) {
   var amp = '%' + "%[ Output(Concat(DecryptSymmetric('" + encStr + "', 'AES',";
      amp += "'" + symetricKey + "', @null,";
      amp += "'" + saltKey + "', @null,";
      amp += "'" + IVKey + "', @null))))";
      amp += ']%' + '%';

   var val = Platform.Function.TreatAsContent(amp);
   
   return val;
}

var clientsecret = decryptString(clientsecretEncrypt);
var password = decryptString(passwordEncrypt);

updateBulkStats();

function updateBulkStats() {
    if (clientid && clientsecret && username && password) {
        //Write("Credentials Received - processing bulk api ...<br>");
        var tokenResp = retrieveToken(host,clientid,clientsecret,username,password);

        var token = tokenResp.access_token;
        var instURL = tokenResp.instance_url;

        var numberOfRecords = processBatchData(instURL, token, jobid);
    }
}

function retrieveToken(host,clientid,clientsecret,username,password) {

    var tokenstr = "/oauth2/token?grant_type=password&client_id="+clientid+"&client_secret="+clientsecret+"&username="+username+"&password="+password;
    var url = host + tokenstr;
    var req = new Script.Util.HttpRequest(url);
    req.emptyContentHandling = 0;
    req.retries = 2;
    req.continueOnError = true;
    req.contentType = "application/json";
    req.method = "POST";
    
    var resp = req.send();
    var resultStr = String(resp.content);
    var resultJSON = Platform.Function.ParseJSON(String(resp.content));

    return resultJSON;
}

function processBatchData(instURL, token, jobid) {
    //Provide External key for SFSubscribersDE
    var deCustKey = Stats_DE;
    var cols = ["BulkJobId","BulkJobState","CreatedDate"];
    //To validate if more data in Retrieve
    var moreData = true;
    numItems = 0;
    //Used with Batch Retrieve to get more data
    var reqID = null;
    var batchCount = 0;
    //String to store CSV Data to send to SF Bulk API

    while (moreData && ((new Date().getTime() - start) < timeout)) {
        var insertArr = [];
        batchCount++;
        moreData = false;
        //Call function to get records from DE
        var deReturn = getDERowsArray(deCustKey, cols, reqID);

        moreData = deReturn.HasMoreRows;
        reqID = deReturn.RequestID;
      
        //iterate for each batch of 2500 records returned
        for (var i = 0; i < deReturn.Results.length; i++) {
            var insertObj = {};
            var currRecordJobId = "";
            var currRecord = deReturn.Results[i];
            for (var j = 0; j < currRecord.Properties.length; j++) {
                if (currRecord.Properties[j].Name == "BulkJobId") {
                    currRecordJobId= currRecord.Properties[j].Value;
                }
            }
            var reqStatusJson = getBulkReqStatus(instURL, token, currRecordJobId);
            insertObj.CustomerKey = deCustKey;
            insertObj.Properties = [
                {
                    Name: "BulkJobId",
                    Value: currRecordJobId
                },
                {
                    Name: "BulkJobState",
                    Value: reqStatusJson.state
                },
                {
                    Name: "NumberRecordsProcessed",
                    Value: reqStatusJson.numberRecordsProcessed
                },
                {
                    Name: "NumberRecordsFailed",
                    Value: reqStatusJson.numberRecordsFailed
                }
            ];
            numItems++;
            insertArr.push(insertObj);
        }
        updateRecords(insertArr);
        //Use batchCount if needed for debug log to identify number of batches called;
    }
    return numItems;
}


function updateRecords(batches) {
    var options = { 
        SaveOptions: [
            {
                PropertyName: "*", 
                SaveAction: "UpdateAdd"
            }
        ]
    };
    if (batches.length) {
        var deUpdate = prox.updateBatch("DataExtensionObject",batches,options);
    } else {
        var deUpdate = "noDataToBeUpdated";
    }

    return deUpdate;
}

function getDERowsArray(deCustKey, cols, reqID) {
    var filterRow = {
        Property:"BulkJobState",
        SimpleOperator:"IN",
        Value:["UploadComplete", "InProgress", "Open"]
    };
    if (reqID == null) {
      var deRecs = prox.retrieve("DataExtensionObject[" + deCustKey + "]", cols, filterRow); //executes the proxy call
    } else {
      var deRecs = prox.getNextBatch("DataExtensionObject[" + deCustKey + "]", reqID);
    }

    return deRecs;
}

function getBulkReqStatus(host,token, jobid) {

    var url = host + "/services/data/"+api_version+"/jobs/ingest/"+jobid;

    var req = new Script.Util.HttpRequest(url);
    req.emptyContentHandling = 0;
    req.retries = 2;
    req.continueOnError = true;
    req.contentType = "application/json";
    req.method = "GET";
    req.setHeader("Authorization", "Bearer " + token);

    var resp = req.send();
    var resultStr = String(resp.content);
    var resultJSON = Platform.Function.ParseJSON(String(resp.content));

    return resultJSON;
}  

</script>
