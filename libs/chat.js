/**
 * 聊天
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-11-11
 */
(function($, undefined) {
bc.chat = {
	/**在线用户的html模板*/
	userItemTpl: ["<li class='item' data-sid='{0}' data-user='{1}'>"
	    ,'<img src="' + bc.root + '/bc/image/download?puid={2}&ptype=portrait&ts=' + bc.ts + '"/>'
	    ,'<span class="text">{3}&nbsp;{4} - {5}</span>'
	    ,'</li>'].join(""),
	/**聊天记录的html模板*/
	historyItemTpl: ['<div class="item">'
	    ,'<div class="header {0}">{1}&nbsp;&nbsp;{2}</div>'
	    ,'<div class="content">{3}</div>'
		,'</div>'].join(""),
	/**初始化WebSocket连接*/
	init: function(){
		//开启WebSocket
		if (!window.WebSocket && window.MozWebSocket)
			window.WebSocket = window.MozWebSocket;
		if (window.WebSocket){
			bc.ws = new window.WebSocket(bc.wsurl + "?sid=" + bc.sid + "&userId=" + userId + "&userName=" + userName, "chat");
			bc.ws.onopen = function(){
				logger.info("WebSocket打开了！");
			};
			bc.ws.onmessage =function(e){
				if(logger.debugEnabled)
					logger.debug("onmessage:e=" + $.toJSON(e));
				var json = eval("(" + e.data + ")");
				if(json.type == 2 || json.type == 4){//用户发给用户的信息
					var toSid = (json.type == 4 ? json.origin : json.sid);
					var userName = (json.type == 4 ? "系统" : json.name);
					var className = (json.type == 4 ? "sys" : "remote");
					//寻找聊天对话框
					var $msgDialog = $(".ui-dialog>.ui-dialog-content.chatMsg[data-mid='chat-" + toSid + "']").parent();
					if($msgDialog.size()){//找到对话框
						//插入聊天消息
						bc.chat.addHistory($msgDialog,bc.chat.historyItemTpl.format(className,userName,json.time,json.msg));
						
						//如果对话框当前被隐藏，任务栏搞动一下
						if ($msgDialog.is(":hidden")) {
							bc.page.quickbar.warn("chat-" + toSid);
						}
					}else{
						//用户还没有打开聊天窗口就提示一下
						//TODO 记录这些信息以便在用户打开聊天窗口后自动添加进去
						bc.msg.slide(json.name + "：" + json.msg);
					}
				}else if(json.type == 0 || json.type == 1){//上下线信息
					//寻找在线用户列表对话框
					var $msgDialog = $(".ui-dialog>.ui-dialog-content.online[data-mid='bcq']").parent();
					if($msgDialog.size()){//找到对话框
						if(json.type == 0){//上线
							//添加在线用户
							bc.chat.addUser($msgDialog,json);
						}else if(json.type == 1){//下线
							//删除离线用户
							bc.chat.removeUser($msgDialog,json.sid);
						}
						
						//如果对话框当前被隐藏，提示一下
						if ($msgDialog.is(":hidden")) {
							bc.page.quickbar.warn("bcq");
							bc.msg.slide(json.msg);
						}
					}else{
						bc.msg.slide(json.msg);
						
						 if(json.type == 1 && json.sid == bc.sid){//自己登录超时下线
							 bc.chat.relogin();
						 }
					}					
				}else{// if(json.type == 1){//广播的信息
					bc.msg.slide(json.msg);
				}
			};
			bc.ws.onclose =function(e){
				if(logger.debugEnabled)
					logger.debug("onclose:e=" + $.toJSON(e));
				bc.chat.destroy();
				if(e.wasClean === true && !bc.chat.stopReconnect){
					//WebSocket服务器超时断开
					setTimeout(function(){
						logger.info("重新连接WebSocket中...");
						bc.msg.slide("重新连接WebSocket中...");
						bc.chat.init();//如果网络断开了，会导致死循环
					},1000);
				}else{
					//服务器关闭了
					alert("WebSocket断开了，请重新登录！");
				}
			};
			bc.ws.onerror =function(e){
				if(logger.debugEnabled)
					logger.debug("onerror:e=" + $.toJSON(e));
				alert("WebSocket通讯异常,要连接请重新登录！");
				bc.chat.destroy();
			};
			bc.chat.stopReconnect = false;
		}else{
			bc.msg.slide("当前浏览器不支持WebSocket，无法使用在线聊天工具！");
		}
	},
	stopReconnect: false,
	/**销毁已初始化的WebSocket*/
	destroy:function(){
		if(bc.ws){
			bc.ws.onopen = null;
			bc.ws.onmessage = null;
			bc.ws.onclose = null;
			bc.ws.onerror = null;
			if(bc.ws.close)
				bc.ws.close();
			bc.ws = null;
		}
	},
	/**添加一条聊天记录*/
	addHistory:function($page,item){
		var historyEl = $page.find("div.history").append(item)[0];
		historyEl.scrollTop = historyEl.scrollHeight - historyEl.clientHeight;  
	},
	/**添加在线用户*/
	addUser:function($page,json){
		var user = {
			sid: json.sid,
			uid: json.uid,
			name: json.name,
			ip: json.ip
		};
		$page.find("ul.items").prepend(bc.chat.userItemTpl.format(json.sid,$.toJSON(user),json.uid,json.time,json.name,json.ip));
	},
	/**删除离线用户*/
	removeUser:function($page,sid){
		if(bc.sid == sid){	// 自己登录超时导致的离线，提示用户重新登录
			bc.chat.relogin(sid);
		}else{				// 别人离线
			$page.find("li.item[data-sid='" + sid + "']").remove();
		}
	},
	/** 重新登录 */
	relogin:function(sid){
		bc.page.newWin({
			mid: 'relogin',
			url: bc.root + '/relogin',
			name: '重新登录',
			modal: true,
			afterClose: function(json){
				logger.info("relogin:json=" + $.toJSON(json));
			}
		});
		bc.chat.stopReconnect = true;
		bc.chat.destroy();
	}
};
})(jQuery);