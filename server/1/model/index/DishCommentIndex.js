var config = require('../../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

var DishCommentIndex = exports.DishCommentIndex = function(){};


db.bind("DishCommentIndex");

DishCommentIndex.create = function(user,dishId,data,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	data.dishId = dishId;
	data.commentor = user;
	data.time = new Date();
	db.DishCommentIndex.insert(data,{safe:true},outerCallback);
}

DishCommentIndex.findByUserId = function(userId,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	db.DishCommentIndex.findItems({"userId":userId},outerCallback);
}
/*
DishCommentIndex.update = function(userId,canteenId,isLike,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	if(typeof(canteenId) == "string"){
		canteenId = new ObjectID(canteenId);
	}
	db.DishCommentIndex.update({"userId":userId,"canteenId":canteenId},
		{"userId":userId,"canteenId":canteenId,"isLike":isLike},{safe:true,upsert:true},outerCallback);
}

DishCommentIndex.hadLiked = function(userId,canteenId,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	if(typeof(canteenId) == "string"){
		canteenId = new ObjectID(canteenId);
	}
	db.DishCommentIndex.findOne({"userId":userId,"canteenId":canteenId,"isLike":true},outerCallback);
}*/

DishCommentIndex.findByDishId = function(dishId,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishCommentIndex.findItems({"dishId":dishId},outerCallback);
}

DishCommentIndex.countByDishId = function(dishId,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishCommentIndex.count({"dishId":dishId},outerCallback);
}


DishCommentIndex.removeByDishId = function(dishId,outerCallback){
	if(typeof(dishId) == "string"){
		dishId = new ObjectID(dishId);
	}
	db.DishCommentIndex.remove({"dishId":dishId},outerCallback);
}