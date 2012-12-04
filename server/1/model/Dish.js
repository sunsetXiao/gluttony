var config = require('../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

db.bind('Dish');
var Dish = exports.Dish = function(data){
	this.data = data;
} 

/**

**/
Dish.create = function(data,outerCallback){
	if(typeof(data.canteenId) == "string"){
		data.canteenId = new ObjectID(data.canteenId);
	}
	db.Dish.insert({
		canteenId:data.canteenId,
		name:data.dishName,
		description:data.dishDescription,
		price:data.dishPrice,
		previewUrl:data.previewUrl,
		rates:[],
		comments:[]
	},{safe:true},outerCallback);
}

Dish.find = function(query,outerCallback){
	db.Dish.findItems(query,outerCallback);
}

Dish.findById = function(id,outerCallback){
	if(typeof(id) == 'string'){
		id = new ObjectID(id);
	}
	db.Dish.findOne({_id:id},outerCallback);
}

Dish.findByCanteenId = function(canteenId,outerCallback){
	if(typeof(canteenId) == 'string'){
		canteenId = new ObjectID(canteenId);
	}
	db.Dish.findItems({"canteenId":canteenId},outerCallback);
}
Dish.prototype.update = function(outerCallback){
	db.Dish.update({_id:this.data._id},this.data,{safe:true},outerCallback);
}

Dish.prototype.delete = function(outerCallback){
	db.Dish.remove({_id:this.data._id},{safe:true},outerCallback);
}