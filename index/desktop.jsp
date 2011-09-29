<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title><s:text name="app.title" /></title>
<script type="text/javascript">var ts = "<s:text name="app.ts" />";</script>
<link rel="stylesheet" type="text/css" href="<s:url value='/ui-libs/jquery-ui/1.9m6/themes/base/jquery-ui.css' />" />	
<link rel="stylesheet" type="text/css" href="<s:url value='/ui-libs/jquery-ui/plugins/timepicker/0.9.6/jquery-ui-timepicker-addon.css' />" />
<link rel="stylesheet" type="text/css" href="<s:url value='/ui-libs/jquery-ui/plugins/menu/3.0/fg.menu.css' />" />
<link rel="stylesheet" type="text/css" href="<s:url value='/ui-libs/jquery-ui/plugins/pnotify/1.0.2/jquery.pnotify.default.css' />" />
<s:if test='%{"true" == getText("app.debug")}'>
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/core.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/tabs.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/desktop.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/shortcuts.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/grid.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/form.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/boxPointer.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/attach.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
</s:if>
<s:else>
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/bc.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
</s:else>
</head>
<body style='font-size:<s:property value="personalConfig.font" />px;' class="bc">
<!-- 整个桌面 -->
<div id="desktop" class="bc-desktop">
	<!-- 系统菜单条 -->
	<div id="top" class="ui-widget-header">
		<ul id="sysmenu" class="menubar">
			<li>
				<a href="#File">File</a>
				<ul>
					<li><a href="#Open...">Open...</a></li>
					<li class="ui-state-disabled">Open recent...</li>
					<li><a href="#Save">Save</a></li>
					<li><a href="#Save as...">Save as...</a></li>
					<li><a href="#Close">Close</a></li>
					<li><a href="#Quit">Quit</a></li>
				</ul>
			</li>
			<li>
				<a href="#Edit">Edit</a>
				<ul>
					<li><a href="#Copy">Copy</a></li>
					<li><a href="#Cut">Cut</a></li>
					<li class="ui-state-disabled">Paste</li>
				</ul>
			</li>
		</ul>
	</div>
	
	<div id="middle">
		<!-- 桌面区域 -->
		<div id="center" class="ui-widget-content bc-shortcuts">
			<s:iterator value="shortcuts" status="stuts">
			<s:if test="resource == null">
				<a class="shortcut" data-m="false"
					data-id='<s:property value="id" />'
					data-standalone='<s:property value="standalone" />'
					data-type='0' 
	 				data-mid='shortcut-<s:property value="id" />'
					data-option='{}' 
					data-order='<s:property value="order" />'
					data-iconClass='<s:property value="iconClass" />'
					data-name='<s:property value="name" />'
					data-url='<s:url value="%{url}" />'>
					<span class='icon <s:property value="iconClass" />'></span>
					<span class="text"><s:property value="name" /></span>
				</a>
	           </s:if>
	           <s:else>
				<a class="shortcut" data-m="true"
					data-id='<s:property value="id" />'
					data-standalone='<s:property value="standalone" />'
					data-type='<s:property value="resource.type" />' 
	 				data-mid='<s:property value="resource.id" />'
					data-option='<s:property value="resource.option" />' 
					data-order='<s:property value="order" />'
					data-iconClass='<s:property value="resource.iconClass" />'
					data-name='<s:property value="resource.name" />'
					data-url='<s:url value="%{resource.url}" />'>
					<span class='icon <s:property value="resource.iconClass" />'></span>
					<span class="text"><s:property value="resource.name" /></span>
				</a>
	           </s:else>
			</s:iterator>
		</div>
		
		<!-- 右边栏 -->
		<div id="right" class="ui-widget-content ui-state-highlight">
	
		</div>
	</div>
	
	<!-- 任务条 -->
	<div id="bottom" class="ui-widget-header">

	</div>
</div>

<script type="text/javascript" src="<s:url value='/ui-libs/jquery/1.6.3/jquery.min.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery/plugins/json/2.2/jquery.json.min.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery-ui/1.9m6/ui/jquery-ui.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery-ui/1.9m6/ui/i18n/jquery.ui.datepicker-zh-CN.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery-ui/plugins/timepicker/0.9.6/jquery-ui-timepicker-addon.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery-ui/plugins/timepicker/0.9.6/i18n/jquery-ui-timepicker-zh-CN.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery-ui/plugins/menu/3.0/fg.menu.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery-ui/plugins/pnotify/1.0.2/jquery.pnotify.min.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery/plugins/easing/1.3/jquery.easing.js' />"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery/plugins/mousewheel/3.0.4/jquery.mousewheel.min.js' />"></script>
<script type="text/javascript">
	bc={};
	bc.root = "<%=request.getContextPath()%>";
	bc.debug = <s:text name="app.debug" />;
	if (bc.debug) {
		bc.ts = new Date().getTime();//首次打开主页的时间
		jQuery(function() {
			logger.toggle();
			//logger.enable("debug");
		});
	}else{
		bc.ts = "<s:text name="app.ts" />";//系统编译发布的时间
	}
	var userCode = '<s:property value="context.user.code" />';
	var userName = '<s:property value="context.user.name" />';
</script>
<s:if test='%{getText("app.debug") == "true"}'>
	<script type="text/javascript" src="<s:url value='/bc/libs/core.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/ajax.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/msg.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/validate.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/page.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/toolbar.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/grid.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/grid.export.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/form.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/boxPointer.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/loader.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/editor.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/attach.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/attach.html5.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/attach.flash.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/image.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/desktop.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<link rel="stylesheet" type="text/css" href="<s:url value='/bc/libs/themes/default/logger.css' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>" />
	<script type="text/javascript" src="<s:url value='/bc/libs/logger.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/debug.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/browser.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript" src="<s:url value='/bc/libs/tabs.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
</s:if>
<s:else>
	<script type="text/javascript" src="<s:url value='/bc/libs/bc.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
	<script type="text/javascript">
	if(!window['logger']){
		/** JavaScript日志组件的幻象，实际的见logger.js */
		window['logger'] = {
			debugEnabled:false,infoEnabled:false,warnEnabled:false,profileEnabled:false,
			clear:$.noop,debug:$.noop,info:$.noop,warn:$.noop,error:$.noop,
			profile:$.noop,enable:$.noop,disabled:$.noop,show:$.noop,test:true
		};
	}
	</script>
</s:else>
<script type="text/javascript">
jQuery(function() {
	$("#desktop").bcdesktop();
});
</script>
</body>
</html>