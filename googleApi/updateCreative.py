from server import services
services.connectToNetwork(XXXX)
print "connected"
orderIds = [XXXX]

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
            customFieldValues= services.CustomFieldService.getCustomFieldsByStatement(statement2.ToStatement())
            updated_line_items = []
            line_items = []
            if 'results' in response:
                # print "Read "+str(len(response["results"]))
                for line_item in response["results"]:

                    drop_down_custom_field_value = {
                        'customFieldId': XXXX,
                        'xsi_type': 'DropDownCustomFieldValue',
                        'customFieldOptionId': XXXX,
                    }

                    custom_field_values = [drop_down_custom_field_value]
                    line_item['customFieldValues'] = custom_field_values
                    
                    # line_item['costPerUnit']['currencyCode'] = 'USD'
                    
                    # print line_item
                    updated_line_items.append(line_item)
                    continue
                    
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

update()
