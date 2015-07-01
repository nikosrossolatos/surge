
/**
 * Module dependencies.
 */

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');

var io = require('socket.io')(8080);

io.on('connection', function (socket) {
	console.log('socket connected for client')
	console.log(Object.keys(socket));
	socket.on('message', function (message) {
		console.log('message sent :  '+message);
		socket.emit('message','pong');
	});
	socket.on('disconnect', function () {
		console.log('socket disconnected for client')
	});
});