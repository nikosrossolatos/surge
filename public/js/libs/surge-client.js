'use strict';


function surgeClient(options){
	var api = {
		on 					: bindEvent,
		subscribe 	: subscribe,
		destroy 		: destroy,
		connect 		: connect,
		emit 				: emit
	};

	return api;
};

function bindEvent(event,callback){
	alert('event name is :'+event);
	callback();
};

function subscribe(){

};

function destroy(){

};

function connect(){

};

function emit(){

};