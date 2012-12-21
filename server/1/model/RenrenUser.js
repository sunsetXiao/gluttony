var async = require('async'),
	config = require('../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

db.bind("RenrenUser");
var RenrenUser = exports.RenrenUser = function () {
}

RenrenUser.create = function(info,outerCallback){
	db.RenrenUser.update({id:info.id},info,{safe:true,upsert:true},outerCallback);
}

RenrenUser.findByPlatformId = function(id,outerCallback){
	db.RenrenUser.findOne({id:id},outerCallback);
}

