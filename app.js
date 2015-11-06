
/**
 * Module dependencies.
 */
var http = require('http');
var path = require('path');
var util = require('util');
var sockjs  = require('sockjs');

// Sockjs server
var sockjs_opts = { sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' };
var io = sockjs.createServer(sockjs_opts);

//Initialize surge-node
var surge = require('./app/surge.js')(io);

var server = http.createServer();
io.installHandlers(server);
server.listen(8080, '0.0.0.0');
