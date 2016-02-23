
/**
 * Module dependencies.
 */
var http = require('http');
var path = require('path');
var util = require('util');
var sockjs  = require('sockjs');

/**
 *	Usage Details modules
 */
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');
var debug = require('debug')('mysite:server');
require('./db.js');


// Routes
var routes = require('./routes/index');
var api = require('./routes/api');
var auth = require('./routes/auth');

// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);
// app.use('/auth', auth);

//Express server
var expressServer = http.createServer(app);
expressServer.on('error', onError);
expressServer.on('listening', onListening);
expressServer.listen(8081,'0.0.0.0')

// Sockjs server
var sockjs_opts = { sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' };
var io = sockjs.createServer(sockjs_opts);

//Initialize surge-node
var surge = require('./app/surge.js')(io);
app.set('surge',surge);

//Socket server
var socketServer = http.createServer();
io.installHandlers(socketServer);
socketServer.listen(8080, '0.0.0.0');



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = expressServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

