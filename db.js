var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var messages = new Schema({
	event: String,
	message: String,
	channel: String,
	type: String,
	sentFrom: String,
	sentTo: String,
	dateSent: Date
});
var clientsSchema = new Schema({
	socketId: String,
	headers: String,
	address: String,
	protocol: String
});

mongoose.model( 'messages', messages );
mongoose.model( 'clients', clientsSchema );

mongoose.connect('mongodb://localhost/surge');