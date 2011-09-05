bc.scheduleLogForm = {
	init : function() {
		var $form = $(this);
		//绑定“在新窗口中查看”链接的点击事件
		$form.find("#showError").click(function(){
			var errorWin=window.open('', 'bcErrorShow');
			var errorDoc = errorWin.document;
			errorDoc.open();
			errorDoc.write("<pre>" + $form.find("#msg").html() + "</pre>");
			errorDoc.close();
			errorWin.focus();
			return false;;
		});
	}
};