bc.scheduleJobForm = {
	init : function() {
		var $form = $(this);
		//绑定“帮助”链接的点击事件
		$form.find("#helpref").click(function(){
			var url = "http://rongjih.blog.163.com/blog/static/33574461201032011858793/";
			window.open(url,"_blank");
			return false;;
		});
	}
};