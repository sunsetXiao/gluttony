var Canteen = require("../model/Canteen").Canteen,
	Dish = require("../model/Dish").Dish,
	FileHandler = require('../model/FileHandler').FileHandler,
	async = require('async'),
	config = require('../config'),
	DishLikedIndex = require("../model/index/DishLikedIndex").DishLikedIndex,
	DishTastedIndex = require("../model/index/DishTastedIndex").DishTastedIndex,
	UserSystem = require("../logic/UserSystem").UserSystem
	;

var CanteenController = exports.CanteenController = function(){};


CanteenController.index = function(req,res){
	Canteen.find({},function(err,canteenList){
		if (canteenList)
			res.render('index.html',{canteenList:canteenList,user:req.session.user,canteenIndex:true});
	});
}


CanteenController.create = function(req,res){
	var postData = req.body;
	var f = new FileHandler();
	var data = {};
	console.log("creating canteen");
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
				_POST2SCHEMA(postData,data);
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
							_POST2SCHEMA(postBody,canteen.data);
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
					//为每道菜添加附加信息
					var dishInfo = {};
					var defaultDishInfo = null;
					var defaultCategory = "其他";
					async.forEach(items,function(dish,mapCallback){
						//喜欢的人的数量
						DishLikedIndex.countByDishId(dish._id,function(err,count){
							dish.likeNumber = count;
							//吃过的人的数量
							DishTastedIndex.countByDishId(dish._id,function(err,tcount){
								dish.tastedNumber = tcount;
								if(dish.category){
									if(!dishInfo[dish.category]){
										dishInfo[dish.category] = {name:dish.category,dishList:[]};	
									}
									dishInfo[dish.category].dishList.push(dish);
								}else{
									if(!defaultDishInfo){
										defaultDishInfo = {name:defaultCategory,dishList:[]};
									}
									defaultDishInfo.dishList.push(dish);
								}
								//与当前用户的关系
								if(req.session.user){
									//这个用户是否喜欢了这个菜
									DishLikedIndex.hadLiked(req.session.user._id,dish._id,function(err,doc){
										if(doc) dish.isLike = true;
										//这个用户是否吃过这个菜
										DishTastedIndex.hadTasted(req.session.user._id,dish._id,function(err,doc){
											if(doc) dish.hadTasted = true;
											//这个用户的其他在平台上的朋友中哪些吃过这个菜
											UserSystem.getExistedFriends(req.session.user._id,function(err,friends){
												var tastedFriends = [];
												tastedFriends = [];
												async.forEach(friends,function(friend,forEachCallback){
													DishTastedIndex.hadTasted(friend._id,dish._id,function(err,doc){
														if(doc) tastedFriends.push(friend);
														forEachCallback(err);
													});
												},function(err){
													if(tastedFriends.length > 0){
														dish.tastedFriends = tastedFriends;
													}
													mapCallback(err,dish);
												});
											});
										});
									});
								}else{
									mapCallback(err,dish);
								}
							});
						});
					},function(err){
						//console.log(dishInfo);
						canteen.dishes = dishInfo;
						canteen.defaultDishes = defaultDishInfo;
						//console.log(canteen);
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

function _POST2SCHEMA(postData,schema){
	schema.name = postData.canteenName;
	schema.description = postData.canteenDescription;
	schema.location = postData.canteenLocation;
	schema.phone = postData.canteenPhone;
	if(postData.canteenSpecial){
		var arr = postData.canteenSpecial.split(" ");
		schema.special = arr;
	}else{
		schema.special = null;
	}
	
}