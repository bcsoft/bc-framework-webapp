bc.templateForm = {
	init : function(option,readonly) {
		var $form = $(this);
		//根据模板类型显示模板文件或模板内容
		var tplType=$form.find(":radio[name='e.type']:checked").val();
		var $tplContent=$form.find("#idTplContent");
		var $tplFile=$form.find(".tplFile");
		if(tplType=='5'){
			$tplFile.hide();
		}else{
			$tplContent.hide();
		}
		
		//绑定加载配置参数事件
		$form.find(".loadTplConfig").click(function(){
			var url=bc.root+"/bc/template/loadTplConfigParam";
			var type=$form.find(":radio[name='e.type']:checked").val();
			var content=$form.find(":input[name='e.content']").val();
			var path=$form.find(":input[name='e.path']").val();
			var tid=$form.find("input[name='e.id']").val();
			
			if(tid==''){
				bc.msg.slide('请先保存模板！');
				return;
			}
			
			if(type==5){
				if(content==''){
					bc.msg.slide("模板内容不能为空！");
					return;
				}	
			}
			$.ajax({
				url:url,
				data:{tid:tid,type:type,content:content,path:path},
				dataType:"json",
				success:function(json){
					if(json.value){
						$form.find(".configParam").val(json.value);
					}
				}
			});	
		});
		
		
		if(readonly) return;
		
		//绑定模板类型选择事件
		$form.find(":radio[name='e.type']").change(function(){
			bc.file.clearFileSelect($form.find("#uploadFile"));
			var type=$(this).val();
			if(type!='5'){
				$tplFile.show();
				$tplContent.hide();
				$form.find(":input[name='e.subject']").val('');
				$form.find(":input[name='e.path']").val('');
				$form.find(":input[name='e.content']").val('');
			}else{
				$tplFile.hide();
				$tplContent.show();
				$form.find(":input[name='e.path']").val('');
				$form.find(":input[name='e.subject']").val('');
			}
			$form.find(".configParam").val('');
		});
		
		//绑定清除按钮事件
		$form.find("#cleanFileId").click(function(){
			$form.find(":input[name='e.path']").val('');
			$form.find(":input[name='e.subject']").val('');
			$form.find(".configParam").val('');
		});
		
	},
	/** 文件上传完毕后 */
	afterUploadfile : function(json){
		logger.info($.toJSON(json));
		if(json.success){
			var $page = this.closest(".bc-page");
			$page.find(':input[name="e.subject"]').val(json.source);
			$page.find(':input[name="e.path"]').val(json.to);
		}else{
			bc.msg.alert(json.msg);
		}
	},
	/**
	 * 保存
	 */
	save : function(){
		var $form = $(this);
		//定义函数
		//excel文件
		function isExcelSuffix(suffix){
			if(suffix=='xls'||suffix=='xlsx'||suffix=='xml')
				return true;
			bc.msg.alert('后缀名错误，保存后缀名应为xls、xlsx、xml文件');
			return false;
		}
		//word文件
		function isWordSuffix(suffix){
			if(suffix=='doc'||suffix=='docx'||suffix=='xml')
				return true;
			
			bc.msg.alert('后缀名错误，保存后缀名应为doc、docx、xml文件');
			return false;
		}
		//文本文件
		function isTextSuffix(suffix){
			if(suffix=='txt'||suffix=='xml'||suffix=='cvs'||suffix=='log')
				return true;
			bc.msg.alert('后缀名错误，保存后缀名应为txt文件');
			return false;
		}
		//验证表单
		if(!bc.validator.validate($form)) return;
		var type=$form.find(":radio[name='e.type']:checked").val();
		var subject=$form.find(":input[name='e.subject']").val();
		var path=$form.find(":input[name='e.path']").val();
		var code=$form.find(":input[name='e.code']").val();
		var version=$form.find(":input[name='e.version']").val();
		var id=$form.find(":input[name='e.id']").val();
		var url=bc.root+"/bc/template/isUniqueCodeAndVersion";
		//自定义文本
		if(type==5){
			bc.page.save.call($form);
			return;
		}
		//模板路径和模板文本
		if(path==''){
			bc.msg.alert('没有上传文件，请点击文本框右侧的上传按钮！');
			return;
		}
		//验证后缀名
		$.trim(path);
		var arrp=path.split(".");
		if(arrp.length!=2){
			bc.msg.alert('上传的文件后缀名错误！');
			return;
		}
		//后缀名
		var suffix=arrp[1];
		//转为小写
		suffix=suffix.toLocaleLowerCase();
		if(type==1&&isExcelSuffix(suffix)){
			saveInfo();
		}else if(type==2&&isWordSuffix(suffix)){
			saveInfo();
		}else if(type==3&&isTextSuffix(suffix)){
			saveInfo();
		}else if(type==4){
			saveInfo();
		} 
		//保存
		function saveInfo(){
			$.ajax({
				url:url,
				data:{tid:id,code:code,version:version},
				dataType:"json",
				success:function(json){
					var result=json.result;
					if(result=='save'){
						bc.page.save.call($form);
					}else{
						//系统中已有此编码
						bc.msg.alert("此编码、版本号已被其它模板使用，请修改编码或版本号！");
					}
				}
			});
		}
	},
	/** 查看历史版本号 **/
	showVersion : function(){
		var $form = $(this);
		var url=bc.root+"/bc/showTemplateVersion/list";
		var id=$form.find(":input[name='e.id']").val();
		var code=$form.find(":input[name='e.code']").val();
		if(code==''){
			bc.msg.slide('编码为空不能查看历史版本');
			return;
		}
		option={};
		// 构建默认参数
		option = jQuery.extend({
			mid: 'showTemplateVersion',
			paging: true,
			title: '模板管理编码'+code+'的版本历史'
		},option);
		// 将一些配置参数放到data参数内(这些参数是提交到服务器的参数)
		option.data = jQuery.extend({
			multiple: false,
			code: code,
			tid: id
		},option.data);
		//弹出选择对话框
		bc.page.newWin(jQuery.extend({
			url: url,
			name: option.title,
			mid: option.mid,
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		},option));
	},
	/** 预览 **/
	inline : function(){
		var $form = $(this);
		var url=bc.root+"/bc/template/loadTplConfigParam";
		var type=$form.find(":radio[name='e.type']:checked").val();
		var content=$form.find(":input[name='e.content']").val();
		var path=$form.find(":input[name='e.path']").val();	
		var tid=$form.find("input[name='e.id']").val();
		
		if(tid==''){
			bc.msg.slide('请先保存模板！');
			return;
		}
		
		if(type==5){
			if(content==''){
				bc.msg.slide("模板内容不能为空！");
				return;
			}	
		}
		
		//先加载一次配置参数
		$.ajax({
			url:url,
			data:{tid:tid,type:type,content:content,path:path},
			dataType:"json",
			success:function(json){
				if(json.value){
					$form.find(".configParam").val(json.value);
					bc.templateForm.inlineSub($form);
				}
			}
		});	
	},
	/** 预览子方法 **/
	inlineSub : function($form){
		var param=$form.find(".configParam").val();
		var tid=$form.find("input[name='e.id']").val();
		if(param==''){
			bc.msg.slide('配置参数为空，不能预览，请先点击灯泡获取配置参数!');
			return;
		}
		//生成对话框的html代码
		var html = [];
		html.push('<div class="bc-page" data-type="dialog">');
		html.push('<div style="margin: 4px;">');
		html.push('<table id="inlineTemplates" style="width:100%;height:100%;">');
		html.push('<tbody>');
		var arrParam=param.split(",");
		for(var i=0; i<arrParam.length; i++){
			html.push('<tr>')
			html.push('<td class="label">'+arrParam[i]+'</td>');
			html.push('<td class="value">');
			html.push('<input type="text" class="ui-widget-content">');
			html.push('</td>');
			html.push('</tr>')
		}
		html.push('</tbody>');
		html.push('</table>');
		html.push('</div>');
		html.push('</div>');
		html = $(html.join("")).appendTo("body");
		
		//绑定双击事件
		function onClick(){
			var $trs=paramsEl.find("tr");
			var dataObj;
			var dataArr=[];
			$trs.each(function(){
				dataObj={}
				var key= $(this).find(".label").html();
				var value= $(this).find("input").val();
				dataObj.key=key;
				if(value && (value.indexOf("[") == 0 || value.indexOf("{") == 0))
					dataObj.value=$.evalJSON(value);
				else
					dataObj.value=value;
				dataArr.push(dataObj);
			});
			if(tid==''){
				bc.msg.slide('请先保存模板！');
				return;
			}
			var url =bc.root+"/bc/template/inline?tid=" + tid
			url+="&markerValueJsons="+$.toJSON(dataArr);
			var win = window.open(url, "_blank");
			return win;
			//销毁对话框
			html.dialog("destroy").remove();
		}
		var paramsEl = html.find("#inlineTemplates");
		
		//弹出对话框让用户选择司机
		html.dialog({
			id: "inlineTemplateParams",
			title: "请输入模板配置参数对应的值",
			dialogClass: 'bc-ui-dialog ui-widget-header',
			width:300,modal:true,
			minWidth:300,
			buttons:[{text:"确定",click: onClick}]
		});	
	}
};