/**
 * desktop
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-09-29
 */
(function($, undefined) {

	$.widget("ui.bcdesktop", {
		version : "1.0",
		options : {
			loadingText : "正在加载 ......"
		},

		_create : function() {
			logger.info("ui.bcdesktop._create");
			var self = this;

			// // 获取基于dom的配置
			// var cfg = this.element.attr("data-cfg");
			// if (cfg && cfg.length > 0)
			// cfg = eval("(" + cfg + ")");
			// jQuery.extend(this.options, cfg);

			// 初始化顶部的系统菜单
			logger.info(this.element.find(">#top>#sysmenu").length);
//			this.element.find(">#top>#sysmenu").menubar({
//				position : {
//					within : $("#demo-frame").add(window).first()
//				},
//				select : function(event, ui) {
//					logger.info("Selected: " + ui.item.text());
//				}
//			});

		},

		_destroy : function() {
			this.element.undelegate().unbind();
		}
	});

})(jQuery);