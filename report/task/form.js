bc.reportTaskForm = {
	init : function(option,readonly) {
		var $form = $(this);
		
		//只读权限控制
		if(readonly) return;
		
		// 点击选择报表模板小按钮弹出选择视图
		$form.find("#selectReportTemplate").click(function() {
			var url = bc.root + "/bc/selectReportTemplate/paging";
			// 构建默认参数
			var option = jQuery.extend({
				mid : 'selectReportTemplate',
				paging : true,
				title : '选择报表模板信息',
			}, option);

			// 将一些配置参数放到data参数内(这些参数是提交到服务器的参数)
			option.data = jQuery.extend({
				status : '0',
				multiple : false
			}, option.data);
			if (option.types)
				option.data.types = option.types;
			if (option.title)
				option.data.title = option.title;
			if (option.selecteds)
				option.data.selecteds = option.selecteds;
			if (option.multiple === true)
				option.data.multiple = true;

			// 弹出选择对话框
			bc.page.newWin(jQuery.extend({
				url : url,
				name : option.title,
				mid : option.mid,
				afterClose : function(template) {
					if (template) {
						$form.find(":input[name='e.template.id']").val(template.id);
						$form.find(":input[name='category']").val(template.category+'/'+template.name);
					}
				}
			}, option));
		});
		
		$form.find(":input[name='e.config']").tah({
		    moreSpace:1,   // 输入框底部预留的空白, 默认15, 单位像素
		    maxHeight:400,  // 指定Textarea的最大高度, 默认600, 单位像素
		    animateDur:10  // 调整高度时的动画过渡时间, 默认200, 单位毫秒
		});
		
	},
	/**保存处理**/
	save:function(){
		var $page = $(this);
		//详细配置赋值
		$page.find(":input[name='e.config']").val($page.find("#reportTaskConfig").text());
		//调用标准的方法执行保存
		bc.page.save.call($page);
	},
	/**查看执行记录**/
	viewExcuteRecode:function(){
		var $form = $(this);
		var id = $form.find(":input[name='e.id']").val();
		var name = $form.find(":input[name='e.name']").val();
		
		if(id==''){
			bc.msg.slide("此报表任务还没保存！");
			return;
		}
		var url = bc.root + "/bc/reportHistorys/paging";
		// 构建默认参数
		var option = {};

		// 将一些配置参数放到data参数内(这些参数是提交到服务器的参数)
		option.data = jQuery.extend({
			success : 'true',
			taskId:id,
		}, option.data);

		// 弹出选择对话框
		bc.page.newWin(jQuery.extend({
			mid : id,
			paging : true,
			title : '报表任务:'+name+'的执行记录',
			name : '报表任务:'+name+'的执行记录',
			url : url,
		}, option));
	}
};