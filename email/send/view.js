bc.emailSendView = {
	open:function(){
		var $view = $(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length==1){
			bc.page.newWin({
				url:bc.root+"/bc/email/open",
				data:{id: $tds.attr("data-id"),openTyoe:0},
				mid:"email::send::"+$tds.attr("data-id"),
				name:"查看已发邮件",
				title:"查看已发邮件"
			});
		}else if($tds.length > 0){
			bc.msg.slide("一次只能查看一条信息！");
		}else{
			bc.msg.slide("请先选择要查看的信息！");
		}
	}
};