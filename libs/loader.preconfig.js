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
	jquery: '/ui-libs/jquery/1.7.2/jquery.min.js?ts=0',
	jqueryui: '/ui-libs/jquery-ui/1.9pre/ui/jquery-ui.js?ts=0',
	jqueryui_i18n: '/ui-libs/jquery-ui/1.9pre/ui/i18n/jquery.ui.datepicker-zh-CN.js?ts=0',
	redactor: '/ui-libs/jquery/plugins/redactor/8.1.1/redactor.min.js?ts=0',
	redactor_cn: '/ui-libs/jquery/plugins/redactor/8.1.1/lang/zh_cn.js?ts=0',
	redactor_css: '/ui-libs/jquery/plugins/redactor/8.1.1/redactor.css?ts=0',
	redactor_plugins_fullscreen: '/ui-libs/jquery/plugins/redactor/8.1.1/plugins/fullscreen/fullscreen.js?ts=0',
	editor: '/ui-libs/xheditor/1.1.7/xheditor-zh-cn.min.js?ts=0',
	xheditor: '/ui-libs/xheditor/1.1.7/xheditor-zh-cn.min.js?ts=0',
	highcharts: '/ui-libs/highcharts/2.1.8/highcharts.min.js?ts=0',
	highcharts_exporting: '/ui-libs/highcharts/2.1.8/modules/exporting.min.js?ts=0',
	quicksand: '/ui-libs/jquery/plugins/quicksand/1.2.2/jquery.quicksand.js?ts=0',
    jcrop: '/ui-libs/jcrop/0.9.12/jquery.Jcrop.min.js?ts=0',
    jcrop_css: '/ui-libs/jcrop/0.9.12/themes/default/jquery.Jcrop.css?ts=0',
	
	/** 平台 */
	bc_identity: '/bc/identity/identity.js',
	bc_photo: '/bc/photo/photo.js'
};

bc.loader.preconfig.css = {
	jqueryui: '/ui-libs/jquery-ui/1.9pre/themes/base/jquery-ui.css?ts=0'
};