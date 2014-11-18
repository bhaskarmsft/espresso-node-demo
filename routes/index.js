var express = require('express');
var router = express.Router();
var q = require('q');
var entrospect = require('../config.js');
var _ = require('underscore');

/* GET home page. */
router.get('/', function (req, res) {
	var customers;

	//Endpoint request, returns a promise
	//pagesize set arbitrarily high enough to get all customers
	customers = entrospect.endpoint('customer').get({pagesize:1000});

	//Render the index page on successfully returning customers
	customers.then(function (list) {
		res.render('index', {
			customers: list
		});
		res.end();
	},
	function (error) {
		console.log(error);
	});
});

router.get('/customer', function (req, res) {
	var customers;
	customers = entrospect.endpoint('customer').get({pagesize:1});
	customers.then(function (list) {
		res.json(list);
		res.end();
	});
});

/* Purchase Orders Request */
router.all('/customerPurchaseOrders', function (req, res) {
	var businessObj, customer;

	//The POST body
	//in this case, a customer object
	obj = req.body;

	//Query the custom CustomerBusinessOjbect resource
	//which returns a hierarchy of purchase orders, line items and products
	businessEndpoint = entrospect.endpoint('CustomerBusinessObject').get({
		filter: 'name LIKE "' + obj.name + '"' //filter the result to the customer in req.body
	});

	businessEndpoint.then(function (businessObj) {
		//The result is an array of objects,
		//though because of our filter, we know there is only 1 object,
		//and the front end only needs the attribute Orders
		res.json(businessObj[0].Orders);
		res.end();
	});
});

router.get('/products', function (req, res) {
	var products;

	//This is used in a drop down when editing a Line Item
	//so pagesize set arbitrarily high enough to get all products
	products = entrospect.endpoint('product').get({pagesize:1000});

	products.then(function (list) {
		res.json(list);
		res.end();
	});
});

//PUT
//This is intended as a demonstration of a PUT request
//though it is not strictly speaking a proper RESTful endpoint
router.post('/put', function (req, res) {
	var obj, objEndpoint;

	//A record sent from the front end
	obj = req.body;

	//Because this is a PUT request, the record is expected to have an @metadata.href attribute
	//Depending on the need, an @metadata.action may be "INSERT", "UPDATE", "DELETE"
	objEndpoint = entrospect.endpoint(obj['@metadata'].href);

	//Using the Endpoint Object method put()
	//the npm package attempts the described @metadata.action for obj
	objEndpoint.put(obj).then(function (txSummary) {
		//reply with a summary of changes
		res.json(txSummary);
		res.end();
	}, function (error) {
		if (entrospect.apiKey == 'readonly') {
			error.errorMessage = 'This application is using a read only API key, we invite you to register and congigure EntroSpect to complete this action'
		}
		
		//set the status code
		res.status(error.statusCode);

		//reply with the server error message
		res.end(error.errorMessage);
	});
});

//DELETE
//This is intended as a demonstration of a DELETE request
//though it is not strictly speaking a proper RESTful endpoint
router.post('/del', function (req, res) {
	var obj, objEndpoint;

	//A record sent from the front end
	obj = req.body;
	console.log(entrospect);
	//Each record provided by the Espresso API includes a unique endpoint for modifying itself
	objEndpoint = entrospect.endpoint(obj['@metadata'].href);

	//Using the Endpoint Object method del()
	//the npm package examines the checksum and provided it's not out of date, resolves the DELETE request
	objEndpoint.del(obj).then(function (txSummary) {
		//reply with a summary of changes
		res.json(txSummary);
		res.end();
	}, function (error) {
		if (entrospect.apiKey == 'readonly') {
			error.errorMessage = 'This application is using a read only API key, we invite you to register and congigure EntroSpect to complete this action'
		}

		//set the status code
		res.status(error.statusCode);

		//reply with the server error message
		res.end(error.errorMessage);
	});
});

module.exports = router;