bc.emailFormr = {
	init : function(option,readonly) {
		var $form = $(this);
		
		$form.find(".email-open").show();
		
		//绑定回复事件
		$form.find(".emailFormr-reply").click(function(){
			var id=$form.find(":input[name='e.id']").val();
			bc.page.newWin({
				url:bc.root+"/bc/email/reply",
				data:{id: id},
				mid:"email::reply::"+id,
				name:"回复邮件",
				title:"回复邮件"
			});
		});
		
		//绑定转发事件
		$form.find(".emailFormr-forward").click(function(){
			var id=$form.find(":input[name='e.id']").val();
			bc.page.newWin({
				url:bc.root+"/bc/email/forward",
				data:{id: id},
				mid:"email::forward::"+id,
				name:"转发邮件",
				title:"转发邮件"
			});
		});
	}
};