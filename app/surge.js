
/**
 * Module dependencies.
 */

'use strict';

var mongoose = require( 'mongoose' );
var Messages = mongoose.model('messages');

module.exports = function(io){

	var surge = new Surge();

	io.on('connection', function(socket) {
		surge.clients[socket.id] = socket;
		//	Send socketid to client so that he can reference himself
		// 	Check if valid for persistance.
		surge.emit(socket,'open',socket.id);
		
		socket.on('data', function(message) {
			if(message){
				surge.catchEvent(JSON.parse(message),socket);
			}
		});

		socket.on('close', function() {
			//remove client that disconnected from the socket
			surge.removeClient(socket)
		});
	});

	return surge;
}

function Surge(){
	this.clients = {};
	this.channels = {};
	this.events = [];
	this.init();
};

Surge.prototype.on = function(name,callback){
	if(!this.events[name]) {
		this.events[name] = [];
	}
	// Append event
	this.events[name].push(callback);
};

Surge.prototype.catchEvent = function(response,socket) {
	var _events = this.events[response.name];
	if(_events) {
		var parsed = (typeof(response) === "object" && response !== null) ? response : response;
		for(var i=0, l=_events.length; i<l; ++i) {
			var fct = _events[i];
			if(typeof(fct) === "function") {
				// Defer call on setTimeout
				(function(f) {
				    setTimeout(function() {f(parsed,socket);}, 0);
				})(fct);
			}
		}
	}
	//Not a known event name
	else{
		this.broadcast(socket,response.channel,response.name,response.message,response.broadcast);
	}
};

//Default functionallity for the surge server. For now its only for subscribing / unsubscribing
Surge.prototype.init = function(socket){
	var _this = this;
	this.on('surge-subscribe',function(data,socket){
		_this.subscribe(socket,data.message.room);
	});
	this.on('surge-unsubscribe',function(data,socket){
		_this.unsubscribe(socket,data.message.room);
	});
};

Surge.prototype.subscribe = function(socket,room){
	if(!room){
		this.emit(socket,'surge-error','You need to provide a valid room');
		return
	}
	if(!this.channels[room]){
		this.channels[room] = {
			subscribers : {}
		}
	}
	this.channels[room].subscribers[socket] = socket;

	var channel = Object.size(this.channels[room].subscribers);
	this.emit(socket,'surge-joined-room',{room:room,subscribers:channel});
	this.broadcast(socket,room,'member-joined',{room:room,subscribers:channel});
};

Surge.prototype.unsubscribe = function(socket,room){
	if(!this.channels[room]){
		this.emit(socket,'surge-error','There is no such room or this user is not subscribed for this room');
		return;
	}
	delete this.channels[room].subscribers[socket];
	var channel = Object.size(this.channels[room].subscribers);
	this.emit(socket,'surge-left-room',{room:room});
	this.broadcast(socket,room,'member-left',{room:room,subscribers:channel});
};

// Broadcast to all clients of a channel if provided, or to all connected sockets
Surge.prototype.broadcast = function(sender,channel,name,message,sendToSelf){
	// iterate through each client in clients object
	var clients = this.clients;
	//filter clients by channel if channel exists
	if(channel){
		clients = {};
		if(this.channels[channel]){
		 clients = this.channels[channel].subscribers;
		}
	}
	var data = {
		name:name,
		data:message
	}
	for (var client in clients){
	  // send the message to that client
	  if(sendToSelf || clients[client]!=sender){
	  	clients[client].write(JSON.stringify(data));
			var message = new Messages({
				event: name,
				message: message,
				channel: channel,
				type: 'broadcast',
				sentFrom: sender['id'],
				sentTo: clients[client]['id'],
				dateSent: Date.now()
			})
			message.save(function(err,message){
				if(err) return;
			})
	  }
	}
};

// Emit something to a specific socket id
Surge.prototype.emit = function(socket,channel,name,message){
	var data = {};

	if(arguments.length<3){
		console.error('emit needs at least 2 arguments');
		return;
	}

	data.name = arguments[arguments.length-2];
	data.data = arguments[arguments.length-1];
	
	//TODO: data.data.room wont crash because String type is a derivative of 
	// Object but it might cause future bugs. Should change the emitting structure
	
	//Figure out if we need to send something in a channel
	//data.channel = arguments.length === 3 ? arguments[0] : undefined;
	socket.write(JSON.stringify(data));
	var message = new Messages({
		event: data.name,
		message: JSON.stringify(data.data),
		channel: data.data.room,
		type: 'emit',
		sentFrom: 'Server',
		sentTo: socket['id'],
		dateSent: Date.now()
	})
	message.save(function(err,message){
		if(err) console.log(err);
	})
};

Surge.prototype.removeClient = function(socket){
	//remove user from all channels
	for (var channel in this.channels){
		this.unsubscribe(socket,channel);
		//delete this.channels[channel].subscribers[socket];		
	}

	//remove user completely
	delete this.clients[socket.id];
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
