/**
 * 聊天
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-11-11
 */
(function($, undefined) {
bc.chat = {
	init: function(){
		//开启WebSocket
		if (!window.WebSocket && window.MozWebSocket)
			window.WebSocket = window.MozWebSocket;
		if (window.WebSocket){
			bc.ws = new WebSocket(bc.wsurl + "?sid=" + bc.sid + "&userId=" + userId + "&userName=" + encodeURIComponent(userName), "chat");
			bc.ws.onopen = function(){
				logger.info("WebSocket打开了！");
			};
			bc.ws.onmessage =function(e){
				logger.info(e.data);
				var json = eval("(" + e.data + ")");
				var type = json.type;
				if(json.from_sid != bc.sid){
					bc.msg.slide(json.msg);
				}
			};
			bc.ws.onclose =function(){
				alert("WebSocket断开了，要连接请重新登录！");
				bc.ws = null;
			};
			bc.ws.onerror =function(e){
				alert("WebSocket通讯异常，要连接请重新登录！");
				bc.ws = null;
			};
		}else{
			bc.msg.slide("当前浏览器不支持WebSocket，无法使用在线聊天工具！");
		}
	},
	destroy:function(){
		if(bc.ws){
			bc.ws.onopen = null;
			bc.ws.onmessage = null;
			bc.ws.onclose = null;
			bc.ws.onerror = null;
			bc.ws = null;
		}
	}
};
})(jQuery);