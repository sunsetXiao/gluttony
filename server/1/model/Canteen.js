var config = require('../config'),
	mongo = require('mongoskin'),
	db = mongo.db(config.db.url,{safe:true}),
	ObjectID = mongo.ObjectID
	;

db.bind('Canteen');
var Canteen = exports.Canteen = function(data){
	this.data = data;
} ;

/**

**/
Canteen.create = function(data,outerCallback){
	console.log(data);
	data.comments = [];
	data.rates = [];
	db.collection('Canteen').insert(data,{safe:true},outerCallback);
}

Canteen.find = function(query,outerCallback){

	db.Canteen.findItems(query,outerCallback);
}

Canteen.findById = function(id,outerCallback){
	if((typeof(id) == 'string')){
		id = new ObjectID(id);
	}
	db.Canteen.findOne({"_id":id},outerCallback);
}
Canteen.prototype.update = function(outerCallback){
	db.Canteen.update({_id:this.data._id},this.data,{safe:true},outerCallback);
}

Canteen.prototype.delete = function(outerCallback){
	db.Canteen.remove({_id:this.data._id},{safe:true},outerCallback);
}