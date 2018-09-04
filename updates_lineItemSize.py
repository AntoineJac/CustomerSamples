from server import services
services.connectToNetwork(8578)
print "connected"
orderIds = [2231927704]
# placementIds = [28608740]
# adunits = [780773]
updated_line_items = []
sizesP = []
numNewsizes = 1

def getAdunits():
    result = []
    for adunit in adunits:
        result.append({
            'adUnitId': adunit,
            'includeDescendants': 'true'
        })
    return result

def batchCreate(method, elements):
    counter = 0
    itemsPerRequest = []
    result = []
    print len(elements)
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
    return result

def update():
    for order in orderIds:
        query = ("WHERE orderId="+str(order))
        statement = services.dfp.FilterStatement(query)
        statement2 = services.dfp.FilterStatement()
        while True:
            response = services.LineItemService.getLineItemsByStatement(statement.ToStatement())
   
            if 'results' in response:
                # print "Read "+str(len(response["results"]))
                for line_item in response["results"]:
                    if not line_item['isArchived']:
                        sizesArrayS = []
                        sizesP = [];
                        #print "customFiel Id is" + test[id]
                        #print "customFiel Name is" + test[id]
                        for sizeE in line_item['creativePlaceholders']:                      
                            sizesArrayS.append ({'size': {'width': str(sizeE['size'].width),'height': str(sizeE['size'].height)}})
                            sizesP.append({'width': str(sizeE['size'].width),'height': str(sizeE['size'].height)})

                        sizesArrayS.append({'size' : { 'width' : '1', 'height' : '1' }})
                        sizesP.append({ 'width' : 1, 'height' : 1 })
                        print sizesArrayS
                        line_item['creativePlaceholders'] = sizesArrayS
                        line_item['allowOverbook'] = 'true'
                        line_item['skipInventoryCheck'] = 'true'
                        # line_item['costPerUnit']['currencyCode'] = 'USD'
                        # print line_item
                        updated_line_items.append(line_item)
                        continue
                             
                        # line_item['targeting']['inventoryTargeting']['targetedAdUnits'] = getAdunits()

                        # line_item['targeting']['inventoryTargeting'] = {
                        #     'targetedPlacementIds': placementIds
                        # }

                        # children = line_item['targeting']['customTargeting']['children'][0]['children']
                        # for index, child in enumerate(children):  
                        #     if (child['keyId'] == 159886):
                        #         del children[index]

                    
                        
                        
                        

                        #customFieldValues[] = { customFieldId = 1263826 value = { dataType = "DROP_DOWN" value = "Option1" } xsi_type = "CustomFieldValue" }
                        #line_item['customFieldValues'] == custom_field_values
                         #['targetedPlacementIds'].append(4084125)

    #line_item.results[0]['customFieldValues'] = custom_field_values

                        # print line_item['targeting']['customTargeting']
                        # print line_item['targeting']['customTargeting']['children'][0]
                        # key = line_item['targeting']['customTargeting']['children'][0]['children'][0]['keyId']
                        # values = line_item['targeting']['customTargeting']['children'][0]['children'][0]['valueIds']

                        # line_item['targeting']['customTargeting'] = {
                        #     'xsi_type': 'CustomCriteriaSet',
                        #     'logicalOperator': 'AND',
                        #     'children': [{
                        #         'xsi_type': 'CustomCriteria',
                        #         'operator': 'IS',
                        #         'keyId': key,
                        #         'valueIds': values, 
                        #     },{
                        #         'xsi_type': 'CustomCriteria',
                        #         'operator': 'IS_NOT',
                        #         'keyId': 10737907,
                        #         'valueIds': [447863213241], 
                        #     }],
                        # }
                
                        # line_item['targeting']['customTargeting']['children'].append({
                        #     'xsi_type': 'CustomCriteriaSet',
                        #     'logicalOperator': 'AND',
                        #     'children': [{
                        #         'xsi_type': 'CustomCriteria',
                        #         'operator': 'IS_NOT',
                        #         'keyId': 10737907,
                        #         'valueIds': [447863213241], 
                        #     }],
                        # })

                        # line_item['targeting']['customTargeting']['children'].append(('CustomCriteriaSet'){
                        #     'logicalOperator': 'AND',
                        #     'children': [('CustomCriteria'){
                        #         'operator': 'IS_NOT',
                        #         'keyId': 10737907,
                        #         'valueIds': [447863213241], 
                        #     }],
                        # })
                        
                        
                        # break

                    
                if (len(updated_line_items) > 0):
                    line_items = batchCreate(services.LineItemService.updateLineItems, updated_line_items)
                if (len(line_items) > 0):
                    print "Update "+str(len(line_items))
                else:
                    print 'No line items were updated.'
                statement.offset += services.dfp.SUGGESTED_PAGE_LIMIT
                # break
            else:
                break
        print "order: "+str(order)+" finished"
        
        association(updated_line_items, sizesP)


def association(line_item, creSizes):  

    print "newCreative"


    print "creativeAssociation"
    print creSizes
    PREBID_NEW_IDS = []
    query3 = ("WHERE orderId="+str(2231927704))
    statement3 = services.dfp.FilterStatement(query3)
    response3 = services.LineItemCreativeAssociationService.getLineItemCreativeAssociationsByStatement(statement3.ToStatement())
    image_creative = response3['results'][0]

    query4 = ("WHERE id="+str(image_creative['creativeId']))
    statement4 = services.dfp.FilterStatement(query4)
    response4 = services.CreativeService.getCreativesByStatement(statement4.ToStatement())
    image_creative2 = response4['results'][0]
    print image_creative2
     # Build the new creative, set id to None to create a copy.

    for i in range(numNewsizes):
        image_creative2['id'] = None
        image_creative2['name'] = 'Copy %s of %s' % (i,image_creative2['name'])
        newLineItem = services.CreativeService.createCreatives([image_creative2])[0]
        print newLineItem['id']
        PREBID_NEW_IDS.append(newLineItem['id'])


    PREBID_OLD_IDS = [2231927704]
    licasOld = []
    licasNew = []
    for li in line_item:
        query = ("WHERE lineItemId="+str(li['id']))
        statement = services.dfp.FilterStatement(query)
        response2 = services.LineItemCreativeAssociationService.getLineItemCreativeAssociationsByStatement(statement.ToStatement())
        for lica2 in response2['results']:
            licasOld += [{
              'creativeId': lica2['creativeId'],
              'lineItemId': li.id,
              'sizes': creSizes
            } for cid in PREBID_OLD_IDS]
        licasNew += [{
          'creativeId': cid2,
          'lineItemId': li.id,
          'sizes': creSizes
        } for cid2 in PREBID_NEW_IDS]
  # send licas to dfp service
    licasOld = batchCreate(services.LineItemCreativeAssociationService.updateLineItemCreativeAssociations, licasOld)
    licasNew = batchCreate(services.LineItemCreativeAssociationService.createLineItemCreativeAssociations, licasNew)

    licas = licasOld + licasNew
    if (len(licas) > 0):
        print "Update "+str(len(licas))
    else:
        print 'No association'

    

update()
