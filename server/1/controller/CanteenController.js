var Canteen = require("../model/Canteen").Canteen,
	Dish = require("../model/Dish").Dish,
	FileHandler = require('../model/FileHandler').FileHandler,
	async = require('async'),
	config = require('../config')
	;

var CanteenController = exports.CanteenController = function(){};


CanteenController.index = function(req,res){
	Canteen.find({},function(err,canteenList){
		res.render('index.html',{canteenList:canteenList});
	});
}


CanteenController.create = function(req,res){
	var data = req.body;
	var f = new FileHandler();
	async.waterfall([
			function(waterfallCallback){
				if(req.files.canteenPreview){
					f.saveFromFile(req.files.canteenPreview.path,function(err,imgId){
						waterfallCallback(err,config.gridfs + imgId);
					});
				}else{
					waterfallCallback(null,null);
				}
			},
			function(previewUrl,waterfallCallback){
				data.previewUrl = previewUrl;
				Canteen.create(data,function(err,count){
					waterfallCallback(err);
				});
			}
		],function(err){
			if(err){
				res.send(500);
			}else{
				res.send(200);
			}
	});
	
}

CanteenController.canteen = function(req,res){
	if(req.params.id){
		Canteen.findById(req.params.id,function(err,item){
			if(item){
				Dish.findByCanteenId(item._id,function(err,items){
					canteen.dishes = items;
					res.render("canteen/canteen.html",{'canteen':canteen});
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