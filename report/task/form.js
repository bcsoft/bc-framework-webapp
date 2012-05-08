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
					mid : 'selectSuperiorPlace',
					paging : true,
					title : '选择上级信息',
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
		
	},
	/**保存的处理*/
	save:function(){
		
	}
};