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
				//当前题目：
				var thisTopic = $(this).closest("table");
				//插入题目
				//thisTopic.after(bc.questionaryForm.radioTopic);
				$(bc.questionaryForm.radioTopic).insertAfter(thisTopic);
			
				//初始化题目序号
				bc.questionaryForm.getSerialNumber($form);
				
				//修改新题目的类型单选按键组的name属性：name="type[题目序号]"
				//新题目
				var newTopic = thisTopic.next();
				//包含题目类型的td
				var thirdTd = newTopic.children().children().eq(1).children().eq(2);
				//题目类型
				//var newType = "type" + (newTopic.index()+1);
				var newType = "type" +bc.questionaryForm.changeTimeToString();
				thirdTd.find("input[type='radio'][class='type']").attr("name", newType);
				//布局
				//var newConfig = "config" + (thisTopic.next().index()+1);
				var newConfig = "config" + bc.questionaryForm.changeTimeToString();
				thirdTd.find("input[type='radio'][class='config']").attr("name", newConfig);
				//选项的标准答案
				var fourTd = newTopic.children().children().eq(3).children().eq(2);
				//var newStandard = "standard" + (newTopic.index()+1);
				var newStandard = "standard" + bc.questionaryForm.changeTimeToString();
				fourTd.find("input[type='radio']").attr("name", newStandard);
				
				
			});
			//删除问题
			
			$form.find("#testArea").delegate("#deleteTopic","click",function(){
				$(this).closest("table").remove();
				//初始化题目序号
				bc.questionaryForm.getSerialNumber($form);
			});
			
			//上移问题
			$form.find("#testArea").delegate("#upTopic","click",function(){
				//当前问题
				var thisTopic=$(this).closest("table");;
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
				var thisTopic=$(this).closest("table");
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
				
				var tr = thisOption.parent().parent();
				//索引
				var table = tr.parent().parent();
				var index = table.index();
				
				//获取题型
				
				var td=tr.prev().prev().children().eq(2);
				var type = td.find("input[type='radio'][class='type']:checked").val();
				//多选
				if(type==1){
					$(bc.questionaryForm.option).insertAfter(thisOption);
					//标识
					//var k = "standard" + (index + 1);
					var k = "standard" + bc.questionaryForm.changeTimeToString();
					thisOption.next().find("input[type='checkbox'][class='standard']").attr("name",k);
				}
				//未完成
				//单选
				if(type==0){
					$(bc.questionaryForm.radinOption).insertAfter(thisOption);
					//标识
					//var k = "standard" + (index + 1);
					var k = "standard" + bc.questionaryForm.changeTimeToString();
					thisOption.next().find("input[type='radio'][class='standard']").attr("name",k);
				}
				
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
			$form.find("#testArea").delegate(":input[type='radio'][class='type']","change",function(){
				//td
				var td = $(this).parent();
				//当前题目
				var type = $(this).val();
				//是否必选
				var requiredValue = td.find(":input[name='required']")[0].checked;
				//是否全对方得分
				var seperateScoreCheck = td.find(":input[name='seperateScore']");
				if(!(seperateScoreCheck[0]===undefined)){
					var seperateScoreValue =seperateScoreCheck[0].checked;
				}
				//布局
				var configRadio = td.find("input[type='radio'][class='config']");
				if(!configRadio===undefined){
					var configValue = td.find("input[type='radio'][class='config']:checked").val();
				}
				
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
					//当前的填空题
					var thisCompletion = $($form.find("#testArea").children()[index]);
					//包含题目类型的td
					var thirdTd = thisCompletion.children().children().eq(1).children().eq(2);
					//题目类型
					//var newType = "type" + (index+1);
					var newType = "type" + bc.questionaryForm.changeTimeToString();
					thirdTd.find("input[type='radio'][class='type']").attr("name", newType);
					thisCompletion.find(":input[type='radio'][class='type']").eq(type).attr("checked","checked");
					//是否必填
					if(requiredValue){
						//thisCompletion.find(":input[name='required']").val(requiredValue);
						thisCompletion.find(":input[name='required']").attr("checked","checked");
					}
					
				}
				//简答题
				if(type==3){
					//先插入
					$(bc.questionaryForm.jquiz).insertAfter(thisTopic);
					//用填空题替换当前的题目
					thisTopic.replaceWith(thisTopic.next());
					//初始化题目序号
					bc.questionaryForm.getSerialNumber($form);
					//当前的问答题
					var thisJquiz = $($form.find("#testArea").children()[index]);
					//包含题目类型的td
					var thirdTd = thisJquiz.children().children().eq(1).children().eq(2);
					//题目类型
					//var newType = "type" + (index+1);
					var newType = "type" + bc.questionaryForm.changeTimeToString();
					thirdTd.find("input[type='radio'][class='type']").attr("name", newType);
					thisJquiz.find(":input[type='radio']").eq(type).attr("checked","checked");
					//是否必填
					if(requiredValue){
						//thisCompletion.find(":input[name='required']").val(requiredValue);
						thisJquiz.find(":input[name='required']").attr("checked","checked");
					}

				}
				//单选
				if(type==0){
					//先插入
					$(bc.questionaryForm.radioTopic).insertAfter(thisTopic);
					//用填空题替换当前的题目
					thisTopic.replaceWith(thisTopic.next());
					//初始化题目序号
					bc.questionaryForm.getSerialNumber($form);
					//新题目
					var newTopic = $($form.find("#testArea").children()[index]);
					//包含题目类型的td
					var thirdTd = newTopic.children().children().eq(1).children().eq(2);
					//题目类型
					//var newType = "type" + (index+1);
					var newType = "type" + bc.questionaryForm.changeTimeToString();
					thirdTd.find("input[type='radio']").slice(0,4).attr("name", newType);
					//布局
					//var newScore = "seperateScore" + (index+1);
					var newScore = "seperateScore" + bc.questionaryForm.changeTimeToString();
					thirdTd.find("input[type='radio']").slice(4,6).attr("name", newScore);

					newTopic.find(":input[type='radio']").eq(type).attr("checked","checked");
					//是否必填
					if(requiredValue){
						//thisCompletion.find(":input[name='required']").val(requiredValue);
						newTopic.find(":input[name='required']").attr("checked","checked");
					}

					
				}
				
				//多选
				if(type==1){
					//先插入
					$(bc.questionaryForm.topic).insertAfter(thisTopic);
					//用填空题替换当前的题目
					thisTopic.replaceWith(thisTopic.next());
					//初始化题目序号
					bc.questionaryForm.getSerialNumber($form);
					//新题目
					var newTopic = $($form.find("#testArea").children()[index]);
					//包含题目类型的td
					var thirdTd = newTopic.children().children().eq(1).children().eq(2);
					//题目类型
					//var newType = "type" + (index+1);
					var newType = "type" + bc.questionaryForm.changeTimeToString();
					thirdTd.find("input[type='radio']").slice(0,4).attr("name", newType);
					//布局
					//var newScore = "seperateScore" + (index+1);
					var newScore = "seperateScore" + bc.questionaryForm.changeTimeToString();
					thirdTd.find("input[type='radio']").slice(4,6).attr("name", newScore);
					newTopic.find(":input[type='radio']").eq(type).attr("checked","checked");
					//是否必填
					if(requiredValue){
						//thisCompletion.find(":input[name='required']").val(requiredValue);
						newTopic.find(":input[name='required']").attr("checked","checked");
					}
					//是否全对方得分
					if(seperateScoreValue){
						newTopic.find(":input[name='seperateScore']").attr("checked","checked");
					}
					
				}

				
			});

		},
		//一条多选择题目的模板
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
		         			'<input type="checkbox" name="required" id="questionary_create_e_innerFix" style="width:1em;">',
		         			'<label style="width:auto;margin-left:4px;">必选题</label>',
	         			'</div>',
		         		'<input type="radio" class="type" id="questionary_create_type0" value="0" checked="checked" style="width:auto;margin-left:4px;">',
		         		'<label for="questionary_create_type0">单选</label>',
		         		'<input type="radio" class="type" id="questionary_create_type1" value="1" style="width:auto;margin-left:4px;">',
		         		'<label for="questionary_create_type1">多选</label>',
		         		'<input type="radio" class="type" id="questionary_create_type2" value="2" style="width:auto;margin-left:4px;">',
		         		'<label for="questionary_create_type2">填空</label>',
		         		'<input type="radio" class="type" id="questionary_create_type3" value="3" style="width:auto;margin-left:4px;">',
		         		'<label for="questionary_create_type3" style="width:auto;margin-right:4px;">问答题</label>',
		         		'<div class="ui-widget-content" style="display: inline-block;border-width: 0 1px 0 1px;padding: 0 2px 0 2px;">',
		         			'<input type="checkbox" name="seperateScore" id="questionary_create_e_innerFix" style="width:1em;">',
		         			'<label style="width:auto;margin-left:4px;">全对方有分</label>',
	         			'</div>',
		         		'<div style="position:relative;right:-24px; display: inline-block;">选项布局：',
		         			'<input type="radio" name="config" checked="checked" class="config" id="questionary_create_configvertical" value="vertical" style="width:auto;margin-left:4px">',
		         			'<label for="questionary_create_configvertical">垂直</label>',
		         			'<input type="radio" name="config" class="config" id="questionary_create_confighorizontal" value="horizontal" style="width:auto;margin-left:4px">',
		         			'<label for="questionary_create_confighorizontal">水平</label>',
	         			'</div>',
         			'</td>',
     			'</tr>',
     			'<tr>',
     				'<td>&nbsp;</td>',
     				'<td style="font-weight: normal;text-align: right;">题目:</td>',
     				'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
     				'<input type="text" name="subject" value="" id="questionary_create_e_subject" class="ui-widget-content" style="width:464px;">',
					'<div style="position:relative;right:-5px;width: 40px;display: inline-block;">',
						'<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">分',
					'</div>',
     				'<ul class="inputIcons" style="top:12px;right: 62px;">',
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
 							'<input type="checkbox" name="standard" value="true" class="standard" id="questionary_create_" style="width:1em;">',
 							'<input type="hidden" id="__checkbox_questionary_create_" name="__checkbox_" >',
 							'<input type="text" name="subject" value id="questionary_create_e_subject" class="ui-widget-content" style="width:446px;margin-left:6px;">',
 							'<div style="position:relative;right:-5px;width: 40px;display: inline-block;">',
 								'<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">分',
							'</div>',
 							'<ul class="inputIcons" style="top:12px;right: 60px;">',
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
		 		//一条单选题的模板
		 		radioTopic : [
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
		 		         			'<input type="checkbox" name="required" id="questionary_create_e_innerFix" style="width:1em;">',
		 		         			'<label style="width:auto;margin-left:4px;">必选题</label>',
		 	         			'</div>',
		 		         		'<input type="radio" class="type" id="questionary_create_type0" value="0" checked="checked" style="width:auto;margin-left:4px;">',
		 		         		'<label for="questionary_create_type0">单选</label>',
		 		         		'<input type="radio" class="type" id="questionary_create_type1" value="1" style="width:auto;margin-left:4px;">',
		 		         		'<label for="questionary_create_type1">多选</label>',
		 		         		'<input type="radio" class="type" id="questionary_create_type2" value="2" style="width:auto;margin-left:4px;">',
		 		         		'<label for="questionary_create_type2">填空</label>',
		 		         		'<input type="radio" class="type" id="questionary_create_type3" value="3" style="width:auto;margin-left:4px;">',
		 		         		'<label for="questionary_create_type3" style="width:auto;margin-right:4px;">问答题</label>',
		 		         		'<div class="ui-widget-content" style="display: inline-block;border-width: 0 1px 0 1px;padding: 0 2px 0 2px;">',
		 		         			'<input type="checkbox" name="seperateScore" id="questionary_create_e_innerFix" style="width:1em;">',
		 		         			'<label style="width:auto;margin-left:4px;">全对方有分</label>',
		 	         			'</div>',
		 		         		'<div style="position:relative;right:-24px; display: inline-block;">选项布局：',
		 		         			'<input type="radio" name="config" class="config" id="questionary_create_configvertical" value="vertical" checked="checked" style="width:auto;margin-left:4px">',
		 		         			'<label for="questionary_create_configvertical">垂直</label>',
		 		         			'<input type="radio" name="config" class="config" id="questionary_create_confighorizontal" value="horizontal" style="width:auto;margin-left:4px">',
		 		         			'<label for="questionary_create_confighorizontal">水平</label>',
		 	         			'</div>',
		          			'</td>',
		      			'</tr>',
		      			'<tr>',
		      				'<td>&nbsp;</td>',
		      				'<td style="font-weight: normal;text-align: right;">题目:</td>',
		      				'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
		      				'<input type="text" name="subject" value="" id="questionary_create_e_subject" class="ui-widget-content" style="width:464px;">',
		 					'<div style="position:relative;right:-5px;width: 40px;display: inline-block;">',
		 						'<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">分',
		 					'</div>',
		      				'<ul class="inputIcons" style="top:12px;right: 62px;">',
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
		  							'<input type="radio" name="standard" checked="checked" id="questionary_create_standard1true" class="standard" style="width:auto;width:1em;">',
		  							'<input type="hidden" id="__checkbox_questionary_create_" name="__checkbox_" >',
		  							'<input type="text" name="subject" value id="questionary_create_e_subject" class="ui-widget-content" style="width:446px;margin-left:6px;">',
		  							'<div style="position:relative;right:-5px;width: 40px;display: inline-block;">',
		  								'<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">分',
		 							'</div>',
		  							'<ul class="inputIcons" style="top:12px;right: 60px;">',
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
		 				         			'<input type="checkbox" name="required" id="questionary_create_e_innerFix" style="width:1em;">',
		 				         			'<label style="width:auto;margin-left:4px;">必选题</label>',
		 			         			'</div>',
		 				         		'<input type="radio" class="type" name="type" id="questionary_create_type0" value="0" style="width:auto;margin-left:4px;">',
		 				         		'<label for="questionary_create_type0">单选</label>',
		 				         		'<input type="radio" class="type" name="type" id="questionary_create_type1" value="1" style="width:auto;margin-left:4px;">',
		 				         		'<label for="questionary_create_type1">多选</label>',
		 				         		'<input type="radio" class="type" name="type" id="questionary_create_type2" value="2" style="width:auto;margin-left:4px;">',
		 				         		'<label for="questionary_create_type2">填空</label>',
		 				         		'<input type="radio" class="type" name="type" id="questionary_create_type3" value="3" style="width:auto;margin-left:4px;">',
		 				         		'<label for="questionary_create_type3" style="width:auto;margin-right:4px;">问答题</label>',
		 								'<div style="position:relative;right:-180px;width: 100px;display: inline-block;">',
		 									'默认行数:<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">',
		 								'</div>',
		 		         			'</td>',
		 		     			'</tr>',
		 		     			'<tr>',
		 		     				'<td>&nbsp;</td>',
		 		     				'<td style="font-weight: normal;text-align: right;">题目:</td>',
		 		     				'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
		 		     				'<input type="text" name="subject" value="" id="questionary_create_e_subject" class="ui-widget-content" style="width:464px;">',
		 							'<div style="position:relative;right:-5px;width: 40px;display: inline-block;">',
		 								'<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">分',
		 							'</div>',
		 		     				'<ul class="inputIcons" style="top:12px;right: 62px;">',
		 		     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此问题" id="upTopic"></li>',
		 		     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此问题" id="downTopic"></li>',
		 		     					'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此问题下添加新问题" id="addTopic"></li>',
		 		     					'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此问题" id="deleteTopic"></li>',
		 		 					'</ul>',
		 		 					'</td>',
		 							'</tr>',
		 		     			'<tr class="option">',
		 		     				'<td>&nbsp;</td>',
		 		     				'<td style="font-weight: normal;text-align: right;vertical-align: top;">内容:</td>',
		 		     				'<td class="value">',
		 		     					'<textarea name="subject" rows="3" id="questionary_create_e_description" class="ui-widget-content noresize" style="width: 98%;">',
		 		     					'</textarea>',
	 		     					'</td>',
		 						'</tr>',
		 						'<tr>',
		 							'<td>&nbsp;</td>',
		 							'<td style="font-weight: normal;text-align: right;vertical-align: top;">答案:</td>',
		 							'<td class="value"><textarea name="config" cols="" rows="3" id="questionary_create_e_description" class="ui-widget-content noresize" style="width: 98%;"></textarea>',
		 							'</td>',
	 							'</tr>',
		 					'</tbody>',
		 				'</table>'
		 				         ].join(""),
			         //一条问答题题目的模板
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
		 				 				         			'<input type="checkbox" name="required" id="questionary_create_e_innerFix" style="width:1em;">',
		 				 				         			'<label style="width:auto;margin-left:4px;">必选题</label>',
		 				 			         			'</div>',
		 				 				         		'<input type="radio" class="type" name="type" id="questionary_create_type0" value="0" style="width:auto;margin-left:4px;">',
		 				 				         		'<label for="questionary_create_type0">单选</label>',
		 				 				         		'<input type="radio" class="type" name="type" id="questionary_create_type1" value="1" style="width:auto;margin-left:4px;">',
		 				 				         		'<label for="questionary_create_type1">多选</label>',
		 				 				         		'<input type="radio" class="type" name="type" id="questionary_create_type2" value="2" style="width:auto;margin-left:4px;">',
		 				 				         		'<label for="questionary_create_type2">填空</label>',
		 				 				         		'<input type="radio" class="type" name="type" id="questionary_create_type3" value="3" style="width:auto;margin-left:4px;">',
		 				 				         		'<label for="questionary_create_type3" style="width:auto;margin-right:4px;">问答题</label>',
		 				 								'<div style="position:relative;right:-180px;width: 100px;display: inline-block;">',
		 			 										'默认行数:<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">',
		 			 									'</div>',
		 				 		         			'</td>',
		 				 		     			'</tr>',
		 				 		     			'<tr>',
		 				 		     				'<td>&nbsp;</td>',
		 				 		     				'<td style="font-weight: normal;text-align: right;">题目:</td>',
		 				 		     				'<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
		 				 		     				'<input type="text" name="subject" value="" id="questionary_create_e_subject" class="ui-widget-content" style="width:464px;">',
		 				 							'<div style="position:relative;right:-5px;width: 40px;display: inline-block;">',
		 				 								'<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">分',
		 				 							'</div>',
		 				 		     				'<ul class="inputIcons" style="top:12px;right: 62px;">',
		 				 		     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此问题" id="upTopic"></li>',
		 				 		     					'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此问题" id="downTopic"></li>',
		 				 		     					'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此问题下添加新问题" id="addTopic"></li>',
		 				 		     					'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此问题" id="deleteTopic"></li>',
		 				 		 					'</ul>',
		 				 		 					'</td>',
		 				 							'</tr>',
		 				 		     			'<tr class="option">',
		 				 		     				'<td>&nbsp;</td>',
		 				 		     				'<td style="font-weight: normal;text-align: right;vertical-align: top;">内容:</td>',
		 				 		     				'<td class="value">',
		 				 		     					'<textarea name="subject" cols="" rows="3" id="questionary_create_e_description" class="ui-widget-content noresize" style="width: 98%;">',
		 				 		     					'</textarea>',
		 			 		     					'</td>',
		 				 						'</tr>',
		 				 					'</tbody>',
		 				 				'</table>'
		         ].join(""),
         //多选题选项的模板：
         option : [
	 					'<div style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
	 						'<input type="checkbox" name="standard" value="true" class="standard" id="questionary_create_" style="width:1em;margin-left:1px;">',
	 						'<input type="hidden" id="__checkbox_questionary_create_" name="__checkbox_" >',
	 						'<input type="text" name="subject" value id="questionary_create_e_subject" class="ui-widget-content" style="width:446px;margin-left:4px;">',
 							'<div style="position:relative;right:-5px;width: 40px;display: inline-block;">',
								'<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">分',
							'</div>',
	 						'<ul class="inputIcons" style="top:12px;right: 60px;">',
	 							'<li class="inputIcon ui-icon ui-icon-circle-arrow-n" title="上移此选项" id="upOption"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title="下移此选项" id="downOption"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-plus" title="在此选项下添加新选项" id="addOption"></li>',
	 							'<li class="inputIcon ui-icon ui-icon-circle-close" title="删除此选项" id="deleteOption"></li>',
							'</ul>',
						'</div>',
           ].join(""),
           //单选题选项模板：
           radinOption : [
	 					'<div style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">',
	 						'<input type="radio" name="standard1" class="standard" id="questionary_create_standard1true" class="standard" style="width:auto;width:1em;">',
	 						'<input type="hidden" id="__checkbox_questionary_create_" name="__checkbox_" >',
	 						'<input type="text" name="subject" value id="questionary_create_e_subject" class="ui-widget-content" style="width:446px;margin-left:4px;">',
							'<div style="position:relative;right:-5px;width: 40px;display: inline-block;">',
								'<input type="text" name="score" value="" id="questionary_create_score" class="ui-widget-content" style="width:25px;">分',
							'</div>',
	 						'<ul class="inputIcons" style="top:12px;right: 60px;">',
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

            },
            
        	//保存之前的操作
        	beforeSave:function($page){
        		
        		//题目合并到隐藏域
        		var topics=[];
        		//将收费明细表中的内容添加到buyPlants里
        		$page.find("#testArea").children().each(function(){
        			//table的tr
        			var tr = $(this).children().children();
        			//题目项
        			var question = tr.eq(1).children().eq(2);
        			//排序号
        			var orderNo = tr.eq(1).children().first().children().text();
        			alert("序号：" +orderNo);
        			//是否必选
        			var required = question.find(":input[name='required']")[0].checked;
        			alert("是否必选：" +required);
        			//题型
        			var type = question.find("input[type='radio'][class='type']:checked").val();
        			alert("题型：" +type);
//        			//全对方得分
//        			alert("qq 选组： "+question.find(":input[name='seperateScore']")[0]);
//        			var seperateScore = question.find(":input[name='seperateScore']")[0].checked;
//        			
//        			alert("全对方得分"+seperateScore);
    				//是否全对方得分
    				var seperateScoreCheck = question.find(":input[name='seperateScore']");
    				if(!(seperateScoreCheck[0]===undefined)){
    					var seperateScore =seperateScoreCheck[0].checked;
    					alert("全对方得分"+seperateScore);
    				}

        			//布局
        			var config = question.find(":input[type='radio'][class='config']:checked").val();
        			alert("布局：" +config);
        			//题目
        			var subject = tr.eq(2).children().eq(2).find(":input[name='subject']").val();
        			alert("题目：" +subject);
        			
        			var optionItem = {};
        			var optionItems = [];
        			//选项
        			$(this).children().find(".option").find(".value").children().each(function(){
        				//单选题的答案
        				if(type==0){
            				//答案
            				var standard = $(this).find(":input[type='radio'][class='standard']:checked").val();
        					//var isChecked = $(this).find(":input[type='radio'][class='standard']:checked");
        					//alert("isChecked: "+isChecked);
        					if(standard!=null){
        						standard=true;
        					}else{
        						standard=false;
        					}
            				alert("答案：" +standard);
            				//标题
            				var subject = $(this).find(":input[name='subject']").val();
            				alert("标题：" +subject);

        				}
        				//多选题的答案
        				if(type==1){
            				//答案
            				var standard = $(this).find(":input[class='standard']")[0].checked;
            				alert("答案：" +standard);
            				//标题
            				var subject = $(this).find(":input[name='subject']").val();
            				alert("标题：" +subject);
       					
        				}
        				
        				optionItem = {
        					 standard : standard,
        					 subject : subject
        				};
        				optionItems.push(optionItem);
        			}); 
        			
    				//填空题的答案
    				if(type==2){
        				//答案
        				var config = $(this).find(":input[name='config']").val();
        				optionItem.config = config;
        				alert("答案：" +config);
        				//内容
        				var ItemSubject = $(this).find(".option").find(":input[name='subject']").val();
        				optionItem.subject = ItemSubject;
        				alert("填空内容：" +subject);
        				//optionItems.push(optionItem);
    				}
    				//简答题的答案
    				if(type==3){
        				//内容
        				var ItemSubject = $(this).find(".option").find(":input[name='subject']").val();
        				optionItem.subject = ItemSubject;
        				alert("简答内容：" +subject);
        				//alert("optionItems0" +$.toJSON(optionItems));
        				//optionItems.push(optionItem);
    				}
    				alert("optionItems" +$.toJSON(optionItems));
    				//第条题目的问题项：
    				var optionItemsValue = $.toJSON(optionItems);
        			
        			var json = {
    					orderNo:orderNo,
    					required:required,
    					type: type,
    					seperateScore: seperateScore,
    					config: config,
    					subject: subject,
    					optionItemsValue: optionItemsValue
        			};
        			var id = $(this).attr("data-id");
        			if(id && id.length > 0)
        				json.id = id;
        			topics.push(json);
        		});
        		alert("topics ： "+$.toJSON(topics));
        		
        		$page.find(":input[name='topics']").val($.toJSON(topics));
//        		//表单验证
//        		$feeDetailTables=$page.find("#feeDetailTables tr");
//        		
//        		if(!bc.validator.validate($feeDetailTables))
//        			return;

        	},
            //保存
            save : function(){
            	var $form = $(this);
            	bc.questionaryForm.beforeSave($form);
            	
        		//调用标准的方法执行保存
        		bc.page.save.call(this,{callback: function(json){
        			if(json.success){
        				bc.msg.slide(json.msg);
        			}else{
        				bc.msg.alert(json.msg);
        			}
        			return false;
        		}});

            },
        	//将当前时间转化为字符串
        	changeTimeToString:function(){
        		var hours=0;
        		var minutes=0;
        		var seconds=0;
        		var currentDate="";
        		var now =new Date();
        		hours=now.getHours();
        		minutes=now.getMinutes();
        		seconds=now.getSeconds();
        		currentDate=hours+""+minutes+""+seconds;
        		return currentDate;
        	}
                    
		                   
};





