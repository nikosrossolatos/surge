var express = require('express');
var router = express.Router();
var helpers = require('../app/helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
	var surge = req.app.get('surge');
	var clients = helpers.flattenClients(surge.clients);
  res.render('dashboard',{clients:clients});
});
module.exports = router;