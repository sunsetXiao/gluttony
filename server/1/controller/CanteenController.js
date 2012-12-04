var Canteen = require("../model/Canteen").Canteen,
	Dish = require("../model/Dish").Dish
	;

var CanteenController = exports.CanteenController = function(){};


CanteenController.index = function(req,res){
	Canteen.find({},function(err,canteenList){
		res.render('index.html',{canteenList:canteenList});
	});
}

CanteenController.create = function(req,res){
	var data = req.body;
	Canteen.create(data,function(err,count){
		if(err){
			res.send(500);
		}
		else{
			res.send(200);
		}
	});
}

CanteenController.canteen = function(req,res){
	if(req.params.id){
		Canteen.findById(req.params.id,function(err,item){
			if(item){
				
			}
			else{
				res.send(404);
			}
		});
	}else{
		res.send(404);
	}
}