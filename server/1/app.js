var express = require('express'),
    config = require('./config'),
    mongo = require('mongoskin'),
    http = require('http'),
    path = require('path'),
    db = mongo.db(config.db.url,{safe:true}),
    consolidate = require('consolidate'),
    RedisStore = require('connect-redis')(express),
	   app = express(),
     AdminController = require('./controller/AdminController').AdminController,
     CanteenController = require('./controller/CanteenController').CanteenController,
     DishController = require('./controller/DishController').DishController,
     ApiController = require('./controller/ApiController').ApiController,
     AuthController = require('./controller/AuthController').AuthController,
     UtilController = require('./controller/UtilController').UtilController
     ;


app.configure(function(){
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.engine('.html', consolidate.swig);
  require('swig').init({ root: path.join(__dirname, 'views'), allowErrors: true,cache:false });
  app.set('view engine', 'html');
  app.use(express.static(path.join(__dirname, 'static')));
  express.logger.format('devx', function(tokens, req, res){
    var status = res.statusCode
      , color = 32;

    if (status >= 500) color = 31
    else if (status >= 400) color = 33
    else if (status >= 300) color = 36;

    if(req.method == 'GET' &&
        (req.originalUrl.indexOf("/js/") == 0 ||
         req.originalUrl.indexOf("/css/") == 0||
         req.originalUrl.indexOf("/img/") == 0 || 
         req.originalUrl.indexOf("/grid/img") == 0))
      return null;

    return '\033[90m' + req.method
      + ' ' + req.originalUrl + ' '
      + '\033[' + color + 'm' + res.statusCode
      + ' \033[90m'
      + (new Date - req._startTime)
      + 'ms'
      + '\033[0m';
  });
  app.use(express.logger('devx'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());


  app.use(express.session({
    store: new RedisStore({
      host: config.redis.host,
      port: config.redis.port,
      db: config.redis.dbName,
      pass: config.redis.auth
    }), 
    secret: 'Gluttony',
    cookie: { maxAge: 7200000} // Session expired in four hours if no user action
  }));
/*
  app.use(express.session({
      secret: "Tsinghua Gluttony",
      cookie: { maxAge: 7200000} // Session expired in four hours if no user action
    }));*/
});

//General
app.get('/grid/img/:id',ApiController.getImage);
app.get("/about/",UtilController.about);
app.post("/feedback/",ApiController.feedback);

//Login
app.get('/auth/login/',AuthController.login);
app.get('/auth/renrenCallback',AuthController.renrenCallback);










if(process.env.NODE_ENV != 'production'){
  //Admin
  app.get('/admin/',AdminController.index);
  app.get('/admin/canteen/',AdminController.manageCanteen);
  app.get('/admin/dish/',AdminController.manageDish);

  //Canteen management
  app.post('/canteens/',CanteenController.create);
  app.post('/canteen/:id/',CanteenController.update);

  //Dish management
  app.post('/dishes/',DishController.create);
  app.post('/dish/:id/',DishController.update);
  app.delete('/dish/:id/',DishController.remove);
}

//Canteen
app.get('/',CanteenController.index);
// Render the specific canteen.
app.get('/canteen/:id/', CanteenController.canteen);
app.post('/canteen/:id/toggleLike/',CanteenController.toggleLike);



//Dish
app.post('/dish/:id/comment/',DishController.comment);
app.post('/dish/:id/toggleLike/',DishController.toggleLike);
app.post('/dish/:id/toggleTasted/',DishController.toggleTasted);

//Api
app.get('/api/randomDish/',ApiController.randomDish);
app.get('/api/canteen/:id/dishes/',ApiController.dishList);
app.get('/api/canteen/:id/',ApiController.canteen);
app.get('/api/dish/:id/',ApiController.dish);
app.post('/api/canteens/',ApiController.canteenList)
app.post('/api/canteen/random/',ApiController.randomCanteen);

app.listen(app.get('port'),config.host);
console.log("Server listening on port " + app.get('port'));