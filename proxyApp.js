'use strict'
const express = require('express')
const app = express()
const request = require('request');
const http = require('https');
const xmldom = require('xmldom');
const xpath = require('xpath');

const parser = new xmldom.DOMParser();
const serializer = new xmldom.XMLSerializer();


app.get('/', (req, res) => {

	//const ip = req.headers['x-real-ip'] || req.connection.remoteAddress || req.headers['x-forwarded-for'] || req.ip;
	const url = 'https://optimized-by.rubiconproject.com/a/api/vast.xml?account_id=19300&site_id=216776&zone_id=1067602&size_id=204&tg_c.language=&width=&height=&p_app.name=Hotstar&p_app.domain=https://play.google.com/store/apps/details?id=in.startv.hotstar&p_app.bundle=in.startv.hotstar&p_app.storeurl=https://play.google.com/store/apps/details?id=in.startv.hotstar&p_device.dpid=&p_device.dpid_type=gaid&p_geo.latitude=&p_geo.longitude=&p_geo.type=&p_device.connectiontype=&rp_lmt=' 			
	http.get(url, function (result) {
		let data;	
	    result.on('data', function (chunk) {
	        data += chunk;
	    });
	    result.on('end', function () {
	    	const root = parser.parseFromString(data, 'text/xml');
	    	const nodes = xpath.select('//Error', root);
			nodes.forEach(function (n) {
			  n.parentNode.removeChild(n);
			});
			const xmlOut = serializer.serializeToString(root);
			res.write(xmlOut);
	        res.end();
	    });
	    result.on('error', function () {
	        console.log(error);
	        res.send();
	        res.end();
	    });
	});
	setTimeout(function(){res.send();res.end();},1000);

})


const port = process.env.PORT || 3000

app.listen(port, () => 
  console.log(`Server is listening on port ${port}.`)
)
