var express = require('express');
var router = express.Router();
var surge = require('../public/js/libs/surge-client.js')();
var mongoose = require( 'mongoose' );


surge.on('message', function(message) {
});

router.get('/', function(req, res) {
	res.render('index');
});

module.exports = router;