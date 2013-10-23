/**
 * 自定义变淡操作方法
 * 
 */
bc.customForm = {
		/**
		 * 自定义表单创建方法
		 * @param {Object} option 配置参数
		 * @option {String} tpl [必填]模板编码
		 * @option {String} subject [必填]标题
		 * @option {String} type [必填]类别
		 * @option {String} mid [必填]对话框的唯一标识id
		 * @option {Integer} pid [必填]pid
		 * @option {String} code [必填]编码
		 * @option {String} from [可选]打开此对话框的源对话框的mid
		 * @option {String} name [可选]任务栏显示的名称或对话框的标题
		 * @option {String} title [可选]对话框的标题,如果不指定则使用请求返回的值
		 * @option {String} afterOpen [可选]窗口新建好后的回调函数
		 * @option {String} afterClose [可选]窗口关闭后的回调函数。function(event, ui)
		 * @option {String} beforeClose [可选]窗口关闭前的回调函数，返回false将阻止关闭窗口。function(event, ui)
		 * @option {boolean} addSaveBtn [可选]添加保存按钮的控制 默认true
		 * @option {String} saveClick [可选]添加保存按钮自定义的点击事件 默认 调用"bc.customForm.save"
		 *
		 */
		create : function(option) {
			if(!(option&&option.tpl&&option.subject&&option.type&&option.mid&&option.pid&&option.code)){
				alert("必须设置option参数！");
				return;
			}
			
			if(!option.name)
				option.name=option.subject;
			if(!option.title)
				option.title=option.subject;
			
			if(!option.data){option.data={}}
			option.data.tpl=option.tpl;
			option.url=bc.root+"/bc/customForm/create";
			if(option.addSaveBtn == null || true===option.addSaveBtn){
				if(option.saveClick){
					option.buttons=[{click:option.saveClick,text:"保存"}];
				}else{
					option.buttons=[{click:"bc.customForm.save",text:"保存"}];
				}
			}
			
			var afterOpen;
			if(option.afterOpen){
				afterOpen=option.afterOpen;
			}
			
			//对模板表单中form-info加入模板编码、类别、标题 、pid、code
			option.afterOpen=function(){
				var $page = $(this);
				var $form = $("form",$page);
				bc.customForm.setFormInfo($form,{tpl:option.tpl
					,subject:option.subject
					,type:option.type
					,pid:option.pid
					,code:option.code});
				if(afterOpen){
					afterOpen.call($page);
				}
			}
			
			bc.page.newWin(option);
		},
		/**
		 * 自定义表单编辑方法
		 * @param {Object} option 配置参数
		 * @option {String} id [必填]表单id
		 * @option {String} subject [必填]标题
		 * @option {String} mid [必填]对话框的唯一标识id
		 * @option {String} from [可选]打开此对话框的源对话框的mid
		 * @option {String} name [可选]任务栏显示的名称或对话框的标题
		 * @option {String} title [可选]对话框的标题,如果不指定则使用请求返回的值
		 * @option {String} afterOpen [可选]窗口新建好后的回调函数
		 * @option {String} afterClose [可选]窗口关闭后的回调函数。function(event, ui)
		 * @option {String} beforeClose [可选]窗口关闭前的回调函数，返回false将阻止关闭窗口。function(event, ui)
		 * @option {boolean} addSaveBtn [可选]添加保存按钮的控制 默认true
		 * @option {String} saveClick [可选]添加保存按钮自定义的点击事件 默认 调用"bc.customForm.save"
		 *
		 */
		edit : function(option){
			if(!(option&&option.id&&option.subject&&option.mid)){
				alert("必须设置option参数！");
				return;
			}
			option.url=bc.root+"/bc/customForm/edit";
			if(option.addSaveBtn == null || true===option.addSaveBtn){
				if(option.saveClick){
					option.buttons=[{click:option.saveClick,text:"保存"}];
				}else{
					option.buttons=[{click:"bc.customForm.save",text:"保存"}];
				}
			}
			if(!option.data){option.data={}}
			option.data.id=option.id;
			var afterOpen;
			if(option.afterOpen){
				afterOpen=option.afterOpen;
			}
			option.afterOpen=function(){
				var $page = $(this);
				var $form = $("form",$page);
				bc.customForm.loadFormData.call($page);
				if(afterOpen){
					afterOpen.call($page);
				}
			}
			bc.page.newWin(option);
		},
		open : function(){
			if(!(option&&option.id&&option.subject&&option.mid)){
				alert("必须设置option参数！");
				return;
			}
			option.url=bc.root+"/bc/customForm/open";

			if(!option.data){option.data={}}
			option.data.id=option.id;
			var afterOpen;
			if(option.afterOpen){
				afterOpen=option.afterOpen;
			}
			option.afterOpen=function(){
				var $page = $(this);
				var $form = $("form",$page);
				//只读表单的处理
				$form.find(":input:visible:not('.custom')").each(function(){
					logger.debug("disabled:" + this.name);
					var $in = $(this);
					if($in.is("select,:checkbox,:radio"))
						this.disabled=true;
					else
						this.readOnly=true;
				});
				$form.find("ul.inputIcons,span.selectButton").each(function(){
					$(this).hide();
				});
				
				if(afterOpen){
					afterOpen.call($page);
				}
			}
			bc.page.newWin(option);
		},
		/**保存表单数据，上下文为页面对象
		 * @param {Object} option
		 * @option {Function} callback 保存成功后的回调函数，上下文为当前页面，第一个参数为服务器返回的json对象
		 */
		save : function(option){
			option = option || {};
			
			var $page = $(this);
			var $form = $("form",$page);
			//表单验证
			if(!bc.validator.validate($form))return;
			//判断是否正在保存，若是就返回
			if($page.data("saving")) return;
		
			var formData = bc.customForm.getFormData($form);
			if(false === formData){
				bc.msg.alert("没有可保存的表单数据！");
				return;
			}
			//将表单的状态设为正常
			var formInfo = bc.customForm.setFormInfo($form,{status:0});
			//设置是否正在保存的标识为true[正在保存]
			$page.data("saving",true);
			bc.ajax({
				url: bc.root+"/bc/customForm/save", 
				data:{formInfo:formInfo,formData:$.toJSON(formData)},
				dataType: "json",
				success: function(json) {
					if(logger.debugEnabled)logger.debug("save success.json=" + jQuery.param(json));
					if(json.success === false){
						bc.msg.info(json.msg);
					}else{
						bc.customForm.setFormInfo($form,{id:json.id,formData:json.formData});
						bc.customForm.loadFormData.call($page);

						//调用回调函数
						var showMsg = true;
						if(typeof option.callback == "function"){
							//返回false将禁止保存提示信息的显示
							if(option.callback.call($page[0],json) === false)
								showMsg = false;
						}
						if(showMsg){
							bc.msg.slide(json.msg);
						}
					}
					
					//将正在保存标识设为false[已保存]
					$page.data("saving",false);
				}
			});
		},
		/** 获取表单数据 */
		getFormData: function($form){
			// 默认的表单数据获取方法
			var $inputs = $form.find(":input:not(.ignore)");
			if($inputs.size() == 0)
				return false;
			var datas = [];
			$inputs.each(function(){
				var $input = $(this);
				var data = {};
				data.name = this.name;
				data.value = $input.val();
				data.type = $input.attr("data-type") || "string";
				
				var id = $input.attr("data-id");
				if(id)data.id = id;
				var label = $input.attr("data-label");
				if(label)data.label = label;

				datas.push(data);
			});
			return datas;
		},
		/** 设置data-form-info 信息  **/	
		setFormInfo:function($form,extData){
			var form_info=$form.attr("data-form-info");
			if(form_info && /^\{/.test($.trim(form_info))){
				//对json格式进行解释
				form_info = eval("(" + form_info + ")");
			}else{
				form_info = {};
			}
			form_info=$.extend(form_info,extData);
			var to_form_info = $.toJSON(form_info);
			$form.attr("data-form-info",to_form_info);
			return to_form_info;
		},
		/**
		 * 根据formData信息id信息 加载到对应input标签的字段中
		 */
		loadFormData:function(){
			var $page = $(this);
			var $form = $("form",$page);
			var form_info=$form.attr("data-form-info");
			if(form_info && /^\{/.test($.trim(form_info))){
				//对json格式进行解释
				form_info = eval("(" + form_info + ")");
			}else{
				form_info = {};
			}
			var $formData = form_info.formData;
			$.each($formData,function(index,value){
				var $input=$form.find(':input[name='+value.name+']');
				$input.attr("data-id",value.id);
			});
		}
}