var async = require('async'),
	config = require('../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

db.bind("User");

var User = exports.User = function(data){
	this.data = data;
}

User.create = function(data,outerCallback){
	var insertData = {
		"name" : data.name,
		"avatarUrl": data.avatarUrl
	};
	for(var i = 0;i < config.supportPlatform.length;i++){
		var field = "link_" + config.supportPlatform[i];
		if(data[field]){
			insertData[field] = data[field];
		}
	}
	db.User.insert(insertData,{safe:true},outerCallback);
}

User.find = function(query,outerCallback){
	db.User.findItems(query,outerCallback);
}

User.findById = function(id,outerCallback){
	if((typeof(id) == "string")){
		id = new ObjectID(id);
	}
	db.User.findOne({"_id":id},outerCallback);
}