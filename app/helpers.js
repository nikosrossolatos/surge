
exports.flattenClients = function(obj){

	//Which properties to keep from socket object , also helps to prevent circularity
	var keep = ['id','headers','address','protocol'];
  var clients = Object.keys(obj);
  var result = [];
  clients.forEach(function(client){
  	var x = {};
  	keep.forEach(function(key){
  		x[key] = obj[client][key];
  	})
  	result.push(x);
  });
  return result;
}
