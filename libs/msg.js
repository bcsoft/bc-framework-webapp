/**
 * 消息框控件
 *
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 * @dep jqueryui-dialog
 */
bc.msg = {
	id:0,
    
    /** 默认的对话框常数定义 */
    DEFAULT_TITLE: "系统提示",
    OK: "确定",
    CANCEL: "取消",
    YES: "是",
    NO: "否",
    WITH: 300,
    MINWIDTH: 150,
    MINHEIGHT: 150,
    MAXWITH: 900,
    MAXHEIGHT:560,
    AUTO: 'auto',
    
    /** 提示框 
     * @param {String || Object} msg 提示信息 || json对象
     * @msg.modal {boolean} 是否背景遮掩
     * @msg.onOk {String} [可选]点击确认按钮的回调函数
     * @msg.icon {String} [可选]显示的图标类型：error,question,info,warning，默认不显示图标
     * @msg.title {String} [可选]标题,默认为bc.msg.DEFAULT_TITLE
     * @msg.width {number} [可选]宽度,默认为bc.msg.WITH
     * @msg.height {number} [可选]高度,默认为bc.msg.AUTO
     * @msg.minWidth {number} [可选]最小宽度,默认为bc.msg.MINWIDTH
     * @msg.minHeight {number} [可选]最小高度,默认为bc.msg.MINHEIGHT
     * @msg.maxWidth {number} [可选]最大宽度,默认为bc.msg.MAXWITH
     * @msg.maxHeight {number} [可选]最大高度,默认为bc.msg.MAXHEIGHT
     * @param {String} onOk [可选]点击确认按钮的回调函数
     * @param {String} title [可选]标题,默认为OZ.Messager.DEFAULT_TITLE
     * @param {String} icon [可选]显示的图标类型：error,question,info,warning，默认不显示图标
     */
    alert: function(msg, title, onOk, icon){
        var option;
        if (typeof msg == 'string') {//第一个参数为字符串则按旧实现方式实现
            option = {msg: msg};
            if(title) option.title = title;
            if(onOk) option.onOk = onOk;
            if(icon) option.icon = icon;
        } else {//第一个参数是对象
            option = msg;
        }

        option = {
            msg: option.msg || null,
            modal: option.modal ? option.modal : true, 
            onOk: option.onOk || null,
            icon: option.icon || null,
            title: option.title || bc.msg.DEFAULT_TITLE,
            width: option.width || bc.msg.WITH,
            height: option.height || bc.msg.AUTO,
            minWidth: option.minWidth || bc.msg.MINWIDTH,
            minHeight: option.minHeight || bc.msg.MINHEIGHT,
            maxWidth: option.maxWidth || bc.msg.MAXWITH,
            maxHeight: option.maxHeight || bc.msg.MAXHEIGHT
        };

        return $('<div data-type="msg" id="msg-' + (bc.msg.id++) + '">' + (option.msg || 'no message.') + '</div>')
            .dialog(option).bind("dialogclose",function(event,ui){
                $(this).dialog("destroy").remove();//彻底删除所有相关的dom元素
                if(typeof option.onOk == "function")
                    option.onOk.call();
            });
    },
    /** 确认框 
     * @param {String} msg 提示信息
     * @param {String} onOk 点击确认|是按钮的回调函数
     * @param {String} onCancel [可选]点击取消|否按钮的回调函数
     * @param {String} title [可选]标题,默认为OZ.Messager.DEFAULT_TITLE
     */
    confirm: function(msg, onOk, onCancel, title){
    	return $('<div data-type="msg" id="msg-' + (bc.msg.id++) + '">' + (msg || 'no message.') + '</div>').dialog({
			modal: true, title: title || bc.msg.DEFAULT_TITLE,
			buttons:[
			    {
			    	text:bc.msg.YES,
			    	click:function(){
			    		if(typeof onOk == "function"){
			    			if(onOk.call() !== false){//不保留窗口
			    				$(this).dialog("destroy").remove();
			    			}
			    		}else{
			    			$(this).dialog("destroy").remove();
			    		}
			    	}
			    },{
			    	text:bc.msg.NO,
			    	click:function(){
			    		$(this).dialog("destroy").remove();
			    		if(typeof onCancel == "function")
			    			onCancel.call();
			    	}
			    }]
		}).bind("dialogclose",function(event,ui){
			$(this).dialog("destroy").remove();//彻底删除所有相关的dom元素
			if(typeof onCancel == "function")
				onCancel.call();
		});
    },
    /** 输入框 
     * @param {String} msg 提示信息
     * @param {String} onOk 点击确认按钮的回调函数
     * @param {String} onCancel [可选]点击取消按钮的回调函数
     * @param {String} value [可选]文本输入框默认显示的内容
     * @param {Boolean} multiline [可选]是否为多行文本输入，默认为false(单行文本输入)
     * @param {String} title [可选]标题,默认为OZ.Messager.DEFAULT_TITLE
     * @param {Boolean} isPassword [可选]是否是密码输入框，默认为false(文本输入框)，只有在multiline为非true的情况下有效
     * @param {Boolean} showIcon [可选]是否显示图标，默认为false(不显示)
     */
    prompt: function(msg, onOk, onCancel, value, multiline, title, isPassword, showIcon){
    	return $.messager.prompt(title||OZ.Messager.DEFAULT_TITLE, msg, 
    		function(value,isOk,oldValue){
	    		if (isOk){
	    			if(typeof onOk == "function") onOk.call(this,value,oldValue);
	    		}else{
	    			if(typeof onCancel == "function") onCancel.call(this,value,oldValue);
	    		}
    		},
    		value, multiline, isPassword, showIcon
    	);
    },
    /** 信息提示框：提示框icon=info的简化使用版 */
    info: function(msg, title, onOk){
    	return bc.msg.alert(msg, title, onOk, "info");
    },
    /** 信息警告框：提示框icon=warning的简化使用版 */
    warn: function(msg, title, onOk){
    	alert("TODO:warn");
    },
    /** 错误提示框：提示框icon=error的简化使用版 */
    error: function(msg, title, onOk){
    	alert("TODO:error");
    },
    /** 信息提问框：提示框icon=question的简化使用版 */
    question: function(msg, title, onOk){
    	alert("TODO:question");
    },
    /** 自动提醒框：显示在页面右下角并可以自动隐藏的消息提示框 */
    show: function(config){
    	alert("TODO:show");
    },
    /** 自动提醒框的slide简化使用版:滑出滑入效果 */
    slide: function(msg,timeout,width,height){
//    	//构造容器
//    	var me = $('<div class="bc-slide ui-widget ui-state-highlight ui-corner-all"><div class="content"></div></div>');
//    	me.find(".content").append(msg || 'undefined message!');
//    	//显示
//    	me.hide().appendTo("body").slideDown("fast",function(){
//			//自动隐藏
//			setTimeout(function(){
//		    	me.slideUp("slow",function(){
//		    		me.unbind().remove();
//				});
//			},timeout || 2000);
//		});
    	
		$.pnotify({
			//pnotify_title: '系统提示',
			pnotify_text: msg,
			pnotify_animation: 'slide'//show,bounce,fade,slide,fade
			,pnotify_addclass: "stack-bottomright"
			,pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
		});
    },
    /** 自动提醒框的fade简化使用版：渐渐显示消失效果 */
    fade: function(msg,timeout,width,height){
    	alert("TODO");
    },
    /** 自动提醒框的show简化使用版：从角落飞出飞入效果 */
    fly: function(msg,timeout,width,height){
    	alert("TODO");
    }
};
$.pnotify.defaults.pnotify_delay = 2000;
$.pnotify.defaults.pnotify_history=false;