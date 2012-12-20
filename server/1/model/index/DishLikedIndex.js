var config = require('../../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

var DishLikedIndex = exports.DishLikedIndex = function(){};


db.bind("DishLikedIndex");
DishLikedIndex.findByUserId = function(userId,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	db.DishLikedIndex.findItems({"userId":userId},outerCallback);
}

DishLikedIndex.update = function(userId,dishId,isLike,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishLikedIndex.update({"userId":userId,"dishId":dishId},
		{"userId":userId,"dishId":dishId,"isLike":isLike},{safe:true,upsert:true},outerCallback);
}

DishLikedIndex.hadLiked = function(userId,dishId,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishLikedIndex.findOne({"userId":userId,"dishId":dishId,"isLike":true},outerCallback);
}

DishLikedIndex.findByDishId = function(dishId,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishLikedIndex.findItems({"dishId":dishId,isLike:true},outerCallback);
}

DishLikedIndex.countByDishId = function(dishId,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishLikedIndex.count({"dishId":dishId,isLike:true},outerCallback);
}