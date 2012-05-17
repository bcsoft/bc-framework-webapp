bc.templateForm = {
	init : function(option,readonly) {
		var $form = $(this);
		//根据模板类型显示模板文件或模板内容
		var tplType=$form.find("#templateTypeCode").val();
		var $tplContent=$form.find("#idTplContent");
		var $tplFile=$form.find(".tplFile");
		if(tplType=='custom'){
			$tplFile.hide();
			$form.find(":input[name='e.path']").removeAttr("data-validate");
		}else{
			$tplContent.hide();
		}		
		
		if(readonly) return;
			
		//绑定清除按钮事件
		$form.find("#cleanFileId").click(function(){
			$form.find(":input[name='e.path']").val('');
			$form.find(":input[name='e.subject']").val('');
		});
		
		//绑定下载按钮事件
		$form.find(".downLoadFileId").click(function(){
			var type=$form.find("#templateTypeCode").val();
			var subject=$form.find(":input[name='e.subject']").val();
			var path=$form.find(":input[name='e.path']").val();
			var id=$form.find(":input[name='e.id']").val();
			var content=$form.find(":input[name='e.content']").val();
			if(id==""){
				bc.msg.slide('请先保存模板！');
				return;
			}
			
			if(type=='custom'){
				if(content==""){bc.msg.slide('模板内容为空！');return;}
				var url =bc.root+"/bc/template/download?tid=" +id
				url+="&content="+content;
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
		
		//绑定选择模板类型事件
		$form.find("select[name='e.templateType.id']").change(function(){
			bc.file.clearFileSelect($form.find("#uploadFile"));
			var id=$(this).val();
			bc.ajax({
				url : bc.root+"/bc/templateType/loadOneById",
				data : {tid:id},
				dataType : "json",
				success : function(json){
					$form.find("#templateTypeCode").val(json.code);
					$form.find("#templateTypeExt").val(json.ext);
					//自定义文本类型显示模板内容，隐藏附件
					if(json.code!='custom'){
						$tplFile.show();
						$tplContent.hide();
						$form.find(":input[name='e.subject']").val('');
						$form.find(":input[name='e.path']").val('');
						$form.find(":input[name='e.content']").val('');
						$form.find(":input[name='e.path']").attr("data-validate","required");
					}else{
						$tplFile.hide();
						$tplContent.show();
						$form.find(":input[name='e.path']").val('');
						$form.find(":input[name='e.subject']").val('');
						$form.find(":input[name='e.path']").removeAttr("data-validate");
					}
				}
			});
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
		function saveInfo(){
			var id=$form.find(":input[name='e.id']").val();
			var code=$form.find(":input[name='e.code']").val();
			var version=$form.find(":input[name='e.version']").val();
			var url=bc.root+"/bc/template/isUniqueCodeAndVersion";
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
		
		//验证表单
		if(!bc.validator.validate($form)) return;
		
		//模板类型编码
		var typeCode=$form.find("#templateTypeCode").val();
		//模板类型后缀名
		var typeExt = $form.find("#templateTypeExt").val();
		var path=$form.find(":input[name='e.path']").val();
		
		//自定义文本
		if(typeCode == "custom"){saveInfo();return;}
		//其它附件不需检测上传文件的后缀名
		if(typeCode == "other"){saveInfo();return;}
		
		//验证后缀名
		var lastIndex=path.lastIndexOf(".");
		if(lastIndex==-1){
			bc.msg.alert('上传的文件后缀名错误！');
			return;
		}
		//后缀名
		var ext=path.substr(lastIndex+1);
		
		//判断上传文件的后缀名是否与模板类型的后缀名相同
		if(ext == typeExt){
			saveInfo();
		}else{
			bc.msg.alert("这种模板类型需要保存后缀名为"+typeExt+"!");
		}
	},
	/** 查看历史版本号 **/
	showVersion : function(){
		var $form = $(this);
		var url=bc.root+"/bc/templates/list";
		var code=$form.find(":input[name='e.code']").val();
		var subject=$form.find(":input[name='e.subject']").val();
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
			name: subject+'的版本历史',
			title: subject+'的版本历史'
		},option));
	},
	/** 预览 **/
	inline : function(){
		var $form = $(this);
		var url=bc.root+"/bc/template/loadTplConfigParam";
		var type=$form.find("#templateTypeCode").val();
		var path=$form.find(":input[name='e.path']").val();
		var tid=$form.find(":input[name='e.id']").val();
		var content=$form.find(":input[name='e.content']").val();
		
		if(tid==''){
			bc.msg.slide('请先保存模板！');
			return;
		}
		
		if(type=="custom"&&content==""){
			bc.msg.slide('模板内容为空！');
			return;
		}
		
		//先加载一次配置参数
		$.ajax({
			url:url,
			data:{tid:tid,content:content},
			dataType:"json",
			success:function(json){
				if(json.value){//有配置参数打开配置参数窗口
					bc.templateForm.openConfigWindow($form,tid,json.value,content);
				}else{//无配置参数调用默认的方法
					if(type=="custom"){//自定义文本类型调用自定义的预览方法
						var url =bc.root+"/bc/template/inline?tid=" + tid
						url+="&content="+content;
						var win = window.open(url, "_blank");
						return win;
					}
					if(!bc.validator.validate($form)) return;
					var n = $form.find(":input[name='e.subject']").val();// 获取文件名
					var f = "template/" +path;// 获取附件相对路径
					// 预览文件
					var option = {f: f, n: n};
					var ext = f.substr(f.lastIndexOf("."));
					if(type=="xls" && ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
						option.from="docx";
					}
					bc.file.inline(option);
				}
			}
		});	
	},
	/** 配置参数窗口 **/
	openConfigWindow : function($form,tid,param,content){	
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

			var url =bc.root+"/bc/template/inline?tid=" + tid
			url+="&markerValueJsons="+$.toJSON(dataArr);
			url+="&content="+content;
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