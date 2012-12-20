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

DishController.update = function(req,res){
	if(req.params.id){
		Dish.findById(req.params.id,function(err,item){
			if(item){
				var dish = new Dish(item);
				var f = new FileHandler();
				var postBody = req.body;
				async.waterfall([
						function(waterfallCallback){
							if(req.files.dishPreview){
								f.saveFromFile(req.files.dishPreview.path,function(err,imgId){
									waterfallCallback(err,config.gridfs + imgId);
								});
							}else{
								waterfallCallback(null,null);
							}
						},
						function(previewUrl,waterfallCallback){
							if(previewUrl)
								dish.data.previewUrl = previewUrl;
							dish.data.name = postBody.dishName;
							dish.data.description = postBody.dishDescription;
							dish.data.canteenId = postBody.canteenId;
							dish.data.price = postBody.dishPrice;
							dish.data.location = postBody.dishLocation;
							dish.update(waterfallCallback);
						}
					],function(err){
						if(err){
							res.send(500);
						}else{
							res.send(200);
						}
					});
			}else{
				res.send(404);
			}
		});
	}else{
		res.send(404);
	}
}

DishController.comment = function(req,res){
	if(req.params.id && req.body){
		Dish.findById(req.params.id,function(err,dish){
			if(dish){
				var comments = dish.comments;
				comments.add({
					time:new Date(),
					content:req.body.commentContent,
					rate:req.body.rate
				});
				var dishDAO = new Dish(dish);
				dishDAO.update(function(err){
					if(err){
						res.send(500);
					}else{
						res.send(200);
					}
				});
			}else{
				res.send(404);
			}
		});
	}else{
		res.send(404);
	}
}