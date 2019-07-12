from server import services
import json
from suds.sudsobject import asdict

services.connectToNetwork(4362169)
print "connected"
orderIds = [XXXX]
sizesCrea = ["300x250"]
numberOfCrea = 2;
# placementIds = [XXXX]
# adunits = [XXXX]
updated_line_items = []
creativeIds = []

def batchCreate(method, elements, json=True):
    counter = 0
    itemsPerRequest = []
    result = []
    for element in elements:
        if(counter == 200):
            result.extend(method(itemsPerRequest))
            counter = 0
            itemsPerRequest = []
            print 'updated'
        itemsPerRequest.append(element)
        counter += 1
    if len(itemsPerRequest) != 0:
        result.extend(method(itemsPerRequest))
    return suds_to_json(result) if json else result

def getObjectsAsJson(method, query="", values=None):
    statement = services.ad_manager.FilterStatement(query, values)
    results = []
    while True:
        response = method(statement.ToStatement())
        if 'results' in response:
            results.extend(response["results"]);
            statement.offset += services.ad_manager.SUGGESTED_PAGE_LIMIT
        else:
            break
    return suds_to_json(results)

def retry(method, elements, condition, backupMethod, backupElements, retries=0):
    try:
        createdElements = json.loads(backupMethod(backupElements)) or []
        print "Amount of elements already created "+str(len(createdElements))
        if (len(createdElements) > 0):
            for createdElement in createdElements:
                for element in elements:
                    if (condition(createdElement, element)):
                        elements.remove(element)

        print "Amount of elements left to create "+str(len(elements))
        if(len(elements) > 0):
            createdElements.extend(batchCreate(method, elements, False))
        print "Total amount of elements "+str(len(createdElements))
        return suds_to_json(createdElements)
    except Exception,e:
        print e
        if (retries == 5):
            raise e
        print "Method failed on "+str(retries+1)+" try"
        retries += 1
        return retry(method, elements, condition, backupMethod, backupElements, retries)

def update():
    for order in orderIds:
        query = ("WHERE orderId="+str(order))
        statement = services.ad_manager.FilterStatement(query)
        statement2 = services.ad_manager.FilterStatement()

        detailsOrder = services.OrderService.getOrdersByStatement(statement.ToStatement())
        advertiserId = detailsOrder["results"][0]["advertiserId"]
        print "advertiser id is "+ str(advertiserId)

        while True:
            response = services.LineItemService.getLineItemsByStatement(statement.ToStatement())
   
            if 'results' in response:
                # print "Read "+str(len(response["results"]))
                for line_item in response["results"]:
                    if not line_item['isArchived']:
                        updated_line_items.append(line_item)
                        continue
                if (len(updated_line_items) > 0):
                    print "Update "+str(len(updated_line_items))
                statement.offset += services.ad_manager.SUGGESTED_PAGE_LIMIT
            else:
                break
        print "order: "+str(order)+" finished"



        #desactiavte(updated_line_items)



        for i in range(numberOfCrea):
            createNewCreative(advertiserId, i)

        association(updated_line_items)

def desactiavte(line_item):  

    num_deactivated_licas = 0
    for li in line_item:
        query = ("WHERE lineItemId="+str(li['id']))
        statement = services.ad_manager.FilterStatement(query)
        response = services.LineItemCreativeAssociationService.getLineItemCreativeAssociationsByStatement(statement.ToStatement())
        
        if 'results' in response:
            for lica in response['results']:   
                print ('LICA with line item id \'%s\', creative id \'%s\', and status'
                   ' \'%s\' will be deactivated.' %
                   (lica['lineItemId'], lica['creativeId'], lica['status']))

                # Perform action.
                result = services.LineItemCreativeAssociationService.performLineItemCreativeAssociationAction(
                    {'xsi_type': 'DeactivateLineItemCreativeAssociations'},
                    statement.ToStatement())
                if result and int(result['numChanges']) > 0:
                    num_deactivated_licas += int(result['numChanges'])
                statement.offset += services.ad_manager.SUGGESTED_PAGE_LIMIT
        else:
            break
 
    # Display results.
    if num_deactivated_licas > 0:
        print 'Number of LICAs deactivated: %s' % num_deactivated_licas
    else:
        print 'No LICAs were deactivated.'


def createNewCreative(advertiserId, i):
    creatives = []

    for size in sizesCrea:
        creatives.append({
          'xsi_type': 'ThirdPartyCreative',
          'advertiserId': advertiserId,
          'name': "prebid_Creative_"+size.split("x")[0]+"x"+size.split("x")[1]+"_"+str(i),
          'size': {
            'width': size.split("x")[0],
            'height': size.split("x")[1],
          },
          'isSafeFrameCompatible': 0,
          'snippet': '''<script src = "https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%PATTERN:url%%";
  ucTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;

  try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>''',
        })

    creativesResult = batchCreate(services.CreativeService.createCreatives, creatives, False)

    if creativesResult:
        for creativeResult in creativesResult:
            creativeIds.append({ "creativeId": creativeResult['id'], "creativeSize": creativeResult['size']})
            print ('Template creative with id \'%s\', name \'%s\', and type \'%s\' was '
                   'created and can be previewed at %s.'
                   % (creativeResult['id'], creativeResult['name'], services.ad_manager.ad_managerClassType(creativeResult),
                      creativeResult['previewUrl']))

def isExistingCreativeAssociation(createdElement, element):
    return createdElement['lineItemId'] == element['lineItemId'] and createdElement['creativeId'] == element['creativeId']

def getAssociationsByCreativeIds(creativeIds):
    query = ("WHERE creativeId IN ("+",".join(repr(str(x)) for x in creativeIds)+")")
    return getObjectsAsJson(services.LineItemCreativeAssociationService.getLineItemCreativeAssociationsByStatement, query)

def associateCreativeToLineItem(request):
    return retry(services.LineItemCreativeAssociationService.createLineItemCreativeAssociations, request['associations'], isExistingCreativeAssociation, getAssociationsByCreativeIds, request['creativeIds'])

def recursive_asdict(data):
    result = {}
    for key, value in asdict(data).iteritems():
        if hasattr(value, '__keylist__'):
            result[key] = recursive_asdict(value)
        elif isinstance(value, list):
            result[key] = []
            for item in value:
                if hasattr(item, '__keylist__'):
                    result[key].append(recursive_asdict(item))
                else:
                    result[key].append(item)
        else:
            result[key] = value
    return result

def suds_to_json(data):
    result = []
    if(isinstance(data, list)):
        for item in data:
            if hasattr(item, '__keylist__'):
                result.append(recursive_asdict(item))
            else:
                result.append(item)
        return json.dumps(result)
    return json.dumps(recursive_asdict(data))

def association(line_item):
    associations = []
    creativeIdsR = []

    for li in line_item:
        for creative in creativeIds:
            associations.append({
                'creativeId': creative,
                'lineItemId': li.id,
            });
            creativeIdsR.append(creative)

    request = {
        'associations': associations,
        'creativeIds': creativeIdsR
    }

    query = ("WHERE lineItemId="+str(li['id']))
    statement = services.ad_manager.FilterStatement(query)
    response = retry(services.LineItemCreativeAssociationService.createLineItemCreativeAssociations, request['associations'], isExistingCreativeAssociation, getAssociationsByCreativeIds, request['creativeIds'])           
    
    if (len(response) > 0):
        print "Update "+str(len(response))
    else:
        print 'No association'    


update()
