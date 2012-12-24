var config = require('../../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

var CanteenLikedIndex = exports.CanteenLikedIndex = function(){};


db.bind("CanteenLikedIndex");
CanteenLikedIndex.findByUserId = function(userId,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	db.CanteenLikedIndex.findItems({"userId":userId},outerCallback);
}

CanteenLikedIndex.update = function(userId,canteenId,isLike,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	if(typeof(canteenId) == "string"){
		canteenId = new ObjectID(canteenId);
	}
	db.CanteenLikedIndex.update({"userId":userId,"canteenId":canteenId},
		{"userId":userId,"canteenId":canteenId,"isLike":isLike},{safe:true,upsert:true},outerCallback);
}

CanteenLikedIndex.hadLiked = function(userId,canteenId,outerCallback){
	if(typeof(userId) == "string"){
		userId = new ObjectID(userId);
	}
	if(typeof(canteenId) == "string"){
		canteenId = new ObjectID(canteenId);
	}
	db.CanteenLikedIndex.findOne({"userId":userId,"canteenId":canteenId,"isLike":true},outerCallback);
}

CanteenLikedIndex.findByCanteenId = function(canteenId,outerCallback){
	if(typeof(canteenId) == "string"){
		canteenId = new ObjectID(canteenId);
	}
	db.CanteenLikedIndex.findItems({"canteenId":canteenId,isLike:true},outerCallback);
}

CanteenLikedIndex.countByCanteenId = function(canteenId,outerCallback){
	if(typeof(canteenId) == "string"){
		canteenId = new ObjectID(canteenId);
	}
	db.CanteenLikedIndex.count({"canteenId":canteenId,isLike:true},outerCallback);
}