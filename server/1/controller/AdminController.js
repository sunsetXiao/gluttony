var Canteen = require('../model/Canteen').Canteen
	Dish = require('../model/Dish').Dish
	;

var AdminController = exports.AdminController = function(){} ;

AdminController.logOnForm = function(req,res){

}
AdminController.index = function (req,res){
	res.render('admin/index.html',{name:'taylor'});
}

AdminController.manageCanteen = function(req,res){
	Canteen.find({},function(err,items){
		if(err){return res.send(500);}
		res.render('admin/manageCanteen.html',{canteenList:items});
	});
}

AdminController.manageDish = function(req,res){
	Canteen.find({},function(err,items){
		if(err){return res.send(500);}
		res.render('admin/manageDish.html',{canteenList:items});
	});
}

