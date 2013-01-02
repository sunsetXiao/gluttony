var config = require('../../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

var DishTastedIndex = exports.DishTastedIndex = function(){};


db.bind("DishTastedIndex");
DishTastedIndex.findByUserId = function(userId,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	db.DishTastedIndex.findItems({"userId":userId},outerCallback);
}

DishTastedIndex.update = function(userId,dishId,isLike,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishTastedIndex.update({"userId":userId,"dishId":dishId},
		{"userId":userId,"dishId":dishId,"isLike":isLike},{safe:true,upsert:true},outerCallback);
}

DishTastedIndex.hadTasted = function(userId,dishId,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishTastedIndex.findOne({"userId":userId,"dishId":dishId,"isLike":true},outerCallback);
}

DishTastedIndex.findByDishId = function(dishId,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishTastedIndex.findItems({"dishId":dishId,isLike:true},outerCallback);
}

DishTastedIndex.countByDishId = function(dishId,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishTastedIndex.count({"dishId":dishId,isLike:true},outerCallback);
}

DishTastedIndex.removeByDishId = function(dishId,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishTastedIndex.remove({"dishId":dishId},outerCallback);
}