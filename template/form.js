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
			var url=bc.root+"/bc/template/getCode?type="+type;
			//根据模板类型获取编码
			$.ajax({
				url:url,
				dataType:"json",
				success:function(json){
					if(json)
					$form.find(":input[name='e.code']").val(json.code);
				}
			});
			if(type=='1'||type=='2'||type=='5'){
				$tplFile.show();
				$tplContent.hide();
				$form.find(":input[name='e.content']").val('');
			}else{
				$tplFile.hide();
				$tplContent.show();
				$form.find(":input[name='e.templateFileName']").val('');
			}
		});
	},
	/**
	 *文件上传完毕后
	 */
	afterUploadfile : function(json){
		logger.info($.toJSON(json));
		if(json.success){
			this.closest(".bc-page").find(':input[name="e.templateFileName"]').val(json.to);
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
		var type=$form.find(":radio[name='e.type']:checked").val();
		//text、html
		if(type=='3'||type=='4'){
			bc.page.save.call($form);
		}else{
			//检查是否有相同的文件名称
			var fileName=$form.find(":input[name='e.templateFileName']").val();
			if(fileName==''){
				bc.msg.alert("请选择文件！");
				return;
			}
			$.trim(fileName);
			
			//文件后缀名
			var suffix=fileName.split(".")[1];
			var url=bc.root+"/bc/template/checkFileName";
			
			if(type=="1"){
				bc.templateForm.saveExcel($form,url,fileName,suffix);
			}else if(type=="2"){
				bc.templateForm.saveWord($form,url,fileName,suffix);
			}else{
				bc.templateForm.saveInfo($form,url,fileName);
			}
		}
	},
	saveExcel:function($form,url,fileName,suffix){
		if(suffix=='xls'||suffix=='xlsx'){
			bc.templateForm.saveInfo($form,url,fileName);
		}else{
			bc.msg.alert("请选择Excel文件");
			return;
		}
	},
	saveWord:function($form,url,fileName,suffix){
		if(suffix=='doc'||suffix=='docx'){
			bc.templateForm.saveInfo($form,url,fileName);
		}else{
			bc.msg.alert("请选择Word文件");
			return;
		}
	},
	saveInfo:function($form,url,fileName){
		$.ajax({
			url:url,
			data:{fileName:fileName},
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