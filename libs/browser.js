/**
 * 系统浏览器支持提示工具
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-29
 * @depend jquery-ui,bc.core
 */
(function($) {
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
			url: bc.root + "/bc/browser/list",
			mid: "browser.list",
			name: "下载系统支持的浏览器"
		});
	}
})(jQuery);