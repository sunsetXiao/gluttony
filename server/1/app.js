var express = require('express'),
    config = require('./config'),
    mongo = require('mongoskin'),
    http = require('http'),
    path = require('path'),
    db = mongo.db(config.db.url,{safe:true}),
    consolidate = require('consolidate')
	   app = express(),
     AdminController = require('./controller/AdminController').AdminController,
     CanteenController = require('./controller/CanteenController').CanteenController
     ;


app.configure(function(){
  app.set('port', 3000);
  app.set('views', __dirname + '/views');
  app.engine('.html', consolidate.swig);
  require('swig').init({ root: path.join(__dirname, 'views'), allowErrors: true,cache:false });
  app.set('view engine', 'html');
  app.use(express.static(path.join(__dirname, 'static')));
});


app.get('/',CanteenController.index);
app.listen(app.get('port'));
console.log("Server listening on port " + app.get('port'));