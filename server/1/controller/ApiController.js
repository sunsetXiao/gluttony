var FileHandler = require('../model/FileHandler').FileHandler

;

var ApiController = exports.ApiController = function(){}

ApiController.getImage = function(req,res){
	var f = new FileHandler();
	f.getByIdStr(req.params.id,function(err,object){
		res.writeHead('200', {'Content-Type': 'image/jpg'});
    	res.end(object,'binary');
	},req.params.id);
}

ApiController.randomDish = function(req,res){
	
}