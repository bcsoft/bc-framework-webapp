bc.emailViewBase = {
	i:0,
	/** 写邮件 */
	writeEmail: function(){
		bc.page.newWin({
			url:bc.root+"/bc/email/create",
			mid:"email::create::"+bc.emailViewBase.i,
			name:"新邮件",
			title:"新邮件"
		});
		bc.emailViewBase.i=bc.emailViewBase.i+1;
	},
	/** 回复 */
	reply:function(){
		var $view = $(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length==1){
			bc.page.newWin({
				url:bc.root+"/bc/email/reply",
				data:{id: $tds.attr("data-id")},
				mid:"email::reply::"+$tds.attr("data-id"),
				name:"回复邮件",
				title:"回复邮件"
			});
		}else if($tds.length > 0){
			bc.msg.slide("一次只能回复一封邮件！");
		}else{
			bc.msg.slide("请先选择要回复的邮件！");
		}
	},
	/** 转发 */
	forwoard:function(){
		var $view = $(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length==1){
			bc.page.newWin({
				url:bc.root+"/bc/email/forward",
				data:{id: $tds.attr("data-id")},
				mid:"email::forward::"+$tds.attr("data-id"),
				name:"转发邮件",
				title:"转发邮件"
			});
		}else if($tds.length > 0){
			bc.msg.slide("一次只能转发一封邮件！");
		}else{
			bc.msg.slide("请先选择要转发的邮件！");
		}
	},
	/** 发件箱 */
	sendBox: function(){
		var $view=$(this);

	},
	/** 收件箱 */
	toBox: function(){
		var $view=$(this);

	},
	/** 垃圾箱 */
	trashBox: function(){
		var $view=$(this);

	}
};