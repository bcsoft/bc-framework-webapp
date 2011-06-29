/**
 * 系统浏览器支持提示工具
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-29
 * @depend jquery-ui,bc.core
 */
(function($) {

bc.browser = {
	/**下载指定的浏览器安装文件
	 * @param puid 附件的puid 
	 */
	init: function(puid) {
		var browser = jQuery.browser.version;
		var lowerVersion = false;
		var unSupportHtml5 = false;
		if(browser.safari || browser.mozilla || browser.opera){
			//对现代化的浏览器不做任何提示
			//Chrome、Safari、Firefox、Opera
		}else if(browser.msie){
			lowerVersion = browser.version < 8;
			unSupportHtml5 = browser.version < 9;
		}
		if(lowerVersion || unSupportHtml5){
			bc.msg.slide("你的浏览器" + (lowerVersion ? "版本太低" : "") + (unSupportHtml5 ? "、不支持html5！" : "！"));
			//弹出窗口让用户下载浏览器
			bc.page.newWin({
				url: bc.root + "/bc/attach/browser",
				mid: "attach.browser",
				name: "下载系统支持的浏览器"
			});
		}
	},
	/**下载指定的浏览器安装文件
	 * @param puid 附件的puid 
	 */
	download: function(puid) {
		window.open(bc.root + "/bc/attach/download?puid=" + puid, "blank");
	}
};
	
bc.browser.init();

//事件处理
$("ul.browsers>li.browser").live("mouseover", function() {
	$(this).addClass("ui-state-hover");
}).live("mouseout", function() {
	$(this).removeClass("ui-state-hover");
}).live("click", function() {
	bc.browser.download($(this).attr("data-puid"));
});

})(jQuery);