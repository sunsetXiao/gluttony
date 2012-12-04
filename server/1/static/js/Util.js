var Util = function(){
	notifySuccess : function(){
		new $.Zebra_Dialog("操作成功",{
			'buttons':  false,
			'modal':false,
		    'type':'confirmation',
		    'position': ['right - 20','top + 60'],
		    'auto_close': 3000
		});
	}

	notifyError : function(){
		new $.Zebra_Dialog("操作成功",{
			'buttons':  false,
			'modal':false,
		    'type':'information',
		    'position': ['right - 20','top + 60'],
		    'auto_close': 3000
		});
	}
}


