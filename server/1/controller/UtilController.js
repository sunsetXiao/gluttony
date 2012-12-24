var FileHandler = require('../model/FileHandler').FileHandler
	Dish = require('../model/Dish').Dish,
	Canteen = require('../model/Canteen').Canteen,
	async = require('async')
;

var UtilController = exports.UtilController = function(){};


UtilController.about = function(req,res){
	res.render('about.html',{aboutIndex:true});
}

