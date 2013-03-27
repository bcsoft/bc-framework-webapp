bc.namespace("bc.sidebar");
(function($){

// 通知：id,type,title,content,time
var Notice = Backbone.Model.extend({
	// 初始化
	initialize: function() {
	 	if (!this.get("iconClass")) {
	 		var parentIconClass = GroupTypes[this.get("type")].iconClass;
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
	model: Notice
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
		+'		<div class="label"><%- title %></div>'
		+'		<div class="time"><%- time4moment %></div>'
		+'	</div>'
		+'	<pre class="detail"><%- content %></pre>'),

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
		logger.info("m:render");
		this.$el.html(this.template(this.model.toJSON()));
		this.time = this.$(">.header>.time");
		return this;
	},

	// 自动更新相对时间的显示
	updateTime4moment: function() {
		logger.info("m:updateTime4moment");
		this.time.html(this.model.get("time4moment"));
		return this;
	},

	// 打开链接
	open: function() {
		bc.page.newWin({
			name: this.model.get("title") || "(无)",
			mid: this.model.get("type") + this.model.get("dbid"),
			url: GroupTypes[this.model.get("type")].itemUrl.format(this.model.get("dbid"))
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
			+'<div class="label"><span><%- title %></span></div>'
			+'<div class="btn close ui-icon ui-icon-close"></div>'
		+'</div>'
		+'<div class="rows"></div>'),

	// 绑定DOM事件
	events: {
		"click .header>.label>span": "open",
	},

	// 初始化
	initialize: function() {
		// 初始化dom结构
		this.render();
	},

	// 渲染
	render: function() {
		//alert("NoticeGroupView.render");
		this.$el.html(this.template(this.model));
		this.rows = this.$(">.rows");
		return this;
	},

	// 打开更多视图
	open: function() {
		var g = this.model;
		bc.page.newWin({
			name: g.title,
			mid: g.mid,
			url: g.url,
		});
	},

	// 关闭分组
	close: function() {
		alert("TODO: group.close");
	},

	// 在组中添加一项
	add: function(notice) {
	    var view = new NoticeView({model: notice});
	    this.rows.append(view.render().el);
	}
});

// 预定义的分组配置
var GroupTypes={
	todo: {
		mid: "myTodos",
		title: "个人待办",
		url: "bc-workflow/todo/personals/list",			// 视图url
		itemUrl: "bc-workflow/workspace/open?id={0}",	// 表单url
		iconClass: "ui-icon-calendar",
		order: 1
	},
	groupTodo: {
		mid: "myGroupTodos",
		title: "岗位待办",
		url: "bc-workflow/todo/personals/list",
		itemUrl: "bc-workflow/workspace/open?id={0}",
		iconClass: "ui-icon-calendar",
		order: 2
	},
	email: {
		mid: "myEmails",
		title: "未读邮件",
		url: "bc/email/personals/list",
		itemUrl: "bc/email/open?id={0}",
		iconClass: "ui-icon-mail-closed",
		order: 3
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
				+'<div class="btn config">'
					+'<span class="ui-icon ui-icon-wrench"></span>'
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
		"click >.header>.btns>.btn.config": "config",
		"keypress >.header>.search>input": "searchOnEnter"
	},

	// 初始化
	initialize: function() {
		// 初始化dom结构
		this.render();
		
		// 监听模块列表的事件
		this.listenTo(notices, 'add', this.add);
		this.listenTo(notices, 'reset', this.addAll);

		// 加载数据
		notices.fetch();
	},

 	// 渲染
 	render: function() {
		this.$el.toggleClass("sidebar",true).html(this.template({}));
		
		// 缓存一些内部的dom对象
		this.input = this.$(">.header>.search>input");
		this.groups = this.$(">.groups");

	    //alert("SidebarView.render");
		return this;
	},

 	// 配置通知中心
 	config: function () {
 		alert("TODO: config");
 	},

 	// 回车后搜索
	searchOnEnter: function(e) {
 	   	if (e.keyCode != 13) return;
 	   	if (!this.input.val()) return;
 	   	alert("TODO: searchOnEnter:" + this.input.val());
 	},

	// 在组中添加一项
	add: function(notice) {
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

	// 在组中重新添加全部
	addAll: function() {
		alert("addAll");
		notices.each(this.addOne, this);
	},

	// 刷新
	refresh: function() {
		alert("TODO: sidebar.refresh");
	}
});

// 创建边栏的实例
bc.sidebar = new SidebarView;

// 定时更新时间的相对值
window.setInterval(function(){
	notices.each(function(m){
 		m.set({"time4moment": moment(m.get("time"), "YYYY-MM-DD HH:mm:ss").fromNow()});
	});
}, 60000);

})(jQuery);