bc.emailViewBase = {
	i:0,
	/** 写邮件 */
	writeEmail: function(){
		bc.page.newWin({
			url:bc.root+"/bc/email/create",
			mid:"newEmail::"+bc.emailViewBase.i,
			name:"新邮件",
			title:"新邮件"
		});
		bc.emailViewBase.i=bc.emailViewBase.i+1;
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