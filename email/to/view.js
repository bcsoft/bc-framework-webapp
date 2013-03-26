bc.emailToView = {
	open:function(){
		var $view = $(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length==1){
			bc.page.newWin({
				url:bc.root+"/bc/email/open",
				data:{id: $tds.attr("data-id"),openTyoe:1},
				mid:"email::open::"+$tds.attr("data-id"),
				name:"查看邮件",
				title:"查看邮件"
			});
		}else if($tds.length > 0){
			bc.msg.slide("一次只能查看一条信息！");
		}else{
			bc.msg.slide("请先选择要查看的信息！");
		}
	},
	/** 标记为按钮的事件处理 */
	selectMenuButtonItem : function(option) {
		var $view = $(this);
		switch(option.value){
			case "workflow.carManEntry":
				if(!bs.tempDriverView.starflowing)
					bs.tempDriverView.startFlow($page,"CarManEntry");
				break;
			case "workflow.requestServiceCertificate":
				
				if(!bs.tempDriverView.starflowing){
					bs.tempDriverView.startFlow4RSC.call($page);
				}
				break;
			case "operate.interviewDate":
				if(!bs.tempDriverView.operate)
					bs.tempDriverView.updateInterviewDate($page);
				break;
			case "operate.status":
				if(!bs.tempDriverView.operate)
					bs.tempDriverView.updateStatus($page);
				break;
			default:alert("other");
		}
	}
	
};