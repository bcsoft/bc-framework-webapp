/**
 * 自动处理溢出的tabs
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-09-17
 */
(function($, undefined) {

	$.widget("ui.bctabs", {
		version : "1.0",
		options : {
			offsetNext : 0,
			offsetPrev : 0,
			tabsScroll: true,
			animateMethod : 'slideH',// 动画的方法
			contentEasing : 'easeInOutExpo',// 动画的擦出方法，参考easing插件可用的方法
			direction : 'horizontal',// tabs的布局方向
			tabActiveClass: "ui-state-active",
			totalHeight : ''// tabs的总高度，默认根据内容的高度自动扩展
		},

		_create : function() {
			var _this = this;
			
			//标记水平垂直的参数
			if (this.options.direction == 'horizontal') {
				this.options.val={
					wh: 'outerWidth',
					lt: 'left',
					marginLT: 'marginLeft'
				};
			} else {
				this.options.val={
					wh: 'outerHeight',
					lt: 'top',
					marginLT: 'marginTop'
				};
			}
			
			//向前向后按钮点击事件
			this.element.delegate("div.prev,div.next", "click", function() {
				var $this = $(this);
				if($this.hasClass("next") && !$this.children("a").hasClass("ui-state-disabled")){
					_this.next();
				}else if($this.hasClass("prev") && !$this.children("a").hasClass("ui-state-disabled")){
					_this.prev();
				}
				return false;
			});
			
			//向前向后按钮的显示
			this._initPrevNext();
			
			//页签的点击事件
			this.element.delegate("ul.tabs>li.tab>a", "click", function() {
				logger.info("tabs.click:id=" + _this.element.attr("id"));
				_this.load($(this).parent().index());
				return false;
			});
			
			//处理当前页签的显示
			var $activeTab = this.element.find("ul.tabs>li.tab.active");
			if(!$activeTab.size())
				this.load(0,true);
			
			//处理鼠标的滚轮事件
			if (this.element.find("div.tabsContainer.sliding").size() && this.options.tabsScroll == true && $.fn.mousewheel) {
				this.element.find("ul.tabs").mousewheel(function(event, delta) {
					logger.info("mousewheel:delta=" + delta);
					(delta > 0) ? _this.prev() : _this.next();
					return false;
				});
			}
		},

		_destroy : function() {
			this.element.undelegate().unbind();
		},

		_setOption : function(key, value) {
		},

	    _getIndex: function( index ) {
			if ( typeof index == "string" ) {
				index = this.element.find(".tabs>tab>a[href$=" + index + "]" ).parent().index();
			}
			return index;
		},
		
		/** 初始化前后按钮的显示 */
		_initPrevNext : function() {
			logger.info("tabs:_initPrevNext");
			var $tabs = this.element.find("ul.tabs");
			
			//prev
			if ($tabs.children('li:first').position()[this.options.val.lt] == (0 + this.options.offsetPrev)) {
				this._disablePrev();
			} else {
				this._enablePrev();
			}

			//next
			var $lastElem = $tabs.children('li:last');
			var $slidElem = $tabs.parent();
			if (($lastElem.position()[this.options.val.tl] + $lastElem[this.options.val.wh](true)) <= ($slidElem.width() - this.options.offsetNext)) {
				this._disableNext();
			} else {
				this._enableNext();
			}
		},
		
		/** 启用向后按钮 */
		_enableNext : function() {
			this.element.find("div.next>a.next").toggleClass("ui-state-disabled",false);
		},
		/** 禁用向后按钮 */
		_disableNext : function() {
			this.element.find("div.next>a.next").toggleClass("ui-state-disabled",true);
		},
		/** 启用向前按钮 */
		_enablePrev : function() {
			logger.info("_enablePrev");
			this.element.find("div.prev>a.prev").toggleClass("ui-state-disabled",false);
		},
		/** 禁用向前按钮 */
		_disablePrev : function() {
			this.element.find("div.prev>a.prev").toggleClass("ui-state-disabled",true);
		},
		
		/** 显示tab */
		_showTab : function($tab,$content) {
			logger.info("tabs._showTab");
			//页签
			var $preActiveTab = $tab.siblings(".active");
			$tab.add($preActiveTab).toggleClass("active").end();
			$tab.children("a").add($preActiveTab.children("a")).toggleClass("ui-state-active");
			
			//定位页签
			var $tabs = $tab.parent();
			var cwh = $tabs.parent()[this.options.val.wh](false);
			var mlt = parseInt($tabs.css(this.options.val.marginLT));
			var wh = $tab[this.options.val.wh](true);
			var lt = $tab.position()[this.options.val.lt];
			logger.info("wh=" + wh + ",lt=" + lt + ",cwh=" + cwh + ",mlt=" + mlt);
			if (lt < 0) {
				this.prev();
			}else if((wh + lt) > (cwh - this.options.offsetNext)){
				this.next();
			}
			
			//内容
			$content.add($content.siblings(".active")).toggleClass("active");
		},
		
		/** 加载tab */
		load : function(index,force) {
			index = this._getIndex(index);
			if(force !== true && index == this.element.find("ul.tabs>li.active").index()){
				return this;
			}

			var $tab = this.element.find("ul.tabs>li:eq(" + index + ")" );
			var $a = $tab.children("a");
			
			var url = $a.attr("href");
			logger.info("tabs.load:index=" + index + ",href=" + url);
			if(url.indexOf("#") == 0){
				var $content = this.element.find(">div.contentContainer>" + url);
				if(!$content.size())
					alert("this tab did not config content's div：href=" + url);
				this._showTab($tab,$content);
				return this;
			}
			
			var id = new Date().getTime();
			// 将url作为一个属性记录下来
			$a.attr("data-src",url).attr("href", "#" + id);
			
			//创建内容div，并显示加载动画
			var $contentContainer = this.element.find(">div.contentContainer");
			var $content = $('<div id="'+id+'" class="content">loading...</div>').appendTo($contentContainer);
			
			var _this = this;
			//通过ajax加载页签的内容
			$.get(url,function(html){
				$content.empty().append(html);
				_this._showTab($tab,$content);
			});
			
			return this;
		},

		/** 选中tab */
		select : function(index) {
			index = this._getIndex(index);
			if(index != this.element.find("ul.tabs>li.active").index()){
				this.load(index);
			}
			
			return this;
		},

		/** 显示上一个tab */
		prev : function() {
			var _this = this;
			//如果正在动画中就忽略不处理
			//TODO

			//动画滚动页签
			var $tabs = this.element.find("ul.tabs");
			var $lis = $tabs.children('li');
			var cwh = $tabs.parent()[_this.options.val.wh](false);
			var mlt = parseInt($tabs.css(_this.options.val.marginLT));
			$lis.each(function(index) {
				$li = $(this);
				var wh = $li[_this.options.val.wh](true);
				var lt = $li.position()[_this.options.val.lt];
				logger.info("wh=" + wh + ",lt=" + lt + ",cwh=" + cwh + ",mlt=" + mlt);
				if ((wh + lt) >= 0) {
					var newmlt = lt - mlt - _this.options.offsetPrev;
					logger.info("next:index=" + index + ",newmlt=" + newmlt);
					
					//显示这个页签 
					$tabs.css( _this.options.val.marginLT,-newmlt);
					
					//处理前后按钮的显示
					_this._enableNext();
					if(index == 0){
						_this._disablePrev();
					}
					
					return false;
				}
			});
			
			return this;
		},

		/** 显示下一个tab */
		next : function() {
			var _this = this;
			//如果正在动画中就忽略不处理
			//TODO

			//动画滚动页签
			var $tabs = this.element.find("ul.tabs");
			var $lis = $tabs.children('li');
			var cwh = $tabs.parent()[_this.options.val.wh](false);
			var mlt = parseInt($tabs.css(_this.options.val.marginLT));
			$lis.each(function(index) {
				$li = $(this);
				var wh = $li[_this.options.val.wh](true);
				var lt = $li.position()[_this.options.val.lt];
				logger.info("wh=" + wh + ",lt=" + lt + ",cwh=" + cwh + ",mlt=" + mlt);
				if ((wh + lt) > (cwh - _this.options.offsetNext)) {
					var newmlt = wh + lt - mlt + _this.options.offsetNext - cwh;
					logger.info("next:index=" + index + ",newmlt=" + newmlt);
					
					//显示这个页签 
					$tabs.css( _this.options.val.marginLT,-newmlt);
					
					//处理前后按钮的显示
					_this._enablePrev();
					if(index +1 >= $lis.size()){
						_this._disableNext();
					}
					
					return false;
				}
			});
			
			return this;
		}
	});

})(jQuery);