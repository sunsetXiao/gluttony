var config = require('../config')
  	,	OAuth2 = require('../oauth/oauth2')
  	, 	renrenOAuth = new OAuth2(config.renren)
  	, 	async = require('async')
  	,	RenrenUser = require('../model/RenrenUser').RenrenUser
  	, 	User = require('../model/User').User
  	,	RenrenUserSystem = require('../logic/UserSystem').RenrenUserSystem
  	;


var AuthController = exports.AuthController = function(){}


AuthController.login = function(req,res){
	var platform = req.query.platform || "renren";
	var authorizationUrl;

	switch(platform){
		case "renren":
			authorizationUrl = renrenOAuth.getAuthorizeUrl();
			break;
		default:
			break;
	}
	if(authorizationUrl){
		res.redirect(authorizationUrl);
	}else{
		res.send(404);
	}
}

AuthController.renrenCallback = function(req,res){
	var code = req.query.code;
  async.waterfall([
    function(waterfallCallback){
      renrenOAuth.getAccessToken(code, waterfallCallback);
    },
    function(oauthRet, waterfallCallback) {
    	//console.log(oauthRet);
      var platformId = parseInt(oauthRet.user.id),
      	  platformAccessToken = oauthRet.access_token,
      	  refreshToken = oauthRet.refresh_token
      	  ;
      RenrenUserSystem.getFriendsID(platformId,platformAccessToken,function(err,friends){
      	if(err) waterfallCallback(err);
      	else{
      		waterfallCallback(err,oauthRet,friends);
      	}
      });
    },
    function(ret,friends,waterfallCallback){
    	var renrenUser = ret.user;
    	renrenUser.friends = friends;
    	RenrenUser.create(renrenUser,function(err){
    		if(err) waterfallCallback(err);
    		else{
    			var userInfo = {};
    			userInfo.name = renrenUser.name;
    			userInfo.link_renren = renrenUser.id;
    			userInfo.avatarUrl = renrenUser.avatar[0].url;//Default url maybe
    			//console.log(renrenUser.avatar);
    			User.find({"link_renren":renrenUser.id},function(err,items){
    				if(items && items.length > 0){
    					//Exists
    					waterfallCallback(err,items[0]);
    				}else{
    					User.create(userInfo,function(err,c){
    						//console.log(c);
    						if(c && c.length > 0)
    							waterfallCallback(err,c[0]);
    						else
    							waterfallCallback(err);
    					});
    				}
    			});
    		}
    	});
    },
    function(user,waterfallCallback){
    	if(req.session.user){
    		for(field in user){
    			req.session.user[field] = user[field];
    		}
    	}else{
    		req.session.user = user;
    	}
    	waterfallCallback(null);
    }
  ],function(err){
    if (err) 
    	res.send(500);
    //console.log("success");
    //res.render('index.html',{user:req.session.user});
    res.redirect('/');
  });
}