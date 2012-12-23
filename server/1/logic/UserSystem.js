var 	RenrenUser = require('../model/RenrenUser').RenrenUser
  	, 	User = require('../model/User').User
  	,	async = require('async')	
  	,	config = require('../config')
  	, 	NodeRenren = require('../oauth/node-renren/renren')
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

UserSystem.getExistedFriends = function(userId,outerCallback){
	User.findById(userId,function(err,user){
		if(!user) return outerCallback(err,[]);
		var friendList = [];
		async.forEach(config.supportPlatform,function(item,forEachCallback){
			switch(item){
				case "renren":
					RenrenUser.findByPlatformId(user.link_renren,function(err,renrenUser){
						async.forEach(renrenUser.friends,function(id,innerForeachCallback){
							User.find({"link_renren":id},function(err,items){
								if(items && items.length > 0){
									friendList.push(items[0]);
								}
								innerForeachCallback(err);
							});
						},function(err){
							forEachCallback(err);
						});
					});
					break;
				default:
					forEachCallback(null);
					break;
			}
		},function(err){
			outerCallback(err,friendList);
		});
	});
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

function _getDAOByPlatform(platform){
	switch(platform){
		case "renren":
			return RenrenUser;
		default:
			return null;
	}
}