
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
	console.log('socket connected for client');

	socket.on('message', function (message) {

		console.log('message received : '+JSON.stringify(message));

		if(message.event=='join_room'){
			socket.join(message.room);
			socket.emit('message',{event:'surge-joined_room',room:message.room});
		}
		if(message.event=='leave_room'){
			socket.leave(message.room);
			socket.emit('message',{event:'surge-left_room',room:message.room});
		}
		if(message.event=='joined_rooms'){
			socket.emit('message',{message:'rooms connected : '+socket.rooms})
		}
		else{
			message.message = 'pong';
			socket.broadcast.emit('message',message);
		}
		
	});

	socket.on('disconnect', function () {
		console.log('socket disconnected for client')
	});
});