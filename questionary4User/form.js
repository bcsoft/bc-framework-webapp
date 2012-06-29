bc.questionary4UserForm = {
		init : function(option,readonly) {
			var $form = $(this);
			//只读权限控制
			if(readonly) return;
			
			$form.find(".progress").progressbar({
				value: 20
			});
		},
            
        	//保存之前的操作
        	beforeSave:function($page){
        		
        		//题目合并到隐藏域
        		var topics=[];
        		//将收费明细表中的内容添加到buyPlants里
        		$page.find("#testArea").children().each(function(){
        			//题目ID
        			var questionId = $(this).attr("data-id");
        			//alert("题目ID" +questionId);
        			//题型
        			var type = $(this).attr("data-type");
        			//alert("题型：" +type);
        			
        			var optionItem = {};
        			var optionItems = [];
        			var completionValue = {};
        			var completions =[];
        			//选项
        			$(this).children().find(".option").each(function(){
    					//选项Id
    					var itemId =  $(this).attr("data-id");
    					alert("选项Id： "+itemId);
        				//单选题的答案
        				if(type==0){
        					//选项Id
        					//var itemId =  $(this).attr("data-id");
        					//alert("选项Id： "+itemId);
            				//答案
            				var standard = $(this).find(":input[type='radio'][class='standard']:checked").val();
        					if(standard!=null){
        						standard=true;
        					}else{
        						standard=false;
        					}
            				//alert("答案：" +standard);
         
        				}
        				//多选题的答案
        				if(type==1){
        					//选项Id
        					//var itemId =  $(this).attr("data-id");
        					//alert("选项Id： "+itemId);

            				//答案
            				var standard = $(this).find(":input[class='standard']")[0].checked;
            				//alert("答案：" +standard);

        				}
        				//填空题
        				if(type==2){
        					//获取输入框
        					var input = $(this).find("input");
        					$(input).each(function(){
        						var key = $(this).attr("name");
        						var value = $(this).val();
        						completionValue = {
        								key : key,
        								value : value
        						};
        						completions.push(completionValue);
        					});
        				}
        				//简答题
        				if(type==3){
        					var subject = $(this).find("textarea[name='subject']").val();
        					//alert("简答题答案："+subject);
        				}
        				if(standard!=false){
	        				optionItem = {
	    						 itemId : itemId,
	        					 standard : standard,
	        					 completions : completions,
	        					 subject : subject
	        				};
	        				optionItems.push(optionItem);
	        				//alert("答题的答案： "+$.toJSON(optionItem));
        				}
        			}); 
        			
    				//第条题目的问题项：
    				var optionItemsValue = $.toJSON(optionItems);
        			//alert(optionItemsValue);
        			var json = {
    					questionId : questionId,
    					type: type,
    					optionItemsValue: optionItemsValue
        			};
//        			var id = $(this).attr("data-id");
//        			if(id && id.length > 0)
//        				json.id = id;
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
            	bc.questionary4UserForm.beforeSave($form);
            	
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
            //预览
            preview : function(){
            	var $form = $(this);
            	var id =$form.find(":input[name='e.id']").val();
            	if(id==""){
            		bc.msg.alert("请先保存！");
            	}else{
    			bc.page.newWin({
    				name: "预览" + $form.find(":input[name='e.subject']").val(),
    				mid: "questionary" + id,
    				url: bc.root + "/bc/questionary/preview",
    				data: {id:id},
    				afterClose: function(status){
    					if(status) bc.grid.reloadData($form);
    					}
    				});
            	}
            },
            
            //发布:将问卷的状态由草稿改为已发布
            issue : function(){
            	var $form = $(this);
            	var id = $form.find(":input[name='e.id']").val();
            	if(id==""){
            		bc.msg.alert("请先保存！");
            	}else{
				//执行发布
				bc.ajax({
					url: bc.root + "/bc/questionary/issue",
					data: {id:id},
					dataType: "json",
					success: function(json){
						//完成后提示用户
						bc.msg.info("发布成功！");
						$form.data("data-status","saved");
						$form.dialog("close");
						return false;
						}
					}); 
            	}
				},
				
	           //归档:将问卷的状态由草稿改为已发布
				archiving : function(){
	            	var $form = $(this);
	            	var id = $form.find(":input[name='e.id']").val();
					//执行发布
					bc.ajax({
						url: bc.root + "/bc/questionary/archiving",
						data: {id:id},
						dataType: "json",
						success: function(json){
							//完成后提示用户
							bc.msg.info("归档成功！");
							$form.data("data-status","saved");
							$form.dialog("close");
							return false;
						}
					});    		
					}
				
		                   
};





