var Dish = require('../model/Dish').Dish,
	FileHandler = require('../model/FileHandler').FileHandler,
	async = require('async'),
	config = require('../config'),
	Canteen = require("../model/Canteen").Canteen
	;

var DishController = exports.DishController = function(){

};


DishController.create = function(req,res){
	var data = req.body;
	async.waterfall([
		function(waterfallCallback){
			if(data.canteenId){
				Canteen.findById(data.canteenId,waterfallCallback);
			}else{
				waterfallCallback("No canteenId!");
			}
		},
		function(canteen,waterfallCallback){
			if(!canteen){
				waterfallCallback("No canteen!");
			}
			data.canteenId = canteen._id;
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
			data.previewUrl = previewUrl;
			Dish.create(data,function(err){
				waterfallCallback(err);
			});
		}
		],function(err){
			if(err){
				console.log(err);
				res.send(500);
			}else{
				res.send(200);
			}
		});
}