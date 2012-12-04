var Dish = require('../model/Dish').Dish
	FileHandler = require('../model/FileHandler').FileHandler
	async = require('async'),
	config = require('../config')
	;

var DishController = exports.DishController = function(){

};


DishController.create = function(req,res){
	async.waterfall([
		function(waterfallCallback){
			if(req.files.dishPreview){
				var f = new FileHandler();
				f.saveFromFile(req.files.dishPreview.path,function (err,storageId){
					console.log(storageId);
					waterfallCallback(err,config.gridfs + storageId);
				});
			}
			else{
				waterfallCallback(null,null);
			}
		},
		function(previewUrl,waterfallCallback){
			var data = req.body;
			data.previewUrl = previewUrl;
			Dish.create(data,function(err){
				waterfallCallback(err);
			});
		}
		],function(err){
			if(err){
				res.send(500);
			}else{
				res.send(200);
			}
		});
}