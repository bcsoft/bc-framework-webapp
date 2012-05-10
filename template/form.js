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
		});
		
		//绑定清除按钮事件
		$form.find("#cleanFileId").click(function(){
			$form.find(":input[name='e.path']").val('');
			$form.find(":input[name='e.subject']").val('');
		});
		
		//绑定下载按钮事件
		$form.find(".downLoadFileId").click(function(){
			var type=$form.find(":radio[name='e.type']:checked").val();
			var subject=$form.find(":input[name='e.subject']").val();
			var path=$form.find(":input[name='e.path']").val();
			var id=$form.find(":input[name='e.id']").val();
			if(id==""){
				bc.msg.slide('请先保存模板！');
				return;
			}
			
			if(type==5){
				var url =bc.root+"/bc/template/download?tid=" +id
				var win = window.open(url, "blank");
				return win;
			}else{
				if(!bc.validator.validate($form)) return;
				
				var n =  subject;// 获取文件名
				var f = "template/" + path;// 获取附件相对路径			
				// 下载文件
				bc.file.download({f: f, n: n});
			}
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
		var url=bc.root+"/bc/templates/list";
		var code=$form.find(":input[name='e.code']").val();
		if(code==''){
			bc.msg.slide('编码不能为空');
			return;
		}
		option={};
		// 将一些配置参数放到data参数内(这些参数是提交到服务器的参数)
		option.data = jQuery.extend({
			code: code,
		},option.data);
		//弹出选择对话框
		bc.page.newWin(jQuery.extend({
			mid: code,
			url: url,
			name: '模板编码:'+code+'的版本历史',
			title: '模板编码:'+code+'的版本历史'
		},option));
	},
	/** 预览 **/
	inline : function(){
		var $form = $(this);
		var url=bc.root+"/bc/template/loadTplConfigParam";
		var type=$form.find(":radio[name='e.type']:checked").val();
		var path=$form.find("input[name='e.path']").val();
		var tid=$form.find("input[name='e.id']").val();
		
		if(tid==''){
			bc.msg.slide('请先保存模板！');
			return;
		}
		
		//先加载一次配置参数
		$.ajax({
			url:url,
			data:{tid:tid},
			dataType:"json",
			success:function(json){
				if(json.value){//有配置参数打开配置参数窗口
					bc.templateForm.openConfigWindow($form,tid,json.value);
				}else{//无配置参数调用默认的方法
					if(type==5){//自定义文本类型调用自定义的预览方法
						var url =bc.root+"/bc/template/inline?tid=" + tid
						var win = window.open(url, "_blank");
						return win;
					}
					if(!bc.validator.validate($form)) return;
					var n = $form.find(":input[name='e.subject']").val();// 获取文件名
					var f = "template/" +path;// 获取附件相对路径
					// 预览文件
					var option = {f: f, n: n};
					var ext = f.substr(f.lastIndexOf("."));
					if(type==2 && ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
						option.from="docx";
					}
					bc.file.inline(option);
				}
			}
		});	
	},
	/** 配置参数窗口 **/
	openConfigWindow : function($form,tid,param){	
		//生成对话框的html代码
		var html = [];
		html.push('<div class="bc-page" data-type="dialog" style="overflow-y:auto;">');
		html.push('<div style="margin: 4px;max-height: 400px;">');
		html.push('<table id="inlineTemplates" style="width:100%;height:100%;">');
		html.push('<tbody>');
		var arrParam=param.split(",");
		for(var i=0; i<arrParam.length; i++){
			html.push('<tr>')
			html.push('<td class="label">'+arrParam[i]+'</td>');
			html.push('<td class="value">');
			html.push('<input type="text" class="ui-widget-content" style="width:180px">');
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