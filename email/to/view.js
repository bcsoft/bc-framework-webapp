bc.emailToView = {
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