bc.roleForm = {
	init : function(option,readonly) {
		if(readonly) return;
		
		var $form = $(this);
		
		var liTpl = '<li class="horizontal ui-widget-content ui-corner-all ui-state-highlight" data-id="{0}">'+
			'<span class="text">{1}</span>'+
			'<span class="click2remove verticalMiddle ui-icon ui-icon-close" title={2}></span></li>';
		var ulTpl = '<ul class="horizontal"></ul>';
		var title = $form.find("#assignResources").attr("data-removeTitle");
		//绑定添加资源的按钮事件处理
		$form.find("#addResources").click(function(){
			var $ul = $form.find("#assignResources ul");
			var $lis = $ul.find("li");
			var selecteds = "";
			$lis.each(function(i){
				selecteds += (i > 0 ? "," : "") + $(this).attr("data-id");//已选择的id
			});
			bc.identity.selectResource({
				multiple: true,
				selecteds: selecteds,
				types: "1,2,3,4",
				onOk: function(resources){
					//添加当前没有分派的模块
					$.each(resources,function(i,resource){
						if($lis.filter("[data-id='" + resource.id + "']").size() > 0){//已存在
							logger.info("duplicate select: id=" + resource.id + ",name=" + resource.name);
						}else{//新添加的
							if(!$ul.size()){//先创建ul元素
								$ul = $(ulTpl).appendTo($form.find("#assignResources"));
							}
							$(liTpl.format(resource.id,resource.name,title))
							.appendTo($ul).find("span.click2remove")
							.click(function(){
								$(this).parent().remove();
							});
						}
					});
				}
			});
		});

		//绑定删除角色的按钮事件处理
		$form.find("span.click2remove").click(function(){
			$(this).parent().remove();
		});
	},
	/**保存的处理*/
	save:function(){
		$page = $(this);
		//先将模块的id合并到隐藏域
		var ids=[];
		$page.find("#assignResources li").each(function(){
			ids.push($(this).attr("data-id"));
		});
		$page.find(":input[name=assignResourceIds]").val(ids.join(","));
		
		//调用标准的方法执行保存
		bc.page.save.call(this);
	}
};