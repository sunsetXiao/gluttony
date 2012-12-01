var express = require('express'),
    config = require('./config'),
    mongo = require('mongoskin'),
    db = mongo.db(config.db.url,{safe:true}),
	   app = express();

app.get('/',function(req,res){
  db.collection('test').insert({test:1},{safe:true},function(err){if(err)console.log(err);});
	res.write("Hello world!");
	res.end();
});

app.listen(3000);
console.log("Server listening on port 3000");