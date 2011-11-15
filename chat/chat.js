bc.chatDemo = {
	init : function() {
		var $form = $(this);
		if (!window.WebSocket && window.MozWebSocket)
			window.WebSocket = window.MozWebSocket;
		if (!window.WebSocket)
			alert("WebSocket not supported by this browser");

		function getKeyCode(ev) {
			if (window.event)
				return window.event.keyCode;
			return ev.keyCode;
		}

		var room = {
			join : function(name) {
				this._username = name;
				//var location = document.location.toString().replace('http://',
				//		'ws://').replace('https://', 'wss://');
				var location = bc.wsurl;//"ws://localhost:8080/ws/";
				this._ws = new WebSocket(location, "chat");
				this._ws.onopen = this._onopen;
				this._ws.onmessage = this._onmessage;
				this._ws.onclose = this._onclose;
			},

			_onopen : function() {
				$form.find('#join').hide();
				$form.find('#joined').show();
				$form.find('#phrase').focus();
				//room._send(room._username, 'has joined!');
			},

			_send : function(user, message) {
				user = user.replace(':', '_');
				if (this._ws){
					if ("close" == message){
						this._ws.send('{type:"close"}');
					}else{
						this._ws.send('{type:"send",msg:"' + user + ':' + message + '"}');
					}
				}
			},

			chat : function(text) {
				if (text != null && text.length > 0)
					room._send(room._username, text);
			},

			_onmessage : function(m) {
				if (m.data) {
					var c = m.data.indexOf(':');
					var from = m.data.substring(0, c).replace('<', '&lt;')
							.replace('>', '&gt;');
					var text = m.data.substring(c + 1).replace('<', '&lt;')
							.replace('>', '&gt;');

					var chat = $form.find('#chat')[0];
					var spanFrom = document.createElement('span');
					spanFrom.className = 'from';
					spanFrom.innerHTML = from + ':&nbsp;';
					var spanText = document.createElement('span');
					spanText.className = 'text';
					spanText.innerHTML = text;
					var lineBreak = document.createElement('br');
					chat.appendChild(spanFrom);
					chat.appendChild(spanText);
					chat.appendChild(lineBreak);
					chat.scrollTop = chat.scrollHeight - chat.clientHeight;
				}
			},

			_onclose : function(m) {
				this._ws = null;
				$form.find('#join').show();
				$form.find('#joined').hide();
				$form.find('#username').focus();
				$form.find('#chat').html('');
			}
		};
		
		$form.find('#username').attr('autocomplete','OFF');
		$form.find('#username').keyup(function(ev) { 
			var keyc=getKeyCode(ev); 
			if (keyc==13 || keyc==10) { 
				room.join($form.find('#username').val()); 
				return false; 
			} 
			return true; 
		});        

		$form.find('#joinB').click(function(event) {
			room.join($form.find('#username').val());
			return false;
		});
		$form.find('#phrase').attr('autocomplete', 'OFF');
		$form.find('#phrase').keyup(function(ev) {
			var keyc = getKeyCode(ev);
			if (keyc == 13 || keyc == 10) {
				room.chat($form.find('#phrase').val());
				$form.find('#phrase').val('');
				return false;
			}
			return true;
		});
		$form.find('#sendB').click(function(event) {
			room.chat($form.find('#phrase').val());
			$form.find('#phrase').val('');
			return false;
		});
		
		$form.dialog().bind("dialogclose",function(){
			logger.info("chat:dialogclose");
		})
	}
};