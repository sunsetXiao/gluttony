var Canteen = require("../model/Canteen").Canteen,
	Dish = require("../model/Dish").Dish,
	FileHandler = require('../model/FileHandler').FileHandler,
	async = require('async'),
	config = require('../config'),
	DishLikedIndex = require("../model/index/DishLikedIndex").DishLikedIndex
	;

var CanteenController = exports.CanteenController = function(){};


CanteenController.index = function(req,res){
	Canteen.find({},function(err,canteenList){
		if (canteenList)
			res.render('index.html',{canteenList:canteenList,user:req.session.user});
	});
}


CanteenController.create = function(req,res){
	var data = req.body;
	var f = new FileHandler();
	async.waterfall([
			function(waterfallCallback){
				if(req.files.canteenPreview){
					f.saveFromFile(req.files.canteenPreview.path,function(err,imgId){
						waterfallCallback(err,config.gridfs + imgId);
					});
				}else{
					waterfallCallback(null,null);
				}
			},
			function(previewUrl,waterfallCallback){
				data.previewUrl = previewUrl;
				Canteen.create(data,function(err,count){
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

CanteenController.update = function(req,res){
	if(req.params.id){
		Canteen.findById(req.params.id,function(err,item){
			if(item){
				var canteen = new Canteen(item);
				var f = new FileHandler();
				var postBody = req.body;
				async.waterfall([
						function(waterfallCallback){
							if(req.files.canteenPreview){
								f.saveFromFile(req.files.canteenPreview.path,function(err,imgId){
									waterfallCallback(err,config.gridfs + imgId);
								});
							}else{
								waterfallCallback(null,null);
							}
						},
						function(previewUrl,waterfallCallback){
							if(previewUrl)
								canteen.data.previewUrl = previewUrl;
							canteen.data.name = postBody.canteenName;
							canteen.data.description = postBody.canteenDescription;
							canteen.update(waterfallCallback);
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
CanteenController.canteen = function(req,res){
	if(req.params.id){
		Canteen.findById(req.params.id,function(err,canteen){
			if(canteen){
				Dish.findByCanteenId(canteen._id,function(err,items){
					async.map(items,function(dish,mapCallback){
						DishLikedIndex.countByDishId(dish._id,function(err,count){
							dish.likeNumber = count;
							if(req.session.user){
								DishLikedIndex.hadLiked(req.session.user._id,dish._id,function(err,doc){
									if(doc) dish.isLike = true;
									mapCallback(err,dish);
								});
							}else{
								mapCallback(err,dish);
							}
						});
					},function(err,mappedDishes){
						console.log(mappedDishes);
						canteen.dishes = mappedDishes;
						res.render("canteen/canteen.html",{canteen:canteen,user:req.session.user});
					});
				});
			}
			else{
				res.send(404);
			}
		});
		
	}else{
		res.send(404);
	}
}