var config = require('../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true})
	;

db.bind('Dish');
var Dish = function(data){
	this.data = data;
} 
Dish = exports.Dish;

/**

**/
Dish.create = function(data,outerCallback){
	db.Dish.insert(data,{safe:true},outerCallback);
}

Dish.find = function(query,outerCallback){
	db.Dish.findItems(query,outerCallback);
}

Dish.prototype.update = function(outerCallback){
	db.Dish.update({_id:this.data._id},this.data,{safe:true},outerCallback);
}

Dish.prototype.delete = function(outerCallback){
	db.Dish.remove({_id:this.data._id},{safe:true},outerCallback);
}