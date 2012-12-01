var config = require('../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true})
	;

var _AbstractModel = function(){} = exports._AbstractModel;
_AbstractModel.db = db;

_AbstractModel.create = function(){

}

