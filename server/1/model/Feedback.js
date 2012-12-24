var config = require('../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

db.bind('Feedback');
var Feedback = exports.Feedback = function(data){
	this.data = data;
} 

Feedback.create = function(data,outerCallback){
	db.Feedback.insert(data,{safe:true},outerCallback);
}

Feedback.find = function(query,outerCallback){
	db.Feedback.findItems(query,outerCallback);
}
