<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='ChatDemo' data-type='form' class="bc-page bc-chatdemo"
	data-js='<s:url value="/bc-test/websocket/chat.css" />,<s:url value="/bc-test/websocket/chat.js" />'
	data-initMethod='bc.chatDemo.init' data-option='{"width":600}'>
	<div id='chat'></div>
	<div id='input'>
		<div id='join'>
			Username:&nbsp;<input id='username' type='text' />
			<input id='joinB' class='button' type='submit' name='join' value='Join' />
		</div>
		<div id='joined' class='hidden'>
			Chat:&nbsp;<input id='phrase' type='text' />
			<input id='sendB' class='button' type='submit' name='join' value='Send' />
		</div>
	</div>
	<p>This is a demonstration of the Jetty websocket server.</p>
</div>