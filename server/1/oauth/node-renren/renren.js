module.exports = exports = Renren;
//constants
var RENREN_API_SERVER = 'http://api.renren.com/restserver.do';

var request = require('request'),
    crypto = require('crypto');

function Renren(config){
    
    this.session_key = config.session_key;
    this.api_key = config.api;
    this.app_secret = config.secret;
}


Renren.prototype.request = function(params,success,failure){
    //params.api_key = this.api_key;
    //params.call_id = (new Date).getTime();
    params.format = 'json';
    //params.session_key = this.session_key;
    params.v = '1.0';

    params.sig = this.hash_params(params);

    request.post({
        uri: RENREN_API_SERVER,
        form: params
    },function(e,r,body){
        var resp = JSON.parse(body);
        if( !Array.isArray(resp) && resp["error_code"]){
            if('function' == typeof failure ) 
                failure(resp);
        }else{
            success(resp);
        }
    });
};

Renren.prototype.hash_params = function(params){
    var pairList = [], hasher = crypto.createHash('md5');
    for(var key in params) pairList.push(key+'='+params[key]);
    hasher.update(pairList.sort().join(''));
    hasher.update(this.app_secret);
    return hasher.digest('hex');
};
