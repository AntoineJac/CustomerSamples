from server import services
services.connectToNetwork(XXXX)
print "connected"

lineItemsIds = XXXX
updated_line_items = []

def getRootAdUnit():
    statement = services.ad_manager.FilterStatement()
    current_network = services.NetworkService.getCurrentNetwork()
    if hasattr(current_network, 'effectiveRootAdUnitId'):
        return current_network.effectiveRootAdUnitId
    else:
        return 0    

def getAllOrders():
    orderList = []
    statement = services.ad_manager.FilterStatement()
    while True:
        response = services.OrderService.getOrdersByStatement(statement.ToStatement())
        if 'results' in response and len(response['results']):
            for order in response['results']:
                orderList.append(order['id'])
            statement.offset += services.ad_manager.SUGGESTED_PAGE_LIMIT
        else:
            break

    return orderList
        

def getAdunits(ad_unitsCurrent):
    ad_units = []
    for adunit in ad_unitsCurrent:
        if int(adunit['adUnitId']) == int(adunitsRON):
            return ad_unitsCurrent

        if int(adunit['adUnitId']) == int(parentAdUnit):
            return ad_unitsCurrent    

        ad_units.append({
            'adUnitId': adunit['adUnitId'],
            'includeDescendants': 'true'
        })

        for adunit in adunitsToAppend:
            ad_units.append({
                'adUnitId': adunit,
                'includeDescendants': 'true'
            })

    return ad_units


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
    query = ("WHERE Id="+str(lineItemsIds))
    statement = services.ad_manager.FilterStatement(query)
    while True:
        print 'testAntoine'
        response = services.LineItemService.getLineItemsByStatement(statement.ToStatement())

        line_items = []
        if 'results' in response and len(response['results']):
            for line_item in response["results"]:
                if not line_item['isArchived']:
                    #ad_units = getAdunits(line_item['targeting']['inventoryTargeting']['targetedAdUnits'])
                    #line_item['allowOverbook'] = True
                    #line_item['skipInventoryCheck'] = True
                    line_item['creativeTargetings'] = [
                        {   
                            'name': 'testRubTarg', 
                            'targeting': {
                                'customTargeting': { 
                                    'xsi_type': 'CustomCriteriaSet',
                                    'logicalOperator': 'OR',
                                    'children': [ 
                                        {
                                            'xsi_type': 'CustomCriteriaSet',
                                            'logicalOperator': 'AND',
                                            'children': [ 
                                                {
                                                    'xsi_type': 'CustomCriteria',
                                                    'keyId': XXXX,
                                                    'valueIds': [
                                                        XXXX
                                                    ],
                                                    'operator': 'IS' 
                                                } 
                                            ] 
                                        } 
                                    ] 
                                }
                            }
                        } 
                    ]
                    line_item['creativePlaceholders'] = [ { 'size': { 'width': 728L, 'height': 90L, 'isAspectRatio': False }, 'creativeTemplateId': None, 'companions': [], 'appliedLabels': [], 'effectiveAppliedLabels': [], 'expectedCreativeCount': 1L, 'creativeSizeType': 'PIXEL', 'targetingName': 'testRubTarg', 'isAmpOnly': False }, { 'size': { 'width': 300L, 'height': 250L, 'isAspectRatio': False }, 'creativeTemplateId': None, 'companions': [], 'appliedLabels': [], 'effectiveAppliedLabels': [], 'expectedCreativeCount': 1L, 'creativeSizeType': 'PIXEL', 'targetingName': 'testRubTarg', 'isAmpOnly': False }, { 'size': { 'width': 300L, 'height': 600L, 'isAspectRatio': False }, 'creativeTemplateId': None, 'companions': [], 'appliedLabels': [], 'effectiveAppliedLabels': [], 'expectedCreativeCount': 1L, 'creativeSizeType': 'PIXEL', 'targetingName': None, 'isAmpOnly': False } ]

                    updated_line_items.append(line_item)
                    
                    continue

            if (len(updated_line_items) > 0):
                line_items = batchCreate(services.LineItemService.updateLineItems, updated_line_items)
            if (len(line_items) > 0):
                print "Update "+str(len(line_items))
            else:
                print 'No line items were updated.'

            statement.offset += services.ad_manager.SUGGESTED_PAGE_LIMIT
            # break
        else:
            break
    print "the line items have been updated"
    association(updated_line_items)

def association(line_item):  

    print "creativeAssociation"
    #print image_creative2
     # Build the new creative, set id to None to create a copy.
    licasOld = []
    for li in line_item:
        newSizesArray = []
        query = ("WHERE lineItemId="+str(li['id']))
        statement = services.ad_manager.FilterStatement(query)
        response2 = services.LineItemCreativeAssociationService.getLineItemCreativeAssociationsByStatement(statement.ToStatement())
        for lica2 in response2['results']:
        	if (lica2['creativeId'] == XXXX):
        		print lica2
        		#lica2['targetingName'] = 'testRubTarg'
        		#licasOld.append(lica2)

  # send licas to dfp service
    #licasOld = batchCreate(services.LineItemCreativeAssociationService.updateLineItemCreativeAssociations, licasOld)
    if (len(licasOld) > 0):
        print "Update "+str(len(licasOld))
    else:
        print 'No association'

#orderIds = getAllOrders()
#adunitsRON = getRootAdUnit()
update()
