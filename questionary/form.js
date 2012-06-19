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
			//添加问题
			
			$form.find("#testArea").delegate("#addTopic","click",function(){
				$(bc.questionaryForm.topic).insertAfter($(this).parent().parent().parent().parent().parent());
				//初始化题目序号
				bc.questionaryForm.getSerialNumber($form);
			});
			//删除问题
			
			$form.find("#testArea").delegate("#deleteTopic","click",function(){
				$(this).parent().parent().parent().parent().parent().remove();
				//初始化题目序号
				bc.questionaryForm.getSerialNumber($form);
			});
			
			//上移问题
			$form.find("#testArea").delegate("#upTopic","click",function(){
				//当前问题
				var thisTopic=$(this).parent().parent().parent().parent().parent();
				//当前问题为第一条问题不能再上移
				if(thisTopic.prev().size()==0){
					bc.msg.slide("当前问题为第一条问题不能再上移！");
				}else{
					thisTopic.insertBefore(thisTopic.prev());
				}
				//初始化题目序号
				bc.questionaryForm.getSerialNumber($form);

			});
			
			//下移问题
			$form.find("#testArea").delegate("#downTopic","click",function(){
				//当前问题
				var thisTopic=$(this).parent().parent().parent().parent().parent();
				//当前问题为最后一条问题不能再下移
				if(thisTopic.next().size()==0){
					bc.msg.slide("当前问题为最后一条问题不能再下移！");
				}else{
					thisTopic.insertAfter(thisTopic.next());
				}
				//初始化题目序号
				bc.questionaryForm.getSerialNumber($form);
			});
			
			//添加选项
			$form.find("#testArea").delegate("#addOption","click",function(){
				//当前选项
				var thisOption=$(this).parent().parent();
//				//判断当前项是否为最后一项，若是则在添加下一项目时本身也添加可以下移按钮
//				if(thisOption.next().size()==0){
//					//如果存在就不添加
//					if($(this).parent().find("#downOption").size()==0){
//						//插在添加按钮前
//						$(bc.questionaryForm.li4DownOption).insertBefore($(this).parent().find("#addOption"));
//					}
//				}
				
				$(bc.questionaryForm.option).insertAfter(thisOption);
//				//查找新加入的项目的下一个过元素是否存在，如果不存在就删除下移按钮
//				var newOption=$(this).parent().parent().parent().next();//插入的新选项
//				if(newOption.next().size()==0){
//					newOption.children(".value").children(".inputIcons").children().remove("#downOption");
//				}
			});
			
			//上移选项
			$form.find("#testArea").delegate("#upOption","click",function(){
				//当前选项
				var thisOption=$(this).parent().parent();
				//当前选项为第一条选项不能再上移
				if(thisOption.prev().size()==0){
					bc.msg.slide("当前选项为第一条选项不能再上移！");
				}else{
					thisOption.insertBefore(thisOption.prev());
				}

			});
			
			//下移选项
			$form.find("#testArea").delegate("#downOption","click",function(){
				//当前选项
				var thisOption=$(this).parent().parent();
				//当前问题为最后一条问题不能再下移
				if(thisOption.next().size()==0){
					bc.msg.slide("当前选项为最后一条选项不能再下移！");
				}else{
					thisOption.insertAfter(thisOption.next());
				}

			});
			
			//删除选项
			$form.find("#testArea").delegate("#deleteOption","click",function(){
				$(this).parent().parent().remove();
			});
			
			//切换题型
			$form.find("#testArea").delegate(":input[name='type']","change",function(){
				var type = $(this).val();
				//当前题目
				var thisTopic=$(this).parent().parent().parent().parent();
				//获取索引
				var index = thisTopic.index();
				//填空题
				if(type==2){
					//先插入
					$(bc.questionaryForm.completion).insertAfter(thisTopic);
					//用填空题替换当前的题目
					thisTopic.replaceWith(thisTopic.next());
					//初始化题目序号
					bc.questionaryForm.getSerialNumber($form);
					$($form.find("#testArea").children()[index]).find(":input[name='type']").eq(type).attr("checked","checked");

					
				}
				//简答题
				if(type==3){
					//先插入
					$(bc.questionaryForm.jquiz).insertAfter(thisTopic);
					//用填空题替换当前的题目
					thisTopic.replaceWith(thisTopic.next());
					//初始化题目序号
					bc.questionaryForm.getSerialNumber($form);
					$($form.find("#testArea").children()[index]).find(":input[name='type']").eq(type).attr("checked","checked");
				}
				//单选或多选时
				if(type==0||type==1){
					//先插入
					$(bc.questionaryForm.topic).insertAfter(thisTopic);
					//用填空题替换当前的题目
					thisTopic.replaceWith(thisTopic.next());
					//初始化题目序号
					bc.questionaryForm.getSerialNumber($form);
					$($form.find("#testArea").children()[index]).find(":input[name='type']").eq(type).attr("checked","checked");
					
				}

				
			});

		},
		//一条选择题目的模板
		topic : [
         '<table class="ui-widget-content" cellspacing="2" cellpadding="0" style="width:100%;border-width: 1px 0 0 0;">',
         	'<tbody>',
         		'<tr class="widthMarker">',
         			'<td style="width: 40px;">&nbsp;</td>',
         			'<td style="width: 60px;">&nbsp;</td>',
         			'<td>&nbsp;</td>',
     			'</tr>',
		        '<tr>',
		        	'<td style="font-weight: normal;text-align: left;">第<span style="color: red;"></span>题</td>',
		         	'<td style="font-weight: normal;text-align: right;">题型:</td>',
		         	'<td class="value">',
		         		'<div class="ui-widget-content" style="display: inline-block;border-width: 0 1px 0 0;padding-right: 2px;">',
		         			'<input type="checkbox" name="e.innerFix" value="true" id="questionary_create_e_innerFix" style="width:1em;">',
		         			'<label style="width:auto;margin-left:4px;">必选题</label>',
	         			'</div>',
		         		'<input type="radio" name="type" id="questionary_create_type0" value="0" style="width:auto;margin-left:4px;">',
		         		'<label for="questionary_create_type0">单选</label>',
		         		'<input type="radio" name="type" id="questionary_create_type1" value="1" style="width:auto;margin-left:4px;">',
		         		'<label for="questionary_create_type1">多选</label>',
		         		'<input type="radio" name="type" id="questionary_create_type2" value="2" style="width:auto;margin-left:4px;">',
		         		'<label for="questionary_create_type2">填空</label>',
		         		'<input type="radio" name="type" id="questionary_create_type3" value="3" style="width:auto;margin-left:4px;">',
		         		'<label for="questionary_create_type3" style="width:auto;margin-right:4px;">简答</label>',
		         		'<div class="ui-widget-content" style="display: inline-block;border-width: 0 1px 0 1px;padding: 0 2px 0 2px;">',
		         			'<input type="checkbox" name="e.innerFix" value="true" id="questionary_create_e_innerFix" style="width:1em;">',
		         			'<label style="width:auto;margin-left:4px;">全对方有分</label>',
	         			'</div>',
		         		'<div style="position:relative;right:-38px; display: inline-block;">选项布局：',
		         			'<input type="radio" name="config" id="questionary_create_configvertical" value="vertical" style="width:auto;margin-left:4px">',
		         			'<label for="questionary_create_configvertical">垂直</label>',
		         			'<input type="radio" name="config" id="questionary_create_confighorizontal" value="horizontal" style="width:auto;margin-left:4px">',
		         			'<label for="questionary_create_confighorizontal">水平</label>',
	         			'</div>',
         			'</td>',
     			'</tr>',
     			'<tr>',
     				'<td>&nbsp;</td>',
     				'<td style="font-weight: normal;text-align: right;">题目:</td>',
     				'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
     				'<input type="text" name="e.subject" value="" id="questionary_create_e_subject" class="ui-widget-content">',
     				'<ul class="inputIcons" style="top:12px;right: 19px;">',
     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此问题" id="upTopic"></li>',
     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此问题" id="downTopic"></li>',
     					'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此问题下添加新问题" id="addTopic"></li>',
     					'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此问题" id="deleteTopic"></li>',
 					'</ul>',
 					'</td>',
					'</tr>',
     			'<tr class="option">',
     				'<td>&nbsp;</td>',
     				'<td style="font-weight: normal;text-align: right;vertical-align: top;">选项:</td>',
 					'<td class="value">',
 						'<div style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
 							'<input type="checkbox" name="" value="true" id="questionary_create_" style="width:1em;">',
 							'<input type="hidden" id="__checkbox_questionary_create_" name="__checkbox_" value="true">',
 							'<input type="text" name="e.subject" value="" id="questionary_create_e_subject" class="ui-widget-content" style="width:496px;margin-left:4px;">',
 							'<ul class="inputIcons" style="top:12px;right: 19px;">',
 								'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此选项" id="upOption"></li>',
 								'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此选项" id="downOption"></li>',
 								'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此选项下添加新选项" id="addOption"></li>',
 								'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此选项" id="deleteOption"></li>',
							'</ul>',
						'</div>',
					'</td>',
				'</tr>',
			'</tbody>',
		'</table>'
		         ].join(""),		
		         //一条填空题目的模板
		         completion : [
		 		         '<table class="ui-widget-content" cellspacing="2" cellpadding="0" style="width:100%;border-width: 1px 0 0 0;">',
		 		         	'<tbody>',
		 		         		'<tr class="widthMarker">',
		 		         			'<td style="width: 40px;">&nbsp;</td>',
		 		         			'<td style="width: 60px;">&nbsp;</td>',
		 		         			'<td>&nbsp;</td>',
		 		     			'</tr>',
		 				        '<tr>',
		 				        	'<td style="font-weight: normal;text-align: left;">第<span style="color: red;"></span>题</td>',
		 				         	'<td style="font-weight: normal;text-align: right;">题型:</td>',
		 				         	'<td class="value">',
		 				         		'<div class="ui-widget-content" style="display: inline-block;border-width: 0 1px 0 0;padding-right: 2px;">',
		 				         			'<input type="checkbox" name="e.innerFix" value="true" id="questionary_create_e_innerFix" style="width:1em;">',
		 				         			'<label style="width:auto;margin-left:4px;">必选题</label>',
		 			         			'</div>',
		 				         		'<input type="radio" name="type" id="questionary_create_type0" value="0" style="width:auto;margin-left:4px;">',
		 				         		'<label for="questionary_create_type0">单选</label>',
		 				         		'<input type="radio" name="type" id="questionary_create_type1" value="1" style="width:auto;margin-left:4px;">',
		 				         		'<label for="questionary_create_type1">多选</label>',
		 				         		'<input type="radio" name="type" id="questionary_create_type2" value="2" style="width:auto;margin-left:4px;">',
		 				         		'<label for="questionary_create_type2">填空</label>',
		 				         		'<input type="radio" name="type" id="questionary_create_type3" value="3" style="width:auto;margin-left:4px;">',
		 				         		'<label for="questionary_create_type3" style="width:auto;margin-right:4px;">简答</label>',
		 		         			'</td>',
		 		     			'</tr>',
		 		     			'<tr>',
		 		     				'<td>&nbsp;</td>',
		 		     				'<td style="font-weight: normal;text-align: right;">题目:</td>',
		 		     				'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
		 		     				'<input type="text" name="e.subject" value="" id="questionary_create_e_subject" class="ui-widget-content">',
		 		     				'<ul class="inputIcons" style="top:12px;right: 19px;">',
		 		     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此问题" id="upTopic"></li>',
		 		     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此问题" id="downTopic"></li>',
		 		     					'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此问题下添加新问题" id="addTopic"></li>',
		 		     					'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此问题" id="deleteTopic"></li>',
		 		 					'</ul>',
		 		 					'</td>',
		 							'</tr>',
		 		     			'<tr>',
		 		     				'<td>&nbsp;</td>',
		 		     				'<td style="font-weight: normal;text-align: right;vertical-align: top;">内容:</td>',
		 		     				'<td class="value">',
		 		     					'<textarea name="e.description" cols="" rows="3" id="questionary_create_e_description" class="ui-widget-content noresize" style="width: 98%;">',
		 		     					'</textarea>',
	 		     					'</td>',
		 						'</tr>',
		 						'<tr>',
		 							'<td>&nbsp;</td>',
		 							'<td style="font-weight: normal;text-align: right;vertical-align: top;">答案:</td>',
		 							'<td class="value"><textarea name="e.description" cols="" rows="3" id="questionary_create_e_description" class="ui-widget-content noresize" style="width: 98%;"></textarea>',
		 							'</td>',
	 							'</tr>',
		 					'</tbody>',
		 				'</table>'
		 				         ].join(""),
			         //一条简答题目的模板
			         jquiz : [
		 				 		         '<table class="ui-widget-content" cellspacing="2" cellpadding="0" style="width:100%;border-width: 1px 0 0 0;">',
		 				 		         	'<tbody>',
		 				 		         		'<tr class="widthMarker">',
		 				 		         			'<td style="width: 40px;">&nbsp;</td>',
		 				 		         			'<td style="width: 60px;">&nbsp;</td>',
		 				 		         			'<td>&nbsp;</td>',
		 				 		     			'</tr>',
		 				 				        '<tr>',
		 				 				        	'<td style="font-weight: normal;text-align: left;">第<span style="color: red;"></span>题</td>',
		 				 				         	'<td style="font-weight: normal;text-align: right;">题型:</td>',
		 				 				         	'<td class="value">',
		 				 				         		'<div class="ui-widget-content" style="display: inline-block;border-width: 0 1px 0 0;padding-right: 2px;">',
		 				 				         			'<input type="checkbox" name="e.innerFix" value="true" id="questionary_create_e_innerFix" style="width:1em;">',
		 				 				         			'<label style="width:auto;margin-left:4px;">必选题</label>',
		 				 			         			'</div>',
		 				 				         		'<input type="radio" name="type" id="questionary_create_type0" value="0" style="width:auto;margin-left:4px;">',
		 				 				         		'<label for="questionary_create_type0">单选</label>',
		 				 				         		'<input type="radio" name="type" id="questionary_create_type1" value="1" style="width:auto;margin-left:4px;">',
		 				 				         		'<label for="questionary_create_type1">多选</label>',
		 				 				         		'<input type="radio" name="type" id="questionary_create_type2" value="2" style="width:auto;margin-left:4px;">',
		 				 				         		'<label for="questionary_create_type2">填空</label>',
		 				 				         		'<input type="radio" name="type" id="questionary_create_type3" value="3" style="width:auto;margin-left:4px;">',
		 				 				         		'<label for="questionary_create_type3" style="width:auto;margin-right:4px;">简答</label>',
		 				 		         			'</td>',
		 				 		     			'</tr>',
		 				 		     			'<tr>',
		 				 		     				'<td>&nbsp;</td>',
		 				 		     				'<td style="font-weight: normal;text-align: right;">题目:</td>',
		 				 		     				'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
		 				 		     				'<input type="text" name="e.subject" value="" id="questionary_create_e_subject" class="ui-widget-content">',
		 				 		     				'<ul class="inputIcons" style="top:12px;right: 19px;">',
		 				 		     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此问题" id="upTopic"></li>',
		 				 		     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此问题" id="downTopic"></li>',
		 				 		     					'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此问题下添加新问题" id="addTopic"></li>',
		 				 		     					'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此问题" id="deleteTopic"></li>',
		 				 		 					'</ul>',
		 				 		 					'</td>',
		 				 							'</tr>',
		 				 		     			'<tr>',
		 				 		     				'<td>&nbsp;</td>',
		 				 		     				'<td style="font-weight: normal;text-align: right;vertical-align: top;">内容:</td>',
		 				 		     				'<td class="value">',
		 				 		     					'<textarea name="e.description" cols="" rows="3" id="questionary_create_e_description" class="ui-widget-content noresize" style="width: 98%;">',
		 				 		     					'</textarea>',
		 			 		     					'</td>',
		 				 						'</tr>',
		 				 					'</tbody>',
		 				 				'</table>'
		         ].join(""),
         //一个选项的模板：
         option : [
	 					'<div style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
	 						'<input type="checkbox" name="" value="true" id="questionary_create_" style="width:1em;">',
	 						'<input type="hidden" id="__checkbox_questionary_create_" name="__checkbox_" value="true">',
	 						'<input type="text" name="e.subject" value="" id="questionary_create_e_subject" class="ui-widget-content" style="width:496px;margin-left:4px;">',
	 						'<ul class="inputIcons" style="top:12px;right: 19px;">',
	 							'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此选项" id="upOption"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此选项" id="downOption"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此选项下添加新选项" id="addOption"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此选项" id="deleteOption"></li>',
							'</ul>',
						'</div>',
           ].join(""),
           //下移按钮模板：
           li4DownOption : [
                                    '<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="在此选项下添加新选项" id="downOption"></li>'
            ].join(""), 
            
            //初始化题目数
            getSerialNumber : function (form){
            	var $form = form;
            	//获取所有题目的集合
            	var TopicGather = $form.find("#testArea").children();
            	for(var i = 0;i<TopicGather.length;i++){
            		$tb = $(TopicGather[i]);
            		//获取题目序号
            		$tb.children().children().eq(1).children().first().children().text($tb.index()+1);
            	}

            }
                    
		                   
};





