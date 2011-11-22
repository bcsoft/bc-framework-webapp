/**
 * 表单及表格常用函数
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 */
bc.page = {
	/**创建窗口
	 * @param {Object} option
	 * @option {String} url 地址
	 * @option {String} data 附加的数据
	 * @option {String} afterOpen 窗口新建好后的回调函数
	 * @option {String} afterClose 窗口关闭后的回调函数。function(event, ui)
	 * @option {String} beforeClose 窗口关闭前的回调函数，返回false将阻止关闭窗口。function(event, ui)
	 */
	newWin: function(option) {
		option = option || {};
		
		//在单独的浏览器窗口中打开
		if(option.standalone){
			logger.debug("newWin:option.standalone=" + option.standalone);
			window.open(option.url,"_blank");
			return;
		}
		
		// 任务栏显示正在加载的信息
		if(bc.page.quickbar.has(option.mid)){
			logger.debug("newWin:active=" + option.mid);
			bc.page.quickbar.active(option.mid);//仅显示现有的窗口
			return;
		}else{
			logger.debug("newWin:create=" + option.mid);
			bc.page.quickbar.loading(option);
		}
		
		logger.profile("newWin.ajax." + option.mid);
		
		//内部处理
		logger.debug("newWin:loading html from url=" + option.url);
		bc.ajax({
			url : option.url, data: option.data || null,
			dataType : "html",
			success : function(html) {
				logger.profile("newWin.ajax." + option.mid);
				logger.profile("newWin.init." + option.mid);
				logger.debug("success loaded html");
				//var tc = document.getElementById("tempContainer");
				//if(!tc){
				//	tc=$('<div id="tempContainer"></div>').appendTo("body")[0];
				//}
				//tc.innerHTML=html;
				var $dom = $(html);
				if($dom.size() > 1){
					//logger.error("error page. try set theme='simple' for struts2 tag");
					$dom.remove();
					
					//alert("喔唷，出错啦！");
					//显示漂亮的错误提示窗口
					bc.page.showError({url:option.url, more:html,from:"bc.page.newWin->bc.ajax.success->$dom.size()>1"});
					
					//删除任务栏对应的dom元素
					$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();
					return;
				}
				function _init(){
					//从dom构建并显示桌面组件
					var cfg = $dom.attr("data-option");
					//logger.info("cfg=" + cfg);
					if(cfg && /^\{/.test($.trim(cfg))){
						//对json格式进行解释
						cfg = eval("(" + cfg + ")");
					}else{
						cfg = {};
					}
					cfg.dialogClass=cfg.dialogClass || "bc-ui-dialog ui-widget-header";// ui-widget-header";
					//cfg.afterClose=option.afterClose || null;//传入该窗口关闭后的回调函数
					if(!$dom.attr("title"))
						cfg.title=option.name;
					$dom.dialog($.extend(bc.page._rebuildWinOption(cfg),{
						open: function(event, ui) {
							var dataType = $dom.attr("data-type");
							if(dataType == "list"){//视图
								//视图聚焦到搜索框
								$dom.find("#searchText").focus();
							}else if(dataType == "form"){//表单
								//聚焦到表单的第一个可输入元素
								$dom.find(":text:eq(0)").focus();
							}
						},
						appendTo:"#middle",
						scroll:false,
						containment:false//"#middle"
					}));
					$dom.bind("dialogbeforeclose",function(event,ui){
						var status = $dom.data("data-status");
						//调用回调函数
						if(option.beforeClose) 
							return option.beforeClose.call($dom[0],status);
					}).bind("dialogclose",function(event,ui){
						var $this = $(this);
						var status = $dom.data("data-status");
						//调用回调函数
						if(option.afterClose) option.afterClose.call($dom[0],status);
						
						//在ie9，如果内含<object>,$this.remove()会报错,故先处理掉object
						//ie8试过没问题
						if(jQuery.browser.msie && jQuery.browser.version >= 9){
							logger.info("IE9坑爹啊");
							$this.find("object").each(function(){
								this.parentNode.innerHTML="";
							});
						}
						//彻底删除所有相关的dom元素
						$this.dialog("destroy").remove();
						//删除任务栏对应的dom元素
						$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();
					}).attr("data-src",option.url).attr("data-mid",option.mid)
					.bind("dialogfocus", function(event, ui) {
						//logger.debug("dialogfocus");
						var cur = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']");
						if(!cur.hasClass("ui-state-active"))
							cur.addClass("ui-state-active").siblings().toggleClass("ui-state-active",false);
					});
					//.disableSelection();这个会导致表单中输入框部分浏览器无法获取输入焦点
					
					var dataType = $dom.attr("data-type");
					if(dataType == "list"){//视图
						if($dom.find(".bc-grid").size()){//表格的额外处理
							bc.grid.init($dom,cfg,cfg.readonly);
						}
					}else if(dataType == "form"){//表单
						bc.form.init($dom,cfg,cfg.readonly);//如绑定日期选择事件等
					}
					
					//插入最大化|还原按钮、最小化按钮
					if(cfg.maximize !== false){
						//$dom.dialog(
					}
					
					//执行组件指定的额外初始化方法，上下文为$dom
					var method = $dom.attr("data-initMethod");
					logger.debug("initMethod="+method);
					if(method){
						method = bc.getNested(method);
						if(typeof method == "function"){
							method.call($dom, cfg,cfg.readonly);
						}else{
							alert("undefined function: " + $dom.attr("data-initMethod"));
						}
					}
					
					//通知任务栏模块加载完毕
					bc.page.quickbar.loaded(option.mid);
					
					//调用回调函数
					if(option.afterOpen) option.afterOpen.call($dom[0]);
				}
				//alert(html);
				var dataJs = $dom.attr("data-js");
				if(dataJs && dataJs.length > 0){
					//先加载js文件后执行模块指定的初始化方法
					dataJs = dataJs.split(",");//逗号分隔多个文件
					dataJs.push(_init);
					bc.load(dataJs);
				}else{
					//执行模块指定的初始化方法
					_init();
				}
				logger.profile("newWin.init." + option.mid);
			},
			error: function(request, textStatus, errorThrown) {
				//var msg = "bc.ajax: textStatus=" + textStatus + ";errorThrown=" + errorThrown;
				//alert("喔唷，出错啦！");
				//显示漂亮的错误提示窗口
				bc.page.showError({url:option.url, more:request.responseText || request.responseHTML,from:"bc.page.newWin->bc.ajax.error"});
				
				//删除任务栏对应的dom元素
				$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();
				
				//出错后通知任务栏模块加载完毕，避免长期显示加载动画
				//bc.page.quickbar.loaded(option.mid);
			}
		});
	},
	/**
	 * 显示请求错误的提示窗口
	 */
	showError: function(option){
		//alert(option.url + ";" + option.more);
		//alert("喔唷，出错啦！");
		//显示漂亮的错误提示窗口
		var errorDom = [
		      '<div style="text-align: center;"><table class="error" cellspacing="0" cellpadding="0" data-from="'+option.from+'" style="width:300px;">'
		      ,'<tr>'
		      ,'<td class="icon" style="width:52px;" title="url:'+option.url+',from:'+option.from+'"><div class="icon"></div></td>'
		      ,'<td class="label">喔唷，出错啦！</td>'
		      ,'</tr>'
		      ,'<tr><td class="detail" colspan="2">处理过程出现了错误，请重新尝试或联系管理员。</td></tr>'
		];
		if(option.more)
			errorDom.push('<tr><td class="detail" colspan="2" style="width:52px;text-align: center;"><span class="more">了解详情</span></td></tr>');
		errorDom.push('</table></div>');
		errorDom = errorDom.join("");
		
		var $error = $(errorDom).dialog({width:380,height:150,modal:true,dialogClass:"bc-ui-dialog ui-widget-header"});
		$error.bind("dialogclose",function(event,ui){
			$error.unbind().remove();
		});
		$error.find("span.more").click(function(){
			logger.info("span.more");
			var errorWin=window.open('', 'bcErrorShow');
			var errorDoc = errorWin.document;
			errorDoc.open();
			errorDoc.write(option.more);
			errorDoc.close();
			errorWin.focus();
		});
	},
	/**
	 * 初始化表单或列表中的元数据信息：表单验证、列表的行操作处理
	 * 上下文为插入到对话框中的元素
	 * TODO 迁移到分散的组件文件中各自定义
	 */
	innerInit: function() {

	},
	_rebuildWinOption: function(option){
		var _option = option || {};
		if(_option.buttons){
			var btn;
			for(var i in _option.buttons){
				btn = _option.buttons[i];
				if(btn.action == "save"){//内部的表单保存
					btn.click = bc.page.save;
				}else if(btn.action == "submit"){//提交表单保存，成功后自动关闭对话框
					btn.click = bc.page.submit;
				}else if(btn.action == "cancel"){//关闭对话框
					btn.click = bc.page.cancel;
				}else if(btn.action == "create"){//新建
					btn.click = bc.page.create;
				}else if(btn.action == "delete"){//删除
					btn.click = bc.page.delete_;
				}else if(btn.action == "edit"){//编辑
					btn.click = bc.page.edit;
				}else if(btn.action == "open"){//打开
					btn.click = bc.page.open;
				}else if(btn.action == "preview"){//预览xheditor的内容
					btn.click = bc.page.preview;
				}else if(btn.action == "more"){//带下拉菜单的按钮
					btn.click = bc.page.more;
				}else if(btn.fn){//调用自定义函数
					btn.click = bc.getNested(btn.fn);
				}
				
				//如果click为字符串，当成是函数名称处理
				if(typeof btn.click == "string"){
					var c = btn.click;
					btn.click = bc.getNested(btn.click);
					if(!btn.click)
						alert("函数'"+c+"'没有定义！");
				}
			}
			//delete _option.buttons;
		}
		return _option;
	},
	/**保存表单数据，上下文为页面对象
	 * @param {Object} option
	 * @option {Function} callback 保存成功后的回调函数，上下文为当前页面，第一个参数为服务器返回的json对象
	 */
	save: function(option) {
		option = option || {};
		var $page = $(this);
		var url=$page.attr("data-saveUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-saveUrl或data-namespace属性的值");
				return;
			}else{
				url += "/save";
			}
		}
		logger.info("saveUrl=" + url);
		var $form = $("form",$page);
		
		//表单验证
		if(!bc.validator.validate($form))
			return;
		
		//使用ajax保存数据
		var data = $form.serialize();
		bc.ajax({
			url: url, data: data, dataType: "json",
			success: function(json) {
				if(logger.debugEnabled)logger.debug("save success.json=" + jQuery.param(json));
				if(json.id){
					$form.find("input[name='e.id']").val(json.id);
				}
				//记录已保存状态
				$page.attr("data-status","saved").data("data-status","saved");
				
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
		});
	},
	/**提交表单保存数据后自动关闭表单对话框，上下文为页面对象*/
	submit: function(option) {
		option = option || {};
		var $page = $(this);
		bc.page.save.call(this,{callback:function(json){
			if(typeof option.callback == "function"){
				//返回false将禁止提示信息的显示
				if(option.callback.call($page[0],json) === false)
					return false;;
			}else{
				bc.msg.slide("提交成功！");
				$page.data("data-status",true);
				$page.dialog("close");
				return false;
			}
		}});
	},
	/**删除*/
	delete_: function(option) {
		option = option || {};
		var $page = $(this);
		var url=$page.attr("data-deleteUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-deleteUrl或data-namespace属性的值");
				return;
			}else{
				url += "/delete";
			}
		}
		var data=null;
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-focus>td.id");
		if($tds.length == 1){
			data = "id=" + $tds.attr("data-id");
		}else if($tds.length > 1){
			data = "ids=";
			$tds.each(function(i){
				data += $(this).attr("data-id") + (i == $tds.length-1 ? "" : ",");
			});
		}
		if(logger.infoEnabled) logger.info("bc.page.delete_: data=" + data);
		if(data == null){
			bc.msg.slide("请先选择要删除的条目！");
			return;
		}
		bc.msg.confirm("确定要删除选定的 <b>"+$tds.length+"</b> 项吗？",function(){
			bc.ajax({
				url: url, data: data, dataType: "json",
				success: function(json) {
					if(logger.debugEnabled)logger.debug("delete success.json=" + jQuery.param(json));
					//调用回调函数
					var showMsg = true;
					if(typeof option.callback == "function"){
						//返回false将禁止保存提示信息的显示
						if(option.callback.call($page[0],json) === false)
							showMsg = false;
					}
					if(showMsg)
						bc.msg.slide(json.msg);
					
					//重新加载列表
					bc.grid.reloadData($page);
				}
			});
		});
	},
	/**禁用*/
	disabled: function(option) {
		option = option || {};
		var $page = $(this);
		var url=$page.attr("data-deleteUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-deleteUrl或data-namespace属性的值");
				return;
			}else{
				url += "/delete";
			}
		}
		var data=null;
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-focus>td.id");
		if($tds.length == 1){
			data = "id=" + $tds.attr("data-id");
		}else if($tds.length > 1){
			data = "ids=";
			$tds.each(function(i){
				data += $(this).attr("data-id") + (i == $tds.length-1 ? "" : ",");
			});
		}
		if(logger.infoEnabled) logger.info("bc.page.delete_: data=" + data);
		if(data == null){
			bc.msg.slide("请先选择要禁用的条目！");
			return;
		}
		bc.msg.confirm("确定要禁用选定的 <b>"+$tds.length+"</b> 项吗？",function(){
			bc.ajax({
				url: url, data: data, dataType: "json",
				success: function(json) {
					if(logger.debugEnabled)logger.debug("disabled success.json=" + jQuery.param(json));
					//调用回调函数
					var showMsg = true;
					if(typeof option.callback == "function"){
						//返回false将禁止保存提示信息的显示
						if(option.callback.call($page[0],json) === false)
							showMsg = false;
					}
					if(showMsg)
						bc.msg.slide(json.msg);
					
					//重新加载列表
					bc.grid.reloadData($page);
				}
			});
		});
	},
	/**关闭表单对话框，上下文为dialog的原始dom元素*/
	cancel: function(option){
		$(this).dialog("destroy").remove();
	},
	/**新建表单*/
	create: function(option){
		option = option || {};
		var $page = $(this);
		var url=$page.attr("data-createUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-createUrl或data-namespace属性的值");
				return;
			}else{
				url += "/create";
			}
		}
		
		//附加固定的额外参数
		var data = option.data || {};
		var extras = option.extras || $page.data("extras");
		if(extras){
			data = $.extend(data, extras);
		}
		
		bc.page.newWin({
			url: url,
			mid: $page.attr("data-mid") + ".0",
			name: "新建" + ($page.attr("data-name") || "未定义"),
			afterClose: function(status){
				if(status)bc.grid.reloadData($page);
			},
			afterOpen: option.callback,
			data: data
		});
	},
	/**编辑*/
	edit: function(option){
		option = option || {};
		var $page = $(this);
		var url = option.url || $page.attr("data-editUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-editUrl或data-namespace属性的值");
				return;
			}else{
				url += "/edit";
			}
		}
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-focus>td.id");
		if($tds.length == 1){
			var data = {id: $tds.attr("data-id")};
			
			//附加固定的额外参数
			var extras = option.extras || $page.data("extras");
			if(extras){
				data = $.extend(data, extras);
			}
			
			bc.page.newWin({
				url:url, data: data || null,
				mid: $page.attr("data-mid") + "." + $tds.attr("data-id"),
				name: $tds.attr("data-name") || "未定义",
				afterClose: function(status){
					if(status == "saved")
						bc.grid.reloadData($page);
				},
				afterOpen: option.callback
			});
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以编辑一条信息，请确认您只选择了一条信息！");
			return;
		}else{
			bc.msg.slide("请先选择要编辑的信息！");
			return;
		}
	},
	/**查看*/
	open: function(option){
		option = option || {};
		var $page = $(this);
		var url = $page.attr("data-openUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-openUrl或data-namespace属性的值");
				return;
			}else{
				url += "/open";
			}
		}
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-focus>td.id");
		if($tds.length == 1){
			var data = {id: $tds.attr("data-id")};
			
			//附加固定的额外参数
			var extras = option.extras || $page.data("extras");
			if(extras){
				data = $.extend(data, extras);
			}
			
			bc.page.newWin({
				url:url, data: data || null,
				mid: $page.attr("data-mid") + "." + $tds.attr("data-id"),
				name: $tds.attr("data-name") || "未定义",
				afterClose: function(status){
					if(status == "saved")
						bc.grid.reloadData($page);
				},
				afterOpen: option.callback
			});
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以查看一条信息，请确认您只选择了一条信息！");
			return;
		}else{
			bc.msg.slide("请先选择要查看的信息！");
			return;
		}
	},
	/**预览xheditor的内容，上下文为dialog对象*/
	preview: function(){
		$(this).find(".bc-editor").xheditor({tools:'mini'}).exec("Preview");
	}
};

jQuery(function($) {
	bc.page.innerInit();
});

bc.page.quickbar={
	id:"#quickButtons",
	/**  
	 * 判断指定的模块当前是否已经加载
	 * @param mid 模块的id
	 */
	has: function(mid){
		return $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']").length > 0;
	},
	/**  
	 * 激活已经加载的现有模块
	 * @param mid 模块的id
	 */
	active: function(mid){
		$(".ui-dialog>.ui-dialog-content[data-mid='" + mid + "']").parent().show()
		.end().siblings().toggleClass("ui-state-active",false)
		.end().dialog("moveToTop");
	},
	/**  
	 * 设置指定的模块开始加载中
	 * @param option 模块的配置
	 */
	loading: function(option){
		$(bc.page.quickbar.id).append('<a id="quickButton-'+option.mid
				+'" class="quickButton ui-corner-all ui-state-default" data-mid="'+option.mid
				+'" data-name="'+option.name+'" title="'+option.name+'">'
				+'<span class="ui-icon loading"></span>'
				+'<span class="text">正在加载：'+option.name+'</span></a>');
	},
	/**  
	 * 设置指定的模块加载完毕
	 * @param mid 模块的id
	 */
	loaded: function(mid){
		var $item = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']");
		$item.find(">span.text").text($item.attr("data-name"));
		$item.find(">span.ui-icon").removeClass("loading").addClass("ui-icon-folder-open");
		$item.toggleClass("ui-state-active",true).siblings().toggleClass("ui-state-active",false);
	},
	/**  
	 * 设置指定的模块的警告显示
	 * @param mid 模块的id
	 */
	warn: function(mid){
		var $item = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']");
		$item.toggleClass("ui-state-highlight",true);
	}
};

/**  
 * 初始化表单中的页签页面
 * 上下文及参数同tabs的事件参数一致
 */
bc.page.initTabPageLoad = function (event, ui){
	if($.data(ui.tab, "bcInit.tabs")) return;
	
	var $tabPanel = $(ui.panel);
	var $page = $tabPanel.find(">.bc-page");
	logger.info("bc-page.size:" + $page.size());
	if(!$page.size()) return;
	
	$page.height($tabPanel.height());
	//logger.info("show:" + $page.attr("class"));
	
	//对视图和表单执行额外的初始化
	var dataType = $page.attr("data-type");
	if(dataType == "list"){//视图
		if($page.find(".bc-grid").size()){//表格的额外处理
			bc.grid.init($page);
			$page.removeAttr("title");
		}
	}else if(dataType == "form"){//表单
		bc.form.init($page);//如绑定日期选择事件等
		$page.removeAttr("title");
	}
	
	//标记已经初始化过
	$.data(ui.tab, "bcInit.tabs",true);
};

/**  
 * 表单中的页签创建事件的通用处理函数
 * 上下文及参数同tabs的事件参数一致
 */
bc.page.initTabPageCreate = function (event, ui){
	//统一设置页签内容区的高度，而不是默认的自动高度，并设置内容区内容溢出时显示滚动条
	var $tabs = $(this);
	var $tabPanels = $tabs.children(".ui-tabs-panel");
	//logger.info("create tabs:" + $tabs.attr("class"));
	var $nav = $tabs.children(".ui-tabs-nav");
	var ch = $tabs.height() - $nav.outerHeight(true) - ($tabPanels.outerHeight(true) - $tabPanels.height());
	$tabPanels.addClass("bc-autoScroll").height(ch);
};
bc.page.defaultTabsOption = {
	cache: true, 
	create: bc.page.initTabPageCreate,
	load: bc.page.initTabPageLoad
};

//页签中页面的加载处理
function _initBcTabsLoad(){
	var $page = this;
	//执行组件指定的额外初始化方法，上下文为$dom
	var method = $page.attr("data-initMethod");
	logger.debug("bctabs:initMethod="+method);
	if(method){
		method = bc.getNested(method);
		if(typeof method == "function"){
			var cfg = $page.attr("data-option");
			//logger.info("cfg=" + cfg);
			if(cfg && /^\{/.test($.trim(cfg))){
				//对json格式进行解释
				cfg = eval("(" + cfg + ")");
			}else{
				cfg = {};
			}
			method.call($page, cfg,cfg.readonly);
		}else{
			alert("undefined function: " + $page.attr("data-initMethod"));
		}
	}
}

/**  
 * 表单中的bctabs页签的默认配置
 * 上下文及参数同bctabs的事件参数一致
 */
bc.page.defaultBcTabsOption = {
	load:function(event,ui){
		logger.info("load:" +  $(this).attr("class"));
		var $page = ui.content.children(".bc-page");
		logger.info("tabs.load:bc-page.size=" + $page.size());
		if(!$page.size()) return;
		
		// 加载js、css文件
		var dataJs = $page.attr("data-js");
		if(dataJs && dataJs.length > 0){
			//先加载js文件后执行模块指定的初始化方法
			dataJs = dataJs.split(",");//逗号分隔多个文件
			dataJs.push(jQuery.proxy(_initBcTabsLoad,$page));
			bc.load(dataJs);
		}else{
			//执行模块指定的初始化方法
			_initBcTabsLoad.call($page);
		}
		
		//对视图和表单执行额外的初始化
		var dataType = $page.attr("data-type");
		logger.info("tabs.load:dataType=" + dataType);
		if(dataType == "list"){//视图
			if($page.find(".bc-grid").size()){//表格的额外处理
				bc.grid.init($page);
				$page.removeAttr("title");
			}
		}else if(dataType == "form"){//表单
			bc.form.init($page);//如绑定日期选择事件等
			$page.removeAttr("title");
		}
	},
	show:function(event,ui){
		logger.info("show:" + ui.content.attr("class"));
	}
};
