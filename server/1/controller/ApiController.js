var FileHandler = require('../model/FileHandler').FileHandler
	Dish = require('../model/Dish').Dish,
	Canteen = require('../model/Canteen').Canteen,
	async = require('async')
;

var ApiController = exports.ApiController = function(){}

ApiController.getImage = function(req,res){
	var f = new FileHandler();
	f.getByIdStr(req.params.id,function(err,object){
		res.writeHead('200', {'Content-Type': 'image/jpg'});
    	res.end(object,'binary');
	},req.params.id);
}

ApiController.randomDish = function(req,res){
	async.waterfall([
			function(waterfallCallback){
				Dish.find({},function(err,dishes){
					if(err)	waterfallCallback(err);
					var r = Math.round(Math.random() * dishes.length);
					r = r % dishes.length;
					console.log(r);
					waterfallCallback(err,dishes[r]);
				});
			},
			function(dish,waterfallCallback){
				Canteen.findById(dish.canteenId,function(err,item){
					dish.canteen = item;
					waterfallCallback(err,dish);
				});
			}
		],
		function(err,dish){
			res.json(dish);
		});
}

ApiController.randomCanteen = function(req,res){

	async.waterfall([
			function(waterfallCallback){
				var params = req.body;
				console.log(req.body);
				Canteen.find({},function(err,canteens){
					if(err)	waterfallCallback(err);
					var r = Math.round(Math.random() * canteens.length);
					r = r % canteens.length;
					console.log(r);
					waterfallCallback(err,canteens[r]);
				});
			}
		],
		function(err,canteen){
			res.json(canteen);
		});
}
ApiController.canteen = function(req,res){
	if(req.params.id){
		Canteen.findById(req.params.id,function(err,item){
			if(item){
				Dish.findByCanteenId(item._id,function(err,items){
					item.dishes = items;
					res.json(item);
				});
			}
			else{
				res.send(404);
			}
		});
	}else{
		res.send(404);
	}
}

ApiController.canteenList = function(req,res){
	Canteen.find({},function(err,canteens){
		res.json(canteens);
	});
}

ApiController.dishList = function(req,res){
	if(req.params.id){
		Dish.findByCanteenId(req.params.id,function(err,dishes){
			res.json(dishes);
		});
	}else{
		res.send(404);
	}
}

ApiController.dish = function(req,res){
	if(req.params.id){
		Dish.findById(req.params.id,function(err,dish){
			res.json(dish);
		});
	}else{
		res.send(404);
	}
}