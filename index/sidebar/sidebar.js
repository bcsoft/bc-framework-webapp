bc.namespace("bc.sidebar");
(function($){

// 通知：id,type,title,content,time
var Notice = Backbone.Model.extend({
	// 初始化
	initialize: function() {
	 	if (!this.get("iconClass")) {
	 		var parentIconClass = GroupTypes[this.get("type")].itemIconClass;
	 		if(parentIconClass)
		 		this.set({"iconClass": parentIconClass});
	 		else
		 		this.set({"iconClass": "ui-icon-radio-on"});
		}
	 	if (!this.get("time4moment")) {
	 		this.set({"time4moment": moment(this.get("time"), "YYYY-MM-DD HH:mm:ss").fromNow()});
		}
	}
});

// 通知列表
var NoticeList = Backbone.Collection.extend({
	// 获取数据的URl
	url: function(){
		return "sidebar";
	},

	// 关联到通知
	model: Notice,
	
	comparator: "time",
	
	// 初始化
	initialize: function() {
	}
});

// 创建一个通知列表实例
var notices = new NoticeList;

// 通知条目的视图
var NoticeView = Backbone.View.extend({
	tagName: "div",
	className: "row",

	// Cache the template function for a single item.
	template: _.template('<div class="header row">'
		+'		<div class="icon ui-icon <%- iconClass %>"></div>'
		+'		<div class="label" title="<%- title %>"><%- title %></div>'
		+'		<div class="time"><%- time4moment %></div>'
		+'	</div>'
		+'	<pre class="detail" title="<%- content %>"><%- content %></pre>'),

	// 绑定DOM事件
	events: {
		"click": "open"
	},

	// 初始化
	initialize: function() {
		// 监听模块的事件
		//this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'change:time4moment', this.updateTime4moment);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	// 渲染
	render: function() {
		if(logger.infoEnabled)logger.info("m:render");
		this.$el.html(this.template(this.model.toJSON()));
		this.time = this.$(">.header>.time");
		return this;
	},

	// 自动更新相对时间的显示
	updateTime4moment: function() {
		if(logger.debugEnabled)logger.debug("m:updateTime4moment");
		this.time.html(this.model.get("time4moment"));
		return this;
	},

	// 打开链接
	open: function() {
		var g = GroupTypes[this.model.get("type")];
		bc.page.newWin({
			name: this.model.get("title") || "(无)",
			mid: this.model.get("type") + this.model.get("dbid"),
			url: g.itemUrl,
			data: g.itemData.format(this.model.get("dbid"))
		});
	}
});

//通知条目的视图
var NoticeGroupView = Backbone.View.extend({
	tagName: "div",
	className: "group",
	template: _.template(
		'<div class="header row ui-widget-header">'
			+'<div class="icon ui-icon <%- iconClass %>"></div>'
			+'<div class="label"><span class="title"><%- title %></span> (<span class="count">0</span>)</div>'
			+'<div class="btn toggle ui-icon ui-icon-triangle-1-n" title="点击展开"></div>'
		+'</div>'
		+'<div class="rows"><div class="empty">(无)</div></div>'),
	empty: '<div class="empty">(无)</div>',

	// 绑定DOM事件
	events: {
		"click .header>.label>span": "open",
		"click .header>.btn.toggle": "toggle"
	},

	// 初始化
	initialize: function() {
		this.count = 0;
		this.itemViews = {};
		// 初始化dom结构
		this.render();
	},

	// 渲染
	render: function() {
		if(logger.infoEnabled)logger.info("mg:render");
		this.$el.html(this.template(this.model));
		this.rows = this.$(">.rows");
		this.toggleBtn = this.$(">.header>.btn.toggle");
		this.countEl = this.$(">.header>.label>.count");
		return this;
	},

	// 打开更多视图
	open: function() {
		var g = this.model;
		bc.page.newWin({
			name: g.title,
			mid: g.mid,
			url: g.url
		});
	},

	// 关闭分组
	close: function() {
		alert("TODO: group.close");
	},

	// 在组中添加一项
	add: function(notice) {
		if(this.rows.is(":has(.empty)")){
			this.rows.empty();
		}
	    var view = new NoticeView({model: notice});
	    this.rows.append(view.render().el);
	    this.itemViews[notice.cid] = view;
	    this.count++;
	    this.countEl.text(this.count);
	},

	// 在组中移除一项
	removeItem: function(notice) {
		if(logger.infoEnabled)logger.info("group:removeItem");
	    this.itemViews[notice.cid].remove();
	    delete this.itemViews[notice.cid];
		if(this.rows.is(":empty"))
			this.rows.append(this.empty);
	    this.count--;
	    this.countEl.text(this.count);
	},

 	// 搜索
 	doSearch: function(text) {
		if(logger.infoEnabled)logger.info("mg:doSearch:" + this.$el.find(">.header>.label>span").text() + ":" + text);
 	   	
		var view,model;
		for(var key in this.itemViews){
			view = this.itemViews[key];
			model = view.model;
			//if(logger.infoEnabled)logger.info("id=" + model.id + "," + model.get("title"));
			if(model.get("title").indexOf(text) != -1 
				|| (model.has("content") && model.get("content").indexOf(text) != -1)){
				if(logger.infoEnabled)logger.info("match:title=" + model.get("title"));
				view.$el.show();
			}else{
				view.$el.hide();
			}
		}
 	   	return false;
 	},

	// 折叠或展开
	toggle: function() {
		this.$el.toggleClass("collapse");
		var isCollapse = this.$el.hasClass("collapse");
		if(isCollapse){
			this.toggleBtn.toggleClass("ui-icon-triangle-1-s",true)
				.toggleClass("ui-icon-triangle-1-n",false)
				.attr("title","点击展开");
		}else{
			this.toggleBtn.toggleClass("ui-icon-triangle-1-n",true)
				.toggleClass("ui-icon-triangle-1-s",false)
				.attr("title","点击折叠");
		}
		return false;
	}
});

// 预定义的分组配置
var GroupTypes={
	email: {
		mid: "myEmails",
		title: "邮件",
		url: "bc/emailTos/paging",
		itemUrl: "bc/email/open",
		itemData: "openType=2&id={0}",
		iconClass: "ui-icon-mail-closed",
		itemIconClass: "ui-icon-mail-closed",
		order: 3
	},
	todo: {
		mid: "myTodos",
		title: "个人待办",
		url: "bc-workflow/todo/personals/list",			// 视图url
		itemUrl: "bc-workflow/workspace/open",	// 表单url
		itemData: "id={0}",
		iconClass: "ui-icon-calendar",
		itemIconClass: "ui-icon-check",
		order: 1
	},
	groupTodo: {
		mid: "myGroupTodos",
		title: "岗位待办",
		url: "bc-workflow/todo/personals/list",
		itemUrl: "bc-workflow/workspace/open",
		itemData: "id={0}",
		iconClass: "ui-icon-calendar",
		itemIconClass: "ui-icon-person",
		order: 2
	}
};

// 待办边栏视图
var SidebarView = Backbone.View.extend({
	el: $("#right"),
	groupViews: {},

	// 界面模版
	template: _.template(
		 '<div class="header ui-widget-header">'
			+'<div class="btns">'
//				+'<div class="btn toggle">'
//					+'<span class="ui-icon ui-icon-transferthick-e-w"></span>'
//				+'</div>'
				+'<div class="btn refresh" title="刷新">'
					+'<span class="ui-icon ui-icon-refresh"></span>'
				+'</div>'
				+'<div class="btn toggle" title="展开|折叠信息">'
					+'<span class="ui-icon ui-icon-carat-2-n-s"></span>'
				+'</div>'
			+'</div>'
			+'<div class="label">通知中心</div>'
			+'<div class="search">'
				+'<a href="#" class="ui-icon ui-icon-search" title="点击执行查询"></a>'
				+'<input type="text" class="ui-widget-content" placeholder="搜索">'
			+'</div>'
		+'</div>'
		+'<div class="groups ui-widget-content"></div>'),

	// 定义事件委托
	events: {
		"click .header>.btns>.btn.refresh": "refresh",
		"click .header>.btns>.btn.toggle": "toggle",
		"keypress .header>.search>input": "doSearchOnEnter",
		"click .header>.search>a": "doSearch"
	},

	// 初始化
	initialize: function() {
		var _this = this;
		// 初始化dom结构
		this.render();
		
		// 监听模块列表的事件
		this.listenTo(notices, 'add', this.add);
		this.listenTo(notices, 'reset', this.reset);
		this.listenTo(notices, 'remove', this.removeItem);
		
		// 每间隔一段时间更新相对时间的值
		window.setInterval(function(){
			if(_this.refreshing) return;
			logger.info("sidebar:updateMoment");
			notices.each(function(m){
				m.set({"time4moment": moment(m.get("time"), "YYYY-MM-DD HH:mm:ss").fromNow()});
			});
		},60000);
		
		this.refresh();
		// 每间隔一段时间重新获取数据
		window.setInterval(function(){
			_this.refresh();
		},300000);
	},

 	// 渲染
 	render: function() {
		if(logger.infoEnabled)logger.info("sidebar:render");
		this.$el.toggleClass("sidebar",true).html(this.template({}));
		
		// 缓存一些内部的dom对象
		this.input = this.$(">.header>.search>input");
		this.groups = this.$(">.groups");
		
		// 生成空的分组
		for(var key in GroupTypes){
		    var groupView = new NoticeGroupView({
		    	model: GroupTypes[key]
		    });
		    this.groupViews[key] = groupView;
		    this.groups.append(groupView.el);
		}

		return this;
	},

 	// 配置通知中心
 	config: function () {
 		alert("TODO: config");
 	},

 	// 回车后搜索
 	doSearchOnEnter: function(e) {
 	   	if (e.keyCode != 13) return;
 	   	this.doSearch();
 	   	return false;
 	},

 	// 搜索
 	doSearch: function() {
		if(logger.infoEnabled)logger.info("sidebar:doSearch:" + this.input.val());
 	   	
		for(var key in this.groupViews){
			this.groupViews[key].doSearch(this.input.val());
		}
 	   	return false;
 	},

	// 在组中添加一项
	add: function(notice) {
		if(logger.infoEnabled)logger.info("sidebar:add");
		var type = notice.get("type");
		if(!this.groupViews[type]){
			// 创建分组
		    var groupView = new NoticeGroupView({
		    	model: GroupTypes[type]
		    });
		    this.groupViews[type] = groupView;
		    this.groups.append(groupView.el);
		}
		
		// 添加信息条目
		this.groupViews[type].add(notice);
	},
	
	// 在组中移除1项
	removeItem: function(model) {
		if(logger.infoEnabled)logger.info("sidebar:removeItem=" + model.get("type"));
		this.groupViews[model.get("type")].removeItem(model);
	},

	// 在组中重新添加全部
	reset: function(models) {
		if(logger.infoEnabled)logger.info("sidebar:reset");
		this.groups.empty();
		this.groupViews = {};
	},

	// 刷新
	refresh: function(callback) {
		var _this = this;
		logger.info("sidebar:refreshing=" + this.refreshing);
		//this.input.val("");
		if(this.refreshing) return;
		this.refreshing = true;
		
		// 清空数据
		notices.each(function(model){
			notices.remove(model);
		});

		// 加载数据
		logger.info("sidebar:refresh-start");
		notices.fetch({
			reset: false,
			success:function(){
				logger.info("sidebar:refresh-success");
				_this.refreshing = false;
				_this.doSearch();
			},
			error: function(){
				logger.info("sidebar:refresh-error");
				_this.refreshing = false;
			}
		});
	},

	// 折叠或展开
	toggle: function() {
		for(var key in this.groupViews){
			this.groupViews[key].toggle();
		}
		return false;
	}
});

// 创建边栏的实例
bc.sidebar = new SidebarView;
})(jQuery);