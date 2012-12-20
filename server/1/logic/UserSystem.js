var 	RenrenUser = require('../model/RenrenUser')
  	, 	User = require('../model/User')
  	,	async = require('async')	
  	,	config = require('../config')
  	, 	NodeRenren = require('node-renren/renren')
  	, 	nodeRenren = new NodeRenren(config.renren)
  	;



var UserSystem = exports.UserSystem = function(){};
var RenrenUserSystem = exports.RenrenUserSystem = function(){};


UserSystem.getUserPlaformInfo = function(platform,platformId,outerCallback){
	switch(platform){
		case "renren":
		nodeRenren.
		break;
		default:
		outerCallback("Not supported");
	}
}

RenrenUserSystem.getFriendsID = function(platformId,accessToken,outerCallback){
	nodeRenren.request({
		access_token: accessToken,
    	method:"friends.get"
	},function(res){
		console.log(res);
		outerCallback(null,res);
	},function(err){
		console.log("Get friend list failure");
		console.log(err);
		outerCallback(err);
	});
}