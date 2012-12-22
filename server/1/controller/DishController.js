var Dish = require('../model/Dish').Dish,
	FileHandler = require('../model/FileHandler').FileHandler,
	async = require('async'),
	config = require('../config'),
	Canteen = require("../model/Canteen").Canteen
	User = require("../model/User").User
	DishLikedIndex = require("../model/index/DishLikedIndex").DishLikedIndex,
	DishTastedIndex = require("../model/index/DishTastedIndex").DishTastedIndex
	;

var DishController = exports.DishController = function(){

};


DishController.create = function(req,res){
	var post = req.body;
	var data = {};
	_POST2SCHEMA(post,data);
	async.waterfall([
		function(waterfallCallback){
			if(post.canteenId){
				Canteen.findById(post.canteenId,waterfallCallback);
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
							Canteen.findById(postBody.canteenId,function(err,canteen){
								if(canteen){
									dish.data.canteenId = canteen._id;
									_POST2SCHEMA(postBody,dish.data);
									dish.update(waterfallCallback);
								}else{
									waterfallCallback("No canteen!");
								}
							});
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


function _POST2SCHEMA(post,schema){
	schema.name = post.dishName;
	schema.description = post.dishDescription;
	schema.price = post.dishPrice;
	schema.location = post.dishLocation;
	schema.category = post.dishCategory;
	if(post.dishConstraints){
		schema.constraints = post.dishConstraints.split(" ");
	}else{
		schema.constraints = null;
	}
}
DishController.comment = function(req,res){
	if(req.params.id && req.body){
		if(req.session.user){
			async.waterfall([
				function(waterfallCallback){
					User.findById(req.session.user._id,function(err,user){
						if(user){
							waterfallCallback(err,user);
						}else{
							return res.send(403);
						}
					});
				},
				function(user,waterfallCallback){
					Dish.findById(req.params.id,function(err,dish){
						if(dish){
							var comments = dish.comments;
							comments.push({
								time:new Date(),
								content:req.body.commentContent,
								commentor:user
							});
							var dishDAO = new Dish(dish);
							dishDAO.update(function(err){
								waterfallCallback(err);
							});
						}else{
							return res.send(404);
						}
					});
				}
				],function(err){
					if(err) res.send(500);
					else res.send(200);
				});
		}else{
			return res.send(401);
		}
		
	}else{
		res.send(404);
	}
}

DishController.toggleLike = function(req,res){
	if(req.params.id){
		if(req.session.user){
			async.waterfall([
				function(waterfallCallback){
					User.findById(req.session.user._id,function(err,user){
						if(user){
							waterfallCallback(err,user);
						}else{
							return res.send(403);
						}
					});
				},
				function(user,waterfallCallback){
					Dish.findById(req.params.id,function(err,dish){
						if(dish){
							waterfallCallback(err,user,dish);
						}else{
							return res.send(404);
						}
					});
				},
				function(user,dish,waterfallCallback){
					DishLikedIndex.hadLiked(user._id,dish._id,function(err,doc){
						if(doc){
							DishLikedIndex.update(user._id,dish._id,false,function(err){
								waterfallCallback(err,false,dish);
							});
						}else{
							DishLikedIndex.update(user._id,dish._id,true,function(err){
								waterfallCallback(err,true,dish);
							});
						}
					});
				},
				function(finalLike,dish,waterfallCallback){
					DishLikedIndex.countByDishId(dish._id,function(err,count){
						waterfallCallback(err,finalLike,count);
					});
				}
				],function(err,finalLike,finalCount){
					if(err) res.send(500);
					else res.send({isLike:finalLike,count:finalCount});
				});
		}else{
			return res.send(401);
		}
		
	}else{
		res.send(404);
	}
}

DishController.toggleTasted = function(req,res){
	if(req.params.id){
		if(req.session.user){
			async.waterfall([
				function(waterfallCallback){
					User.findById(req.session.user._id,function(err,user){
						if(user){
							waterfallCallback(err,user);
						}else{
							return res.send(403);
						}
					});
				},
				function(user,waterfallCallback){
					Dish.findById(req.params.id,function(err,dish){
						if(dish){
							waterfallCallback(err,user,dish);
						}else{
							return res.send(404);
						}
					});
				},
				function(user,dish,waterfallCallback){
					DishTastedIndex.hadTasted(user._id,dish._id,function(err,doc){
						if(doc){
							DishTastedIndex.update(user._id,dish._id,false,function(err){
								waterfallCallback(err,false,dish);
							});
						}else{
							DishTastedIndex.update(user._id,dish._id,true,function(err){
								waterfallCallback(err,true,dish);
							});
						}
					});
				},
				function(finalTasted,dish,waterfallCallback){
					DishTastedIndex.countByDishId(dish._id,function(err,count){
						waterfallCallback(err,finalTasted,count);
					});
				}
				],function(err,finalTasted,finalCount){
					if(err) res.send(500);
					else res.send({hadTasted:finalTasted,count:finalCount});
				});
		}else{
			return res.send(401);
		}
		
	}else{
		res.send(404);
	}
}