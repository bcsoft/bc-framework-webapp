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
	}
};
	
var $document = $(document);
//顶部工具条按钮控制
$document.delegate(".bc-toolbar .bc-button",{
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
			bc.page.create.call(pageEl,{callback:callback,extras:extras});
			break;
		case "edit"://编辑----视图中
			bc.page.edit.call(pageEl,{callback:callback,extras:extras});
			break;
		case "open"://查看----视图中
			bc.page.open.call(pageEl,{callback:callback,extras:extras});
			break;
		case "delete"://删除----视图
			bc.page.delete_.call(pageEl,{callback:callback,extras:extras});
			break;
		case "disabled"://禁用----视图
			bc.page.disabled.call(pageEl,{callback:callback,extras:extras});
			break;
		case "save"://保存----表单
			bc.page.save.call(pageEl,{callback:callback,extras:extras});
			break;
		case "cancel"://关闭对话框
			bc.page.cancel.call(pageEl,{callback:callback,extras:extras});
			break;
		default ://调用自定义的函数
			var click = $this.attr("data-click");
			if(typeof click == "string")
				click = bc.getNested(click);//将函数名称转换为函数
			if(typeof click == "function")
				click.call(pageEl,{callback:callback,extras:extras});
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

// 工具条的单选按钮组
$document.delegate(".bc-toolbar .bc-radioGroup>.ui-button",{
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


//工具条的单选按钮组
$document.delegate(".bc-button.bc-menuButton",{
	click: function() {
		var $this = $(this);
		if($this.attr("data-menuInit") != "true"){//初始化下拉菜单
			logger.info("data-menuInit!=true");
			
			//将菜单的dom迁移到指定的容器
			var $contextmenu = $this.find(".bc-menu");
			var menuSelector = $this.attr("data-menuSelector");
			if(menuSelector && menuSelector.length > 0){
				$contextmenu.appendTo($this.closest(menuSelector));//添加到指定的容器
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
						change.call($this.closest(".bc-page")[0],{
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

})(jQuery);