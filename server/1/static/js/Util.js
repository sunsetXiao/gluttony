var Util = function(){
	
}

Util.notifySuccess = function(data){
	var content = data.content || '操作成功';
		new $.Zebra_Dialog(content,{
			'buttons':  false,
			'modal':false,
		    'type':'confirmation',
		    'position': ['right - 20','top + 60'],
		    'auto_close': 3000
		});
	}

Util.notifyError = function(data){
	var content = data.content || '出了点问题，请稍后重试';
		new $.Zebra_Dialog(content,{
			'buttons':  false,
			'modal':false,
		    'type':'information',
		    'position': ['right - 20','top + 60'],
		    'auto_close': 3000
		});
	}

