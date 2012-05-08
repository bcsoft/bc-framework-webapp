bc.reportTemplateForm = {
	init : function(option,readonly) {
		var $form = $(this);
		
		//只读权限控制
		if(readonly) return;
		
		var liTpl = '<li class="horizontal ui-widget-content ui-corner-all ui-state-highlight" data-id="{0}"'+
		'style="position: relative;margin:0 2px;float: left;padding: 0;border-width: 0;">'+
		'<span class="text">{1}</span>'+
		'<span class="click2remove verticalMiddle ui-icon ui-icon-close" style="margin: -8px -2px;" title={2}></span></li>';
		var ulTpl = '<ul class="horizontal"></ul>';
		var title = $form.find("#assignUsers").attr("data-removeTitle");
		
		//绑定添加用户的按钮事件处理
		$form.find("#addUsers").click(function(){
			var $ul = $form.find("#assignUsers ul");
			var $lis = $ul.find("li");
			var selecteds="";
			$lis.each(function(i){
				selecteds+=(i > 0 ? "," : "") + ($(this).attr("data-id"));//
			});
			bc.identity.selectUser({
				multiple: true,//可多选
				history: false,
				selecteds: selecteds,
				onOk: function(users){
					var usersInfo = $form.find(":hidden[name='e.users']").val();
					$.each(users,function(i,user){
						if($lis.filter("[data-id='" + user.id + "']").size() > 0){//已存在
							logger.info("duplicate select: id=" + user.id + ",name=" + user.name);
						}else{//新添加的
							if(!$ul.size()){//先创建ul元素
								$ul = $(ulTpl).appendTo($form.find("#assignUsers"));
							}
							$(liTpl.format(user.id,user.name,title))
							.appendTo($ul).find("span.click2remove")
							.click(function(){
								$(this).parent().remove();
							});
						}
					});
				}
			});
		});
		
		//绑定删除角色、用户的按钮事件处理
		$form.find("span.click2remove").click(function(){
			$(this).parent().remove();
		});
	},
	/**保存的处理*/
	save:function(){
		var $page = $(this);
		//将角色的id合并到隐藏域
		var ids=[];
		$page.find("#assignRoles li").each(function(){
			ids.push($(this).attr("data-id"));
		});
		$page.find(":input[name=assignRoleIds]").val(ids.join(","));
		
		//将用户的id合并到隐藏域
		ids=[];
		$page.find("#assignUsers li").each(function(){
			ids.push($(this).attr("data-id"));
		});
		$page.find(":input[name=assignUserIds]").val(ids.join(","));
		
		var code=$page.find(":input[name='e.code']").val();
		var id=$page.find(":input[name='e.id']").val();
		var url=bc.root+"/bc/reportTemplate/isUniqueCode";
		
		if(code==''){
			bc.msg.siled("请输入编码");
			return null;
		}
		
		//检查编码唯一性ajax请求
		$.ajax({
			url:url,
			data:{rid:id,code:code},
			dataType:"json",
			success:function(json){
				if(json.result){
					//调用标准的方法执行保存
					bc.page.save.call($page);
				}else{
					bc.msg.alert("系统中其它报表模板已使用此编码！");
				}
			}
		});
		
		
		
	},
	/**执行的处理**/
	execute:function(){
		var $form = $(this);
		var code = $form.find(":input[name='e.code']").val();;
		//弹出选择对话框
		bc.page.newWin({
			url: bc.root + "/bc/report/run?code=" + code,
			name: $form.find(":input[name='e.name']").val(),
			mid: code			
		});
	}
};