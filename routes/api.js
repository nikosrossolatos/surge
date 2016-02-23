var express = require('express');
var router = express.Router();
var helpers = require('../app/helpers');

var mongoose = require('mongoose');
var Messages = mongoose.model('messages');

/* GET home page. */
router.get('/health', function(req, res, next) {
	res.status(200).end('Status OK');
});

/* GET home page. */
router.get('/clients', function(req, res, next) {
	var surge = req.app.get('surge');
	var clients = helpers.flattenClients(surge.clients);
	res.status(200);
	res.json(clients);
});

router.get('/channels', function(req, res, next) {
	res.status(200);
	var params = req.query;
	var channel = params.channel || '';
	Messages.find().distinct('channel').exec(function(err,channels){
		res.json(channels);
	})
});

router.get('/messages', function(req, res, next) {
	res.status(200);
	var params = req.query;
	var channel = params.channel || '';
	var time = params.t || '';
	var queryTime = new Date(new Date().getTime() - (1000*60*60)); //defaut: last Hour

	Messages.find({dateSent:{$gt: queryTime}},null, {sort: '-date'},function(err,messages){
		res.json(messages);
	})
});
module.exports = router;