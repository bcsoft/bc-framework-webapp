bc.namespace("bc.sidebar");
(function($){

// 通知：id,type,title,content,time
var Notice = Backbone.Model.extend({
	// 默认属性
	defaults: function() {
 		return {
	 		title: "(空)",
	 		iconClass: "ui-icon-radio-on"
		};
	},

	// 初始化
	initialize: function() {
 		// 如果没有就添加默认的标题
	 	if (!this.get("title")) {
	 		this.set({"title": this.defaults().title});
		}
	 	if (!this.get("iconClass")) {
	 		this.set({"iconClass": this.defaults().iconClass});
		}
	}
});

// 通知列表
var NoticeList = Backbone.Collection.extend({
	// 获取数据的URl
	url: "sidebar",

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
		"click .row": "open"
	},

	// 初始化
	initialize: function() {
		// 监听模块的事件
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	// 渲染
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	// 打开链接
	open: function() {
		alert("open:id=" + this.model.id);
	}
});

//通知条目的视图
var NoticeGroupView = Backbone.View.extend({
	tagName: "div",
	className: "group",
	type: "none",
	template: _.template(
		'<div class="header row ui-widget-header">'
			+'<div class="icon ui-icon <%- iconClass %>"></div>'
			+'<div class="label"><span><%- title %></span></div>'
			+'<div class="btn close ui-icon ui-icon-close"></div>'
		+'</div>'
		+'<div class="rows"></div>'),

	// 绑定DOM事件
	events: {
		"click >.header>.label>span": "open",
		"click >.header>.btn.close": "close"
	},

	// 初始化
	initialize: function() {
	},

	// 渲染
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	// 打开更多视图
	open: function() {
		alert("TODO: group.type=" + this.type);
	},

	// 关闭分组
	close: function() {
		alert("TODO: group.close");
	},

	// 在组中添加一项
	add: function(notice) {
	    var view = new NoticeView({model: notice});
	    this.$el.append(view.render().el);
	}
});

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
		// 监听模块列表的事件
		this.listenTo(notices, 'add', this.addOne);
		this.listenTo(notices, 'reset', this.addAll);
		this.listenTo(notices, 'all', this.render);

		// 加载数据
		notices.fetch();
	},

 	// 渲染
 	render: function() {
		this.$el.toggleClass("sidebar",true).html(this.template({}));
		
		// 缓存一些内部的dom对象
		this.input = this.$(">.header>.search>input");
		this.groups = this.$(">.groups");

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
		if(!groupViews[notice.type]){
			// 创建分组
		    var view = new NoticeGroupView;
		    this.$el.append(view.render().el);
		    groupViews[notice.type] = view;
		}
		groupViews[notice.type].add(notice);
	},

	// 在组中重新添加全部
	addAll: function() {
		notices.each(this.addOne, this);
	},

	// 刷新
	refresh: function() {
		alert("TODO: sidebar.refresh");
	}
});

// 创建边栏的实例
bc.sidebar = new SidebarView;
})(jQuery);