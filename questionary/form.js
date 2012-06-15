bc.questionaryForm = {
		init : function(option,readonly) {
			var $form = $(this);
			//只读权限控制
			if(readonly) return;
			
			var liTpl = '<li class="horizontal reportUserLi ui-widget-content ui-corner-all ui-state-highlight" data-id="{0}"'+
			'style="position: relative;margin:0 2px;float: left;padding: 0;border-width: 0;">'+
			'<span class="text">{1}</span>'+
			'<span class="click2remove verticalMiddle ui-icon ui-icon-close" style="margin: -8px -2px;" title={2}></span></li>';
			var ulTpl = '<ul class="horizontal reportUserUl" style="padding: 0 45px 0 0;"></ul>';
			var title = $form.find("#assignUsers").attr("data-removeTitle");
			
			//绑定添加用户的按钮事件处理
			$form.find("#addUsers").click(function(){
				var $ul = $form.find("#assignUsers .reportUserUl");
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

			//绑定添加岗位的按钮事件处理
			$form.find("#addGroups").click(function(){
				var $ul = $form.find("#assignUsers .reportUserUl");
				var $lis = $ul.find("li");
				var selecteds = "";
				$lis.each(function(i){
					selecteds += (i > 0 ? "," : "") + $(this).attr("data-id");//已选择的id
				});
				bc.identity.selectGroup({
					multiple: true,
					selecteds: selecteds,
					onOk: function(groups){
						//添加当前没有分派的岗位
						$.each(groups,function(i,group){
							if($lis.filter("[data-id='" + group.id + "']").size() > 0){//已存在
								logger.info("duplicate select: id=" + group.id + ",name=" + group.name);
							}else{//新添加的
								if(!$ul.size()){//先创建ul元素
									$ul = $(ulTpl).appendTo($form.find("#assignUsers"));
								}
								$(liTpl.format(group.id,group.name,title))
								.appendTo($ul).find("span.click2remove")
								.click(function(){
									$(this).parent().remove();
								});
							}
						});
					}
				});
			});

			//绑定添加单位或部门的按钮事件处理
			$form.find("#addUnitOrDepartments").click(function(){
				var $ul = $form.find("#assignUsers .reportUserUl");
				var $lis = $ul.find("li");
				var selecteds = "";
				$lis.each(function(i){
					selecteds += (i > 0 ? "," : "") + $(this).attr("data-id");//已选择的id
				});
				bc.identity.selectUnitOrDepartment({
					multiple: true,
					selecteds: selecteds,
					onOk: function(groups){
						//添加当前没有分派的岗位
						$.each(groups,function(i,group){
							if($lis.filter("[data-id='" + group.id + "']").size() > 0){//已存在
								logger.info("duplicate select: id=" + group.id + ",name=" + group.name);
							}else{//新添加的
								if(!$ul.size()){//先创建ul元素
									$ul = $(ulTpl).appendTo($form.find("#assignUsers"));
								}
								$(liTpl.format(group.id,group.name,title))
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
			//添加题目
			
			$form.find("#testTable").delegate("#addTopic","click",function(){
				$(bc.questionaryForm.topic).appendTo($form.find("#testTable"));
			});
			
			//添加选项
			$form.find("#testTable").delegate("#addOption","click",function(){
				//当前选项
				var thisOption=$(this).parent().parent().parent();
				//判断当前项是否为最后一项，若是则在添加下一项目时本身也添加可以下移按钮
				if(thisOption.next().size()==0){
					//如果存在就不添加
					if($(this).parent().find("#downOption").size()==0){
						//插在添加按钮前
						$(bc.questionaryForm.li4DownOption).insertBefore($(this).parent().find("#addOption"));
					}
				}
				
				$(bc.questionaryForm.option).insertAfter($(this).parent().parent().parent());
				//查找新加入的项目的下一个过元素是否存在，如果不存在就删除下移按钮
				var newOption=$(this).parent().parent().parent().next();//插入的新选项
				if(newOption.next().size()==0){
					newOption.children(".value").children(".inputIcons").children().remove("#downOption");
				}
			});
			
			//删除选项
			$form.find("#testTable").delegate("#deleteOption","click",function(){
				$(this).parent().parent().parent().remove();
			});

		},
		//一条题目的模板
		topic : [
		         '<tr>',
		         	'<td class="label">题型:</td>',
		         	'<td class="value">',
		         		'<input type="radio" name="type" id="questionary_create_type0" value="0" style="width:auto;">',
		         		'<label for="questionary_create_type0">单选</label>',
		         		'<input type="radio" name="type" id="questionary_create_type1" value="1" style="width:auto;margin-left:3px">',
		         		'<label for="questionary_create_type1">多选</label>',
		         		'<input type="radio" name="type" id="questionary_create_type2" value="2" style="width:auto;margin-left:3px">',
		         		'<label for="questionary_create_type2">填空</label>',
		         		'<input type="radio" name="type" id="questionary_create_type3" value="3" style="width:auto;margin-left:3px">',
		         		'<label for="questionary_create_type3">简答</label>',
		         		'<div style="position:relative;right:-198px; display: inline-block;">选项布局：',
		         			'<input type="radio" name="config" id="questionary_create_configvertical" value="vertical" style="width:auto;">',
		         			'<label for="questionary_create_configvertical">垂直</label>',
		         			'<input type="radio" name="config" id="questionary_create_confighorizontal" value="horizontal" style="width:auto;margin-left:3px">',
		         			'<label for="questionary_create_confighorizontal">水平</label>',
	         			'</div>',
         			'</td>',
     			'</tr>',
     			'<tr>',
     				'<td class="label">题目:</td>',
     				'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
     				'<input type="text" name="e.subject" value="" id="questionary_create_e_subject" class="ui-widget-content">',
     				'<ul class="inputIcons" style="top:12px;right: 19px;">',
     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此问题" id="addUsers"></li>',
     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此问题" id="addUsers"></li>',
     					'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此问题下添加新问题" id="addTopic"></li>',
     					'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此问题" id="addUnitOrDepartments"></li>',
 					'</ul>',
 					'</td>',
					'</tr>',
     			'<tr>',
     				'<td class="label">选项:</td>',
 					'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
 						'<input type="checkbox" name="" value="true" id="questionary_create_" style="width:1em;">',
 						'<input type="hidden" id="__checkbox_questionary_create_" name="__checkbox_" value="true">',
 						'<input type="text" name="e.subject" value="" id="questionary_create_e_subject" class="ui-widget-content" style="width:496px;margin-left:4px;">',
 						'<ul class="inputIcons" style="top:12px;right: 19px;">',
 							'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此选项" id="addUsers"></li>',
 							'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此选项" id="downOption"></li>',
 							'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此选项下添加新选项" id="addOption"></li>',
 							'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此选项" id="addUnitOrDepartments"></li>',
							'</ul>',
					'</td>',
				'</tr>'
		         ].join(""),
		         //一个选项的模板：
		         option : [
                    '<tr>',
                    	'<td class="label"> </td>',
	 					'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
	 						'<input type="checkbox" name="" value="true" id="questionary_create_" style="width:1em;">',
	 						'<input type="hidden" id="__checkbox_questionary_create_" name="__checkbox_" value="true">',
	 						'<input type="text" name="e.subject" value="" id="questionary_create_e_subject" class="ui-widget-content" style="width:496px;margin-left:4px;">',
	 						'<ul class="inputIcons" style="top:12px;right: 19px;">',
	 							'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此选项" id="addUsers"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此选项" id="downOption"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此选项下添加新选项" id="addOption"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此选项" id="deleteOption"></li>',
							'</ul>',
						'</td>',
					'</tr>'
		                   ].join(""),
	                   //下移按钮模板：
                   li4DownOption : [
                                    '<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="在此选项下添加新选项" id="downOption"></li>'
                                    ].join(""), 
		                   
};





