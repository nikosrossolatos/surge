'use strict';

var io = require('socket.io-client');

var socket;

var defs = {
	server  		: 'http://83.212.100.253:8080',
	enviroment	: 'production'
}

function Surge(options){

	var api = {
		on 					: bindEvent,
		subscribe 	: subscribe,
		unsubscribe : unsubscribe,
		disconnect 	: disconnect,
		connect 		: connect,
		emit 				: emit
	};

	socket = connect();

	return api;

	function bindEvent(evt,callback){
		socket.on(evt, function(data){
			if(defs.enviroment=='production'){
				console.log('Surge : Event recieved : ' + JSON.stringify(data));
			}
			callback(data);
		});
	};

	function subscribe(room){
		socket.join(room);
	};
	function unsubscribe(room){
		socket.leave(room);
	};
	function disconnect(){
		socket.emit('disconnect');
	};

	function connect(options){
		var o = options || {};
		if(socket){
			//What happens if you are connected and you reconnect again?
		}
		var ip = o.ip || defs.server;
		return io(ip);
	};

	function emit(evt,data){
		if(defs.enviroment=='production'){
			console.log('Surge : Event sent : ' + JSON.stringify(data));
		}
		socket.emit(evt,data);
	};
};
module.exports = Surge;