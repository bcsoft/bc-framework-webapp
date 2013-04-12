/**
 * 工具条的全局处理
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-05-26
 * @depend jquery-ui-1.8,bc.core
 */
(function($) {

bc.toolbar = {
	/**执行搜索操作
	 * @param $page 页面dom的jquery对象
	 * @param option 
	 * @option action 
	 * @option callback 
	 * @option click 
	 */
	doSearch: function($page,option) {
		var action = option.action;//内定的操作
		var callback = option.callback;//回调函数
		callback = callback ? bc.getNested(callback) : undefined;//转换为函数

		switch (action){
		case "search"://内置的搜索处理
			//重设置为第一页
			$page.find("ul.pager #pageNo").text(1);
			
			//重新加载列表数据
			bc.grid.reloadData($page, callback);
			break;
		default ://调用自定义的函数
			var click = option.click;
			if(typeof click == "string")
				click = bc.getNested(click);//将函数名称转换为函数
			if(typeof click == "function")
				click.call($page[0],{callback:callback});
			break;
		}
	},
	
	/** 初始化高级搜索窗口
	 * @param $advanceSearchBtn 点击的按钮
	 * @param $conditionsForm 高级搜索窗口
	 */
	initAdvanceSearchForm: function($advanceSearchBtn, $conditionsForm){
		if($conditionsForm.size() == 0) return;
		
		//设置窗口的最小宽度为按钮的当前宽度
		$conditionsForm.css("min-width", $advanceSearchBtn.parent().width() + "px");
		
		//绑定点击按钮就显示条件窗口的事件
		$conditionsForm.bcsearch({
			trigger: $advanceSearchBtn,
			position: {my: "right top",at: "right bottom",of: $advanceSearchBtn.prev(),offset:"0 -1"}
		}).bcsearch("open");
		
		//标记已初始化
		$advanceSearchBtn.attr("data-advanceSearchInit","true");
		
		// 控制是否可拖动高级搜索框
		if($conditionsForm.is(".draggable") && $.fn.draggable){
			$conditionsForm.css("cursor","move").draggable({
				cancel: ".conditions,button,a"
			});
			
			// 让高级搜索框超出对话框范围也可见
			$conditionsForm.closest(".bc-page").css("overflow","visible");
		}
	},
	
	/** 执行高级搜索：上下文为当前窗口页面
	 * @param option 选项
	 * @param target 点击的按钮
	 */
	doAdvanceSearch: function(option,target) {
		var $page = $(this);
		var $target = $(target);
		var $conditionsForm = $target.closest(".bc-conditionsForm");
		if(logger.debugEnabled)logger.debug("doAdvanceSearch:" + $conditionsForm.attr("class"));
		
		// 格式验证
		if(!bc.validator.validate($conditionsForm))
			return
		
		// 组合高级查询条件
		var conditions = [];
		var $this,value,c;
		$conditionsForm.find("[data-condition]").each(function(){
			$this = $(this);
			if($this.is("input[type='text'],input[type='hidden'],textarea,select")){//文本框、隐藏域、下拉选择框
				value = $this.val();
				c = eval("(" + $this.attr("data-condition") + ")");
				if(logger.debugEnabled)logger.debug("c1=" + $.toJSON(c));
				if(value && value.length > 0){
					var op = {type:c.type,ql:c.ql,value:value};
					if(c.likeType)
						op.likeType = c.likeType;
					if(c.name){
						op.name=c.name;
					}
					conditions.push(op);
				}
			}else if($this.is(".radios,.checkboxes")){//单选按钮组或多选框的容器
				c = eval("(" + $this.attr("data-condition") + ")");
				if(logger.debugEnabled)logger.debug("c2=" + $.toJSON(c));
				var $ms = $this.find(":checked");
				var values = [],vv;
				$ms.each(function(){
					vv=this.value.split(",");//单个项可以包含多个值，用逗号连接即可
					for(var i=0;i<vv.length;i++)
						values.push(vv[i]);
				});
				if(values.length == 1){//单个值
					conditions.push({type:c.type,ql: c.ql ? c.ql : c.key + "=?",value:values[0]});
				}else if(values.length > 1){//多个值
					var ins = " in (";
					for(var i=0;i<values.length;i++){
						ins += (i==0 ? "?" : ",?");
					}
					ins += ")";
					conditions.push({type:c.type,ql: c.ql ? c.ql : c.key + ins,value: values});
				}
			}else if($this.is(".multi")){//多值混合类型
				c = this.getAttribute("data-condition");
				c = c.replace(/\r|\n|\t/g,"");
				if(logger.debugEnabled)logger.debug("multi:data-condition=" + c);
				c = eval("(" + c + ")");
				// 获取起始、结束日期的值
				var $values = $this.find("input.value");
				var zero = "", all = "", qlkey = "",valueCfg,v,$t;
				var values = [];
				$values.each(function(i){
					$t = $(this);
					v = $t.val();
					valueCfg = $t.data("value");
					zero += "0";
					all += "1";
					qlkey += v.length > 0 ? "1" : "0";
					if(v.length > 0){//有值的情况
						if(typeof valueCfg == "string"){
							valueCfg = {type: valueCfg, value: v, like:false};
						}else{
							valueCfg.value = v;
						}
						values.push(valueCfg);
					}
				});
				
				if(logger.debugEnabled)logger.debug("zero=" + zero + ";all=" + all + ";qlkey=" + qlkey + ";values.length=" + values.length);
				
				if(qlkey != zero){//排除全部无值的情况
					if(all == qlkey){//全部有值的情况
						qlkey = "ql";
					}else{// 部分有值的情况
						qlkey = "ql" + qlkey;
					}
					if(values.length == 1){
						conditions.push({type: values[0].type,ql: c[qlkey],value: values[0].value,like: !!values[0].like});
					}else{
						conditions.push({type:"multi",ql: c[qlkey],value: values});
					}
				}
			}else{
				alert("不支持的条件配置：data-condition=" + $this.attr("data-condition"));
			}
		});
		
		// 将搜索条件保存到指定位置
		var extras = $page.data("extras");
		if(!extras){
			$page.data("extras",{});
			extras = $page.data("extras");
		}
		extras.search4advance = $.toJSON(conditions);
		if(logger.infoEnabled)logger.info("search4advance=" + extras.search4advance);
		
		// 重设置为第一页
		$page.find("ul.pager #pageNo").text(1);
		
		// 重新加载列表数据
		bc.grid.reloadData($page, function(){
			logger.info("advanceSearch reloadData callback");
		});
	},
	
	/** 清空高级搜索条件
	 * @param option 选项
	 * @param target 点击的按钮
	 */
	doAdvanceClean: function(option,target) {
		// 清除条件框的值
		var $conditionsForm = $(target).closest(".bc-conditionsForm");
		$conditionsForm.find("input[type='text'],input[type='hidden'],textarea,select").val("");
		$conditionsForm.find(":checked").each(function(){
			this.checked = false;
		});
		
		// 清除页面保存的条件值
		var extras = $conditionsForm.closest(".bc-page").data("extras");
		if(extras){
			delete extras.search4advance;
		}
		
		// 重新加载列表数据
		bc.grid.reloadData($conditionsForm.closest(".bc-page"));
	}
};
	
var $document = $(document);
//顶部工具条按钮控制
$document.delegate(".bc-button",{
	mouseover: function() {
		$(this).addClass("ui-state-hover");
	},
	mouseout: function() {
		$(this).removeClass("ui-state-hover");
	},
	click: function() {
		var $this = $(this);
		var action = $this.attr("data-action");//内定的操作
		var callback = $this.attr("data-callback");//回调函数
		callback = callback ? bc.getNested(callback) : undefined;//转换为函数
		var $page = $this.closest(".bc-page");
		var pageEl = $page[0];
		
		//==附加的额外的请求参数
		//  从page取
		var extras = $page.data("extras");
		logger.info("page extras=" + $.toJSON(extras));
		
		//上下文统一为页面，第一个参数为配置
		switch (action){
		case "create"://新建--视图中
			bc.page.create.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "edit"://编辑----视图中
			bc.page.edit.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "open"://查看----视图中
			bc.page.open.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "delete"://删除----视图
			bc.page.delete_.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "disabled"://禁用----视图
			bc.page.disabled.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "save"://保存----表单
			bc.page.save.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "cancel"://关闭对话框
			bc.page.cancel.call(pageEl,{callback:callback,extras:extras},this);
			break;
		default ://调用自定义的函数
			var click = $this.attr("data-click");
			if(typeof click == "string")
				click = bc.getNested(click);//将函数名称转换为函数
			if(typeof click == "function")
				click.call(pageEl,{callback:callback,extras:extras},this);
			break;
		}
	}
});

//右侧的搜索框处理：回车执行搜索（TODO alt+enter执行本地搜索）
$document.delegate(".bc-toolbar #searchText","keyup", function(e) {
	var $this = $(this);
	if(e.which == 13){//按下回车键
		var $page = $this.parents(".bc-page");
		var $search = $this.parent();
		bc.toolbar.doSearch($page,{
			action: $search.attr("data-action"),//内定的操作
			callback: $search.attr("data-callback"),//回调函数
			click: $search.attr("data-click")//自定义的函数
		});
	}
});
//右侧的搜索框处理：点击左侧的简单搜索按钮
$document.delegate(".bc-toolbar #searchBtn","click", function(e) {
	var $this = $(this);
	var $page = $this.parents(".bc-page");
	var $search = $this.parent();
	bc.toolbar.doSearch($page,{
		action: $search.attr("data-action"),//内定的操作
		callback: $search.attr("data-callback"),//回调函数
		click: $search.attr("data-click")//自定义的函数
	});
	
	return false;
});
//右侧的搜索框处理：点击右侧的高级搜索按钮
$document.delegate(".bc-toolbar #advanceSearchBtn","click", function(e) {
	var $this = $(this);
	
	// 隐藏高级搜索按钮
	$this.hide();
	
	if($this.attr("data-advanceSearchInit") != "true"){//初始化条件窗口
		var cotainer = $this.attr("data-conditionsForm") || ".bc-page";//".bc-searchButton";
		var $conditionsFormParent = $this.closest(cotainer);
		logger.info("cotainer=" + cotainer);
		
		// 初始化条件窗口
		var conditionsFormUrl = $this.parent().attr("data-url");//获取条件窗口html代码的请求路径
		logger.info("conditionsFormUrl=" + conditionsFormUrl);
		if(conditionsFormUrl && conditionsFormUrl.length > 0){//通过ajax获取条件窗口
			bc.ajax({
				url: conditionsFormUrl,
				type: "POST",
				dataType: "html",
				data: $this.closest(".bc-page").data("extras"),
				success: function(html){
					logger.info("finish loaded conditionsForm");
					//先清空可能的条件窗口
					$this.next(".bc-conditionsForm").remove();
					
					//添加到指定的容器
					var $conditionsForm = $(html);
					$conditionsForm.appendTo($conditionsFormParent);
					
					// 加载额外的js、css文件
					function _init(){
						//绑定日期选择
						bc.form.initCalendarSelect($conditionsForm);

						bc.toolbar.initAdvanceSearchForm($this,$conditionsForm);
					}
					var dataJs = $conditionsForm.attr("data-js");
					if(dataJs && dataJs.length > 0){
						//先加载js文件后执行模块指定的初始化方法
						dataJs = dataJs.split(",");//逗号分隔多个文件
						
						// 处理预定义的js、css文件
						var t;
						for(var i=0;i<dataJs.length;i++){
							if(dataJs[i].indexOf("js:") == 0){//预定义的js文件
								t = bc.loader.preconfig.js[dataJs[i].substr(3)];
								if(t){
									t = bc.root + t;
									logger.debug(dataJs[i] + "=" +  t);
									dataJs[i] = t;
								}else{
									alert("没有预定义“" + dataJs[i] + "”的配置，请在loader.preconfig.js文件中添加相应的配置！");
								}
							}else if(dataJs[i].indexOf("css:") == 0){//预定义的css文件
								
							}
						}
						
						dataJs.push(_init);
						bc.load(dataJs);
					}else{
						_init();
					}
				}
			});
		}else{//自定义的条件窗口
			bc.toolbar.initAdvanceSearchForm($this,$this.next(".bc-conditionsForm"));
		}
	}
	return false;
});

// 工具条的单选按钮组
$document.delegate(".bc-radioGroup>.ui-button",{
	mouseover: function() {
		$(this).addClass("ui-state-hover");
	},
	mouseout: function() {
		$(this).removeClass("ui-state-hover");
	},
	click: function() {
		var $this = $(this);
		var $siblings = $this.siblings();
		
		// 判断是否值改变了
		var pre = $siblings.filter(".ui-state-active");
		//logger.info("TODO1=" + pre.size());
		//logger.info("TODO2=" + $this.hasClass("ui-state-active"));
		if(pre.size() == 0 || (pre.size() >= 0 && $this.hasClass("ui-state-active"))){
			//没有改变过任何值，不作处理直接返回
			return;
		}
		
		// 获取当前选项的值
		var data = {
			value: $this.attr("data-value"),
			text: $this.children(".ui-button-text").text()
		};
		
		// 获取前一个选项的值
		if(pre.size()){
			data.prev={
				value: pre.attr("data-value"),
				text: pre.children(".ui-button-text").text()
			};
		}
		
		// 处理样式
		$this.addClass("ui-state-active");
		$siblings.removeClass("ui-state-active");
		
		// 处理回调函数：上下文统一为页面，第一个参数为配置
		var $parent = $this.parent();
		var action = $parent.attr("data-action");//内定的操作
		var callback = $parent.attr("data-callback");//回调函数
		callback = callback ? bc.getNested(callback) : undefined;//转换为函数
		var $page = $this.closest(".bc-page");
		var option = $.extend({callback:callback},data);
		switch (action){
			case "reloadGrid"://重新加载grid的数据--视图中
				//参数名称
				var key = $parent.attr("data-key");
				
				//将参数的值设置到页面的data-extras
				var extras = $page.data("extras");
				if(!extras){
					extras = {};
					extras[key] = data.value;
					$page.data("extras",extras);
				}else{
					extras[key] = data.value;
				}
				bc.grid.reloadData($page);
				break;
			default ://调用自定义的函数
				var change = $parent.attr("data-change");
				if(change){
					change = bc.getNested(change);//将函数名称转换为函数
					if(typeof change == "function"){
						change.call($page[0],option);
					}else{
						alert("undefined function: " + $parent.attr("data-change"));
					}
				}
		}
		return false;
	}
});

//工具条的带下拉菜单按钮
$document.delegate(".bc-button.bc-menuButton",{
	click: function() {
		var $this = $(this);
		if($this.attr("data-menuInit") != "true"){//初始化下拉菜单
			logger.info("data-menuInit!=true");
			
			//将菜单的dom迁移到指定的容器
			var $contextmenu = $this.find(".bc-menu");
			var menucontainer = $this.attr("data-menucontainer");
			if(menucontainer && menucontainer.length > 0){
				$contextmenu.appendTo($this.closest(menucontainer));//添加到指定的容器
			}else{
				//$contextmenu.appendTo($this.parent());//添加到父容器
			}
			
			//设置菜单的最小宽度为按钮的当前宽度
			$contextmenu.css("min-width", $this.width() + "px");
			
			//获取回调函数
			var change = $this.attr("data-change");
			if(change){
				change = bc.getNested(change);//将函数名称转换为函数
				if(typeof change != "function"){
					alert("没有定义函数: " + $this.attr("data-change"));
				}
			}
			
			//初始化菜单
			$contextmenu.menu({
				select: function(event, ui) {
					$(this).popup("close");
					//$this.button("option", "label", ui.item.text());
					if(typeof change == "function"){
						change.call($this.closest(".bc-ui-dialog").children(".bc-page")[0],{
							text: ui.item.attr("data-text"),
							value: ui.item.attr("data-value")
						});
					}
				}
			});
			
			//绑定点击按钮就显示下拉菜单
			$contextmenu.popup({trigger: $this}).popup("open");
			
			//标记已初始化
			$this.attr("data-menuInit","true");
		}
		return false;
	}
});

// 基于jQueryUI的下拉框
$document.delegate(".bc-select:not(.ignore)","click", function richInputFn(e) {
	if(logger.infoEnabled)logger.info("e.type="+e.type);
	var $this = $(this);
	if($this.is("input[type='text']")){//文本框
		$input = $this;
	}else if($this.is(".inputIcon")){//文本框右侧的按钮
		$input = $this.parent().siblings("input[type='text']");
		$input.focus();
	}
	
	if($input.attr("data-bcselectInit") != "true"){
		// 获取自定义的配置
		var option = $.extend({
			autoFocus: false,		// 不自动聚焦
			delay: 0,				// 延时时间（毫秒）
			minLength: 0,			// 最少输入两个字符
			autofill: true,			// 是否自动填充选择的值
			position: {
				my: "left top",
				at: "left bottom",
				offset:"0 -1",
				collision: "none"
			},
			select: function(event, ui){
				if(logger.debugEnabled)logger.debug("item2=" + $.toJSON(ui.item));
				
				// 获取值的映射配置
				var autofill = $input.autocomplete( "option", "autofill" );
				var labelMapping = $input.autocomplete( "option", "labelMapping" );
				var valueMapping = $input.autocomplete( "option", "valueMapping" );
				if(logger.debugEnabled){
					logger.debug("autofill=" + autofill);
					logger.debug("labelMapping=" + labelMapping);
					logger.debug("valueMapping=" + valueMapping);
				}
				
				if(autofill){// 自动填充值
					// 设置显示值
					$input.val(labelMapping ? bc.formatTpl(labelMapping, ui.item) : ui.item.label);
					
					// 设置隐藏域字段的值
					$input.next().val(valueMapping ? bc.formatTpl(valueMapping, ui.item) : ui.item.value);
				}
				
				// 返回false禁止autocomplete自动填写值到$input
				return false;
			}
		},$input.data("cfg"));
		
		// 获取下拉列表的数据源
		var source = $input.data("source");
		if(logger.debugEnabled)logger.debug("source=" + $.toJSON(source));
		if(source) option.source = source;
		
		// 处理自定义的select函数
		if(typeof option.select == "string"){
			var select = bc.getNested(option.select);
			if(typeof select != "function"){
				alert("没有定义select函数：select=" + option.select);
			}else{
				option.select = select;
			}
		}
		
		// 合并自定义的回调函数
		if(typeof option.callback == "string"){
			var callback = bc.getNested(option.callback);
			if(typeof callback != "function"){
				alert("没有定义的回调函数：callback=" + option.callback);
			}else{
				option.callback = callback;
				var originSelectFn = option.select;
				option.select = function(event, ui){
					// 调用原始的select函数
					if(typeof originSelectFn == "function")
						originSelectFn.apply(this,arguments);
					
					// 再调用自定义的回调函数：返回非true禁止autocomplete自动填写值到$input
					return option.callback.apply(this,arguments) === true;
				}
			}
		}
		
		// 处理自定义的focus函数
		if(typeof option.focus == "string"){
			var focus = bc.getNested(option.focus);
			if(typeof focus != "function"){
				alert("没有定义focus函数：focus=" + option.focus);
			}else{
				option.focus = focus;
			}
		}
		
		// 处理显示值的映射：如果配置了映射但有没有自定义focus函数就默认构造一个
		//alert(Mustache.render("{{title}} spends {{calc}}", {title:"t", calc: "c"}));
		if(option.labelMapping && !option.focus){
			option.focus = function(event, ui){
				if(logger.debugEnabled)logger.debug("item0=" + $.toJSON(ui.item));
				$input.val(bc.formatTpl(option.labelMapping, ui.item));
				return false;
			}
		}
		
		// 处理change函数
		if(typeof option.change == "string"){// 处理自定义的focus函数
			var change = bc.getNested(option.change);
			if(typeof change != "function"){
				alert("没有定义change函数：change=" + option.change);
			}else{
				option.change = change;
			}
		}
		if(!option.change && option.strict){// 没有配置change事件，但又要求严格匹配就自动创建一个change事件，用于恢复原值
			option.change = function(event, ui){
				var previous = $input.data("previous");
				if(!ui.item && previous != $input.val()){// ui.item==null 证明用户没有确切的从下拉列表中选择一个，将输入框恢复为原来的值
					if(logger.debugEnabled)logger.debug("restore val to "+previous);
					$input.val(previous);// 恢复原来的值
				}
			}
		}
		
		//初始化下拉列表
		$input.autocomplete(option).autocomplete("widget").addClass("bc-condition-autocomplete");
		
		// 每次聚焦时记录当前值，方便change事件中判断如果用户没有选择，恢复原来的值
		$input.bind( "focus.autocomplete",function(){
			if(logger.debugEnabled)logger.debug("cur=" + $input.val());
			$input.data("previous",$input.val());// 记录当前值
		});
		$input.data("previous",$input.val());// 记录当前值
		
		// 设置下拉列表的最大高度
		var maxHeight = $input.attr("data-maxHeight");
		if(maxHeight){
			$input.autocomplete("widget").css({
				'max-height': maxHeight,/*ie6 unsupport*/
				'overflow-y': 'auto',
				'overflow-x': 'hidden'
				//,'paddin-right': '20px'
			});
		}
		
		// 处理下拉列表项的渲染
		if(option.itemMapping){
			$input.autocomplete().data("autocomplete")._renderItem = function( ul, item ) {
				if(logger.debugEnabled)logger.debug("item1=" + $.toJSON(item));
				return $( "<li><a></a></li>" )
					.data( "item.autocomplete", item )
					.children("a").append(bc.formatTpl(option.itemMapping, item))
					.end().appendTo( ul );
			};
		}
		
		// 标记为已经初始化
		$input.attr("data-bcselectInit","true");
	}
	
	// 切换列表的显示
	$input.autocomplete("search", "");
	
	// 添加ignore样式，避免再执行click事件
	//if(!$input.hasClass("ignore"))$input.addClass("ignore");

	return false;
});

})(jQuery);