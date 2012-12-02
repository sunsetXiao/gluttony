var config = require('../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true})
	;

db.bind('Canteen');
var Canteen = function(data){
	this.data = data;
} ;
Canteen = exports.Canteen;

/**

**/
Canteen.create = function(data,outerCallback){
	db.Canteen.insert(data,{safe:true},outerCallback);
}

Canteen.find = function(query,outerCallback){
	db.Canteen.findItems(query,outerCallback);
}

Canteen.prototype.update = function(outerCallback){
	db.Canteen.update({_id:this.data._id},this.data,{safe:true},outerCallback);
}

Canteen.prototype.delete = function(outerCallback){
	db.Canteen.remove({_id:this.data._id},{safe:true},outerCallback);
}