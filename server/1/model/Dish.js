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

	db.Dish.insert(data,{safe:true},outerCallback);
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
	if(this.data.canteenId && (typeof(this.data.canteenId) == "string")){
		this.data.canteenId = new ObjectID(this.data.canteenId);
	}
	db.Dish.update({_id:this.data._id},this.data,{safe:true},outerCallback);
}

Dish.prototype.delete = function(outerCallback){
	db.Dish.remove({_id:this.data._id},{safe:true},outerCallback);
}

Dish.count = function(outerCallback){
	db.Dish.count({},outerCallback);
}