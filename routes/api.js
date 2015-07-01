var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );

 var socket = require('socket.io-client')('http://83.212.100.253:8080');

socket.on('connect', function(){
	console.log('server connected to socket')
});
socket.on('message', function(msg){
	console.log('message received : ' + msg)
});
socket.on('disconnect', function(){
	console.log('server disconnected to socket')
});

router.get('/', function(req, res) {
	res.render('index');
});

module.exports = router;