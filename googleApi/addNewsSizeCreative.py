from server import services
import json
from suds.sudsobject import asdict
import zeep
from time import sleep

services.connectToNetwork(XXXX)
print "connected"
orderIds = [XXXX]
# placementIds = [28608740]
# adunits = [780773]
updated_line_items = []

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
    statement = dfp.FilterStatement(query, values)
    results = []
    while True:
        sleep(2)
        response = method(statement.ToStatement())
        if len(response["results"]) > 0:
            results.extend(response["results"]);
            statement.offset += dfp.SUGGESTED_PAGE_LIMIT
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
        return json.dumps(zeep.helpers.serialize_object(result))
    return json.dumps(zeep.helpers.serialize_object(recursive_asdict(data)))

def update():
    for order in orderIds:
        query = ("WHERE orderId="+str(order))
        statement = services.ad_manager.FilterStatement(query)


        response = services.LineItemService.getLineItemsByStatement(statement.ToStatement())

        if 'results' in response:
            # print "Read "+str(len(response["results"]))
            for line_item in response["results"]:
                if not line_item['isArchived']:
                    sizesArrayS = []

                    for sizeE in line_item['creativePlaceholders']:                      
                        sizesArrayS.append ({'size': {'width': str(sizeE['size'].width),'height': str(sizeE['size'].height)}})
                    sizesArrayS.append({'size' : { 'width' : '1', 'height' : '1' }})
                    sizesArrayS.append({'size' : { 'width' : '320', 'height' : '100' }})

                    line_item['creativePlaceholders'] = sizesArrayS
                    updated_line_items.append(line_item)
                    continue

            if (len(updated_line_items) > 0):
                line_items = batchCreate(services.LineItemService.updateLineItems, updated_line_items, False)

            if (len(line_items) > 0):
                print "Update "+str(len(line_items))
                association(line_items)
            else:
                print 'No line items were updated.'
            statement.offset += services.ad_manager.SUGGESTED_PAGE_LIMIT
                                       
        else:
            break

        print "order: "+str(order)+" finished"

def association(line_item):  

    print "creativeAssociation"
    #print image_creative2
     # Build the new creative, set id to None to create a copy.

    licasOld = []
   
    for li in line_item:
        newSizesArrayB = []  

        for sizeO in li['creativePlaceholders']:
            newSizesArrayB.append({ 'width' : sizeO['size'].width, 'height' : sizeO['size'].height })

        query = ("WHERE lineItemId="+str(li['id']))
        statement = services.ad_manager.FilterStatement(query)
        response2 = services.LineItemCreativeAssociationService.getLineItemCreativeAssociationsByStatement(statement.ToStatement())
        if response2 is not None:
            for lica2 in response2['results']: 
                if lica2['sizes'] is not None:
                                newSizesArray = newSizesArrayB
                                for sizeC in lica2['sizes']:
                                    newSizesArray.append({'width': str(sizeC.width),'height': str(sizeC.height)})            
                                
                                licasOld += [{
                                  'creativeId': lica2['creativeId'],
                                  'lineItemId': li.id,
                                  'sizes': newSizesArray
                                }]

  # send licas to dfp service
    licasOld = batchCreate(services.LineItemCreativeAssociationService.updateLineItemCreativeAssociations, licasOld, False)
    licas = licasOld 
    if (len(licas) > 0):
        print "Update "+str(len(licas))
    else:
        print 'No association'

    

update()
