
/**
 * Module dependencies.
 */

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');
var sockjs  = require('sockjs');

// Sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};
var io = sockjs.createServer(sockjs_opts);

//Initialize surge-node
var surge = require('./app/surge.js')(io);

var server = http.createServer();
io.installHandlers(server);
server.listen(8080, '172.16.1.100');

// var io = require('socket.io')(8080);

// io.on('connection', function (socket) {
// 	console.log('socket connected for client');

// 	socket.on('message', function (message) {

// 		console.log('message received : '+JSON.stringify(message));

// 		if(message.event=='join_room'){
// 			socket.join(message.room);
// 			socket.emit('message',{event:'surge-joined_room',room:message.room});
// 		}
// 		if(message.event=='leave_room'){
// 			socket.leave(message.room);
// 			socket.emit('message',{event:'surge-left_room',room:message.room});
// 		}
// 		if(message.event=='joined_rooms'){
// 			socket.emit('message',{message:'rooms connected : '+socket.rooms})
// 		}
// 		else{
// 			message.message = 'pong';
// 			socket.broadcast.emit('message',message);
// 		}
		
// 	});

// 	socket.on('disconnect', function () {
// 		console.log('socket disconnected for client')
// 	});
// });
