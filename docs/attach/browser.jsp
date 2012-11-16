<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="browser.title"/>' data-type='form' class="bc-page"
	data-js='<s:url value="/bc/libs/themes/default/browser.css" />' 
	data-option='{"width":600,"minWidth":250,"minHeight":250,"height":400,"modal":true,minimizable:true,maximizable:false}' style="overflow-y:auto;">
	<s:form name="browserForm" theme="simple">
		<div class="browsersTitle">现代化的浏览器(支持Html5)：</div>
		<ul class="browsers ui-widget-content">
			<s:iterator value="browsers4html5">
			<li class="browser ui-corner-all ui-state-default" data-puid='<s:property value="puid"/>' title="点击下载">
				<span class='browser-icon <s:property value="icon"/>'></span>
				<span class="text">(<s:property value="sizeInfo"/>) <s:property value="subject"/></span>
			</li>
			</s:iterator>
			<!-- 
			<li class="browser ui-corner-all ui-state-default" data-puid="chrome15.0.874.121" title="点击下载">
				<span class="browser-icon chrome12"></span>
				<span class="text">(24MB) 谷歌浏览器Chrome15.0</span>
			</li>
			<li class="browser ui-corner-all ui-state-default" data-puid="firefox8.0.1" title="点击下载">
				<span class="browser-icon firefox5"></span>
				<span class="text">(16MB) 火狐浏览器Firefox8.0</span>
			</li>
			<li class="browser ui-corner-all ui-state-default" data-puid="safari5.1" title="点击下载">
				<span class="browser-icon safari5"></span>
				<span class="text">(36MB) 苹果浏览器Safari5.1</span>
			</li>
			<li class="browser ui-corner-all ui-state-default" data-puid="opera11.60" title="点击下载">
				<span class="browser-icon opera11"></span>
				<span class="text">(8MB) 挪威浏览器Opera11.60</span>
			</li>
			<li class="browser ui-corner-all ui-state-default" data-puid="ie9.0" title="点击下载">
				<span class="browser-icon ie9"></span>
				<span class="text">(18MB) 微软浏览器IE9.0</span>
			</li>
			 -->
		</ul>
		<div class="browsersTitle">过时的浏览器(不支持Html5)：</div>
		<ul class="browsers ui-widget-content">
			<s:iterator value="browsers4old">
			<li class="browser ui-corner-all ui-state-default" data-puid='<s:property value="puid"/>' title="点击下载">
				<span class='browser-icon <s:property value="icon"/>'></span>
				<span class="text">(<s:property value="sizeInfo"/>) <s:property value="subject"/></span>
			</li>
			</s:iterator>
			<!-- 
			<li class="browser ui-corner-all ui-state-default" data-puid="ie8.0" title="点击下载">
				<span class="browser-icon ie8"></span>
				<span class="text">(16MB) 微软浏览器IE8.0</span>
			</li>
			 -->
		</ul>
	</s:form>
</div>