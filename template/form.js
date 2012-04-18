bc.templateForm = {
	init : function() {
		var $form = $(this);
		//根据模板类型显示模板文件或模板内容
		var tplType=$form.find(":radio[name='e.type']:checked").val();
		var $tplContent=$form.find("#idTplContent");
		var $tplFile=$form.find("#idTplFile");
		if(tplType=='3'||tplType=='4'){
			$tplFile.hide();
		}else{
			$tplContent.hide();
		}
		
		//绑定模板类型选择事件
		$form.find(":radio[name='e.type']").change(function(){
			var type=$(this).val();
			if(type!='5'){
				$tplFile.show();
				$tplContent.hide();
				$form.find(":input[name='e.content']").val('');
			}else{
				$tplFile.hide();
				$tplContent.show();
				$form.find(":input[name='e.userFileName']").val('');
			}
		});
	},
	/**
	 *文件上传完毕后
	 */
	afterUploadfile : function(json){
		logger.info($.toJSON(json));
		if(json.success){
			this.closest(".bc-page").find(':input[name="e.path"]').val(json.to);
		}else{
			bc.msg.alert(json.msg);
		}
	}
	/**
	 * 保存
	 */
	,save : function(){
		var $form = $(this);
		//验证表单
		if(!bc.validator.validate($form)) return;
		var code=$form.find(":input[name='e.code']").val();
		var id=$form.find(":input[name='e.id']").val();
		var url=bc.root+"/bc/template/isUniqueCode";
		$.ajax({
			url:url,
			data:{tid:id,code:code},
			dataType:"json",
			success:function(json){
				var result=json.result;
				if(result=='save'){
					bc.page.save.call($form);
				}else{
					//系统中已有此名称的文件
					bc.msg.alert(result);
				}
			}
		});
	}
};