'use strict';

var io = require('socket.io-client');

var socket;

var defs = {
	server  		: 'http://172.16.1.100:8080',
	enviroment	: 'production'
}

function Surge(options){

	var connection = new Connection();

	socket = connect();
	_surgeEvents();

	var api = {
		on 					: on,
		subscribe 	: subscribe,
		unsubscribe : unsubscribe,
		disconnect 	: disconnect,
		connect 		: connect,
		emit 				: emit,
		connection  : connection
	};

	return api;

	function on(evt,callback){
		socket.on('message',function(data){

			//Create event

			//create event here

			//if evt matches events created

			//trigger event
			if(evt==data.event){
				callback(data);
			}
		});
	};

	function subscribe(room){
		socket.emit('message',{event:'join_room',room:room});
	};
	function unsubscribe(room){
		socket.emit('message',{event:'leave_room',room:room});
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

		connection.state='connecting';
		return io(ip);
	};

	function emit(data){
		if(defs.enviroment=='production'){
			console.log('Surge : Event sent : ' + JSON.stringify(data));
		}
		socket.emit('message',data);
	};

	//Private functions
	function _surgeEvents(){
		socket.on('message', function(data){
			var evt = data.event;
			if(defs.enviroment=='production'){
				console.log('Surge : Event received : ' + JSON.stringify(data));
			}
			if(evt.indexOf('surge-')>=0){
				if(evt=='surge-joined_room'){
					if(!connection.inRoom(data.room)){
						connection.rooms.push(data.room);
						//trigger joined_room
					}
				}
				else if(evt=='surge-left_room'){
					if(connection.inRoom(data.room)){
						connection.rooms.splice(connection.rooms.indexOf(data.room), 1);
						//trigger left_room
					}
				}
			}
		});
		socket.on('connect', function() {
			connection.state = 'connected';
		});
		socket.on('connect_error', function() {
			connection.state = 'connection error';
		});
		socket.on('reconnecting', function() {
			connection.state = 'reconnecting';
		});
		socket.on('reconnect_attempt', function() {
			connection.state = 'reconnect attempt';
		});
		socket.on('reconnect', function() {
			connection.state = 'reconnected';
		});
		socket.on('reconnect_failed', function() {
			connection.state = 'reconnection failed';
		});
	}

};

//	Connection class
//	Keeps details regarding the connection state,rooms,.etc
function Connection(){
	this.rooms  = [];
	this.state 	= 'not initialized';
}

Connection.prototype.inRoom = function(room){
	return this.rooms.indexOf(room)>=0 ? true:false;
}

module.exports = Surge;