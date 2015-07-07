'use strict';

var SockJS = require('sockjs-client');

require('../polyfills/watch.js');

var defs = {
	server  		: 'http://172.16.1.100:8080',
	enviroment	: 'production'
}

function Surge(options){

	var events = {};
	var channels = {};
	var socket    = null;
	var reconnect = true;
	var recInterval = null;

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
		connection  : connection,
		socket  		: socket
	};

	return api;


 
	function on(name,callback){
    if(!events[name]) {
    	events[name] = [];
    }
    // Append event
    events[name].push(callback);
  };

	function subscribe(room){
		console.log('subscribe')
		socket.emit({name:'subscribe',data:{room:room}});
		var channel = new Channel(room);
		channels[room] = channel;
		return channel;
	};
	function unsubscribe(room){
		console.log('unsubscribe')
		socket.emit({name:'unsubscribe',data:{room:room}});
	};
	function disconnect(){
		console.log('disconnect');
		socket.close();
	};

	function connect(options){
		var o = options || {};
		var ip = o.ip || defs.server;

		if(socket) {
        // Get auto-reconnect and re-setup
        connection.state = 'connecting';
        var p = reconnect;
        disconnect();
        reconnect = p;
    }
		connection.state='connecting';
		return new SockJS(ip);
	};

	function emit(channel,event,data){
		if(defs.enviroment=='production'){
			console.log('Surge : Event sent : ' + JSON.stringify(data));
		}
		var data = {};

		if(arguments.length<2){
			console.error('emit needs at least 2 arguments');
			return;
		}

		data.name = arguments[arguments.length-2]
		data.data = arguments[arguments.length-1]
		data.channel = arguments.length === 3 ? arguments[0] : undefined;

		socket.emit(data);
	};
	function _catchEvent(response) {
		var name = response.name,
		data = response.data;
		var _events = events[name];
		if(_events) {
			var parsed = (typeof(data) === "object" && data !== null) ? data : data;
			for(var i=0, l=_events.length; i<l; ++i) {
				var fct = _events[i];
				if(typeof(fct) === "function") {
					// Defer call on setTimeout
					(function(f) {
					    setTimeout(function() {f(parsed);}, 0);
					})(fct);
				}
			}
		}
	};
	//Private functions
	function _surgeEvents(){
    on('surge-joined-room',function(room){
	  	if(!connection.inRoom(room)){
	  		connection.rooms.push(room);
	  		channels[room].state = 'connected';

	  		//TODO: introduce private channels
	  		channels[room].type = 'public';
			}
		});
		on('surge-left-room',function(room){
			if(connection.inRoom(room)){
				connection.rooms.splice(connection.rooms.indexOf(room), 1);

				channels[room].state = 'connected';
				channels[room].on = null;
			}
		});
		socket.onopen = function() {
		 connection.state = 'connected';
		};
		socket.onclose = function() {
			if(reconnect){
				connection.state='attempting reconnection'
			}
			else{
				connection.state = 'disconnected';
			}
			socket = null;
			recInterval = setInterval(function() {
				socket = connect();
				clearInterval(recInterval);
				_surgeEvents();
			}, 2000);
		};
		socket.onmessage = function (e) {
			if(!e.data){
				console.info('no data received');
				return;
			}
			var data = JSON.parse(e.data);
			if(defs.enviroment=='production'){
				console.log('Surge : Event received : ' + e.data);
			}
			_catchEvent(data);
		};
		socket.emit = function (data){
			this.send(JSON.stringify(data));
		}
		// socket.on('connect', function() {
		// 	connection.state = 'connected';
		// });
		// socket.on('connect_error', function() {
		// 	connection.state = 'connection error';
		// });
		// socket.on('reconnecting', function() {
		// 	connection.state = 'reconnecting';
		// });
		// socket.on('reconnect_attempt', function() {
		// 	connection.state = 'reconnect attempt';
		// });
		// socket.on('reconnect', function() {
		// 	connection.state = 'reconnected';
		// });
		// socket.on('reconnect_failed', function() {
		// 	connection.state = 'reconnection failed';
		// });

	}
	function Channel(room){
		this.room = room;
		this.state = 'initializing';
		this.type = 'initializing';//public,private
		this.unsubscribe = function(){
			console.log('unsubscribe from room')
			socket.emit({event:'leave_room',room:this.room});
		}
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