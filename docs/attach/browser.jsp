<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="browser.title"/>' data-type='form' class="bc-page"
	data-js='<s:url value="/bc/libs/themes/default/browser.css" />' 
	data-option='{"width":600,"minWidth":250,"minHeight":250,"modal":true}' style="overflow-y:auto;">
	<s:form name="browserForm" theme="simple">
		<div class="browsersTitle">支持Html5的浏览器：</div>
		<ul class="browsers ui-widget-content">
			<li class="browser ui-corner-all ui-state-default" data-puid="chrome14.0.835.186" title="点击下载">
				<span class="browser-icon chrome12"></span>
				<span class="text">(24MB) 谷歌浏览器Chrome15.0</span>
			</li>
			<li class="browser ui-corner-all ui-state-default" data-puid="firefox7.0" title="点击下载">
				<span class="browser-icon firefox5"></span>
				<span class="text">(16MB) 火狐浏览器Firefox8.0</span>
			</li>
			<li class="browser ui-corner-all ui-state-default" data-puid="safari5.1" title="点击下载">
				<span class="browser-icon safari5"></span>
				<span class="text">(36MB) 苹果浏览器Safari5.1</span>
			</li>
			<li class="browser ui-corner-all ui-state-default" data-puid="opera11.50" title="点击下载">
				<span class="browser-icon opera11"></span>
				<span class="text">(8MB) 挪威浏览器Opera11.60</span>
			</li>
			<li class="browser ui-corner-all ui-state-default" data-puid="ie9.0" title="点击下载">
				<span class="browser-icon ie9"></span>
				<span class="text">(18MB) 微软浏览器IE9.0</span>
			</li>
		</ul>
		<div class="browsersTitle">其他浏览器：</div>
		<ul class="browsers ui-widget-content">
			<li class="browser ui-corner-all ui-state-default" data-puid="ie8.0" title="点击下载">
				<span class="browser-icon ie8"></span>
				<span class="text">(16MB) 微软浏览器IE8.0</span>
			</li>
		</ul>
	</s:form>
</div>