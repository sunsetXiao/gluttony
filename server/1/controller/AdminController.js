

var AdminController = exports.AdminController = function(){} ;

AdminController.index = function (req,res){
	res.render('admin/index.html',{name:'taylor'});
}