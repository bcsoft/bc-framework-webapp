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
			animate:true,//是否使用动画显示页签和其内容
			contentAnimateMethod:"slideH",//内容的动画显示方法
			contentAnimateDuration:600,//内容的动画显示时间
			contentAnimateEasing:"easeInOutExpo",//内容的动画擦除方法
			tabsAnimateDuration:150,//页签的动画显示时间
			tabsAnimateEasing:"",//页签的动画擦除方法
			heightAnimateDuration:150,//内容区高度变化的动画显示时间
			heightAnimateEasing:"easeInOutExpo",//内容区高度变化的动画擦除方法
			minHeight: 80,//内容区的最小高度
			height: 'auto',// tabs的总高度，默认根据内容的高度自动扩展
			loadingText:"正在加载 ......"
		},

		_create : function() {
			var _this = this;
			
			//获取基于dom的配置
			var cfg = this.element.attr("data-cfg");
			if(cfg && cfg.length > 0)
				cfg = eval("(" + cfg + ")");
			jQuery.extend(this.options,cfg);
			
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
			
			//内容容器高度设置
			if(!(this.options.height == "auto")){
				var h = this.options.height - this.element.find(">.tabsContainer").outerHeight(true);
				var $contentContainer = this.element.find(">.contentContainer");
				h = h - ($contentContainer.outerHeight(true) - $contentContainer.height());
				h = Math.max(h,this.options.minHeight);
				$contentContainer.height(h);
			}
			
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

	    _getIndex: function( index ) {
			if ( typeof index == "string" ) {
				index = this.element.find(".tabs>tab>a[href$=" + index + "]" ).parent().index();
			}
			return index;
		},
		
		/** 初始化前后按钮的显示 */
		_initPrevNext : function() {
			logger.info("tabs._initPrevNext");
			var $tabs = this.element.find("ul.tabs");
			var $lastElem = $tabs.children('li:last');
			var $slidElem = $tabs.parent();
			var usePrevNext = ($lastElem.position()[this.options.val.lt] + $lastElem[this.options.val.wh](true)) > ($slidElem.width() - this.options.offsetNext);
			
			//自动创建前后按钮
			logger.info("tabs._initPrevNext:usePrevNext=" + usePrevNext);
			$tabs.children('li').each(function(i){
				logger.info("tabs._initPrevNext:-" + i + "=" + $(this).position().left);
			});
				
			logger.info("tabs._initPrevNext:0=" + ($lastElem.position()[this.options.val.lt] + $lastElem[this.options.val.wh](true)));
			logger.info("tabs._initPrevNext:1=" + ($slidElem.width() - this.options.offsetNext));
			if(usePrevNext && $slidElem.siblings().size() == 0){
				$slidElem.parent().append(''+
					'<div class="prev ui-widget-content">'+
						'<a href="#" class="prev ui-state-default ui-state-disabled"><span class="ui-icon ui-icon-triangle-1-w"></span></a>'+
					'</div>'+
					'<div class="next ui-widget-content">'+
						'<a href="#" class="next ui-state-default"><span class="ui-icon ui-icon-triangle-1-e"></span></a>'+
					'</div>')
				.toggleClass("sliding",true);
			}
			
			//prev
			if ($tabs.children('li:first').position()[this.options.val.lt] == (0 + this.options.offsetPrev)) {
				this._disablePrev();
			} else {
				this._enablePrev();
			}

			//next
			if (!usePrevNext) {
				this._disableNext();
			} else {
				this._enableNext();
			}
		},
		
		/** 启用向后按钮 */
		_enableNext : function() {
			this.element.find("div.next>a.next").toggleClass("ui-state-disabled",false)
			.hover(function(){$(this).addClass("ui-state-hover");},
					function(){$(this).removeClass("ui-state-hover");});
		},
		/** 禁用向后按钮 */
		_disableNext : function() {
			this.element.find("div.next>a.next").toggleClass("ui-state-disabled",true)
			.unbind();
		},
		/** 启用向前按钮 */
		_enablePrev : function() {
			logger.info("_enablePrev");
			this.element.find("div.prev>a.prev").toggleClass("ui-state-disabled",false)
			.hover(function(){$(this).addClass("ui-state-hover");},
					function(){$(this).removeClass("ui-state-hover");});
		},
		/** 禁用向前按钮 */
		_disablePrev : function() {
			this.element.find("div.prev>a.prev").toggleClass("ui-state-disabled",true)
			.unbind();
		},
		
		/** 显示tab */
		_showTab : function($tab,$content) {
			logger.info("tabs._showTab");
			//页签
			var $preActiveTab = $tab.siblings(".active");
			$tab.data("preTabIndex",$preActiveTab.index()).add($preActiveTab).toggleClass("active").end();
			$tab.children("a").add($preActiveTab.children("a")).toggleClass("ui-state-active");
			
			//定位页签
			var $tabs = $tab.parent();
			var lt = $tab.position()[this.options.val.lt];
			if (lt < 0) {
				this.prev();
			}else{
				var cwh = $tabs.parent()[this.options.val.wh](false);
				var mlt = parseInt($tabs.css(this.options.val.marginLT));
				var wh = $tab[this.options.val.wh](true);
				logger.info("wh=" + wh + ",lt=" + lt + ",cwh=" + cwh + ",mlt=" + mlt);
				if((wh + lt) > (cwh - this.options.offsetNext)){
					this.next();
				}
			}
			
			//内容
			if(this.options.animate){
				this["_" + this.options.contentAnimateMethod]($tab,$content);
			}else{
				$content.add($content.siblings(".active")).toggleClass("active");
			}
			
			//抛出show事件
			this._trigger("show",null,{content:$content,tab:$tab});
		},
		
		/** 水平方向动画显示内容 */
		_slideH : function($tab,$content) {
			var _this = this;
			logger.info("tabs._slideH");
			var w = $content.width();
			//上一内容
			$oldContent = this.element.find(">.contentContainer>.content.active");
			var $contentContainer = $oldContent.parent();
			
			//高度动画
			if(this.options.height == "auto"){
				var oldHeight = $oldContent.outerHeight(true);
				var newHeight = $content.outerHeight(true);
				logger.info("tabs._slideH:oldHeight=" + oldHeight + ",newHeight=" + newHeight);
				$contentContainer.stop().css({height: oldHeight})
				.animate({height: newHeight}, this.options.heightAnimateDuration, this.options.heightAnimateEasing);
			}
			
			$contentContainer.children(".content").stop();
			//水平动画
			var rightToLleft = ($tab.index() > $tab.data("preTabIndex"));
			$oldContent.css({
				position: "absolute",
				left: "0px"
			}).animate({
				left: rightToLleft ? -w : w
			}, this.options.contentAnimateDuration, this.options.contentAnimateEasing, function() {
				$oldContent.toggleClass('active', false);
			});
			$content.css({
				position: "absolute",
				left: rightToLleft ? w : -w
			}).toggleClass('active', true).animate({
				left: "0px"
			}, this.options.contentAnimateDuration, this.options.contentAnimateEasing,function(){
				$oldContent.add($content).css({position: "relative"});
				if(_this.options.height == "auto")
					$contentContainer.css({height:"auto"});
				logger.info("tabs._slideH:newHeight=" + $content.height());
			});
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
			//$contentContainer.children(".active").toggleClass("active",false);
			var $content = $('<div id="'+id+'" class="content"><div class="loading">'+this.options.loadingText+'</div></div>')
				.appendTo($contentContainer);
			this._showTab($tab,$content);
			
			var _this = this;
			//通过ajax加载页签的内容
			$.get(url,function(html){
				$content.empty().append(html);
				//抛出加载完毕事件
				_this._trigger("load",null,{content:$content,tab:$tab});
				//_this._showTab($tab,$content);
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
			if (_this.element.find(":animated").length) {
				return false;
			}

			//显示页签
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
					if(_this.options.animate){
						var cfg = {};
						cfg[_this.options.val.marginLT] = -newmlt;
						$tabs.animate(cfg,_this.options.tabsAnimateDuration,_this.options.tabsAnimateEasing);
					}else{
						$tabs.css( _this.options.val.marginLT,-newmlt);
					}
					
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
			if (_this.element.find(":animated").length) {
				return false;
			}

			//显示页签
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
					if(_this.options.animate){
						var cfg = {};
						cfg[_this.options.val.marginLT] = -newmlt;
						$tabs.animate(cfg,_this.options.tabsAnimateDuration,_this.options.tabsAnimateEasing);
					}else{
						$tabs.css( _this.options.val.marginLT,-newmlt);
					}
					
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