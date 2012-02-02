/**
 * 预定义的JS、CSS文件
 *
 * @author rongjihuang@gmail.com
 * @date 2012-02-01
 * @dep bc.loader
 */

bc.loader.preconfig = {};

/** 在js、css路径后添加ts=0可以避免loader组件再在其后添加系统的时间戳 */
bc.loader.preconfig.js = {
	/** 开源组件 */
	jquery: '/ui-libs/jquery/1.7/jquery.min.js?ts=0',
	jqueryui: '/ui-libs/jquery-ui/1.9pre/ui/jquery-ui.js?ts=0',
	jqueryui_i18n: '/ui-libs/jquery-ui/1.9pre/ui/i18n/jquery.ui.datepicker-zh-CN.js?ts=0',
	editor: '/ui-libs/xheditor/1.1.7/xheditor-zh-cn.min.js?ts=0',
	xheditor: '/ui-libs/xheditor/1.1.7/xheditor-zh-cn.min.js?ts=0',
	highcharts: '/ui-libs/highcharts/2.1.8/highcharts.min.js?ts=0',
	highcharts_exporting: '/ui-libs/highcharts/2.1.8/modules/exporting.min.js?ts=0',
	
	/** 平台 */
	bc_identity: '/bc/identity/identity.js'
};

bc.loader.preconfig.css = {
	jqueryui: '/ui-libs/jquery-ui/1.9pre/themes/base/jquery-ui.css?ts=0',
};