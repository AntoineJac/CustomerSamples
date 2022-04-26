<script runat=server>
Platform.Load("Core","1");
var now = new Date();
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
var sendLog_DE = "sendLog_DE";
var OptoutLog_DE = "OptoutLog_DE";
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

triggerBulkApi("Object__C", {isTransac: "False", operation: "upsert", externalIdFieldName: "externalIdFieldName__c"});
triggerBulkApi("Object2__C", {isOptout: "True", operation: "update"});

function triggerBulkApi(object, options) {
	if (clientid && clientsecret && username && password) {
		//Write("Credentials Received - processing bulk api ...<br>");
		var tokenResp = retrieveToken(host,clientid,clientsecret,username,password);

		var token = tokenResp.access_token;
		var instURL = tokenResp.instance_url;

		var bulkJobJSON = createBulkReq(instURL, token, object, options);

		var jobid = bulkJobJSON.id;
		var jobstate = bulkJobJSON.state;

        if (jobid) {
		    var StatsDE = DataExtension.Init(Stats_DE);
		    var resultInitiate = StatsDE.Rows.Add({BulkJobId:jobid,BulkJobState:jobstate, Object:object});

		    var numberOfRecords = processBatchData(instURL, token, jobid, options);
		    var resultUpload = StatsDE.Rows.Update({BulkJobState:"Record Inserted",NumberRecords:numberOfRecords}, ["BulkJobId"], [jobid]);

		    var bulkJobCloseJSON = closeBulkReq(instURL, token, jobid);
		    jobstate = bulkJobCloseJSON.state;
		    var resultClose = StatsDE.Rows.Update({BulkJobState:jobstate}, ["BulkJobId"], [jobid]);
        }
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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        hour = '' + d.getHours();
        minute = '' + d.getMinutes();
        second = '' + d.getSeconds();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    if (hour.length < 2) 
        hour = '0' + hour;
    if (minute.length < 2) 
        minute = '0' + minute;
	if (second.length < 2) 
        second = '0' + second;


    var formattedDate = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second+'Z';
    return formattedDate
}

function processBatchData(instURL, token, jobid, options) {
	var cols, csvData, deCustKey;
	var moreData = true;
	var reqID = null;
	var batchCount = 0;
	var numItems = 0;

	if (options.isOptout == "True") {
		deCustKey = OptoutLog_DE;
		cols = ["Id","AccountId","PersonHasOptedOutOfEmail"];
		csvData = "Id,PersonHasOptedOutOfEmail" + "\r\n";
	} else {
		deCustKey = sendLog_DE;
		cols = ["Id", "Name","Activity_Date","externalIdFieldName"];

		csvData = "Name,Activity_Date__c,externalIdFieldName__c" + "\r\n";
	}

	while (moreData && ((new Date().getTime() - start) < timeout)) {
		var insertArr = [];
		batchCount++;
		moreData = false;
		//Call function to get records from DE
		var deReturn = getDERowsArray(deCustKey, cols, reqID, options);

		moreData = deReturn.HasMoreRows;
		reqID = deReturn.RequestID;

		//iterate for each batch of 2500 records returned
			for (var i = 0; i < deReturn.Results.length; i++) {
				var insertObj = {};
				var recArray = [];
				var currRecord = deReturn.Results[i];

				for (var j = 0; j < currRecord.Properties.length; j++) {

                    if (currRecord.Properties[j].Name.toLowerCase().indexOf('date') > -1) {
						var dateFieldConvert = formatDate(currRecord.Properties[j].Value);
						recArray.push(dateFieldConvert);
						continue;
					}
					
					if (currRecord.Properties[j].Name != "_CustomObjectKey" && currRecord.Properties[j].Name != "Id") {
						recArray.push(currRecord.Properties[j].Value);
					}

					if (currRecord.Properties[j].Name == "Id") {
						insertObj.CustomerKey = deCustKey;
						insertObj.Properties = [
							{
								Name: "Id",
								Value: currRecord.Properties[j].Value
							},
							{
								Name: "IsToBeUpdated",
								Value: "False"
							}
						];
					}

				}

				csvData += recArray.join(",") + "\r\n";
				numItems++;
				insertArr.push(insertObj);
		}
		updateRecords(insertArr);
	}

	//Send update request to Bulk API job with final CSV Data
	var updJobJSON = updateBulkReq(instURL, token, jobid, csvData);
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

function getDERowsArray(deCustKey, cols, reqID, options) {
	var filterRow;

	var filterRowUpdated = {
		Property:"IsToBeUpdated",
		SimpleOperator:"equals",
		Value:"True"
	};

	var filterRowTransac = {
		Property:"IsTransactional",
		SimpleOperator:"equals",
		Value:options.isTransac
	}

	var filterRowAppOptout = {
		Property:"AccountId",
		SimpleOperator:"notEquals",
		Value:" "
	}

	if (options.isApp || options.isOptout) {
		filterRow = {
			LeftOperand: filterRowUpdated,
			LogicalOperator: "AND",
			RightOperand: filterRowAppOptout
		};
	} else {
		filterRow = {
			LeftOperand: filterRowUpdated,
			LogicalOperator: "AND",
			RightOperand: filterRowTransac
		};
	}

	if (reqID == null) {
		var deRecs = prox.retrieve("DataExtensionObject[" + deCustKey + "]", cols, filterRow); //executes the proxy call
	} else {
		var deRecs = prox.getNextBatch("DataExtensionObject[" + deCustKey + "]", reqID);
	}

	return deRecs;
}

function createBulkReq(host,token,object,options) {
	var url = host + "/services/data/"+api_version+"/jobs/ingest/";
	var payload = {};
	payload.object = object;
	payload.contentType = "CSV";
	payload.operation = options.operation;
	payload.lineEnding = "CRLF";
	payload.externalIdFieldName =  options.externalIdFieldName;

	var req = new Script.Util.HttpRequest(url);
	req.emptyContentHandling = 0;
	req.retries = 2;
	req.continueOnError = true;
	req.contentType = "application/json";
	req.method = "POST";
	req.setHeader("Authorization", "Bearer " + token);
	req.postData = Stringify(payload);

	var resp = req.send();
	var resultStr = String(resp.content);
	var resultJSON = Platform.Function.ParseJSON(String(resp.content));

	return resultJSON;
}

function updateBulkReq(host,token,jobid,csvData) {
	var url = host + "/services/data/"+api_version+"/jobs/ingest/"+jobid+"/batches";
	var req = new Script.Util.HttpRequest(url);
	req.emptyContentHandling = 0;
	req.retries = 2;
	req.continueOnError = true;
	req.contentType = "text/csv; charset=UTF-8";
	req.method = "PUT";
	req.setHeader("Authorization", "Bearer " + token);
	req.postData = csvData;

	var resp = req.send();
	var resultStr = String(resp.content);
	var resultJSON = Platform.Function.ParseJSON(String(resp.content));

	return resultJSON;
}

function closeBulkReq(host,token,jobid) {
	var url = host + "/services/data/"+api_version+"/jobs/ingest/"+jobid;
	var payload = {}
	payload.state = "UploadComplete";

	var req = new Script.Util.HttpRequest(url);
	req.emptyContentHandling = 0;
	req.retries = 2;
	req.continueOnError = true;
	req.contentType = "application/json";
	req.method = "PATCH";
	req.setHeader("Authorization", "Bearer " + token);
	req.postData = Stringify(payload);

	var resp = req.send();
	var resultStr = String(resp.content);
	var resultJSON = Platform.Function.ParseJSON(String(resp.content));

	return resultJSON;
}

</script>
