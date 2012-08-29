/**
 * 核心处理函数集
 *
 * @author rongjihuang@gmail.com
 * @date 2011-04-11
 * @dep jquery
 */

if(!window['bc'])window['bc']={};

/**
 * 创建指定名称的命名空间,多个命名空间间以参数的形式用逗号隔开
 * @param {String} namespace1
 * @param {String} namespace2
 * @param {String} etc
 */
bc.namespace = function(){
    var a=arguments, o=null, i, j, d, rt;
    for (i=0; i<a.length; ++i) {
        d=a[i].split(".");
        rt = d[0];
        eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
        for (j=1; j<d.length; ++j) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }
};

/**
 * 字符串格式化处理函数
 * 使用方式：
 * 1) var t="({0}),FF{1}".format("value0","value1") -->t=(value0),FFvalue1
 * 2) var t=String.format("({0}),FF{1}","value0","value1") -->t=(value0),FFvalue1
 */
String.format=function(format){
	var args = Array.prototype.slice.call(arguments, 1);
	return (format+"").replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};
String.prototype.format=function(){
    var args = arguments;
    return (this+"").replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};

/**
 * 日期格式化处理函数
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * 例子： 
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 * (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
 */
Date.format=function(_date){
	var args = Array.prototype.slice.call(arguments, 1);
	return _date.format.apply(_date,args);
};
Date.prototype.format = function(format){ 
  var o = {
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(),    //day 
    "h+" : this.getHours(),   //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter 
    "S" : this.getMilliseconds() //millisecond 
  } 
  if(/(y+)/.test(format)) 
	  format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)
	  if(new RegExp("("+ k +")").test(format)) 
		  format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
  return format; 
}
/** 返回指定日期类型字符串(以yyyy开头)添加指定年度后的字符串 */
Date.addYear=function(_date,num){
	if(typeof _date == "string" && _date.length > 4){
		return (parseInt(_date.substr(0,4)) + num) + _date.substr(4);
	}else{
		return _date;
	}
};

/** 获取新的唯一id值: var newId = bc.nextId();*/
bc.id=0;
bc.nextId=function(prefix){return (prefix ? prefix : "bc") + (bc.id++)};

/** 获取使用符号"."连接的嵌套对象,如a.b.c返回window[a][b][c]或eval(a.b.c) */
bc.getNested=function(nestedName){
	try{
		if(nestedName){
			var names = nestedName.split(".");
			var result = window[names[0]];
			for(var i=1;i<names.length;i++)
				result = result[names[i]];
			return result;
		}else{
			return null;
		}
	}catch(e){
		logger.error("error get:" + nestedName + ";e=" + e);
		return null;
	}
};
/** 得到字符串的真实长度（双字节换算为两个单字节）*/
bc.getStringActualLen=function(sourceString){  
    return sourceString.replace(/[^\x00-\xff]/g,"xx").length;  
};
/** 向指定的url路径末端添加参数
 * @param url url路径
 * @param keyValue 名值对，格式为“key=value”
 * @return 添加参数/值后的url
 */
bc.addParamToUrl=function(url,keyValue){  
    if (url == null) return url;
    if (!keyValue) return url;
    var hasParam = (url.indexOf("?") != -1);
    if(url.indexOf("ts=0") != -1){//强制不添加ts的配置
    	return url;
    }else{
    	return url + (hasParam?"&":"?") + keyValue;
    }
};

/** 
 * 格式化数字显示方式  
 * 用法 
 * bc.formatNumber(12345.999,'#,##0.00'); 
 * bc.formatNumber(12345.999,'#,##0.##'); 
 * bc.formatNumber(123,'000000'); 
 * @param num 
 * @param pattern 
 */  
bc.formatNumber = function(num, pattern) {
	var strarr = num ? num.toString().split('.') : [ '0' ];
	var fmtarr = pattern ? pattern.split('.') : [ '' ];
	var retstr = '';

	// 整数部分  
	var str = strarr[0];
	var fmt = fmtarr[0];
	var i = str.length - 1;
	var comma = false;
	for ( var f = fmt.length - 1; f >= 0; f--) {
		switch (fmt.substr(f, 1)) {
		case '#':
			if (i >= 0)
				retstr = str.substr(i--, 1) + retstr;
			break;
		case '0':
			if (i >= 0)
				retstr = str.substr(i--, 1) + retstr;
			else
				retstr = '0' + retstr;
			break;
		case ',':
			comma = true;
			retstr = ',' + retstr;
			break;
		}
	}
	if (i >= 0) {
		if (comma) {
			var l = str.length;
			for (; i >= 0; i--) {
				retstr = str.substr(i, 1) + retstr;
				if (i > 0 && ((l - i) % 3) == 0)
					retstr = ',' + retstr;
			}
		} else
			retstr = str.substr(0, i + 1) + retstr;
	}

	retstr = retstr + '.';
	// 处理小数部分  
	str = strarr.length > 1 ? strarr[1] : '';
	fmt = fmtarr.length > 1 ? fmtarr[1] : '';
	i = 0;
	for ( var f = 0; f < fmt.length; f++) {
		switch (fmt.substr(f, 1)) {
		case '#':
			if (i < str.length)
				retstr += str.substr(i++, 1);
			break;
		case '0':
			if (i < str.length)
				retstr += str.substr(i++, 1);
			else
				retstr += '0';
			break;
		}
	}
	return retstr.replace(/^,+/, '').replace(/\.$/, '');
};

/** 获取当前客户端的时间信息，格式为HH:mm:ss
 * @return 
 */
bc.getTime = function(){
	var now = new Date();
	var time = now.getHours() + ":";
	//分
	if(now.getMinutes() < 10)
		time += "0" + now.getMinutes() + ":";
	else
		time += now.getMinutes() + ":";
	//秒
	if(now.getSeconds() < 10)
		time += "0" + now.getSeconds();
	else
		time += now.getSeconds();
	return time;
};
/**
 * 计算指定时间范围内的耗时描述信息
 * 
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @return
 */
bc.getWasteTime = function(startTime,endTime){
	if(!endTime) endTime = new Date().getTime();
	var wt = (endTime - startTime);//毫秒
	//logger.info("wt=" + wt + ",startTime=" + startTime + ",endTime=" + endTime);
	if (wt < 1000) {
		return wt + "毫秒";
	} else if (wt < 1000 * 60) {
		return bc.formatNumber(wt/1000,"#.#") + "秒";
	} else {
		var m = wt / (1000 * 60);
		return m + "分" + bc.formatNumber((wt - m * 1000 * 60) / 1000,"#.#") + "秒";
	}
};

bc.getJsCss = function(cfg){
	if(!cfg)
		return [];
	if(typeof cfg == "string")
		cfg = cfg.split(",");
	
	var t;
	for(var i=0;i<cfg.length;i++){
		if(cfg[i].indexOf("js:") == 0){//预定义的js文件
			t = bc.loader.preconfig.js[cfg[i].substr(3)];
			if(t){
				t = bc.root + t;
				logger.debug(cfg[i] + "=" +  t);
				cfg[i] = t;
			}else{
				alert("没有预定义“" + cfg[i] + "”的配置，请在loader.preconfig.js文件中添加相应的配置！");
			}
		}else if(cfg[i].indexOf("css:") == 0){//预定义的css文件
			alert("方法还没实现-css:");
		}else if(cfg[i].indexOf("http") != 0 && cfg[i].indexOf("/") != 0){//相对路径的文件
			cfg[i] = bc.root + "/" + cfg[i];
		}
	}
	return cfg;
};
/**
 * 对$.ajax的通用封装:全局ajax设置
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 */
jQuery(function($){
	var defaultAjaxOption = {
		type: "POST",
		error: function(request, textStatus, errorThrown) {
			if(bc.page.showError){
				logger.error("bc.ajax error!");
				//显示漂亮的错误提示窗口
				bc.page.showError({url:this.url, more:request.responseText || request.responseHTML,from:"bc.ajax.error"});
			}else{
				var msg = "bc.ajax: textStatus=" + textStatus + ";errorThrown=" + errorThrown;
				alert(request.responseText || request.responseHTML);
			}
		}
	};
	$.ajaxSetup(defaultAjaxOption);
	bc.ajax = function(option){
		option = $.extend({},defaultAjaxOption,option);
		jQuery.ajax(option);
	};
});
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
	
    /** 提示框 
     * @param {String} msg 提示信息
     * @param {String} onOk [可选]点击确认按钮的回调函数
     * @param {String} title [可选]标题,默认为OZ.Messager.DEFAULT_TITLE
     * @param {String} icon [可选]显示的图标类型：error,question,info,warning，默认不显示图标
     */
    alert: function(msg, title, onOk, icon){
    	return $('<div data-type="msg" id="msg-' + (bc.msg.id++) + '">' + (msg || 'no message.') + '</div>').dialog({
			modal: true, title: title || bc.msg.DEFAULT_TITLE
		}).bind("dialogclose",function(event,ui){
			$(this).dialog("destroy").remove();//彻底删除所有相关的dom元素
			if(typeof onOk == "function")
				onOk.call();
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
    	alert("TODO");
    },
    /** 错误提示框：提示框icon=error的简化使用版 */
    error: function(msg, title, onOk){
    	alert("TODO");
    },
    /** 信息提问框：提示框icon=question的简化使用版 */
    question: function(msg, title, onOk){
    	alert("TODO");
    },
    /** 自动提醒框：显示在页面右下角并可以自动隐藏的消息提示框 */
    show: function(config){
    	alert("TODO");
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
/**
 * 表单验证常用函数
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 */
bc.validator = {
	/**
	 * 表单验证
	 * <input ... data-validate='{required:true,type:"number",max:10,min:5}'/>
	 * type的值控制各种不同的验证方式：
	 * 1) required 最简单的必填域验证，值不为空即可，如字符串
	 * 2) number 数字(正数、负数、小数)
	 * 3) digits 整数(非小数的数字类型)
	 * 4) email 电子邮件 xx@xx.com
	 * 5) url 网址 TODO
	 * 6) date 日期 yyyy-MM-dd
	 * 7) datetime 日期时间 yyyy-MM-dd HH:mm:ss
	 * 8) time 时间 HH:mm[:ss]
	 * 9) phone 电话号码
	 * 10) money 金额
	 * 11) custom 自定义验证，需要指定验证的正则表达式regexp和提示信息info
	 * min的值控制数字的最小值
	 * max的值控制数字的最大值
	 * minLen的值控制字符串的最小长度(中文按两个字符长度计算)
	 * maxLen的值控制字符串的最大长度(中文按两个字符长度计算)
	 * 如果无需配置其他属性，type的值可以直接配置为validate的值，如<input ... data-validate="number"/>，此时required的值默认为false
	 * required的值控制是否必须填写true|false
	 * @$form 表单form的jquery对象
	 */
	validate: function($form) {
		var ok = true;
		$form.find("div.input[data-validate],:input:enabled:not(input[type='hidden']):not(:button):not(textarea.bc-editor)")
		//添加内部特殊的div模拟input控件的验证
		.each(function(i, n){
			var $this = $(this);
			var validate = $this.attr("data-validate");
			if(logger.debugEnabled)logger.debug("validate=" + validate);
			if(logger.debugEnabled)
				logger.debug(this.nodeName + "," + this.name + "," + this.value + "," + validate);
			if(validate && $.trim(validate).length > 0){
				if(!/^\{/.test(validate)){//不是以字符{开头
					if("required" == validate)
						validate = '{"required":true,"type":"' + validate + '"}';//默认必填
					else
						validate = '{"required":false,"type":"' + validate + '"}';//默认非必填
				}
				validate =eval("(" + validate + ")");// jQuery.parseJSON(validate);
				var method = bc.validator.methods[validate.type];
				var value = $(this).val();
				if(method){
					if(validate.required || (value && value.length > 0)){//必填或有值时
						ok = method.call(validate, this, $form);//类型验证
						if(!ok){//验证不通过，增加界面的提示
							bc.validator.remind(this,validate.type,null,validate);
							return false;
						}else{
							//再验证其他细化的参数
							if(validate.type == "number" || validate.type == "digits"){//数字或整数
								//最小值验证
								if(validate.min || validate.min === 0 ){
									ok = bc.validator.methods.min.call(validate,this);
									if(!ok){
										bc.validator.remind(this, "min", [validate.min+""],validate);
										return false;
									}
								}
								//最大值验证
								if(validate.max || validate.max === 0 ){
									ok = bc.validator.methods.max.call(validate,this);
									if(!ok){
										bc.validator.remind(this, "max", [validate.max+""],validate);
										return false;
									}
								}
							}else if(validate.type == "required" || validate.type == "string"){//字符串
								//最小长度验证
								if(validate.minLen || validate.minLen === 0 ){
									ok = bc.validator.methods.minLen.call(validate,this);
									if(!ok){
										bc.validator.remind(this, "minLen", [validate.minLen+""],validate);
										return false;
									}
								}
								//最大长度验证
								if(validate.maxLen || validate.maxLen === 0 ){
									ok = bc.validator.methods.maxLen.call(validate,this);
									if(!ok){
										bc.validator.remind(this, "maxLen", [validate.maxLen+""],validate);
										return false;
									}
								}
							}
						}
					}
					return ok;
				}else{// 自定义验证
					// 必须的配置参数验证
					if(!validate.method || !validate.msg){
						alert("使用自定义验证必须指定method和msg的配置：el=" + this.name);
						return false;
					}
					logger.info("validate.method=" + validate.method);
					logger.info("validate.msg=" + validate.msg);
					
					// 要求必填但又无值时直接提示
					if(validate.required && (!value || value.length == 0)){
						ok = false;
						bc.validator.remind(this, "custom", null, validate);
						return false;
					}

					// 使用自定义的方法进行验证
					var method = bc.getNested(validate.method);
					if(typeof method != "function"){
						alert("没有定义函数“" + validate.method + "”:el=" + this.name);
						return false;
					}
					ok = method.call(validate, this, $form);//验证
					if(!ok){
						bc.validator.remind(this, "custom", null, validate);
						return false;
					}
				}
			}
		});
		return ok;
	},
	/**各种验证方法，可以自行扩展新的验证方法，方法的上下文为对象的验证配置*/
	methods:{
		/**必填*/
		required: function(element, $form) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			case 'div':
				// 添加内部特殊的div模拟input控件的验证
				$el = $(element);
				if($el.is("div.input[data-validate]")){
					var t = $el.text()
					return t && $.trim(t).length > 0;
				}else{
					return false;
				}
			case 'input':
				if(/radio|checkbox/i.test(element.type)){//多选和单选框
					return $form.find("input:checked[name='" + element.name + "']").length > 0;
				}
			default:
				return $.trim($(element).val()).length > 0;
			}
		},
		/**字符串*/
		string: function() {
			return bc.validator.methods.required.apply(this,arguments);
		},
		/**数字*/
		number: function(element) {
			return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(element.value);
		},
		/**电话号码与手机号码同时验证
		 * 匹配格式：11位手机号码;3-4位区号、7-8位直播号码、1－4位分机号
		 */
		phone: function(element) {
			return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(element.value);
		},
		/**整数*/
		digits: function(element) {
			return /^\d+$/.test(element.value);
		},
		/**字符串最小长度*/
		minLen: function(element) {
			return bc.getStringActualLen(element.value) >= this.minLen;
		},
		/**字符串最大长度*/
		maxLen: function(element) {
			return bc.getStringActualLen(element.value) <= this.maxLen;
		},
		/**最小值*/
		min: function(element) {
			return parseFloat(element.value) >= this.min;
		},
		/**最大值*/
		max: function(element) {
			return parseFloat(element.value) <= this.max;
		},
		/**email*/
		email: function(element) {
			return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(element.value);
		},
		/**yyyy-MM-dd格式的日期*/
		date: function(element) {
			return /^(\d{4})-([0-9]|([0][1-9])|([1][0-2]))-([0-9]|([0][1-9])|([1-2][0-9])|([3][0-1]))$/.test(element.value);
		},
		/**yyyy-MM-dd HH:mm[:ss]格式的日期和时间*/
		datetime: function(element) {
			return /^(\d{4})-([0-9]|([0][1-9])|([1][0-2]))-([0-9]|([0][1-9])|([1-2][0-9])|([3][0-1])) ((\d{1,2}:\d{1,2})|(\d{1,2}:\d{1,2}:\d{1,2}))$/.test(element.value);
		},
		/**HH:mm[:ss]格式的时间*/
		time: function(element) {
			return /^\d{1,2}:(\d{1,2}|(d{1,2}:\d{1,2}))$/.test(element.value);
		},
		/** 金额：1,111,111,111.00 */
		money: function(element) {
			return /^-?(?:\d*|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(element.value);
		}
	},
	/**
	 * 显示验证不通过的提示信息
	 * @param element 验证不通过的dom元素
	 * @param validateType 验证的类型
	 * @param cfg 验证的配置对象
	 */
	remind: function(element,validateType,args,cfg){
		var $el = $(element);
		//alert(element.name);
		//滚动元素到可视区域
		var $scrollContainer = $el.closest("div.content,div.bc-page");
		var pOffset = $scrollContainer.offset();
		var myOffset = $el.offset();
		if(logger.debugEnabled){
			logger.debug("offset1=" + $.toJSON(pOffset));
			logger.debug("scrollTop1=" + $scrollContainer.scrollTop());
			logger.debug("offset2=" + $.toJSON(myOffset));
			logger.debug("scrollTop2=" + $el.scrollTop());
		}
		if(myOffset.top < pOffset.top){//顶部超出可视范围就将其滚出来
			logger.debug("scroll4Top...");
			$scrollContainer.scrollTop($scrollContainer.scrollTop() - pOffset.top + myOffset.top - 5);
		}else{
			var pHeight = $scrollContainer.height();
			var myHeight = $el.height();
			var d = myOffset.top + myHeight - (pOffset.top + pHeight);
			if(d > 0){//底部超出可视范围就将其滚出来
				logger.debug("scroll4Bottom...");
				$scrollContainer.scrollTop($scrollContainer.scrollTop() + d + 5);
			}
		}
		
		var msg = ((cfg && cfg.msg) ? cfg.msg : bc.validator.messages[validateType]);
		if($.isArray(args))
			msg = msg.format.apply(msg,args);
		
		
		bc.boxPointer.show({of:$el.closest(":visible"), content:msg});
	},
	messages:{
		required:"这里必须填写哦！",
		string:"这里必须填写哦！",
		number: "这里必须填写数字哦！<br>如 12、1.2。",
		money: "这里必须填写金额哦！<br>如 123,456,789.00、12,345。",
		digits: "这里必须填写整数哦！<br>如 12。",
		email: "请输入正确格式的电子邮件！<br>如 bc@163.com。",
		phone: "请输入正确格式的电话号码！<br>如 13011112222、88887777、88887777-800、020-88887777-800。",
		url: "请输入正确格式的网址！<br>如 http://www.google.com。",
		date: "请输入正确格式的日期！<br>如 2011-01-01。",
		datetime: "请输入正确格式的日期时间！<br>如 2011-01-01 13:30。",
		time: "请输入正确格式的时间！<br>如 13:30。",
		minLen: "这里至少需要输入 {0}个字符！",
		maxLen: "这里最多只能输入 {0}个字符！",
		max: "这个值不能大于 {0}！",
		min: "这个值不能小于 {0}！"
	}
};
/**
 * 表单及表格常用函数
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 */
bc.page = {
	/**创建窗口
	 * @param {Object} option
	 * @option {String} url 地址
	 * @option {String} mid [可选]对话框的唯一标识id
	 * @option {String} from [可选]打开此对话框的源对话框的mid
	 * @option {String} name [可选]任务栏显示的名称或对话框的标题
	 * @option {String} title [可选]对话框的标题,如果不指定则使用请求返回的值
	 * @option {String} data [可选]附加的数据
	 * @option {String} afterOpen [可选]窗口新建好后的回调函数
	 * @option {String} afterClose [可选]窗口关闭后的回调函数。function(event, ui)
	 * @option {String} beforeClose [可选]窗口关闭前的回调函数，返回false将阻止关闭窗口。function(event, ui)
	 */
	newWin: function(option) {
		option = option || {};
		
		//在单独的浏览器窗口中打开
		if(option.standalone){
			logger.debug("newWin:option.standalone=" + option.standalone);
			window.open(option.url,"_blank");
			return;
		}
		
		// 任务栏显示正在加载的信息
		if(bc.page.quickbar.has(option.mid)){
			logger.debug("newWin:active=" + option.mid);
			bc.page.quickbar.active(option.mid);//仅显示现有的窗口
			return;
		}else{
			logger.debug("newWin:create=" + option.mid);
			bc.page.quickbar.loading(option);
		}
		
		logger.profile("newWin.ajax." + option.mid);
		
		//内部处理
		logger.debug("newWin:loading html from url=" + option.url);
		bc.ajax({
			url : option.url, data: option.data || null,
			dataType : "html",
			success : function(html) {
				logger.profile("newWin.ajax." + option.mid);
				var _option = jQuery.extend({},option);
				delete _option.url;
				_option.html = html;
				bc.page._createWin(_option);
			},
			error: function(request, textStatus, errorThrown) {
				//var msg = "bc.ajax: textStatus=" + textStatus + ";errorThrown=" + errorThrown;
				//alert("喔唷，出错啦！");
				//显示漂亮的错误提示窗口
				bc.page.showError({url:option.url, more:request.responseText || request.responseHTML,from:"bc.page.newWin->bc.ajax.error"});
				
				//删除任务栏对应的dom元素
				$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();
				
				//出错后通知任务栏模块加载完毕，避免长期显示加载动画
				//bc.page.quickbar.loaded(option.mid);
			}
		});
	},
	/**
	 * 创建窗口
	 */
	_createWin: function(option){
		var $dom = $(option.html);
		if($dom.size() > 1){
			//logger.error("error page. try set theme='simple' for struts2 tag");
			$dom.remove();
			
			//alert("喔唷，出错啦！");
			//显示漂亮的错误提示窗口
			bc.page.showError({url:option.url, more:option.html,from:"bc.page.newWin->bc.ajax.success->$dom.size()>1"});
			
			//删除任务栏对应的dom元素
			$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();
			return;
		}
		function _init(){
			//从dom构建并显示桌面组件
			var cfg = $dom.attr("data-option");
			//logger.info("cfg=" + cfg);
			if(cfg && /^\{/.test($.trim(cfg))){
				//对json格式进行解释
				cfg = eval("(" + cfg + ")");
			}else{
				cfg = {};
			}
			cfg.dialogClass=cfg.dialogClass || "bc-ui-dialog ui-widget-header";// ui-widget-header";
			//cfg.afterClose=option.afterClose || null;//传入该窗口关闭后的回调函数
			//if(!$dom.attr("title")) cfg.title=option.name;
			cfg.title = option.title || $dom.attr("title");// 对话框标题
			if($dom.attr("data-type") == "form") {
				cfg.minimizable = true;// 默认为表单添加最小化按钮
				cfg.maximizable = true;// 默认为表单添加最大化按钮
			}
			
			if(option.buttons) cfg.buttons = option.buttons;//使用传入的按钮配置
			
			$dom.dialog($.extend(bc.page._rebuildWinOption(cfg),{
				open: function(event, ui) {
					var dataType = $dom.attr("data-type");
					if(dataType == "list"){//视图
						//视图聚焦到搜索框
						$dom.find("#searchText").focus();
					}else if(dataType == "form"){//表单
						//聚焦到表单的第一个可输入元素
						$dom.find(":text:eq(0)").focus();
					}
				},
				appendTo:"#middle",
				scroll:false,
				containment:false//"#middle"
			}));
			$dom.bind("dialogbeforeclose",function(event,ui){
				var status = $dom.data("data-status");
				//调用回调函数
				if(option.beforeClose) 
					return option.beforeClose.call($dom[0],status);
			}).bind("dialogclose",function(event,ui){
				var $this = $(this);
				var status = $dom.data("data-status");
				
				//在ie9，如果内含<object>,$this.remove()会报错,故先处理掉object
				//ie8试过没问题
				if(jQuery.browser.msie && jQuery.browser.version >= 9){
					logger.info("IE9坑爹啊");
					$this.find("object").each(function(){
						this.parentNode.innerHTML="";
					});
				}
				//彻底删除所有相关的dom元素
				$this.dialog("destroy").remove();
				//删除任务栏对应的dom元素
				$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();
				
				//调用回调函数
				if(option.afterClose) option.afterClose.call($dom[0],status);
			}).attr("data-src",option.url || "").attr("data-mid",option.mid)
			.bind("dialogfocus", function(event, ui) {
				//logger.debug("dialogfocus");
				var cur = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']");
				if(!cur.hasClass("ui-state-active"))
					cur.addClass("ui-state-active").siblings().toggleClass("ui-state-active",false);
			});
			//.disableSelection();这个会导致表单中输入框部分浏览器无法获取输入焦点
			
			// 记录来源窗口的id
			if(option.from){
				if(typeof option.from == "string"){//直接传入来源窗口的mid
					$dom.attr("data-from",option.from);
				}else if(option.from instanceof jQuery){//传入的是来源窗口的jQuery对象
					logger.info("option.from instanceof jQuery == true");
					$dom.attr("data-from",option.from.attr("data-from") || option.from.attr("data-mid"));
				}else{
					alert("不支持的from对象类型！");
				}
			}
			if(option.fromType){
				$dom.attr("data-fromType",option.fromType);
			}
			
			var dataType = $dom.attr("data-type");
			if(dataType == "list"){//视图
				if($dom.find(".bc-grid").size()){//表格的额外处理
					bc.grid.init($dom,cfg,cfg.readonly);
				}
			}else if(dataType == "form"){//表单
				bc.form.init($dom,cfg,cfg.readonly);//如绑定日期选择事件等
			}
			
			//执行组件指定的额外初始化方法，上下文为$dom
			var method = $dom.attr("data-initMethod");
			logger.debug("initMethod="+method);
			if(method){
				method = bc.getNested(method);
				if(typeof method == "function"){
					method.call($dom, cfg,cfg.readonly);
				}else{
					alert("undefined function: " + $dom.attr("data-initMethod"));
				}
			}
			
			// 窗口最小化的处理
			if(cfg.minimizable){
				$dom.bind("dialogminimize",function(event,ui){
					$dom.parent().hide();
					$("#bottom").find(".quickButton[data-mid='" + option.mid + "']")
					.removeClass("ui-state-active")
					.find(">span.ui-icon")
					.removeClass("ui-icon-folder-open").addClass("ui-icon-folder-collapsed");
				});
			}
			
			// 窗口最大化的处理
			if(cfg.maximizable){
				$dom.bind("dialogmaximize",function(event,ui){
					if(logger.infoEnabled)logger.info("--maximize");
				});
			}
			
			// 窗口帮助的处理
			if(cfg.help){
				var helpWin=[];
				$dom.bind("dialoghelp",function showHelp(event,clickDom){
					var helpAnchor = $(clickDom).attr("data-help");
					if(logger.infoEnabled)logger.info("--help=" + helpAnchor);
					try {
						//打开帮助窗口
						if (!helpWin[helpAnchor] || helpWin[helpAnchor].closed) {
							helpWin[helpAnchor] = window.open(bc.root + "/help/index.htm#" + helpAnchor, "_blank");
						} else {
							//helpWin[helpAnchor].document.location.reload(true);
							helpWin[helpAnchor].focus();
						}
					} catch (e) {
						helpWin[helpAnchor] = null;
						showHelp(event,clickDom);
					}
					return false;
				});
			}
			
			// 窗口打印的处理
			if(cfg.print){
				$dom.bind("dialogprint",function(event,clickDom){
					if(logger.infoEnabled)logger.info("--print=" + $(clickDom).attr("data-print"));
					bc.page.print.call($(clickDom).closest(".bc-ui-dialog").children(".bc-page"),cfg.print);
					//bc.msg.alert("功能开发中");
				});
			}
			
			//通知任务栏模块加载完毕
			bc.page.quickbar.loaded(option.mid);
			
			//调用回调函数
			if(option.afterOpen) option.afterOpen.call($dom[0]);
		}
		//alert(html);
		
		// 加载js、css文件
		var dataJs = bc.getJsCss($dom.attr("data-js"));
		if(dataJs && dataJs.length > 0){
			dataJs.push(_init);
			bc.load(dataJs);
		}else{
			//执行模块指定的初始化方法
			_init();
		}
	},
	
	/**
	 * 显示请求错误的提示窗口
	 */
	showError: function(option){
		//alert(option.url + ";" + option.more);
		//alert("喔唷，出错啦！");
		//显示漂亮的错误提示窗口
		var errorDom = [
		      '<div style="text-align: center;"><table class="error" cellspacing="0" cellpadding="0" data-from="'+option.from+'" style="width:300px;">'
		      ,'<tr>'
		      ,'<td class="icon" style="width:52px;" title="url:'+option.url+',from:'+option.from+'"><div class="icon"></div></td>'
		      ,'<td class="label">喔唷，出错啦！</td>'
		      ,'</tr>'
		      ,'<tr><td class="detail" colspan="2">处理过程出现了错误，请重新尝试或联系管理员。</td></tr>'
		];
		if(option.more)
			errorDom.push('<tr><td class="detail" colspan="2" style="width:52px;text-align: center;"><span class="more">了解详情</span></td></tr>');
		errorDom.push('</table></div>');
		errorDom = errorDom.join("");
		
		var $error = $(errorDom).dialog({width:380,height:150,modal:true,dialogClass:"bc-ui-dialog ui-widget-header"});
		$error.bind("dialogclose",function(event,ui){
			$error.unbind().remove();
		});
		$error.find("span.more").click(function(){
			if(logger.infoEnabled)logger.info("span.more");
			var errorWin=window.open('', 'bcErrorShow');
			var errorDoc = errorWin.document;
			errorDoc.open();
			errorDoc.write(option.more);
			errorDoc.close();
			errorWin.focus();
		});
	},
	/**
	 * 初始化表单或列表中的元数据信息：表单验证、列表的行操作处理
	 * 上下文为插入到对话框中的元素
	 * TODO 迁移到分散的组件文件中各自定义
	 */
	innerInit: function() {

	},
	_rebuildWinOption: function(option){
		var _option = option || {};
		if(_option.buttons){
			var btn;
			for(var i in _option.buttons){
				btn = _option.buttons[i];
				if(btn.action == "save"){//内部的表单保存
					btn.click = bc.page.save;
				}else if(btn.action == "submit"){//提交表单保存，成功后自动关闭对话框
					btn.click = bc.page.submit;
				}else if(btn.action == "cancel"){//关闭对话框
					btn.click = bc.page.cancel;
				}else if(btn.action == "create"){//新建
					btn.click = bc.page.create;
				}else if(btn.action == "delete"){//删除
					btn.click = bc.page.delete_;
				}else if(btn.action == "edit"){//编辑
					btn.click = bc.page.edit;
				}else if(btn.action == "open"){//打开
					btn.click = bc.page.open;
				}else if(btn.action == "print"){//打印
					btn.click = bc.page.print;
				}else if(btn.action == "preview"){//预览xheditor的内容
					btn.click = bc.page.preview;
				}else if(btn.action == "more"){//带下拉菜单的按钮
					btn.click = bc.page.more;
				}else if(btn.fn){//调用自定义函数
					btn.click = bc.getNested(btn.fn);
				}
				
				//如果click为字符串，当成是函数名称处理
				if(typeof btn.click == "string"){
					var c = btn.click;
					btn.click = bc.getNested(btn.click);
					if(!btn.click)
						alert("函数'"+c+"'没有定义！");
				}
			}
			//delete _option.buttons;
		}
		return _option;
	},
	/**保存表单数据，上下文为页面对象
	 * @param {Object} option
	 * @option {Function} callback 保存成功后的回调函数，上下文为当前页面，第一个参数为服务器返回的json对象
	 */
	save: function(option) {
		option = option || {};
		var $page = $(this);
		var url=$page.attr("data-saveUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-saveUrl或data-namespace属性的值");
				return;
			}else{
				url += "/save";
			}
		}
		if(logger.infoEnabled)logger.info("saveUrl=" + url);
		var $form = $("form",$page);
		
		//判断是否正在保存，若是就返回
		if($page.data("saving")) return;
		//设置是否正在保存的标识为true[正在保存]
		$page.data("saving",true);
		
		//表单验证
		if(!bc.validator.validate($form))
			return;
		
		//使用ajax保存数据
		var data = $form.serialize();
		bc.ajax({
			url: url, data: data, dataType: "json",
			success: function(json) {
				if(logger.debugEnabled)logger.debug("save success.json=" + jQuery.param(json));
				if(json.id){
					$form.find("input[name='e.id']").val(json.id);
				}
				//记录已保存状态
				$page.attr("data-status","saved").data("data-status","saved");
				
				//将正在保存标识设为false[已保存]
				$page.data("saving",false);
				//调用回调函数
				var showMsg = true;
				if(typeof option.callback == "function"){
					//返回false将禁止保存提示信息的显示
					if(option.callback.call($page[0],json) === false)
						showMsg = false;
				}
				if(showMsg){
					bc.msg.slide(json.msg);
				}
			}
		});
	},
	/**提交表单保存数据后自动关闭表单对话框，上下文为页面对象*/
	submit: function(option) {
		option = option || {};
		var $page = $(this);
		bc.page.save.call(this,{callback:function(json){
			if(typeof option.callback == "function"){
				//返回false将禁止提示信息的显示
				if(option.callback.call($page[0],json) === false)
					return false;;
			}else{
				bc.msg.slide("提交成功！");
				$page.data("data-status",true);
				$page.dialog("close");
				return false;
			}
		}});
	},
	/**删除*/
	delete_: function(option) {
		option = option || {};
		var $page = $(this);
		var url=$page.attr("data-deleteUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-deleteUrl或data-namespace属性的值");
				return;
			}else{
				url += "/delete";
			}
		}
		var data=null;
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			data = "id=" + $tds.attr("data-id");
		}else if($tds.length > 1){
			data = "ids=";
			$tds.each(function(i){
				data += $(this).attr("data-id") + (i == $tds.length-1 ? "" : ",");
			});
		}
		if(logger.infoEnabled) logger.info("bc.page.delete_: data=" + data);
		if(data == null){
			bc.msg.slide("请先选择要删除的条目！");
			return;
		}
		bc.msg.confirm("确定要删除选定的 <b>"+$tds.length+"</b> 项吗？",function(){
			bc.ajax({
				url: url, data: data, dataType: "json",
				success: function(json) {
					if(logger.debugEnabled)logger.debug("delete success.json=" + $.toJSON(json));
					if(json.success === false){
						bc.msg.alert(json.msg);// 仅显示失败信息
					}else{
						//调用回调函数
						var showMsg = true;
						if(typeof option.callback == "function"){
							//返回false将禁止保存提示信息的显示
							if(option.callback.call($page[0],json) === false)
								showMsg = false;
						}
						if(showMsg)
							bc.msg.slide(json.msg);
						
						//重新加载列表
						bc.grid.reloadData($page);
					}
				}
			});
		});
	},
	/**禁用*/
	disabled: function(option) {
		option = option || {};
		var $page = $(this);
		var url=$page.attr("data-deleteUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-deleteUrl或data-namespace属性的值");
				return;
			}else{
				url += "/delete";
			}
		}
		var data=null;
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			data = "id=" + $tds.attr("data-id");
		}else if($tds.length > 1){
			data = "ids=";
			$tds.each(function(i){
				data += $(this).attr("data-id") + (i == $tds.length-1 ? "" : ",");
			});
		}
		if(logger.infoEnabled) logger.info("bc.page.delete_: data=" + data);
		if(data == null){
			bc.msg.slide("请先选择要禁用的条目！");
			return;
		}
		bc.msg.confirm("确定要禁用选定的 <b>"+$tds.length+"</b> 项吗？",function(){
			bc.ajax({
				url: url, data: data, dataType: "json",
				success: function(json) {
					if(logger.debugEnabled)logger.debug("disabled success.json=" + jQuery.param(json));
					//调用回调函数
					var showMsg = true;
					if(typeof option.callback == "function"){
						//返回false将禁止保存提示信息的显示
						if(option.callback.call($page[0],json) === false)
							showMsg = false;
					}
					if(showMsg)
						bc.msg.slide(json.msg);
					
					//重新加载列表
					bc.grid.reloadData($page);
				}
			});
		});
	},
	/**关闭表单对话框，上下文为dialog的原始dom元素*/
	cancel: function(option){
		$(this).dialog("destroy").remove();
	},
	/**新建表单*/
	create: function(option){
		option = option || {};
		var $page = $(this);
		var url=$page.attr("data-createUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-createUrl或data-namespace属性的值");
				return;
			}else{
				url += "/create";
			}
		}
		
		//附加固定的额外参数
		var data = option.data || {};
		var extras = option.extras || $page.data("extras");
		if(extras){
			data = $.extend(data, extras);
		}
		
		var fromMID = $page.attr("data-mid");
		bc.page.newWin({
			url: url,
			from: fromMID,
			mid: fromMID + ".0",
			name: "新建" + ($page.attr("data-name") || "未定义"),
			afterClose: function(status){
				if(status)bc.grid.reloadData($page);
			},
			afterOpen: option.callback,
			data: data
		});
	},
	/**编辑*/
	edit: function(option){
		option = option || {};
		var $page = $(this);
		var url = option.url || $page.attr("data-editUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-editUrl或data-namespace属性的值");
				return;
			}else{
				url += "/edit";
			}
		}
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			var data = {id: $tds.attr("data-id")};
			
			//附加固定的额外参数
			var extras = option.extras || $page.data("extras");
			if(extras){
				data = $.extend(data, extras);
			}
			
			var fromMID = $page.attr("data-mid");
			bc.page.newWin({
				url:url, data: data || null,
				from: fromMID,
				mid: fromMID + "." + $tds.attr("data-id"),
				name: $tds.attr("data-name") || "未定义",
				title: $tds.attr("data-name"),
				afterClose: function(status){
					if(status)
						bc.grid.reloadData($page);
				},
				afterOpen: option.callback
			});
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以编辑一条信息，请确认您只选择了一条信息！");
			return;
		}else{
			bc.msg.slide("请先选择要编辑的信息！");
			return;
		}
	},
	/**查看*/
	open: function(option){
		option = option || {};
		var $page = $(this);
		var url = $page.attr("data-openUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-openUrl或data-namespace属性的值");
				return;
			}else{
				url += "/open";
			}
		}
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			var data = {id: $tds.attr("data-id")};
			
			//附加固定的额外参数
			var extras = option.extras || $page.data("extras");
			if(extras){
				data = $.extend(data, extras);
			}
			
			var fromMID = $page.attr("data-mid");
			bc.page.newWin({
				url:url, data: data || null,
				from: fromMID,
				fromType: $page.is("[data-isTabContent='true']") ? "tab" : null,
				mid: fromMID + "." + $tds.attr("data-id"),
				name: $tds.attr("data-name") || "未定义",
				title: $tds.attr("data-name"),
				afterClose: function(status){
					if(status)
						bc.grid.reloadData($page);
				},
				afterOpen: option.callback
			});
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以查看一条信息，请确认您只选择了一条信息！");
			return;
		}else{
			bc.msg.slide("请先选择要查看的信息！");
			return;
		}
	},
	/**预览xheditor的内容，上下文为dialog对象*/
	preview: function(){
		$(this).find(".bc-editor").xheditor({tools:'mini'}).exec("Preview");
	},
	/**打印表单*/
	print: function(key){
		if(key){
			if(key.indexOf("callback:") == 0){// 调用自定义的函数
				var _fn = key.substr("callback:".length); 
				var fn = bc.getNested(_fn);
				if(typeof fn == "function"){
					fn.call(this,key);
				}else{
					alert("指定的函数没有定义：" + _fn);
				}
				return false;
			}else if(key.indexOf("tpl:") == 0){// 调用内定的模板格式化打印处理
				var templateCode = key.substring("tpl:".length,key.lastIndexOf(":")); // 模板的编码
				logger.info("templateCode=" + templateCode);
				var formatSqlArr = key.substring(key.lastIndexOf(":")+1).split("&");
				var dataObj;
				var dataArr=[];
				for(var i = 0 ; i < formatSqlArr.length ; i++){
					dataObj={};
					var tempstr = formatSqlArr[i];
					var indx = tempstr.indexOf("=");
					if(indx > 0 && indx < tempstr.length){
						var key = tempstr.substring(0,indx);
						var value = tempstr.substring(indx+1);
						dataObj.key=key;
						dataObj.value=value;	
						dataArr.push(dataObj);
					}else{
						alert("key：" + key+",格式化错误！");
						return false;
					}
				}
				var url =bc.root+"/bc/templatefile/inline?code=" + templateCode;
				if(dataArr.length >0 ){
					url += "&formatSqlJsons="+$.toJSON(dataArr);
				}
				var win = window.open(url, "_blank");
				return false;
			}
		}
		var $this = $(this);
		var type = $this.attr("data-type");
		var $form = $this;
		if("form" == type){
			$form = $this.find(">form");
			if($form.size() == 0)
				$form = $this;
		}
		if($form.size() == 0){
			alert("没有找到可打印的表单内容！");
			return;
		}
		
		var origParent = $form.parent()[0],
			origDisplay = [],
			body = document.body,
			childNodes = $(body).children("div");

		// 避免重复打印
		if ($form.data("isPrinting")) {
			return;
		}
		$form.data("isPrinting",true);

		// 隐藏body下的所有一级子节点
		var node;
		logger.info("childNodes.length=" + childNodes.length);
		childNodes.each(function(i){
			origDisplay[i] = this.style.display;
			this.style.display = "none";
		});

		// 将要打印的元素插入到body下
		var formEl = $form[0];
		body.appendChild(formEl);

		// 执行打印
		window.print();

		// allow the browser to prepare before reverting
		setTimeout(function () {
			// 将要打印的元素放回原处
			origParent.appendChild(formEl);

			// 恢复body下的所有一级子节点原来的显示状态
			childNodes.each(function(i){
				this.style.display = origDisplay[i];
			});

			$form.data("isPrinting",false);
		}, 1000);
	}
};

jQuery(function($) {
	bc.page.innerInit();
});

bc.page.quickbar={
	id:"#quickButtons",
	/**  
	 * 判断指定的模块当前是否已经加载
	 * @param mid 模块的id
	 */
	has: function(mid){
		return $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']").length > 0;
	},
	/**  
	 * 激活已经加载的现有模块
	 * @param mid 模块的id
	 */
	active: function(mid){
		$(".ui-dialog>.ui-dialog-content[data-mid='" + mid + "']").parent().show()
		.end().siblings().toggleClass("ui-state-active",false)
		.end().dialog("moveToTop");
	},
	/**  
	 * 设置指定的模块开始加载中
	 * @param option 模块的配置
	 */
	loading: function(option){
		$(bc.page.quickbar.id).append('<a id="quickButton-'+option.mid
				+'" class="quickButton ui-corner-all ui-state-default" data-mid="'+option.mid
				+'" data-name="'+option.name+'" title="'+option.name+'">'
				+'<span class="ui-icon loading"></span>'
				+'<span class="text">正在加载：'+option.name+'</span></a>');
	},
	/**  
	 * 设置指定的模块加载完毕
	 * @param mid 模块的id
	 */
	loaded: function(mid){
		var $item = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']");
		$item.find(">span.text").text($item.attr("data-name"));
		$item.find(">span.ui-icon").removeClass("loading").addClass("ui-icon-folder-open");
		$item.toggleClass("ui-state-active",true).siblings().toggleClass("ui-state-active",false);
	},
	/**  
	 * 设置指定的模块的警告显示
	 * @param mid 模块的id
	 */
	warn: function(mid){
		var $item = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']");
		$item.toggleClass("ui-state-highlight",true);
	}
};

/**  
 * 初始化表单中的页签页面
 * 上下文及参数同tabs的事件参数一致
 */
bc.page.initTabPageLoad = function (event, ui){
	if($.data(ui.tab, "bcInit.tabs")) return;
	
	var $tabPanel = $(ui.panel);
	var $page = $tabPanel.find(">.bc-page");
	if(logger.infoEnabled)logger.info("bc-page.size:" + $page.size());
	if(!$page.size()) return;
	
	$page.height($tabPanel.height());
	//logger.info("show:" + $page.attr("class"));
	
	//对视图和表单执行额外的初始化
	var dataType = $page.attr("data-type");
	if(dataType == "list"){//视图
		if($page.find(".bc-grid").size()){//表格的额外处理
			bc.grid.init($page);
			$page.removeAttr("title");
		}
	}else if(dataType == "form"){//表单
		bc.form.init($page);//如绑定日期选择事件等
		$page.removeAttr("title");
	}
	
	//标记已经初始化过
	$.data(ui.tab, "bcInit.tabs",true);
};

/**  
 * 表单中的页签创建事件的通用处理函数
 * 上下文及参数同tabs的事件参数一致
 */
bc.page.initTabPageCreate = function (event, ui){
	//统一设置页签内容区的高度，而不是默认的自动高度，并设置内容区内容溢出时显示滚动条
	var $tabs = $(this);
	var $tabPanels = $tabs.children(".ui-tabs-panel");
	//logger.info("create tabs:" + $tabs.attr("class"));
	var $nav = $tabs.children(".ui-tabs-nav");
	var ch = $tabs.height() - $nav.outerHeight(true) - ($tabPanels.outerHeight(true) - $tabPanels.height());
	$tabPanels.addClass("bc-autoScroll").height(ch);
};
bc.page.defaultTabsOption = {
	cache: true, 
	create: bc.page.initTabPageCreate,
	load: bc.page.initTabPageLoad
};

//页签中页面的加载处理
function _initBcTabsLoad(){
	var $page = this;
	//执行组件指定的额外初始化方法，上下文为$dom
	var method = $page.attr("data-initMethod");
	logger.debug("bctabs:initMethod="+method);
	if(method){
		method = bc.getNested(method);
		if(typeof method == "function"){
			var cfg = $page.attr("data-option");
			//logger.info("cfg=" + cfg);
			if(cfg && /^\{/.test($.trim(cfg))){
				//对json格式进行解释
				cfg = eval("(" + cfg + ")");
			}else{
				cfg = {};
			}
			method.call($page, cfg,cfg.readonly);
		}else{
			alert("undefined function: " + $page.attr("data-initMethod"));
		}
	}
}

/**  
 * 表单中的bctabs页签的默认配置
 * 上下文及参数同bctabs的事件参数一致
 */
bc.page.defaultBcTabsOption = {
	load:function(event,ui){
		if(logger.infoEnabled)logger.info("load:" +  $(this).attr("class"));
		var $page = ui.content.children(".bc-page");
		if(logger.debugEnabled)logger.debug("tabs.load:bc-page.size=" + $page.size());
		if(!$page.size()) return;
		
		// 加载js、css文件
		var dataJs = $page.attr("data-js");
		if(dataJs && dataJs.length > 0){
			//先加载js文件后执行模块指定的初始化方法
			dataJs = dataJs.split(",");//逗号分隔多个文件
			dataJs.push(jQuery.proxy(_initBcTabsLoad,$page));
			bc.load(dataJs);
		}else{
			//执行模块指定的初始化方法
			_initBcTabsLoad.call($page);
		}
		
		//对视图和表单执行额外的初始化
		var dataType = $page.attr("data-type");
		if(logger.debugEnabled)logger.debug("tabs.load:dataType=" + dataType);
		if(dataType == "list"){//视图
			if($page.find(".bc-grid").size()){//表格的额外处理
				bc.grid.init($page);
				$page.removeAttr("title");
				
				// 绑定窗体尺寸变动事件
				$page.parent().closest(".bc-page").bind("dialogresize",function(){
					// 调整当前页签内grid的尺寸
					if(ui.content.is(":visible") && ui.content.attr("data-resized") == "true"){
						if(logger.debugEnabled)logger.debug("resized=true,index=" + ui.content.index());
						bc.grid.init($page);
						ui.content.attr("data-resized","false");
					}
				});
			}
		}else if(dataType == "form"){//表单
			bc.form.init($page);//如绑定日期选择事件等
			$page.removeAttr("title");
		}
	},
	show:function(event,ui){
		if(logger.debugEnabled)logger.debug("show:" + ui.content.attr("class"));
		// 调整当前页签内grid的尺寸
		if(ui.content.attr("data-resized") == "true"){
			if(logger.debugEnabled)logger.debug("show.resized=true,index=" + ui.content.index());
			bc.grid.init(ui.content.children(".bc-page"));
			ui.content.attr("data-resized","false");
		}
	},
	/** 内容容器的高度是否自动根据tabs容器的高度变化 */
	autoResize: true
};

/**
 * 工具条的全局处理
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-05-26
 * @depend jquery-ui-1.8,bc.core
 */
(function($) {

bc.toolbar = {
	/**执行搜索操作
	 * @param $page 页面dom的jquery对象
	 * @param option 
	 * @option action 
	 * @option callback 
	 * @option click 
	 */
	doSearch: function($page,option) {
		var action = option.action;//内定的操作
		var callback = option.callback;//回调函数
		callback = callback ? bc.getNested(callback) : undefined;//转换为函数

		switch (action){
		case "search"://内置的搜索处理
			//重设置为第一页
			$page.find("ul.pager #pageNo").text(1);
			
			//重新加载列表数据
			bc.grid.reloadData($page, callback);
			break;
		default ://调用自定义的函数
			var click = option.click;
			if(typeof click == "string")
				click = bc.getNested(click);//将函数名称转换为函数
			if(typeof click == "function")
				click.call($page[0],{callback:callback});
			break;
		}
	},
	
	/** 初始化高级搜索窗口
	 * @param $advanceSearchBtn 点击的按钮
	 * @param $conditionsForm 高级搜索窗口
	 */
	initAdvanceSearchForm: function($advanceSearchBtn, $conditionsForm){
		if($conditionsForm.size() == 0) return;
		
		//设置窗口的最小宽度为按钮的当前宽度
		$conditionsForm.css("min-width", $advanceSearchBtn.parent().width() + "px");
		
		//绑定点击按钮就显示条件窗口的事件
		$conditionsForm.bcsearch({
			trigger: $advanceSearchBtn,
			position: {my: "right top",at: "right bottom",of: $advanceSearchBtn.prev(),offset:"0 -1"}
		}).bcsearch("open");
		
		//标记已初始化
		$advanceSearchBtn.attr("data-advanceSearchInit","true");
		
		// 控制是否可拖动高级搜索框
		if($conditionsForm.is(".draggable") && $.fn.draggable){
			$conditionsForm.css("cursor","move").draggable({
				cancel: ".conditions,button,a"
			});
			
			// 让高级搜索框超出对话框范围也可见
			$conditionsForm.closest(".bc-page").css("overflow","visible");
		}
	},
	
	/** 执行高级搜索：上下文为当前窗口页面
	 * @param option 选项
	 * @param target 点击的按钮
	 */
	doAdvanceSearch: function(option,target) {
		var $page = $(this);
		var $target = $(target);
		var $conditionsForm = $target.closest(".bc-conditionsForm");
		if(logger.debugEnabled)logger.debug("doAdvanceSearch:" + $conditionsForm.attr("class"));
		
		// 格式验证
		if(!bc.validator.validate($conditionsForm))
			return
		
		// 组合高级查询条件
		var conditions = [];
		var $this,value,c;
		$conditionsForm.find("[data-condition]").each(function(){
			$this = $(this);
			if($this.is("input[type='text'],input[type='hidden'],textarea,select")){//文本框、隐藏域、下拉选择框
				value = $this.val();
				c = eval("(" + $this.attr("data-condition") + ")");
				if(logger.debugEnabled)logger.debug("c1=" + $.toJSON(c));
				if(value && value.length > 0){
					var op = {type:c.type,ql:c.ql,value:value};
					if(c.likeType)
						op.likeType = c.likeType;
					conditions.push(op);
				}
			}else if($this.is(".radios,.checkboxes")){//单选按钮组或多选框的容器
				c = eval("(" + $this.attr("data-condition") + ")");
				if(logger.debugEnabled)logger.debug("c2=" + $.toJSON(c));
				var $ms = $this.find(":checked");
				var values = [],vv;
				$ms.each(function(){
					vv=this.value.split(",");//单个项可以包含多个值，用逗号连接即可
					for(var i=0;i<vv.length;i++)
						values.push(vv[i]);
				});
				if(values.length == 1){//单个值
					conditions.push({type:c.type,ql: c.ql ? c.ql : c.key + "=?",value:values[0]});
				}else if(values.length > 1){//多个值
					var ins = " in (";
					for(var i=0;i<values.length;i++){
						ins += (i==0 ? "?" : ",?");
					}
					ins += ")";
					conditions.push({type:c.type,ql: c.ql ? c.ql : c.key + ins,value: values});
				}
			}else if($this.is(".multi")){//多值混合类型
				c = this.getAttribute("data-condition");
				c = c.replace(/\r|\n|\t/g,"");
				if(logger.debugEnabled)logger.debug("multi:data-condition=" + c);
				c = eval("(" + c + ")");
				// 获取起始、结束日期的值
				var $values = $this.find("input.value");
				var zero = "", all = "", qlkey = "",valueCfg,v,$t;
				var values = [];
				$values.each(function(i){
					$t = $(this);
					v = $t.val();
					valueCfg = $t.data("value");
					zero += "0";
					all += "1";
					qlkey += v.length > 0 ? "1" : "0";
					if(v.length > 0){//有值的情况
						if(typeof valueCfg == "string"){
							valueCfg = {type: valueCfg, value: v, like:false};
						}else{
							valueCfg.value = v;
						}
						values.push(valueCfg);
					}
				});
				
				if(logger.debugEnabled)logger.debug("zero=" + zero + ";all=" + all + ";qlkey=" + qlkey + ";values.length=" + values.length);
				
				if(qlkey != zero){//排除全部无值的情况
					if(all == qlkey){//全部有值的情况
						qlkey = "ql";
					}else{// 部分有值的情况
						qlkey = "ql" + qlkey;
					}
					if(values.length == 1){
						conditions.push({type: values[0].type,ql: c[qlkey],value: values[0].value,like: !!values[0].like});
					}else{
						conditions.push({type:"multi",ql: c[qlkey],value: values});
					}
				}
			}else{
				alert("不支持的条件配置：data-condition=" + $this.attr("data-condition"));
			}
		});
		
		// 将搜索条件保存到指定位置
		var extras = $page.data("extras");
		if(!extras){
			$page.data("extras",{});
			extras = $page.data("extras");
		}
		extras.search4advance = $.toJSON(conditions);
		if(logger.infoEnabled)logger.info("search4advance=" + extras.search4advance);
		
		// 重设置为第一页
		$page.find("ul.pager #pageNo").text(1);
		
		// 重新加载列表数据
		bc.grid.reloadData($page, function(){
			logger.info("advanceSearch reloadData callback");
		});
	},
	
	/** 清空高级搜索条件
	 * @param option 选项
	 * @param target 点击的按钮
	 */
	doAdvanceClean: function(option,target) {
		// 清除条件框的值
		var $conditionsForm = $(target).closest(".bc-conditionsForm");
		$conditionsForm.find("input[type='text'],input[type='hidden'],textarea,select").val("");
		$conditionsForm.find(":checked").each(function(){
			this.checked = false;
		});
		
		// 清除页面保存的条件值
		var extras = $conditionsForm.closest(".bc-page").data("extras");
		if(extras){
			delete extras.search4advance;
		}
		
		// 重新加载列表数据
		bc.grid.reloadData($conditionsForm.closest(".bc-page"));
	}
};
	
var $document = $(document);
//顶部工具条按钮控制
$document.delegate(".bc-button",{
	mouseover: function() {
		$(this).addClass("ui-state-hover");
	},
	mouseout: function() {
		$(this).removeClass("ui-state-hover");
	},
	click: function() {
		var $this = $(this);
		var action = $this.attr("data-action");//内定的操作
		var callback = $this.attr("data-callback");//回调函数
		callback = callback ? bc.getNested(callback) : undefined;//转换为函数
		var $page = $this.closest(".bc-page");
		var pageEl = $page[0];
		
		//==附加的额外的请求参数
		//  从page取
		var extras = $page.data("extras");
		logger.info("page extras=" + $.toJSON(extras));
		
		//上下文统一为页面，第一个参数为配置
		switch (action){
		case "create"://新建--视图中
			bc.page.create.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "edit"://编辑----视图中
			bc.page.edit.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "open"://查看----视图中
			bc.page.open.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "delete"://删除----视图
			bc.page.delete_.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "disabled"://禁用----视图
			bc.page.disabled.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "save"://保存----表单
			bc.page.save.call(pageEl,{callback:callback,extras:extras},this);
			break;
		case "cancel"://关闭对话框
			bc.page.cancel.call(pageEl,{callback:callback,extras:extras},this);
			break;
		default ://调用自定义的函数
			var click = $this.attr("data-click");
			if(typeof click == "string")
				click = bc.getNested(click);//将函数名称转换为函数
			if(typeof click == "function")
				click.call(pageEl,{callback:callback,extras:extras},this);
			break;
		}
	}
});

//右侧的搜索框处理：回车执行搜索（TODO alt+enter执行本地搜索）
$document.delegate(".bc-toolbar #searchText","keyup", function(e) {
	var $this = $(this);
	if(e.which == 13){//按下回车键
		var $page = $this.parents(".bc-page");
		var $search = $this.parent();
		bc.toolbar.doSearch($page,{
			action: $search.attr("data-action"),//内定的操作
			callback: $search.attr("data-callback"),//回调函数
			click: $search.attr("data-click")//自定义的函数
		});
	}
});
//右侧的搜索框处理：点击左侧的简单搜索按钮
$document.delegate(".bc-toolbar #searchBtn","click", function(e) {
	var $this = $(this);
	var $page = $this.parents(".bc-page");
	var $search = $this.parent();
	bc.toolbar.doSearch($page,{
		action: $search.attr("data-action"),//内定的操作
		callback: $search.attr("data-callback"),//回调函数
		click: $search.attr("data-click")//自定义的函数
	});
	
	return false;
});
//右侧的搜索框处理：点击右侧的高级搜索按钮
$document.delegate(".bc-toolbar #advanceSearchBtn","click", function(e) {
	var $this = $(this);
	
	// 隐藏高级搜索按钮
	$this.hide();
	
	if($this.attr("data-advanceSearchInit") != "true"){//初始化条件窗口
		var cotainer = $this.attr("data-conditionsForm") || ".bc-page";//".bc-searchButton";
		var $conditionsFormParent = $this.closest(cotainer);
		logger.info("cotainer=" + cotainer);
		
		// 初始化条件窗口
		var conditionsFormUrl = $this.parent().attr("data-url");//获取条件窗口html代码的请求路径
		logger.info("conditionsFormUrl=" + conditionsFormUrl);
		if(conditionsFormUrl && conditionsFormUrl.length > 0){//通过ajax获取条件窗口
			bc.ajax({
				url: conditionsFormUrl,
				type: "POST",
				dataType: "html",
				data: $this.closest(".bc-page").data("extras"),
				success: function(html){
					logger.info("finish loaded conditionsForm");
					//先清空可能的条件窗口
					$this.next(".bc-conditionsForm").remove();
					
					//添加到指定的容器
					var $conditionsForm = $(html);
					$conditionsForm.appendTo($conditionsFormParent);
					
					// 加载额外的js、css文件
					function _init(){
						//绑定日期选择
						bc.form.initCalendarSelect($conditionsForm);

						bc.toolbar.initAdvanceSearchForm($this,$conditionsForm);
					}
					var dataJs = $conditionsForm.attr("data-js");
					if(dataJs && dataJs.length > 0){
						//先加载js文件后执行模块指定的初始化方法
						dataJs = dataJs.split(",");//逗号分隔多个文件
						
						// 处理预定义的js、css文件
						var t;
						for(var i=0;i<dataJs.length;i++){
							if(dataJs[i].indexOf("js:") == 0){//预定义的js文件
								t = bc.loader.preconfig.js[dataJs[i].substr(3)];
								if(t){
									t = bc.root + t;
									logger.debug(dataJs[i] + "=" +  t);
									dataJs[i] = t;
								}else{
									alert("没有预定义“" + dataJs[i] + "”的配置，请在loader.preconfig.js文件中添加相应的配置！");
								}
							}else if(dataJs[i].indexOf("css:") == 0){//预定义的css文件
								
							}
						}
						
						dataJs.push(_init);
						bc.load(dataJs);
					}else{
						_init();
					}
				}
			});
		}else{//自定义的条件窗口
			bc.toolbar.initAdvanceSearchForm($this,$this.next(".bc-conditionsForm"));
		}
	}
	return false;
});

// 工具条的单选按钮组
$document.delegate(".bc-radioGroup>.ui-button",{
	mouseover: function() {
		$(this).addClass("ui-state-hover");
	},
	mouseout: function() {
		$(this).removeClass("ui-state-hover");
	},
	click: function() {
		var $this = $(this);
		var $siblings = $this.siblings();
		
		// 判断是否值改变了
		var pre = $siblings.filter(".ui-state-active");
		//logger.info("TODO1=" + pre.size());
		//logger.info("TODO2=" + $this.hasClass("ui-state-active"));
		if(pre.size() == 0 || (pre.size() >= 0 && $this.hasClass("ui-state-active"))){
			//没有改变过任何值，不作处理直接返回
			return;
		}
		
		// 获取当前选项的值
		var data = {
			value: $this.attr("data-value"),
			text: $this.children(".ui-button-text").text()
		};
		
		// 获取前一个选项的值
		if(pre.size()){
			data.prev={
				value: pre.attr("data-value"),
				text: pre.children(".ui-button-text").text()
			};
		}
		
		// 处理样式
		$this.addClass("ui-state-active");
		$siblings.removeClass("ui-state-active");
		
		// 处理回调函数：上下文统一为页面，第一个参数为配置
		var $parent = $this.parent();
		var action = $parent.attr("data-action");//内定的操作
		var callback = $parent.attr("data-callback");//回调函数
		callback = callback ? bc.getNested(callback) : undefined;//转换为函数
		var $page = $this.closest(".bc-page");
		var option = $.extend({callback:callback},data);
		switch (action){
			case "reloadGrid"://重新加载grid的数据--视图中
				//参数名称
				var key = $parent.attr("data-key");
				
				//将参数的值设置到页面的data-extras
				var extras = $page.data("extras");
				if(!extras){
					extras = {};
					extras[key] = data.value;
					$page.data("extras",extras);
				}else{
					extras[key] = data.value;
				}
				bc.grid.reloadData($page);
				break;
			default ://调用自定义的函数
				var change = $parent.attr("data-change");
				if(change){
					change = bc.getNested(change);//将函数名称转换为函数
					if(typeof change == "function"){
						change.call($page[0],option);
					}else{
						alert("undefined function: " + $parent.attr("data-change"));
					}
				}
		}
		return false;
	}
});

//工具条的带下拉菜单按钮
$document.delegate(".bc-button.bc-menuButton",{
	click: function() {
		var $this = $(this);
		if($this.attr("data-menuInit") != "true"){//初始化下拉菜单
			logger.info("data-menuInit!=true");
			
			//将菜单的dom迁移到指定的容器
			var $contextmenu = $this.find(".bc-menu");
			var menucontainer = $this.attr("data-menucontainer");
			if(menucontainer && menucontainer.length > 0){
				$contextmenu.appendTo($this.closest(menucontainer));//添加到指定的容器
			}else{
				//$contextmenu.appendTo($this.parent());//添加到父容器
			}
			
			//设置菜单的最小宽度为按钮的当前宽度
			$contextmenu.css("min-width", $this.width() + "px");
			
			//获取回调函数
			var change = $this.attr("data-change");
			if(change){
				change = bc.getNested(change);//将函数名称转换为函数
				if(typeof change != "function"){
					alert("没有定义函数: " + $this.attr("data-change"));
				}
			}
			
			//初始化菜单
			$contextmenu.menu({
				select: function(event, ui) {
					$(this).popup("close");
					//$this.button("option", "label", ui.item.text());
					if(typeof change == "function"){
						change.call($this.closest(".bc-ui-dialog").children(".bc-page")[0],{
							text: ui.item.attr("data-text"),
							value: ui.item.attr("data-value")
						});
					}
				}
			});
			
			//绑定点击按钮就显示下拉菜单
			$contextmenu.popup({trigger: $this}).popup("open");
			
			//标记已初始化
			$this.attr("data-menuInit","true");
		}
		return false;
	}
});

// 基于jQueryUI的下拉框
$document.delegate(".bc-select","click", function(e) {
	var $this = $(this);
	if($this.is("input[type='text']")){//文本框
		$input = $this;
	}else if($this.is(".inputIcon")){//文本框右侧的按钮
		$input = $this.parent().siblings("input[type='text']");
		$input.focus();
	}
	
	if($input.attr("data-bcselectInit") != "true"){
		// 获取自定义的配置
		var option = $.extend({
			delay: 0,
			minLength: 0,
			position: {
				my: "left top",
				at: "left bottom",
				offset:"0 -1",
				collision: "none"
			},
			select: function(event, ui){
				if(logger.debugEnabled)logger.debug("selectItem=" + $.toJSON(ui.item));
				//设置隐藏域字段的值
				$input.val(ui.item.label);
				$input.next().val(ui.item.value);
				
				//返回false禁止autocomplete自动填写值到$input
				return false;
			}
		},$input.data("cfg"));
		
		//获取下拉列表的数据源
		var source = $input.data("source");
		if(logger.debugEnabled)logger.debug("source=" + $.toJSON(source));
		if(source) option.source = source;
		
		// 合并自定义的回调函数
		if(typeof option.callback == "string"){
			var callback = bc.getNested(option.callback);
			if(typeof callback != "function"){
				alert("没有定义的回调函数：callback=" + option.callback);
			}else{
				option.callback = callback;
				var originSelectFn = option.select;
				option.select = function(event, ui){
					// 调用原始的select函数
					if(typeof originSelectFn == "function")
						originSelectFn.apply(this,arguments);
					
					// 再调用自定义的回调函数
					option.callback.apply(this,arguments);
					
					return false;
				}
			}
		}
		
		//初始化下拉列表
		$input.autocomplete(option).autocomplete("widget").addClass("bc-condition-autocomplete");
		
		// 设置下拉列表的最大高度
		var maxHeight = $input.attr("data-maxHeight");
		if(maxHeight){
			$input.autocomplete("widget").css({
				'max-height': maxHeight,/*ie6 unsupport*/
				'overflow-y': 'auto',
				'overflow-x': 'hidden'
				//,'paddin-right': '20px'
			});
		}
		
		// 标记为已经初始化
		$input.attr("data-bcselectInit","true");
	}
	
	// 切换列表的显示
	$input.autocomplete("search", "");

	return false;
});

})(jQuery);
/*
 * 工具条的高级搜索按钮
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function($) {

var idIncrement = 0;

$.widget( "ui.bcsearch", {
	version: "1.0",
	options: {
		position: {
			my: "left top",
			at: "left bottom"
		},
//		show: {
//			effect: "slideDown",
//			duration: "fast"
//		},
		hide: {
			effect: "fadeOut",
			duration: "fast"
		},
		useCleanButton: true,
		cleanAfterClose: false
	},
	_create: function() {
		var $this = this;
		if ( !this.options.trigger ) {
			this.options.trigger = this.element.prev();
		}

		if ( !this.element.attr( "id" ) ) {
			this.element.attr( "id", "ui-popup-" + idIncrement++ );
			this.generatedId = true;
		}

		if ( !this.element.attr( "role" ) ) {
			// TODO alternatives to tooltip are dialog and menu, all three aren't generic popups
			this.element.attr( "role", "dialog" );
			this.generatedRole = true;
		}

		this.options.trigger
			.attr( "aria-haspopup", "true" )
			.attr( "aria-owns", this.element.attr( "id" ) );

		this.element
			.addClass( "ui-popup" );
		this._beforeClose();
		this.element.hide();
		
		// 添加搜索按钮
		if(this.element.children(".operate").size() == 0){
			var tpl = '<div class="operate">';
			
			// 搜索按钮
			tpl += '<button id="doSearchBtn" class="bc-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" '+
						'data-click="bc.toolbar.doAdvanceSearch">'+
						'<span class="ui-button-icon-primary ui-icon ui-icon-search"></span>'+
						'<span class="ui-button-text">查询</span>'+
					'</button>';
			
			// 清空按钮
			if(this.options.useCleanButton){
				tpl += '<button id="doCleanBtn" class="bc-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" '+
							'data-click="bc.toolbar.doAdvanceClean">'+
							'<span class="ui-button-icon-primary ui-icon ui-icon-minus"></span>'+
							'<span class="ui-button-text">清空</span>'+
						'</button>';
			}
			
			tpl += '</div>';

			this.element.append(tpl);
		}
		
		// 添加关闭按钮
		if(this.element.children(".closeBtn").size() == 0){
			this.element.append('<a id="doClose" href="#" class="closeBtn ui-corner-all" title="点击关闭"><span class="ui-icon ui-icon-closethick">关闭</span></a>');
			this.element.children(".closeBtn").click(function(event){
				$this.close( event );
				return false;
			})
			.hover(
				function(){
					$(this).toggleClass("ui-state-hover");
				},
				function(){
					$(this).toggleClass("ui-state-hover");
				}
			);
		}

		this._bind(this.options.trigger, {
			keydown: function( event ) {
				// prevent space-to-open to scroll the page, only happens for anchor ui.button
				if ( $.ui.button && this.options.trigger.is( "a:ui-button" ) && event.keyCode == $.ui.keyCode.SPACE ) {
					event.preventDefault();
				}
				// TODO handle SPACE to open popup? only when not handled by ui.button
				if ( event.keyCode == $.ui.keyCode.SPACE && this.options.trigger.is( "a:not(:ui-button)" ) ) {
					this.options.trigger.trigger( "click", event );
				}
				// translate keydown to click
				// opens popup and let's tooltip hide itself
				if ( event.keyCode == $.ui.keyCode.DOWN ) {
					// prevent scrolling
					event.preventDefault();
					this.options.trigger.trigger( "click", event );
				}
			},
			click: function( event ) {
				event.preventDefault();
				if (this.isOpen) {
					// let it propagate to close
					return;
				}
				clearTimeout( this.closeTimer );
				this._delay(function() {
					this.open( event );
				}, 1);
			}
		});

		if ( !$.ui.menu || !this.element.is( ":ui-menu" ) ) {
			// default use case, wrap tab order in popup
			this._bind({ keydown : function( event ) {
					if ( event.keyCode !== $.ui.keyCode.TAB ) {
						return;
					}
					var tabbables = $( ":tabbable", this.element ),
						first = tabbables.first(),
						last  = tabbables.last();
					if ( event.target === last[ 0 ] && !event.shiftKey ) {
						first.focus( 1 );
						event.preventDefault();
					} else if ( event.target === first[ 0 ] && event.shiftKey ) {
						last.focus( 1 );
						event.preventDefault();
					}
				}
			});
		}

		this._bind({
			focusout: function( event ) {
				// use a timer to allow click to clear it and letting that
				// handle the closing instead of opening again
				
				// 注释的代码，避免点击内部的非输入区就关闭
				//this.closeTimer = this._delay( function() {
				//	this.close( event );
				//}, 100);
			},
			focusin: function( event ) {
				clearTimeout( this.closeTimer );
			}
		});

		this._bind({
			// TODO only triggered on element if it can receive focus
			// bind to document instead?
			// either element itself or a child should be focusable
			keyup: function( event ) {
				if ( event.keyCode == $.ui.keyCode.ESCAPE && this.element.is( ":visible" ) ) {
					this.close( event );
					// TODO move this to close()? would allow menu.select to call popup.close, and get focus back to trigger
					this.options.trigger.focus();
				}
			}
		});

		// 注释的代码，强制由用户自己关闭
//		this._bind(document, {
//			click: function( event ) {
//				logger.info("----document.click in popup");
//				if ( this.isOpen && !$(event.target).closest(".ui-popup").length ) {
//					logger.info("----document.click in popup-close");
//					this.close( event );
//				}
//			}
//		});
	},

	_destroy: function() {
		this.element
			.show()
			.removeClass( "ui-popup" )
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-expanded" )
			.unbind( "keypress.ui-popup");

		this.options.trigger
			.removeAttr( "aria-haspopup" )
			.removeAttr( "aria-owns" );

		if ( this.generatedId ) {
			this.element.removeAttr( "id" );
		}
		if ( this.generatedRole ) {
			this.element.removeAttr( "role" );
		}
	},

	open: function( event ) {
		var position = $.extend( {}, {
			of: this.options.trigger
		}, this.options.position );

		this._show( this.element, this.options.show );
		this.element
			.attr( "aria-hidden", "false" )
			.attr( "aria-expanded", "true" )
			.position( position );

		// can't use custom selector when menu isn't loaded
		if ( $.ui.menu && this.element.is( ":ui-menu" ) ) {
			this.element.menu( "focus", event, this.element.children( "li" ).first() );
			this.element.focus();
		} else {
			// 让关闭按钮获取焦点
			this.element.find("#doClose").focus();
			
			/*
			// set focus to the first tabbable element in the popup container
			// if there are no tabbable elements, set focus on the popup itself
			var tabbables = this.element.find( ":tabbable" );
			this.removeTabIndex = false;
			if ( !tabbables.length ) {
				if ( !this.element.is(":tabbable") ) {
					this.element.attr("tabindex", "0");
					this.removeTabIndex = true;
				}
				tabbables = tabbables.add( this.element[ 0 ] );
			}
			tabbables.first().focus( 1 );
			*/
		}

		// take trigger out of tab order to allow shift-tab to skip trigger
		this.options.trigger.attr( "tabindex", -1 );
		this.isOpen = true;
		this._trigger( "open", event );
	},

	close: function( event ) {
		// 显示高级搜索按钮
		this.options.trigger.show();
		
		// 清空搜索条件
		if(this.options.cleanAfterClose)
			bc.toolbar.doAdvanceClean.call(this,null,this.element);
		
		this._beforeClose();
		this._hide( this.element, this.options.hide );

		this.options.trigger.attr( "tabindex" , 0 );
		if ( this.removeTabIndex ) {
			this.element.removeAttr( "tabindex" );
		}
		this.isOpen = false;
		this._trigger( "close", event );
	},

	_beforeClose: function() {
		this.element
			.attr( "aria-hidden", "true" )
			.attr( "aria-expanded", "false" );
	}
});

}(jQuery));

/**
 * 列表视图的全局处理
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-05-25
 * @depend jquery-ui-1.8,bc.core
 */
(function($) {
bc.grid = {
	/**
	 * 选中行的样式
	 */
	selectedClass: 'ui-state-highlight',//旧版为 'ui-state-default ui-state-focus'
	/**
	 * 是否允许表格的鼠标悬停行样式切换
	 */
	enabledHoverToggle: true,
	/**
	 * 表格型页面的初始化
	 * @param container 对话框内容的jquery对象
	 */
	init: function(container) {
		var $grid = container.find(".bc-grid");
		//滚动条处理
		$grid.find(".data .right").scroll(function(){
			//logger.debug("scroll");
			container.find(".header .right").scrollLeft($(this).scrollLeft());
			container.find(".data .left").scrollTop($(this).scrollTop());
		});
		//记录表格的原始宽度
		//var $data_table = $grid.find(".data .right .table");
		//var originWidth = parseInt($data_table.attr("originWidth"));
		//$data_table.data("originWidth", originWidth);
		//logger.debug("originWidth:" + originWidth);
		
		//绑定并触发一下对话框的resize事件
		//container.trigger("dialogresize");
		bc.grid.resizeGridPage(container);
		container.bind("dialogresize", function(event, ui) {
			bc.grid.resizeGridPage(container);
		});
		
		//禁止选择文字
		$grid.disableSelection();
	},
	/**
	 * 表格型页面改变对话框大小时的处理
	 * @param container 对话框内容的jquery对象
	 */
	resizeGridPage: function(container) {
		var $grid = container.find(".bc-grid");
		if($grid.size()){
			var $data_right = $grid.find(".data .right");
			var $data_left = $grid.find(".data .left");
			var $header_right = $grid.find(".header .right");
			
			//边框加补白的值
			var sw = 0, sh = 0 ;
			if($.support.boxModel){
				sw = $grid.outerWidth()-$grid.width() + ($data_left.outerWidth()-$data_left.width());
				sh = $grid.outerHeight()-$grid.height();
			}
			logger.debug("grid's sh:" + sh);
			logger.debug("grid's sw:" + sw);
			
			//设置右容器的宽度
			$data_right.width(container.width()-$data_left.width()-sw);
			$header_right.width($data_right[0].clientWidth);//当缩小宽度时，因float，会换行导致高度增高，故在设置高度前必须设置一下
			
			//设置右table的宽度
			var $data_table = $data_right.find(".table");
			var $header_table = $header_right.find(".table");
			var originWidth = parseInt($data_table.attr("originWidth"));//$data_table.data("originWidth");//原始宽度
			var clientWidth = $data_right[0].clientWidth;
			var newTableWidth = Math.max(originWidth, clientWidth);
			$data_table.width(newTableWidth);
			$header_table.width(newTableWidth);
			logger.debug("originWidth=" + originWidth);
			logger.debug("newTableWidth=" + newTableWidth);
			
			//累计表格兄弟的高度
			var otherHeight = 0;
			$grid.siblings(":visible:not('.bc-conditionsForm,.boxPointer')").each(function(i){
				otherHeight += $(this).outerHeight(true);
				logger.debug("grid's sibling" + i + ".outerHeight:" + $(this).outerHeight(true));
			});
			logger.debug("grid's siblings.outerHeight:" + otherHeight);
			
			//重设表格的高度
			$grid.height(container.height()-otherHeight-sh);
			
			//再累计表格头和分页条的高度
			$data_right.parent().siblings().each(function(i){
				otherHeight += $(this).outerHeight(true);
			});
			logger.debug("grid's data.otherHeight:" + otherHeight);
			
			//data右容器高度
			$data_right.height(container.height()-otherHeight - sh);
			
			//如果设置data右容器高度后导致垂直滚动条切换显示了，须额外处理一下
			var _clientWidth = $data_right[0].clientWidth;
			if(_clientWidth != clientWidth){//从无垂直滚动条到出现滚动条的处理
				//logger.debug("clientWidth");
				//$data_table.width(_clientWidth);
				//newTableWidth = _clientWidth;
				$header_right.width($data_right[0].clientWidth);
			}
			
			//header宽度(要减去data区的垂直滚动条宽度)
			//$header_right.width($data_right[0].clientWidth);
			//$header_right.find(".table").width(newTableWidth);
			
			//data左容器高度(要考虑data右容器水平滚动条高度)
			//logger.debug("grid's data.clientHeight:" + $data_right[0].clientHeight);
			$grid.find(".data .left").height($data_right[0].clientHeight);
			
			//logger.debug(":::" + $grid.find(".header").outerHeight(true)  + "," + $grid.find(".header")[0].clientHeight);
			//logger.debug("width2:" + $data_table.width());
		}
	},
	/**
	 * 对指定table的tbody的行数据进行排序
	 * @param $tbody table的tbody对应的jquery对象
	 * @param tdIndex 要进行排序的单元格在行中的索引号
	 * @param dir 排序的方向：1--正向，-1--反向
	 */
	sortTable: function($tbody,tdIndex,dir){
		if(!$tbody.size()) return;
		var tbody = $tbody[0];
		var rows = tbody.rows;
		var trs = new Array(rows.length);
		for(var i=0;i<trs.length;i++){
			trs[i]=rows[i];//rows(i)
			trs[i].setAttribute("prevIndex",i);//记录未排序前的顺序
		}
		//数组排序
		trs.sort(function(tr1,tr2){
			var v1 = tr1.cells[tdIndex].innerHTML;
			var v2 = tr2.cells[tdIndex].innerHTML;
			//英文永远在中文前面，子chrome11测试不通过
			return dir * v1.localeCompare(v2);
		});
		//交换表格的行到新的顺序
		var t = [];
		var notFirefox = !$.browser.mozilla;
		for(var i=0;i<trs.length;i++){
			//firefox不支持outerHTML;
			t.push(notFirefox ? trs[i].outerHTML : document.createElement("div").appendChild(trs[i].cloneNode(true)).parentNode.innerHTML);
		}
		$tbody.html(t.join(""));
		//tbody.innerHTML = t.join("");//ie中不支持，tbody的innerHTML为只读
		
		return trs;//返回排好序的tr列表
	},
	/**重新加载表格的数据部分
	 * @param $page 页面dom的jquery对象
	 * @param option 特殊配置参数
	 * @option url 加载数据的url
	 * @option data 请求将附加的数据
	 * @option callback 请求数据完毕后的处理函数
	 */
	reloadData: function($page,option) {
		var fromMID = $page.attr("data-from");
		logger.info("grid.reloadData:fromMID=" + fromMID);
		if(fromMID){
			if($page.is("[data-fromType='tab']")){// $page来源于页签内的视图
				$page = $(".bc-ui-dialog>.bc-page .bc-page[data-mid='" + fromMID + "']");
				if($page.size() == 0){
					logger.info("找不到相应的原始页签，忽略不作处理！fromMID=" + fromMID);
					return;
				}
			}else{// $page来源于对话框视图
				$page = $(".bc-ui-dialog>.bc-page[data-mid='" + fromMID + "']");
				if($page.size() == 0){
					logger.info("找不到相应的原始对话框，忽略不作处理！fromMID=" + fromMID);
					return;
				}
			}
		}
		
		var ts = "grid.reloadData." + $page.attr("data-mid");
		logger.profile(ts);
		// 显示加载动画
		var $win = $page.parent();
		var $loader = $win.append('<div id="bc-grid-loader"></div>').find("#bc-grid-loader");
		$loader.css({
			top: ($win.height() - $loader.height())/2,
			left: ($win.width() - $loader.width())/2
		});
		
		option = option || {};
		var url=option.url || $page.attr("data-namespace") + "/data";
		logger.debug("reloadWin:loading grid data from url=" + url);
		
		var data = option.data || {};
		
		//==附加的额外的请求参数
		//  从page取
		var extras = $page.data("extras");
		logger.debug("page extras=" + $.toJSON(extras));
		if(extras){
			data = $.extend(data, extras);
		}else{
			//  从grid取
			extras = $page.find(".bc-grid").data("extras");
			logger.debug("grid extras=" + $.toJSON(extras));
			if(extras){
				data = $.extend(data, extras);
			}
		}

		//附加排序参数
		var $sortColumn = $page.find(".bc-grid .header .table td.sortable.asc,.bc-grid .header .table td.sortable.desc");
		if($sortColumn.size()){
			var sort = "";
			var $t;
			$sortColumn.each(function(i){
				$t = $(this);
				sort += (i == 0 ? "" : ",") + $t.attr("data-id") + ($t.hasClass("asc") ? " asc" : " desc");
			});
			data["sort"] = sort;
			if(extras)extras.sort = sort;
		}
		
		//附加分页参数
		var $pager_seek = $page.find("ul.pager>li.seek");
		if($pager_seek.size()){
			data["page.pageNo"] = $pager_seek.find("#pageNo").text();
			data["page.pageSize"] = $pager_seek.parent().find("li.size>a.ui-state-active>span.pageSize").text();
		}
		
		//附加搜索条件的参数  TODO 高级搜索
		var $search = $page.find(".bc-toolbar #searchText");
		if($search.size()){
			var searchText = $search.val();
			if(searchText && searchText.length > 0){
				data.search = searchText;
				if(extras) extras.search = searchText;
			}else{
				delete data.search;
				if(extras) delete extras.search;
			}
		}
		
		//记住原来的水平滚动参数
		var oldScrollLeft = $page.find(".data .right").scrollLeft();
		
		//重新加载数据
		bc.ajax({
			url : url, data: data,
			dataType : "html",
			type: "POST",
			success : function(html) {
				var $data = $page.find(".bc-grid .data");
				$data.empty().replaceWith(html);//整个data更换
				$data = $page.find(".bc-grid .data");//重新获取data对象
				bc.grid.init($page);
				
				//恢复水平滚动参数
				if(oldScrollLeft > 0){
					logger.info("scroll4Left...");
					$data.find(".right").scrollLeft(oldScrollLeft);
				}
				
				//如果总页数变了，就更新一下
				var newPageCount = $data.attr("data-pageCount");
				logger.debug("grid's newPageCount=" + newPageCount);
				if(newPageCount){
					var $pageCount = $page.find("#pageCount");
					if($pageCount.text() != newPageCount)
						$pageCount.text(newPageCount);
				}
				var newTotalCount = $data.attr("data-totalCount");
				logger.debug("grid's newTotalCount=" + newTotalCount);
				if(newTotalCount){
					var $totalCount = $page.find("#totalCount");
					if($totalCount.text() != newTotalCount)
						$totalCount.text(newTotalCount);
				}
				
				//删除加载动画
				$loader.remove();
				logger.profile(ts);
				
				//调用回调函数
				if(typeof option.callback == "function")
					option.callback.call($page[0]);
			}
		});
	},
	/** 获取grid中选中行的id信息
	 * @param $grid grid的jquery对象
	 */
	getSelected: function($grid,option){
		var $tds = $grid.find(">.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			return [$tds.attr("data-id")];
		}else if($tds.length > 1){
			var r = [];
			$tds.each(function(i){
				r.push($(this).attr("data-id"));
			});
			return r;
		}else{
			return [];
		}
	}
};

//表格分页条按钮控制
$("ul .pagerIcon").live("mouseover", function() {
	$(this).addClass("ui-state-hover");
}).live("mouseout", function() {
	$(this).removeClass("ui-state-hover");
});
//点击扩展按钮
$("ul li.pagerIcon").live("click", function() {
	var $this = $(this);
	var action = $this.attr("data-action");//内定的操作
	var callback = $this.attr("data-callback");//回调函数
	callback = callback ? bc.getNested(callback) : undefined;//转换为函数
	var $page = $this.closest(".bc-page");
	switch (action){
	case "refresh"://刷新视图
		//重新加载列表数据
		bc.grid.reloadData($page);
		break;
	case "changeSortType"://切换本地排序和远程排序
		$this.toggleClass("ui-state-active");
		if($this.hasClass("ui-state-active")){
			$this.attr("title",$this.attr("title4clickToLocalSort"));
			$this.closest(".bc-grid").attr("remoteSort","true");
		}else{
			$this.attr("title",$this.attr("title4clickToRemoteSort"));
			$this.closest(".bc-grid").attr("remoteSort","false");
		}
		break;
	case "print"://打印视图
		window.print();
		break;
	case "export"://导出视图
		if(bc.grid.export2Excel)
			bc.grid.export2Excel($page.find(".bc-grid"),this);
		else
			alert("'bc.grid.export2Excel'未定义");
		break;
	default ://调用自定义的函数
		var click = $this.attr("data-click");
		if(typeof click == "string")
			click = bc.getNested(click);//将函数名称转换为函数
		if(typeof click == "function")
			click.call(pageEl,callback);
		break;
	}
	
	return false;
});
//点击分页按钮
$("ul li.pagerIconGroup.seek>.pagerIcon").live("click", function() {
	var $this = $(this);
	var $seek = $this.parent();
	var $pageNo = $seek.find("#pageNo");
	var curPageNo = parseInt($pageNo.text());
	var curPageCount = parseInt($seek.find("#pageCount").text());
	
	var reload = false;
	switch (this.id){
	case "toFirstPage"://首页
		if(curPageNo > 1){
			$pageNo.text(1);
			reload = true;
		}
		break;
	case "toPrevPage"://上一页
		if(curPageNo > 1){
			$pageNo.text(curPageNo - 1);
			reload = true;
		}
		break;
	case "toNextPage"://下一页
		if(curPageNo < curPageCount){
			$pageNo.text(curPageNo + 1);
			reload = true;
		}
		break;
	case "toLastPage"://尾页
		if(curPageNo < curPageCount){
			$pageNo.text(curPageCount);
			reload = true;
		}
		break;
	default :
		//do nothing
	}
	logger.debug("reload=" + reload + ",id=" + this.id + ",curPageNo=" + curPageNo + ",curPageCount=" + curPageCount);
	
	//重新加载列表数据
	if(reload) bc.grid.reloadData($seek.closest(".bc-page"));
	
	return false;
});
//点击pageSize按钮
$("ul li.pagerIconGroup.size>.pagerIcon").live("click", function() {
	var $this = $(this);
	if($this.hasClass("ui-state-active")) return;//不处理重复的点击
	
	$this.addClass("ui-state-active").siblings().removeClass("ui-state-active");
	
	//重设置为第一页
	$this.closest("ul.pager").find("#pageNo").text(1);

	//重新加载列表数据
	bc.grid.reloadData($this.closest(".bc-page"));
	
	return false;
});

//单击行、双击行、鼠标悬停及离开行
var _bc_grig_tr_live = "click dblclick";
if(bc.grid.enabledHoverToggle) _bc_grig_tr_live += " mouseover mouseout";
$(".bc-grid>.data tr.row").live(_bc_grig_tr_live,function(event){
	//处理选中行的样式
	var $this = $(this);
	var index = $this.index();
	var $row = $this.closest(".right,.left").siblings().find("tr.row:eq("+index+")");
	if (event.type == 'click') {				// 单击行
		logger.info("event.type=" + event.type);
		$row.add(this).toggleClass(bc.grid.selectedClass)
		.find("td.id>span.ui-icon").toggleClass("ui-icon-check");
		
		var $grid = $this.closest(".bc-grid");
		if($grid.hasClass("singleSelect")){//处理单选：其他已选中行样式的恢复
			$row.add(this).siblings("."+bc.grid.selectedClass).removeClass(bc.grid.selectedClass)
			.find("td.id>span.ui-icon").removeClass("ui-icon-check");
		}
	}else if (event.type == 'dblclick') {		// 双击行
		logger.info("event.type=" + event.type);
		$row.add(this).toggleClass(bc.grid.selectedClass,true)
		.find("td.id>span.ui-icon").toggleClass("ui-icon-check",true);
		
		$row.add(this).siblings("."+bc.grid.selectedClass).removeClass(bc.grid.selectedClass)
		.find("td.id>span.ui-icon").removeClass("ui-icon-check");

		var $page = $this.closest(".bc-page");
		var $grid = $this.closest(".bc-grid");
		
		var dblClickRowFnStr = $grid.attr("data-dblclickrow");// 双击行的回调函数
		if(dblClickRowFnStr && dblClickRowFnStr.length >= 0){
			var dblClickRowFn = bc.getNested(dblClickRowFnStr);
			if(!dblClickRowFn){
				alert("函数'" + dblClickRowFnStr + "'没有定义！");
			}else{
				//上下文为页面
				dblClickRowFn.call($page[0]);
			}
		}
	}else if (event.type == 'mouseover' || event.type == 'mouseout') {	// 鼠标悬停及离开行
		$row.add(this).toggleClass("ui-state-hover");
	}
});

//超链接的点击处理
$(".bc-grid>.data>.right tr.row .bc-link").live("click",function(event){
	var $this = $(this);
	var url = $this.attr("href");
	//var mtype = $this.attr("data-mtype");
	if(url && url.length >= 0){
		bc.page.newWin({
			url:url,
			mid: $this.attr("data-mid") || url,
			name: $this.attr("data-title") || $this.text() || "未定义"
		});
	}else{
		alert("超链接的 href 为空！");
	}
	
	event.preventDefault();
	return false;
});

//全选与反选
$(".bc-grid>.header td.id>span.ui-icon").live("click",function(){
	var $this = $(this);
	var $grid = $this.closest(".bc-grid");
	if($grid.hasClass("singleSelect")){
		//单选就不作处理
		return;
	}
	
	$this.toggleClass("ui-icon-notice ui-icon-check");
	var check = $this.hasClass("ui-icon-check");
	$this.closest(".header").next().find("tr.row")
	.toggleClass("ui-state-highlight",check)
	.find("td.id>span.ui-icon").toggleClass("ui-icon-check",check);
});

//列表的排序
$(".bc-grid>.header>.right tr.row>td.sortable").live("click",function(){
	logger.debug("sortable");
	//标记当前列处于排序状态
	var $this = $(this).toggleClass("current",true);
	
	//将其他列的排序去除
	$this.siblings(".current").removeClass("current asc desc")
	.find("span.ui-icon").addClass("hide").removeClass("ui-icon-triangle-1-n ui-icon-triangle-1-s");
	
	var $icon = $this.find("span.ui-icon");
	//切换排序图标
	var dir = 0;
	if($this.hasClass("asc")){//正序变逆序
		$this.removeClass("asc").addClass("desc");
		$icon.removeClass("hide ui-icon-triangle-1-n").addClass("ui-icon-triangle-1-s");
		dir = -1;
	}else if($this.hasClass("desc")){//逆序变正序
		$this.removeClass("desc").addClass("asc");
		$icon.removeClass("hide ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-n");
		dir = 1;
	}else{//无序变正序
		$this.addClass("asc");
		$icon.removeClass("hide").addClass("ui-icon-triangle-1-n");
		dir = 1;
	}

	//排序列表中的行
	var $grid = $this.closest(".bc-grid");
	var tdIndex = this.cellIndex;//要排序的列索引
	var remoteSort = $grid.attr("remoteSort") === "true";//是否远程排序，默认本地排序
	if(remoteSort){//远程排序
		logger.profile("do remote sort:");
		bc.grid.reloadData($grid.closest(".bc-page"),{
			callback:function(){
				logger.profile("do remote sort:");
			}
		});
	}else{//本地排序
		logger.profile("do local sort:");
		//对数据所在table和id所在table进行排序
		var rightTrs = bc.grid.sortTable($grid.find(">.data>.right>table.table>tbody"), tdIndex, dir);
		
		//根据上述排序结果对id所在table进行排序
		var $tbody = $grid.find(">.data>.left>table.table>tbody");
		if(!$tbody.size()) return;
		var rows = $tbody[0].rows;
		var trs = new Array(rows.length);
		for(var i=0;i<trs.length;i++){
			trs[i]=rows[parseInt(rightTrs[i].getAttribute("prevIndex"))];//rows(i)
		}
		//交换表格的行到新的顺序
		var t = [];
		var notFirefox = !$.browser.mozilla;
		for(var i=0;i<trs.length;i++){
			//firefox不支持outerHTML;
			t.push(notFirefox ? trs[i].outerHTML : document.createElement("div").appendChild(trs[i].cloneNode(true)).parentNode.innerHTML);
		}
		$tbody.html(t.join(""));
		
		logger.profile("do local sort:");
	}
});

})(jQuery);
/**
 * 列表视图插件：导出为Excel
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-01
 * @depend list.js
 */
(function($) {

/**
 * 显示导出视图数据的配置界面-->用户选择-->导出excel
 * @param $grid 表格的jquery对象
 * @param el 导出按钮对应的dom元素
 */
bc.grid.export2Excel = function($grid,el) {
	//获取要导出的列名
	
	var html=[];
	html.push('<form class="bc-export" name="exporter" method="post">');
	
	//分页时添加“确认导出范围”
	var paging = $grid.find("li.pagerIconGroup.seek").size() > 0;
	if(paging){//分页
		html.push('<div class="rangeTitle">确认导出范围</div>'
			+'<ul class="rangeUl"><li>'
			+'<label for="exportScope1"><input type="radio" id="exportScope1" name="exportScope" value="1" checked><span>当前页</span></label>'
			+'<label for="exportScope2"><input type="radio" id="exportScope2" name="exportScope" value="2"><span>全部</span></label>'
			+'</li></ul>');
	}
	
	//添加剩余的模板内容
	html.push('<div class="headersTitle">选择导出字段</div>'
		+'<table class="headersTable" cellspacing="2" cellpadding="0"><tbody><tr>{0}</tr></tbody></table>'
		+'<div class="buttons">'
		+'<a id="continue" style="text-decoration:underline;cursor:pointer;">继续</a>&nbsp;&nbsp;'
		+'<a id="cancel" style="text-decoration:underline;cursor:pointer;">取消</a>&nbsp;&nbsp;'
		+'<a id="reverse" style="text-decoration:underline;cursor:pointer;">反选</a></div>'
		+'<input type="hidden" name="search">'
		+'<input type="hidden" name="exportKeys">'
		+'</form>');
	
	//获取列的定义信息
	var headerIds=[],headerNames=[];
	var fields = []
	var columns = $grid.find("div.header>div.right>table.table td");
	var maxh = 12;											// 控制1列最多输出的条目数
	var totalCount = columns.size();						// 总条目数
	var splitCount,headerCount;
	if(headerCount <= maxh ){
		splitCount = 1;
		headerCount = totalCount;
	}else{
		splitCount = Math.ceil(totalCount / maxh);			// 判断要分开为几大列
		headerCount = Math.ceil(totalCount / splitCount);	// 每列实际的条目数：尽量平均分配
	}
	
	if(logger.debugEnabled){
		logger.debug("splitCount=" + splitCount);
		logger.debug("headerCount=" + headerCount);
		logger.debug("totalCount=" + totalCount);
	}
	var allHeaders  = [];
	var _ul,index,$column;
	for(var i=0;i<splitCount;i++){
		_ul = [];
		_ul.push('<td class="headersTd"><ul>');
		for(var j=0;j<headerCount;j++){
			index = j + i * headerCount;
			if(index >= totalCount){
				break;
			}else{
				$column = $(columns[index]);
				_ul.push('<li>'
					+'<label>'
					+'<input type="checkbox" name="field" value="'+$column.attr("data-id")+'" checked>'
					+'<span>'+$column.attr("data-label")+'</span></label></li>');
			}
		}
		_ul.push('</ul></td>');
		allHeaders.push(_ul.join(""));
	}
	html = html.join("").format(allHeaders.join(""));
	
	//显示“确认导出”窗口
	var boxPointer = bc.boxPointer.show({
		of:el,dir:"top",close:"click",
		offset:"-8 -4",
		iconClass:null,
		appendTo: $grid.closest(".ui-dialog"),
		content:html
	});
	
	//取消按钮
	boxPointer.find("#cancel").click(function(){
		boxPointer.remove();
		return false;
	});
	
	//继续按钮
	boxPointer.find("#continue").click(function(){
		var $page = $grid.parents(".bc-page");
		var url=$page.attr("data-namespace") + "/export";
		logger.info("export grid data by url=" + url);
		var data = {};
		
		//导出格式
		data.exporting=true;
		data.exportFormat="xls";
		
		//导出范围
		var exportScope = boxPointer.find(":radio:checked[name='exportScope']").val();
		if(exportScope) data.exportScope=exportScope;
		
		//分页参数
		var $pager_seek = $page.find("ul.pager>li.seek");
		if(paging && data.exportScope != "2"){//视图为分页视图，并且用户没有选择导出范围为"全部"
			data["page.pageNo"] = $pager_seek.find("#pageNo").text();
			data["page.pageSize"] = $pager_seek.parent().find("li.size>a.ui-state-active>span.pageSize").text();
		}
		
		//附加页面的data-extras参数
		//  从page取
		var extras = $page.data("extras");
		logger.debug("page extras=" + $.toJSON(extras));
		if(extras){
			data = $.extend(data, extras);
		}else{
			//  从grid取
			extras = $page.find(".bc-grid").data("extras");
			logger.debug("grid extras=" + $.toJSON(extras));
			if(extras){
				data = $.extend(data, extras);
			}
		}
		
		//附加排序参数
		var $sortColumn = $page.find(".bc-grid .header .table td.sortable.asc,.bc-grid .header .table td.sortable.desc");
		if($sortColumn.size()){
			var sort = "";
			var $t;
			$sortColumn.each(function(i){
				$t = $(this);
				sort += (i == 0 ? "" : ",") + $t.attr("data-id") + ($t.hasClass("asc") ? " asc" : " desc");
			});
			data["sort"] = sort;
		}
		
		//将简单的参数附加到url后
		url += "?" + $.param(data);
		
		//附加要导出的列参数到隐藏域
		var $fields = boxPointer.find(":checkbox:checked[name='field']");
		if($fields.size() == 0){
			bc.msg.slide("必须至少选择一列信息！");
			return false;
		}
		if($fields.size() != columns.size()){//用户去除了部分的列没选择
			var t="";
			$fields.each(function(i){
				t+= (i == 0 ? "" : ",") + this.value;
			});
			boxPointer.find(":hidden[name='exportKeys']").val(t);
		}
		
		//附加搜索条件的参数到隐藏域(避免中文乱码) TODO 高级搜索
		var $search = $page.find(".bc-toolbar #searchText");
		if($search.size()){
			var searchText = $search.val();
			if(searchText && searchText.length > 0)
				boxPointer.find(":hidden[name='search']").val(searchText);
		}
		
		//提交表单
		var _form = boxPointer.find("form")[0];
		_form.action = url;
		_form.target = "blank";//这个需要在主页中配置一个名称为blank的iframe来支持
		_form.submit();
		
		//删除弹出的窗口
		boxPointer.remove();
		return false;
	});
	
	//反选按钮
	boxPointer.find("#reverse").click(function(){
		boxPointer.find(":checkbox[name='field']").each(function(){
			this.checked = !this.checked;
		});

		return false;
	});
};

})(jQuery);
/**
 * 表单的全局处理
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 */
bc.form = {
	/** 全局初始化表单元素的事件绑定,
	 * 在表单加载后由系统自动调用进行绑定，
	 * 函数的第一参数为表单元素的容器对象
	 */
	init : function($form,option,readonly) {
		logger.info("bc.form.init:readonly=" + readonly);
		
		//绑定富文本编辑器
		$form.find("textarea.bc-editor").filter(":not('.custom')").each(function(){
			$this = $(this);
			$this.xheditor(bc.editor.getConfig({
				ptype: $this.attr("data-ptype"),
				puid: $this.attr("data-puid"),
				readonly: "true" == $this.attr("data-readonly"),
				tools: $this.attr("data-tools")
			}));
		});
		
		if(!readonly){
			//绑定日期选择
			bc.form.initCalendarSelect($form);
			
			//绑定flash上传附件
			$form.find(".attachs.flashUpload").has(":file.uploadFile").each(function(){
				bc.attach.flash.init.call(this);
			});
		}else{
			//只读表单的处理
			$form.find(":input:visible:not('.custom')").each(function(){
				logger.debug("disabled:" + this.name);
				if(this.nodeName.toLowerCase() == "select")
					this.disabled=true;
				else
					this.readOnly=true;
			});
			$form.find("ul.inputIcons,span.selectButton").each(function(){
				$(this).hide();
			});
		}
		
		// 绑定多页签处理
		$form.find(".formTabs").filter(":not('.custom')").each(function(){
			$this = $(this);
			var $tabs = $this.bctabs(bc.page.defaultBcTabsOption);
			$form.bind("dialogresize", function(event, ui) {
				bc.form.resizeFromTabs.call($tabs,$form);
			});
		});
	},
	
	/** 重新调整tab的尺寸
	 */
	resizeFromTabs : function($form) {
		if(logger.debugEnabled)logger.debug("resizeFromTabs");
		this.bctabs("resize");
	},
	
	/** 初始化日期、时间控件的事件绑定
	 */
	initCalendarSelect : function($form) {
		$form.find('.bc-date[readonly!="readonly"],.bc-time[readonly!="readonly"],.bc-datetime[readonly!="readonly"]')
		.filter(":not('.custom')")
		.each(function bindSelectCalendar(){
			var $this = $(this);
			var cfg = $this.attr("data-cfg");
			if(cfg && cfg.length > 0){
				cfg = eval("(" + cfg + ")");
			}else{
				cfg = {};
			}
			if(typeof cfg.onSelect == "string"){
				var fn = bc.getNested(cfg.onSelect);
				if(typeof fn != "function"){
					alert('函数“' + cfg.onSelect + '”没有定义！');
					return false;
				}
				cfg.onSelect = fn;
			}
			cfg = jQuery.extend({
				//showWeek: true,//显示第几周
				//showButtonPanel: true,//显示今天按钮
				//changeMonth: true,//显示月份下拉框
				changeYear: true,//显示年份下拉框
				showOtherMonths: true,
				selectOtherMonths: true,
				firstDay: 7,
				dateFormat:"yy-mm-dd"//yy4位年份、MM-大写的月份
			},cfg);
			
			// 额外的处理
			if(cfg.addYear){//自动将另一控件的值设置为此控件值加指定年份后的值的处理
				logger.debug("addYear=" + cfg.addYear);
				var ss = cfg.addYear.split("|");
				var $toField;
				if(ss.length < 2){//自动找到另一个控件
					$toField = $this.parent(".bc-dateContainer").siblings(".bc-dateContainer")
					.children("input[type='text']");
				}else{
					//按类似“3 1 -2|fieldName”的格式解析出另一个控件，“3 1 -2”表示加3年再加1月再减2日
					$toField = $form.find("input[name='" + ss[1] + "']");
				}

				if($toField.length){
					var oldFun = cfg.onSelect;
					cfg.onSelect = function(dateText,inst){
						// 转换字符串为日期值：http://docs.jquery.com/UI/Datepicker/parseDate
						var _date = $.datepicker.parseDate(cfg.format || 'yy-mm-dd', dateText);
						var sss = ss[0].split(" ");
						_date.setFullYear(_date.getFullYear() + parseInt(sss[0]));//加年
						if(sss.length > 1)_date.setMonth(_date.getMonth() + parseInt(sss[1]));//加月
						if(sss.length > 2)_date.setDate(_date.getDate() + parseInt(sss[2]));//加日
						if(sss.length > 3)_date.setHours(_date.getHours() + parseInt(sss[3]));//加时
						if(sss.length > 4)_date.setMinutes(_date.getMinutes() + parseInt(sss[4]));//加分
						if(sss.length > 5)_date.setSeconds(_date.getSeconds() + parseInt(sss[5]));//加秒
						
						// 设置联动值：http://docs.jquery.com/UI/Datepicker/formatDate
						$toField.val($.datepicker.formatDate(cfg.format || 'yy-mm-dd',_date));
						
						//调用原来的回调函数
						if(typeof oldFun == "function"){
							return oldFun.call(this,dateText,inst);
						}
					};
				}
			}
			
			//重构回调函数，使控件重新获取焦点
			cfg.onClose = function(){
				$this.focus();
			}
			
			if($this.hasClass('bc-date'))
				$this.datepicker(cfg);
			else if($this.hasClass('bc-datetime'))
				$this.datetimepicker(cfg);
			else
				$this.timepicker(cfg);
		});
	}
};

var $document = $(document);
//表单域内的选择按钮鼠标样式切换
$document.delegate("li.inputIcon",{
	mouseover: function() {
		$(this).addClass("hover");
	},
	mouseout: function() {
		$(this).removeClass("hover");
	}
});
/**
 * 清空选择的自动处理
 * 
 * 使用方法：
 * 在带有此样式的元素中配置data-cfg属性来控制要清空值的元素和控制回调函数，格式为：
 * {callback:[函数全称],fields:[用逗号连接的多个控件名称的字符串]}；
 * 不配置此属性时视为标准“ul.inputIcons”结构中“.clearSelect”元素，自动获取“ul.inputIcons”
 * 的兄弟元素（input[type='text'],input[type='hidden']）进行内容清空
 * 
 */
$document.delegate(".clearSelect",{
	click: function() {
		var $this = $(this);
		var cfg = $this.attr("data-cfg");
		if(cfg){
			if(/^\{/.test($.trim(cfg))){	//对json格式进行解释
				cfg = eval("(" + cfg + ")");
			}else{							// 将简易配置转换为标准配置
				cfg = {fields:cfg};
			}
		}else{
			cfg = {};
		}
		if(logger.debugEnabled)logger.debug("cfg=" + $.toJSON(cfg));
		
		// 清空相关元素的值
		if(!cfg.fields){// 按标准结构获取要清空值的元素
			cfg.fields = $this.parent("ul.inputIcons").siblings("input[type='text'],input[type='hidden']");
			cfg.fields.val("");// 清空值
		}else{// 简易配置的处理（用逗号连接的多个控件名称的字符串）
			var nvs = cfg.fields.split(",");
			var c;
			var $form = $this.closest("form");
			for(var i=0;i<nvs.length;i++){
				c = nvs[i].split("=");// 有等于号相当于配置其默认值而不是清空
				$form.find(":input[name='" + c[0] + "']").val(c.length > 1 ? c[1] : "");
			}
		}
		
		// 调用回调函数
		if(typeof cfg.callback == "string"){
			var callback = bc.getNested(cfg.callback);
			if(typeof callback != "function"){
				alert(this.name + "指定的回调函数没有定义：cfg.callback=" + cfg.callback);
			}else{
				callback.apply(this,arguments);
			}
		}
	}
});
//选择日期的自动处理
$document.delegate(".selectCalendar",{
	click: function() {
		var $this = $(this);
		var fieldName = $this.attr("data-cfg");
		if(logger.debugEnabled)logger.debug("fieldName=" + fieldName);
		var $calendarField;
		if(!fieldName){
			// 自动查找临近的元素
			$calendarField = $this.parent("ul.inputIcons").siblings("input[type='text']");
			
			//alert("没有配置dom元素data-cfg属性的值，无法处理！");
		}else{
			var f = "[name='" + fieldName + "']";
			$calendarField = $this.closest("form").find("input.bc-date" + f + "," + "input.bc-datetime" + f + "," + "input.bc-time" + f);
		}
		
		$calendarField.each(function(){
			var $this = $(this);
			if($this.hasClass('bc-date'))
				$this.datepicker("show");
			else if($this.hasClass('bc-datetime'))
				$this.datetimepicker("show");
			else
				$this.timepicker("show");
		});
	}
});
/**
 * BoxPointer控件
 *
 * @author rongjihuang@gmail.com
 * @date 2011-05-04
 * @dep jquery
 */
bc.boxPointer = {
	id:0,
	
	/** 默认的 */
	TPL: '<div class="boxPointer ui-widget ui-state-highlight ui-corner-all"><div class="content"></div><s class="pointerBorder"><i class="pointerColor"></i></s></div>',
	OK: "确定",
	CANCEL: "取消",
	CSS_TOP:{},
	
    /** 提示框 
     * @param {Object} option 配置对象
     * @param {option} dir 箭头的指向，默认为auto,可强制top、bottom、left、right 4个方向
     * @param {option} content 显示的内容
     * @param {option} close 关闭方式：click--默认的点击关闭、auto--自动关闭(5秒后)、[number]--多少毫秒后关闭
     * @param {option} my 参考position插件
     * @param {option} at 参考position插件
     * @param {option} of 参考position插件
     * @param {option} offset 参考position插件
     */
    show: function(option){
    	option = $.extend({
    		close:"auto",
    		dir:"bottom",
    		content:"undefined content!",
    		of: document.body,
    		iconClass: "ui-icon-alert",
    		appendTo: "body"
    	},option);
		var target = $(option.of);
		
		var id = bc.boxPointer.id++;
		
		//附加bpid到dom中
		target.data("bpid",id);

		//自动生成容器
		var boxPointer = $(bc.boxPointer.TPL).appendTo(option.appendTo).attr("id","boxPointer"+id);
		
		//添加关闭按钮
		boxPointer.append('<a href="#" class="close ui-state-default ui-corner-all"><span class="ui-icon ui-icon-closethick"></span></a>')
		.find("a.close")
		.click(function(){
			$(this).parent().unbind().remove();
			return false;
		}).hover(
		  function () {
		    $(this).addClass("ui-state-hover");
		  },
		  function () {
		    $(this).removeClass("ui-state-hover");
		  }
		);

		if(option.close != "click" ){//自动关闭的配置
			if(option.close == "auto")
				option.close = 5000;
			
			//自动关闭
			setTimeout(function(){
				boxPointer.unbind().hide("fast",function(){
					//移除之前记录到dom中的bpid
					target.removeData("bpid");
					//彻底删除元素
					boxPointer.remove();
				});
			},option.close);
		}
		
		//添加内容
		var content = boxPointer.find(".content");
		if(option.iconClass)
			content.append('<span class="ui-icon '+option.iconClass+'" style="float:left;margin-right:.3em;;margin-top:.2em;"></span>')//图标
		content.append(option.content);//内容
		
		//控制小箭头的生成及定位
		var p={};
		var borderColor = boxPointer.css("border-top-color");
		var backColor = boxPointer.css("background-color");
		if(logger.debugEnabled)logger.debug("border-color=" + borderColor + ",background-color=" + backColor);
		var pointerBorder = boxPointer.find(".pointerBorder").css({
			"border-color": "transparent",
			"border-style": "dashed"
		});
		var pointerColor = boxPointer.find(".pointerColor").css({
			"border-color": "transparent",
			"border-style": "dashed"
		});
		if(option.dir=="top"){
			p.my="left bottom";
			p.at="left top";
			p.offset = option.offset || "0 -4";
			//border颜色设置为与boxPointer的边框色相同
			pointerBorder.css({
				"border-top-color": borderColor,
				"border-top-style": "solid",
				"bottom": "-20px","left": "10px"
			});
			//border颜色设置为与boxPointer的背景色相同
			pointerColor.css({
				"border-top-color": backColor,
				"border-top-style": "solid",
				"bottom": "-9px","left": "-10px"
			});
		}else if(option.dir=="right"){
			p.my="left top";
			p.at="right top";
			p.offset = option.offset || "4 -10";
			//border颜色设置为与boxPointer的边框色相同
			pointerBorder.css({
				"border-right-color": borderColor,
				"border-right-style": "solid",
				"top": "10px","left": "-20px"
			});
			//border颜色设置为与boxPointer的背景色相同
			pointerColor.css({
				"border-right-color": backColor,
				"border-right-style": "solid",
				"top": "-10px","left": "-9px"
			});
		}else if(option.dir=="left"){
			p.my="right top";
			p.at="left top";
			p.offset = option.offset || "-4 -10";
			//border颜色设置为与boxPointer的边框色相同
			pointerBorder.css({
				"border-left-color": borderColor,
				"border-left-style": "solid",
				"top": "10px","right": "-20px"
			});
			//border颜色设置为与boxPointer的背景色相同
			pointerColor.css({
				"border-left-color": backColor,
				"border-left-style": "solid",
				"top": "-10px","right": "-9px"
			});
			boxPointer.find("a.close").css({
				"left":"-8px",
				"right":"auto"
			});
		}else{//bottom
			p.my="left top";
			p.at="left bottom";
			p.offset = option.offset || "0 4";
			//border颜色设置为与boxPointer的边框色相同
			pointerBorder.css({
				"border-bottom-color": borderColor,
				"border-bottom-style": "solid",
				"top": "-20px","left": "10px"
			});
			//border颜色设置为与boxPointer的背景色相同
			pointerColor.css({
				"border-bottom-color": backColor,
				"border-bottom-style": "solid",
				"top": "-9px","left": "-10px"
			});
		}
		p.of=option.of;
		
		//显示及定位
		boxPointer.show().position(p);
		return boxPointer;
    }
};
/**
 * JS、CSS文件加载器
 *
 * @author rongjihuang@gmail.com
 * @date 2011-04-11
 * @ref modify from nbl.plus.js v2.0
 */

if(!window['bc'])window['bc']={};
bc.loader = {
	c: document,
	q: {}, // The dictionary that will hold the script-queue
	n: null,
	
	// The loader function
	//
	// Called with an array, it will interpret the options array
	// Called without an array it will try to load the options from the script-tag's data-nbl attribute
	l: function(a) { 
		//alert(a);
		var b, c, x, y, z, s, l, i = j = 0, m = bc.loader; m.h = m.c.head || m.c.body;
		
		// The timeout counter, counts backwards every 50ms from 50 ticks (50*50=2500ms by default)
		if (!m.i) {
			m.s = m.f = 0; // Reset counters: completed, created, timeout function
			m.i = setInterval(
				function() { 
					//logger.info("setInterval0");
					// If the timeout counter dips below zero, or the amount of completed scripts equals the amount 
					// of created script-tags, we can clear the interval
					if (m.o < 0 || m.s == 0) { 
						m.i = clearInterval(m.i); 
						// If the amount of completed scripts is smaller than the amount of created script-tags,
						// and there is a timeout function available, call it with the current script-queue.
						(m.s > 0 && m.f) && m.f(m.q)
					} 
					m.o--
					//logger.info("setInterval1");
				},
				m.o = 50 // Set the initial ticks at 50, as well as the interval at 50ms
			);
		}

		// If no arguments were given (a == l, which is null), try to load the options from the script tag
		if (a == m.n) {
			s = m.c.getElementsByTagName("script"); // Get all script tags in the current document
			while (j < s.length) {
				if ((a = eval("("+s[j].getAttribute("data-nbl")+")")) && a) { // Check for the data-nbl attribute
					m.h = s[j].parentNode;
					break
				}
				j++
			}
		}
		
		// If an options array was provided, proceed to interpret it
		if (a&&a.shift) {
			while (i < a.length) { // Loop through the options
				//logger.info("i="+i);
				b = a[i]; // Get the current element
				c = a[i+1]; // Get the next element
				x = 'function';
				y = typeof b; 
				z = typeof c;
				l = (z == x) ? c : (y == x) ? b : m.n; // Check whether the current or next element is a function and store it
				if (y == 'number') m.o = b/50; // If the current element is a number, set the timeout interval to this number/50
				// If the current element is a string, call this.a() with the string as a one-element array and the callback function l
				if (y == 'string') m.a([b], l); 
				// If the current element is an array, call this.a() with a two-element array of the string and the next element
				// as well as the callback function l
				b.shift && m.a([b.shift(), b], l); 
				if (!m.f && l) m.f = l; // Store the function l as the timeout function if it hasn't been set yet
				i++;
			}
		}
	},
	a: function(u,l) {
		//logger.info("call a");
		var s, t, m = this, n = u[0].replace(/.+\/|\.min\.js|\.js|\?.+|\W/g, ''), k = {js: {t: "script", a: "src"}, css: {t: "link", a: "href", r: "stylesheet"}, "i": {t: "img", a: "src"}}; // Clean up the name of the script for storage in the queue
		t = u[0].match(/\.(js|css).*$/i); t = (t) ? t[1] : "i";
		n=u[0];
		if(m.q[n] === true){
			if(logger.debugEnabled)logger.debug("loader: skip load '" + u[0] + "'");
			l && l(); // Call the callback function l
			if(u[1]){
				logger.debug("loader: start load next after skip '" + u[0] + "'");
				m.l(u[1]);
			}
			return;//避免重复加载和解析
		}
		s = m.q[n] = m.c.createElement(k[t].t);
		var file = u[0];
		file = bc.addParamToUrl(file,"ts="+bc.ts);// 附加时间挫
			
		s.setAttribute(k[t].a, file);
		// Fix: CSS links do not fire onload events - Richard Lopes
		// Images do. Limitation: no callback function possible after CSS loads
		if (k[t].r){
			s.setAttribute("rel", k[t].r);
			m.q[n] = true;//强制设为true
			clearInterval(m.i); 
			if(logger.debugEnabled)logger.debug("loader|css: loading css '" + file + "'" + (l ? " and call the callback" : ""));
			l && l(); // Call the callback function l
			if(logger.debugEnabled)logger.debug("loader|css: append '" + file + "' to head");
			if(u[1]){
				logger.debug("loader|css: start load next after loaded '" + file + "'");
				m.l(u[1]);
			}
		}else {
			// When this script completes loading, it will trigger a callback function consisting of two things:
			// 1. It will call nbl.l() with the remaining items in u[1] (if there are any)
			// 2. It will execute the function l (if it is a function)
			s.onload = function(){
				clearInterval(m.i); 
				if(logger.debugEnabled)logger.debug("loader|js: finished loaded js'" + file + "'" + (l ? " and call the callback" : ""));
				var s = this, d = function(){
					var s = m, r = u[1]; 
					s.q[n] = true; // Set the entry for this script in the script-queue to true
					//r && s.l(r); // Call nbl.l() with the remaining elements of the original array
					if(r){
						logger.debug("loader|js: start load next after loaded '" + file + "'");
						s.l(r);
					}
					
					l && l(); // Call the callback function l
					s.s--
				};
				if ( !s.readyState || /de|te/.test( s.readyState ) ) {
					s.onload = m.n;
					s.onreadystatechange = m.n;
					d(); // On completion execute the callback function as defined above
				}
			};
			s.onreadystatechange = s.onload;
			m.s++;
			if(logger.debugEnabled)logger.debug("loader|js: append '" + file + "' to head");
		}
		m.h.appendChild(s) // Add the script to the document
	}
};
bc.loader.l();
//bc.load=bc.loader.l;//快捷方式

/** 简易调用方式的封装，如果参数不是如下格式请直接调用bc.loader.l：
 * 将[a1.js,a2.js,...,an.js,fn]转换为[[a1.js, [[a2.js, [[...[an.js,fn]...]] ]] ]]格式，
 * 保证所有js按顺序加载，并在全部加载完毕后再调用fn函数
 */
bc.load = function(args){
	function rebuildArgs(args,lastIsFn){
		//用数组的第1个元素和剩余元素组成的数组生成新的数组
		args=[args.shift(),args];
		
		//如果依然超过2个元素，递归处理
		if(args[1].length > (lastIsFn ? 3 : 2)){
			args[1] = rebuildArgs(args[1],lastIsFn);
		}
		return args;
	};
	if(args && args.shift && args.length > 2){//参数为数组,且长度大于2，执行转换
		var lastIsFn = (typeof args[args.length - 1] == "function");
		if(lastIsFn){
			if(args.length > 3){
				args = rebuildArgs(args,true);
				//if(logger.debugEnabled)logger.debug("newArgs=" + array2string(args));
			}
		}else{
			args = rebuildArgs(args,false);
		}
		bc.loader.l([args]);
	}else{
		bc.loader.l(args);
	}
}
function array2string(array){
	//alert("0:" + array);
	var t=["["];
	for(var i=0;i<array.length;i++){
		if(i>0 && i<array.length)
			t.push(",");
		if(typeof array[i] != "function"){
			if(array[i].shift){
				//alert("1:" + array[i]);
				t.push(array2string(array[i]));
			}else{
				t.push(array[i]);
			}
		}else{
			t.push("fn");
		}
	}
	t.push("]");
	return t.join("");
}
/*
function rebuildArgs1(args,lastIsFn){
	//用数组的第1个元素和剩余元素组成的数组生成新的数组
	args=[args.shift(),args];
	
	//如果依然超过2个元素，递归处理
	if(args[1].length > (lastIsFn ? 3 : 2)){
		args[1] = rebuildArgs1(args[1],lastIsFn);
	}
	return args;
};
var a = ["a","b","c",function(){}];
a = [rebuildArgs1(a,false)];
alert(array2string(a));
*/
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
	editor: '/ui-libs/xheditor/1.1.7/xheditor-zh-cn.min.js?ts=0',
	xheditor: '/ui-libs/xheditor/1.1.7/xheditor-zh-cn.min.js?ts=0',
	highcharts: '/ui-libs/highcharts/2.1.8/highcharts.min.js?ts=0',
	highcharts_exporting: '/ui-libs/highcharts/2.1.8/modules/exporting.min.js?ts=0',
	quicksand: '/ui-libs/jquery/plugins/quicksand/1.2.2/jquery.quicksand.js?ts=0',
	
	/** 平台 */
	bc_identity: '/bc/identity/identity.js'
};

bc.loader.preconfig.css = {
	jqueryui: '/ui-libs/jquery-ui/1.9pre/themes/base/jquery-ui.css?ts=0',
};
/**
 * 富文本编辑器
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-01
 */
bc.editor={
	/**
	 * 构建富文本编辑器的默认配置
	 * @param {Object} option 配置参数
	 * @option {String} ptype 上传附件所属文档的类型，一般是使用类名的小写开头字母
	 * @option {String} puid 上传附件所属文档的uid
	 * @option {String} readonly 是否为只读状态
	 * @option {String} tools full(完全),mfull(多行完全),simple(简单--默认值),mini(迷你)
	 * 
	 */
	getConfig:function(option){
		if(typeof option != "object")
			option = {};
		
		var urlEx = "";
		if(option.ptype){
			urlEx += "&ptype=" + option.ptype;
		}
		if(option.puid){
			urlEx += "&puid=" + option.puid;
		}
			
		if(option.readonly){
			return {tools:'Print,Fullscreen'};//只读状态只显示打印和全屏按钮
		}else{
			return jQuery.extend({
				//参考：http://xheditor.com/manual/2
				//参数值：full(完全),mfull(多行完全),simple(简单),mini(迷你)
				//或者自定义字符串，例如：'Paste,Pastetext,|,Source,Fullscreen,About'
				tools: option.tools || 'simple'
				//图片上传接口地址
				,upImgUrl: option.upImgUrl || bc.root + "/upload/?a=0&type=img" + urlEx
				//图片上传前限制的文件扩展名列表，默认为：jpg,jpeg,gif,png
				//,upImgExt:"jpg,jpeg,gif,png"
				//动画上传接口地址
				,upFlashUrl: option.upFlashUrl || bc.root + "/upload/?a=0&type=flash" + urlEx
				//动画上传前限制的文件扩展名列表，默认为：swf
				//,upFlashExt:"swf"
				//视频上传接口地址
				,upMediaUrl: option.upMediaUrl || bc.root + "/upload/?a=0&type=media" + urlEx
				//视频上传前限制的文件扩展名列表，默认为：avi
				//,upMediaExt:"avi"
			},option);
		}
	},
	readonly:{
		tools:''
	}
};
/**
 * 附件上传
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-01
 * @depend attach.css
 */
bc.attach={
	uploadUrl: bc.root + "/upload/?a=1",
	clearFileSelect:function($attachs){
		//清空file控件:file.outerHTML=file.outerHTML; 
		var file = $attachs.find(":file.uploadFile");
		if(file.size())
			file[0].outerHTML=file[0].outerHTML;
	},
	/** 在线打开附件 */
	inline: function(attachEl,callback){
		//在新窗口中打开文件
		var url = bc.root + "/bc/attach/inline?id=" + $(attachEl).attr("data-id");
		var to = $(attachEl).attr("data-to");
		if(to && to.length > 0)
			url += "&to=" + to;
		return window.open(url, "_blank");
	},
	/** 下载附件 */
	download: function(attachEl,callback){
		window.open(bc.root + "/bc/attach/download?id=" + $(attachEl).attr("data-id"), "blank");
	},
	/** 打包下载所有附件 */
	downloadAll: function(attachsEl,callback){
		var $attachs = $(attachsEl);
		if($attachs.find(".attach").size()){
			window.open(bc.root + "/bc/attach/downloadAll?ptype=" + $attachs.attr("data-ptype") + "&puid=" + $attachs.attr("data-puid"), "blank");
		}else{
			bc.msg.slide("当前没有可下载的附件！");
		}
	},
	/** 删除附件 */
	delete_: function(attachEl,callback){
		var $attach = $(attachEl);
		var fileName = $attach.find(".subject").text();
		bc.msg.confirm("确定要删除附件<b>《"+fileName+"》</b>吗？",function(){
			bc.ajax({
				url: bc.root + "/bc/attach/delete?id=" + $attach.attr("data-id"),
				type: "GET",dataType:"json",
				success: function(json){
					//json:{success:true,msg:"..."}
					if(typeof(json) != "object"){
						alert("删除操作异常！");
						return;
					}
					
					if(json.success == false){
						alert(json.msg);//删除失败了
					}else{
						//附件总数减一
						var $totalCount = $attach.parent().find("#totalCount");
						$totalCount.text(parseInt($totalCount.text()) - 1);
						
						//附件总大小减去该附件的部分
						var $totalSize = $attach.parent().find("#totalSize");
						var newSize = parseInt($totalSize.attr("data-size")) - parseInt($attach.attr("data-size"));
						$totalSize.attr("data-size",newSize).text(bc.attach.getSizeInfo(newSize));
						
						//删除该附件的dom
						$attach.remove();
						
						//提示用户已删除
						bc.msg.slide("已删除附件<b>《"+fileName+"》</b>！");
					}
				}
			});
		});
	},
	/** 删除所有附件 */
	deleteAll: function(attachsEl,callback){
		var $attachs = $(attachsEl);
		if($attachs.find(".attach").size()){
			bc.msg.confirm("确定要将全部附件删除吗？",function(){
				bc.ajax({
					url: bc.root + "/bc/attach/deleteAll?ptype=" + $attachs.attr("data-ptype"),
					type: "GET",dataType:"json",
					success: function(json){
						//json:{success:true,msg:"..."}
						if(typeof(json) != "object"){
							alert("删除操作异常！");
							return;
						}
						
						if(json.success == false){
							alert(json.msg);//删除失败了
						}else{
							//附件总数清零
							$attachs.find("#totalCount").text("0");
							
							//附件总大小清零
							$attachs.find("#totalSize").text("0Bytes").attr("data-size","0");
							
							//清空file控件
					    	bc.attach.clearFileSelect($attachs);
							
							//删除附件的dom
							$attachs.find(".attach").remove();
							
							//提示用户已删除
							bc.msg.slide("已删除全部附件！");
						}
					}
				});
			});
		}else{
			bc.msg.slide("当前没有可删除的附件！");
		}
	},
    /**将字节单位的数值转换为较好看的文字*/
	getSizeInfo: function(size){
		if (size < 1024)
			return bc.formatNumber(size,"#.#") + "Bytes";
		else if (size < 1024 * 1024)
			return bc.formatNumber(size/1024,"#.#") + "KB";
		else
			return bc.formatNumber(size/1024/1024,"#.#") + "MB";
		
    },
    /**单个附件容器的模板*/
    tabelTpl:[
		'<table class="attach" cellpadding="0" cellspacing="0" data-size="{0}">',
			'<tr>',
				'<td class="icon"><span class="file-icon {2}"></span></td>',
				'<td class="info">',
					'<div class="subject">{3}</div>',
					'<table class="operations" cellpadding="0" cellspacing="0">',
						'<tr>',
						'<td class="size">{1}</td>',
						'<td><div class="progressbar"></div></td>',
						'<td><a href="#" class="operation" data-action="abort">取消</a></td>',
						'</tr>',
					'</table>',
				'</td>',
			'</tr>',
		'</table>'
    ].join(""),
    /**单个附件操作按钮的模板*/
    operationsTpl:[
		'<a href="#" class="operation" data-action="inline">在线查看</a>',
		'<a href="#" class="operation" data-action="download">下载</a>',
		'<a href="#" class="operation" data-action="print">打印</a>',
		'<a href="#" class="operation" data-action="delete">删除</a>'
	].join(""),
    /**判断浏览器是否可使用html5上传文件*/
	isHtml5Upload: function(attachEl){
		//return $.browser.safari || $.browser.mozilla;//Chrome12、Safari5、Firefox4
		return $(attachEl).filter("[data-flash]").size() == 0;
	}
};

(function($){

//初始化文件控件的选择事件
if(bc.attach.isHtml5Upload()){
	$(".attachs :file.uploadFile").live("change",function(e){
		var $atm = $(this).parents(".attachs");
		if(bc.attach.isHtml5Upload()){
			logger.info("uploadFile with html5");
			bc.attach.html5.upload.call($atm[0],e.target.files,{
				ptype: $atm.attr("data-ptype")
				,puid: $atm.attr("data-puid") || $atm.parents("form").find(":input:hidden[name='e.uid']").val()
			});
		}else{//Opera、IE等其他
			logger.info("uploadFile with html4");
			bc.attach.flash.upload.call($atm[0],e.target.files,{
				ptype: $atm.attr("data-ptype")
				,puid: $atm.attr("data-puid") || $atm.parents("form").find(":input:hidden[name='e.uid']").val()
			});
		}
	});
}else{
	
}

//单个附件的操作按钮
$(".attachs .operation").live("click",function(e){
	var $this = $(this);
	var action = $this.attr("data-action");//内定的操作
	var callback = $this.attr("data-callback");//回调函数
	callback = callback ? bc.getNested(callback) : undefined;//转换为函数
	var $attach = $this.closest(".attach");//每个附件的容器
	if($attach.size() == 0) $attach = $this.closest(".attachs");//整个附件的容器
	switch (action){
	case "abort"://取消附件的上传
		if(bc.attach.isHtml5Upload($attach[0])){
			bc.attach.html5.abortUpload($attach[0],callback);
		}else{
			bc.attach.flash.abortUpload($attach[0],callback);
		}
		break;
	case "inline"://在线打开附件
		bc.attach.inline($attach[0],callback);
		break;
	case "delete"://删除附件
		bc.attach.delete_($attach[0],callback);
		break;
	case "download"://下载附件
		bc.attach.download($attach[0],callback);
		break;
	case "print"://打印附件
		var win = bc.attach.inline($attach[0],callback);
		setTimeout(function(){
			win.print();
			setTimeout(function(){
				win.close();
			},100);
		},2000);
		break;
	case "downloadAll"://打包下载所有附件
		bc.attach.downloadAll($this.parents(".attachs")[0],callback);
		break;
	case "deleteAll"://删除所有附件
		bc.attach.deleteAll($this.parents(".attachs")[0],callback);
		break;
	default ://调用自定义的函数
		var click = $this.attr("data-click");
		if(typeof click == "string"){
			var clickFn = bc.getNested(click);//将函数名称转换为函数
			if(typeof clickFn == "function"){
				clickFn.call($attach[0],callback);
			}else
				alert("没有定义'" + click + "'函数");
		}else{
			alert("没有定义的action：" + action);
		}
		break;
	}
	
	return false;
});

})(jQuery);
/**
 * html5附件上传
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-01
 * @depend attach.js,attach.css
 */
bc.attach.html5={
	xhrs:{},
	/**
	 * 基于html5的文件上传处理
	 * <p>函数上下文为附件控件的容器dom</p>
	 * @param {Array} files 要上传的文件列表
	 * @param {Object} option 配置参数
	 * @option {String} ptype 
	 * @option {String} puid 
	 * @option {String} url 
	 */
	upload:function(files,option){
		var $atm = $(this);
	    //html5上传文件(不要批量异步上传，实测会乱，如Chrome后台合并为一个文件等，需逐个上传)
		//用户选择的文件(name、fileName、type、size、fileSize、lastModifiedDate)
	    var url = option.url || bc.attach.uploadUrl;
	    if(option.ptype) url+="&ptype=" + option.ptype;
	    if(option.puid) url+="&puid=" + option.puid;
	    
	    //检测文件数量的限制
	    var maxCount = parseInt($atm.attr("data-maxCount"));
	    var curCount = parseInt($atm.find("#totalCount").text());
	    logger.info("maxCount=" + maxCount + ",curCount=" + curCount);
	    if(!isNaN(maxCount) && files.length + curCount > maxCount){
	    	alert("上传附件总数已限制为最多" + maxCount + "个，已超出上限了！");
	    	bc.attach.clearFileSelect($atm);
	    	return;
	    }
	    
	    //检测文件大小的限制
	    var maxSize = parseInt($atm.attr("data-maxSize"));
	    var curSize = parseInt($atm.find("#totalSize").attr("data-size"));
	    logger.info("maxSize=" + maxSize + ",curSize=" + curSize);
	    if(!isNaN(maxSize)){
	    	var nowSize = curSize;
	    	for(var i=0;i<files.length;i++){
	    		nowSize += files[i].fileSize;
	    	}
    		if(nowSize > maxSize){
	    		alert("上传附件总容量已限制为最大" + bc.attach.getSizeInfo(maxSize) + "，已超出上限了！");
		    	bc.attach.clearFileSelect($atm);
	    		return;
    		}
	    }
	    
	    //检测文件类型的限制
	    var _extensions = $atm.attr("data-extensions");//用逗号连接的扩展名列表
	    var fileName;
	    if(_extensions && _extensions.length > 0){
	    	for(var i=0;i<files.length;i++){
	    		fileName = files[i].fileName || files[i].name;
	    		if(_extensions.indexOf(fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase()) == -1){
		    		alert("只能上传扩展名为\"" + _extensions.replace(/,/g,"、") + "\"的文件！");
			    	bc.attach.clearFileSelect($atm);
		    		return;
	    		}
	    	}
	    }
	    
	    //显示所有要上传的文件
	    var f;
	    var batchNo = "k" + new Date().getTime() + "-";//批号
	    for(var i=0;i<files.length;i++){
	    	f=files[i];
	    	var key = batchNo + i;
			//上传进度显示
			var fileName = f.name || f.fileName;
			var extend = fileName.substr(fileName.lastIndexOf(".")+1).toLowerCase();
			var attach = bc.attach.tabelTpl.format(f.fileSize,bc.attach.getSizeInfo(f.size || f.fileSize),extend,fileName);
			$(attach).attr("data-xhr",key).insertAfter($atm.find(".header")).find(".progressbar").progressbar();
	    }

	    //开始上传
	    var $newAttachs = $atm.find(".attach[data-xhr]");//含有data-xhr属性的代表还没上传
	    var i = 0;
	    setTimeout(function(){
	    	uploadNext();
	    },500);//延时小许时间再上传，避免太快看不到效果
		
	    //逐一上传文件
		function uploadNext(){
	    	if(i >= files.length){
		    	bc.attach.clearFileSelect($atm);
	    		return;//全部上传完毕
	    	}
	    	
	    	var key = batchNo + i;
			logger.info("uploading:i=" + i);
			//继续上传下一个附件
			uploadOneFile(key,files[i],url,uploadNext);
		}
	   
		//上传一个文件
	    function uploadOneFile(key,f,url,callback){
	    	var xhr = new XMLHttpRequest();
	    	bc.attach.html5.xhrs[key] = xhr;
	    	var $attach = $newAttachs.filter("[data-xhr='" + key + "']");
	    	var $progressbar = $attach.find(".progressbar");
			if($.browser.safari){//Chrome12、Safari5
				xhr.upload.onprogress=function(e){
					var progressbarValue = Math.round((e.loaded / e.total) * 100);
					logger.info(i + ":upload.onprogress:" + progressbarValue + "%");
					$progressbar.progressbar("option","value",progressbarValue);
				};
			}else if($.browser.mozilla){//Firefox4
				xhr.onuploadprogress=function(e){
					var progressbarValue = Math.round((e.loaded / e.total) * 100);
					logger.info(i + ":upload.onprogress:" + progressbarValue + "%");
					$progressbar.progressbar("option","value",progressbarValue);
				};
			}
			
			//上传完毕的处理
			xhr.onreadystatechange=function(){
				if(xhr.readyState===4){
					bc.attach.html5.xhrs[key] = null;
					//累计上传的文件数
					i++;
					logger.info(i + ":" + xhr.responseText);
					var json = eval("(" + xhr.responseText + ")");
					
					//附件总数加一
					var $totalCount = $atm.find("#totalCount");
					$totalCount.text(parseInt($totalCount.text()) + 1);
					
					//附件总大小添加该附件的部分
					var $totalSize = $atm.find("#totalSize");
					var newSize = parseInt($totalSize.attr("data-size")) + (f.size || f.fileSize);
					$totalSize.attr("data-size",newSize).text(bc.attach.getSizeInfo(newSize));
					
					//删除进度条、显示附件操作按钮（延时1秒后执行）
					setTimeout(function(){
						var tds = $progressbar.parent();
						var $operations = tds.next();
						tds.remove();
						$operations.empty().append(bc.attach.operationsTpl);
						
						$attach.attr("data-id",json.msg.id)
							.attr("data-name",json.msg.localfile)
							.attr("data-url",json.msg.url)
							.removeAttr("data-xhr");
					},1000);
					
					//调用回调函数
					if(typeof callback == "function")
						callback(json);
				}
			};
			
			xhr.onabort=function(){
				logger.info("onabort:i=" + i);
				$attach.remove();
			}
//			xhr.upload.onabort=function(){
//				logger.info("upload.onabort:i=" + i);
//			}

			xhr.open("POST", url);
			xhr.setRequestHeader('Content-Type', 'application/octet-stream');
			//对文件名进行URI编码避免后台中文乱码（后台需URI解码）
			xhr.setRequestHeader('Content-Disposition', 'attachment; name="filedata"; filename="'+encodeURIComponent(f.fileName || f.name)+'"');
			if($.browser == "mozilla" && $.browser.version < 5)//Firefox4
				xhr.sendAsBinary(f.getAsBinary());
			else //Chrome12+,Firefox5+
				xhr.send(f);
	    }
	},
	/** 取消正在上传的附件 */
	abortUpload: function(attachEl,callback){
		var $attach = $(attachEl);
		var key = $attach.attr("data-xhr");
		logger.info("key=" + key);
		var xhr = bc.attach.html5.xhrs[key];
		if(xhr){
			logger.info("xhr.abort");
			xhr.abort();
			xhr = null;
		}
	}
};

(function($){

})(jQuery);
/**
 * flash附件上传
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-01
 * @depend attach.js,attach.css
 */
bc.attach.flash={
	init:function(){
		var $atm = $(this);
		var fileId = $atm.find(":file.uploadFile").attr("id");
		logger.info("bc.attach.flash.init:file.id=" + fileId);
		//,bc.root + "/ui-libs/swfupload/2.2.0.1/plugins/swfupload.cookies.js?ts=0"
		bc.load([bc.root + "/ui-libs/swfupload/2.2.0.1/swfupload.js?ts=0",function(){
		    var url = bc.root+"/upload/?a=1";
		    url += "&ptype=" + $atm.attr("data-ptype");
		    url += "&puid=" + $atm.attr("data-puid") || $atm.parents("form").find(":input:hidden[name='e.uid']").val();
			var swfuCfg = {
				upload_url : url,
				prevent_swf_caching: false,
				flash_url : bc.root+"/ui-libs/swfupload/2.2.0.1/swfupload.swf",
				file_post_name : "filedata",
				file_types : "*.*",
				file_types_description: "所有文件",
				//button_image_url : bc.root + "/bc/libs/themes/default/images/swfuploadButton.png", 
				button_width: "60",
				button_height: "22",
				button_placeholder_id: fileId,
				button_text: '<span class="theFont">添加附件</span>',
				button_text_style: '.theFont{font-size:13px;color:#2A5DB0;text-decoration:underline;font-family:"微软雅黑","宋体",sans-serif;}',
				button_text_left_padding: 0,
				button_text_top_padding: 1,
				button_action : SWFUpload.BUTTON_ACTION.SELECT_FILES, 
				button_disabled : false, 
				button_cursor : SWFUpload.CURSOR.HAND, 
				button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
				debug:false,
				custom_settings : {
					totalSize: 0,//已上传文件的大小累计
					fileCount: 0,//用户选中的文件数量
					finishedSize: 0,//当前已上传完毕的文件数量
					fileNames: []//用户选中的文件名称
				},
			
				// The event handler functions
				file_dialog_complete_handler : bc.attach.flash.handlers.fileDialogComplete,
				file_queued_handler : bc.attach.flash.handlers.fileQueued,
				file_queue_error_handler : bc.attach.flash.handlers.fileQueueError,
				upload_start_handler : bc.attach.flash.handlers.uploadStart,
				upload_progress_handler : bc.attach.flash.handlers.uploadProgress,
				upload_error_handler : bc.attach.flash.handlers.uploadError,
				upload_success_handler : bc.attach.flash.handlers.uploadSuccess,
				upload_complete_handler : bc.attach.flash.handlers.uploadComplete,
				
				// 浏览器flash插件的控制：需要swfupload.swfobject.js插件的支持
				//minimum_flash_version: "9.0.28",
				swfupload_pre_load_handler: bc.attach.flash.handlers.swfuploadPreLoad,
				swfupload_load_failed_handler: bc.attach.flash.handlers.swfuploadLoadFailed
			};
			logger.info("upload_url=" + swfuCfg.upload_url);
			
			//文件大小限制
			var maxSize = parseInt($atm.attr("data-maxSize"));
			if(maxSize > 0){
				logger.info("maxSize=" + maxSize);
				swfuCfg.file_size_limit = maxSize/1024;
			}
			
			//文件过滤控制
			var extensions = $atm.attr("data-extensions");
			if(extensions.length > 0){
				logger.info("extensions=" + extensions);
				//var all = $atm.attr("filter").split("|");
				//swfuCfg.file_types=all[0];
				//if(all.length >1)swfuCfg.file_types_description=all[1];
			}
			
			new SWFUpload(swfuCfg);
		}]);
	},
	/** 取消正在上传的附件 */
	abortUpload: function(attachEl,callback){
		var $attach = $(attachEl);
		var fileId = $attach.attr("data-flash");
		var swfId = $attach.parents(".attachs").find("object").attr("id");
		logger.info("abortUpload:swfId=" + swfId + ",fileId=" + fileId);
		//取消上传中的文件
		var swf = SWFUpload.instances[swfId];
		if(swf){
			swf.cancelUpload(fileId);
		}
		
		//删除dom
		$attach.remove();
	}
};
bc.attach.flash.handlers={
	/**file_queued_handler
	 * 当文件选择对话框关闭消失时，如果选择的文件成功加入上传队列，那么针对每个成功加入的文件都会
	 * 触发一次该事件（N个文件成功加入队列，就触发N次此事件）。
	 */
	fileQueued:function(file){
		this.customSettings.totalSize += file.size;
		this.customSettings.fileCount += 1;
		this.customSettings.fileNames.push(file.name);
	},
	/**file_queue_error_handler
	 * 当选择文件对话框关闭消失时，如果选择的文件加入到上传队列中失败，那么针对每个出错的文件都会触发一次该事件
	 * (此事件和fileQueued事件是二选一触发，文件添加到队列只有两种可能，成功和失败)。
	 * 文件添加队列出错的原因可能有：超过了上传大小限制，文件为零字节，超过文件队列数量限制，设置之外的无效文件类型。
	 * 具体的出错原因可由error code参数来获取，error code的类型可以查看SWFUpload.QUEUE_ERROR中的定义。
	 */
	fileQueueError:function(file, errorCode, message){
		logger.info("fileQueueError:errorCode=" + errorCode + ",message=" + message + ",file=" + file.name);
		bc.msg.slide("您选择的文件《" + file.name + "》为空文件！");
	},
	/**file_dialog_complete_handler
	 * 当选择文件对话框关闭，并且所有选择文件已经处理完成（加入上传队列成功或者失败）时，此事件被触发，
	 * number of files selected是选择的文件数目，number of files queued是此次选择的文件中成功加入队列的文件数目。
	 * totalNumber:total number of files in the queued
	 */
	fileDialogComplete:function(numberOfFilesSelected, numberOfFilesQueued, totalNumber){
		logger.info("selected:" + numberOfFilesSelected + ";queued:" + numberOfFilesQueued + ";totalNumber:" + totalNumber+";totalSize:" + this.customSettings.totalSize);
		try {
			if (numberOfFilesSelected > 0 && numberOfFilesSelected != numberOfFilesQueued) {
		    	alert("无法上传所选择的文件，可能的原因为：空文件、文件大小超出上限或文件类型超出限制！");
		    	this.cancelUpload();
	    		return false;
			}
			if (numberOfFilesQueued > 0) {
				var $atm = $("#" + this.movieName).parents(".attachs");
			    //检测文件数量的限制
			    var maxCount = parseInt($atm.attr("data-maxCount"));
			    var curCount = parseInt($atm.find("#totalCount").text());
			    logger.info("maxCount=" + maxCount + ",curCount=" + curCount);
			    if(!isNaN(maxCount) && numberOfFilesSelected + curCount > maxCount){
			    	alert("上传附件总数已限制为最多" + maxCount + "个，已超出上限了！");
			    	this.cancelUpload();
			    	return false;
			    }
			    
			    //检测文件大小的限制
			    var maxSize = parseInt($atm.attr("data-maxSize"));
			    var curSize = parseInt($atm.find("#totalSize").attr("data-size"));
			    logger.info("maxSize=" + maxSize + ",curSize=" + curSize);
			    if(!isNaN(maxSize)){
			    	var nowSize = curSize + this.customSettings.totalSize;
		    		if(nowSize > maxSize){
			    		alert("上传附件总容量已限制为最大" + bc.attach.getSizeInfo(maxSize) + "，已超出上限了！");
				    	this.cancelUpload();
			    		return false;
		    		}
			    }
			    
			    // 检测文件类型的限制
			    var _extensions = $atm.attr("data-extensions");//用逗号连接的扩展名列表
			    logger.info("_extensions=" + _extensions);
			    if(_extensions && _extensions.length > 0){
			    	var fileNames = this.customSettings.fileNames;
				    var fileName;
			    	for(var i=0;i<fileNames.length;i++){
			    		fileName = fileNames[i];
			    		logger.info("fileName=" + fileName);
			    		if(_extensions.indexOf(fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase()) == -1){
				    		alert("只能上传扩展名为\"" + _extensions.replace(/,/g,"、") + "\"的文件！");
					    	this.cancelUpload();
				    		return false;
			    		}
			    	}
			    }
			    
			    //显示所有要上传的文件
			    var f,fileName;
			    for(var i=0;i<numberOfFilesQueued;i++){
			    	f=this.getFile(i);
				    logger.info("f.id=" + f.id + ",f.name=" + f.name);
					//上传进度显示
					fileName = f.name;
				    logger.info("fileName=" + fileName);
					var extend = fileName.substr(fileName.lastIndexOf(".")+1).toLowerCase();
					var attach = bc.attach.tabelTpl.format(f.size,bc.attach.getSizeInfo(f.size),extend,fileName);
					$(attach).attr("data-flash", f.id).insertAfter($atm.find(".header"))
					.find(".progressbar").progressbar();
			    }
			    
//				//绑定取消事件
//				var othis = this;
//				infoWraper.find(".btn").click(function(){
//					logger.warn("cancelUpload");
//					othis.cancelUpload();
//					othis.customSettings.cancel = true;
//				});
				
				//自动开始上传:默认只会上传第一个文件，需要在uploadComplete控制继续上传
				this.startUpload();
			}
		} catch(ex){
	        logger.error(""+ex);
		}
	},
	/**upload_start_handler
	 * 在文件往服务端上传之前触发此事件，可以在这里完成上传前的最后验证以及其他你需要的操作，例如添加、修改、删除post数据等。
	 * 在完成最后的操作以后，如果函数返回false，那么这个上传不会被启动，并且触发uploadError事件（code为ERROR_CODE_FILE_VALIDATION_FAILED），
	 * 如果返回true或者无返回，那么将正式启动上传。
	 */
	uploadStart:function(file){
		logger.info("uploadStart:" + file.name);
		//document.getElementById(this.customSettings.infoId).innerHTML = OZ.Attachment.Flash.defaults.START_INFO;
	},
	/**upload_progress_handler
	 * 该事件由flash定时触发，提供三个参数分别访问上传文件对象、已上传的字节数，总共的字节数。
	 * 因此可以在这个事件中来定时更新页面中的UI元素，以达到及时显示上传进度的效果。
	 * 注意: 在Linux下，Flash Player只在所有文件上传完毕以后才触发一次该事件，官方指出这是
	 * Linux Flash Player的一个bug，目前SWFpload库无法解决
	 */
	uploadProgress:function(file, bytesComplete, totalBytes){
		var progressbarValue = Math.round((bytesComplete / totalBytes) * 100);
		logger.info("uploadProgress:" + progressbarValue + "%");
		var $attach = $("#" + this.movieName).parents(".attachs").find(".attach[data-flash='" + file.id + "']");
		logger.info("$attach:" + $attach.size());
		$attach.find(".progressbar").progressbar("option","value",progressbarValue);
	},
	/**upload_success_handler
	 * 当文件上传的处理已经完成（这里的完成只是指向目标处理程序发送了Files信息，只管发，不管是否成功接收），
	 * 并且服务端返回了200的HTTP状态时，触发此事件。
	 * 此时文件上传的周期还没有结束，不能在这里开始下一个文件的上传。
	 */
	uploadSuccess:function(file, serverData){
		logger.info("uploadSuccess:" + file.name + ";serverData=" + serverData);
		this.customSettings.finishedSize+=file.size;//累计已上传的字节数
		var $attach = $("#" + this.movieName).parents(".attachs").find(".attach[data-flash='" + file.id + "']");
		//删除进度条、显示附件操作按钮（延时1秒后执行）
		var json = eval("(" + serverData + ")");
		if(json.err && json.err.length > 0){
			alert("上传文件《" + file.name + "》出现异常，" + json.err);
		}else{
			setTimeout(function(){
				var tds = $attach.find(".progressbar").parent();
				var $operations = tds.next();
				tds.remove();
				$operations.empty().append(bc.attach.operationsTpl);
				$attach.attr("data-id",json.msg.id)
					.attr("data-name",json.msg.localfile)
					.attr("data-url",json.msg.url)
					.removeAttr("data-flash");
			},1000);
		}
	},
	/**upload_complete_handler
	 * 当上传队列中的一个文件完成了一个上传周期，无论是成功(uoloadSuccess触发)还是失败(uploadError触发)，此事件都会被触发，
	 * 这也标志着一个文件的上传完成，可以进行下一个文件的上传了。
	 */
	uploadComplete:function(file){
		logger.info("uploadComplete:" + file.name);
		var stats = this.getStats();
		if (stats.files_queued > 0 && !this.customSettings.cancel){
			this.startUpload();
		}else{
			logger.info("all complete");
			//全部上传完毕后的处理
			this.customSettings.totalSize=0;
			this.customSettings.finishedSize=0;
			if (this.customSettings.cancel){
				logger.info("cancel");
			}
		}
	},
	/**upload_error_handler
	 * SWFUpload.UPLOAD_ERROR
	 */
	uploadError:function(file, errorCode, message){
		logger.error("uploadError:" + file.name + ";errorCode:" + errorCode + ";message:" + message);
	},
	/**swfupload_pre_load_handler
	 */
	swfuploadPreLoad:function(){
		logger.info("swfuploadPreLoad");
	},
	/**swfupload_load_failed_handler
	 */
	swfuploadLoadFailed:function(){
		logger.error("swfuploadLoadFailed");
	}
};

(function($){

})(jQuery);
/**
 * 附件上传
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-01
 * @depend attach.css
 */
bc.file={
	uploadUrl: bc.root + "/uploadfile/?a=1",
	clearFileSelect:function($file){
		//清空file控件:file.outerHTML=file.outerHTML; 
		if($file.size())
			$file[0].outerHTML=$file[0].outerHTML;
	},
	
	/** 在线打开附件 */
	inline: function(option){
		//在新窗口中打开文件
		var url = bc.root + "/bc/file/inline?f=" + option.f;
		if(option.n) url += "&n=" + option.n;
		if(option.to) url += "&to=" + option.to;
		if(option.from) url += "&from=" + option.from;
		if(option.ptype) url += "&ptype=" + option.ptype;
		if(option.puid) url += "&puid=" + option.puid;
		var win = window.open(url, "_blank");
		if(typeof option.callback == "function"){
			option.callback.call(this,option,win);
		}
		return win;
	},
	
	/** 下载附件 */
	download: function(option){
		//在新窗口中打开文件
		var url = bc.root + "/bc/file/download?f=" + option.f;
		if(option.n) url += "&n=" + option.n;
		if(option.ptype) url += "&ptype=" + option.ptype;
		if(option.puid) url += "&puid=" + option.puid;
		var win = window.open(url, "blank");
		if(typeof option.callback == "function"){
			option.callback.call(this,option,win);
		}
		return win;
	},
	
    /**将字节单位的数值转换为较好看的文字*/
	getSizeInfo: function(size){
		if (size < 1024)
			return bc.formatNumber(size,"#.#") + "Bytes";
		else if (size < 1024 * 1024)
			return bc.formatNumber(size/1024,"#.#") + "KB";
		else
			return bc.formatNumber(size/1024/1024,"#.#") + "MB";
    },
    
	/**
	 * 基于html5的文件上传处理
	 * <p>函数上下文为附件控件的容器dom</p>
	 * @param {Array} files 要上传的文件列表
	 * @param {Object} option 配置参数
	 */
    upload: function(files,option){
		var $file = $(this);
	    //html5上传文件(不要批量异步上传，实测会乱，如Chrome后台合并为一个文件等，需逐个上传)
		//用户选择的文件(name、fileName、type、size、fileSize、lastModifiedDate)
	    var url = option.url || bc.file.uploadUrl;
	    if(option.subdir) url+="&subdir=" + option.subdir;
	    if(option.ptype) url+="&ptype=" + option.ptype;
	    if(option.puid) url+="&puid=" + option.puid;
	    
	    //检测文件数量的限制
	    var maxCount = option.maxCount;
	    var curCount = parseInt(option.curCount);
	    if(isNaN(curCount)) curCount = 0;
	    logger.info("maxCount=" + maxCount + ",curCount=" + curCount);
	    if(!isNaN(maxCount) && files.length + curCount > maxCount){
	    	alert("上传附件总数已限制为最多" + maxCount + "个，已超出上限了！");
	    	bc.file.clearFileSelect($file);
	    	return;
	    }
	    
	    //检测文件大小的限制
	    var maxSize = parseInt(option.maxSize);
	    var curSize = parseInt(option.curSize);
	    if(isNaN(curSize)) curSize = 0;
	    logger.info("maxSize=" + maxSize + ",curSize=" + curSize);
	    if(!isNaN(maxSize)){
	    	var nowSize = curSize;
	    	for(var i=0;i<files.length;i++){
	    		nowSize += files[i].fileSize;
	    	}
    		if(nowSize > maxSize){
	    		alert("上传附件总容量已限制为最大" + bc.file.getSizeInfo(maxSize) + "，已超出上限了！");
		    	bc.file.clearFileSelect($file);
	    		return;
    		}
	    }
	    
	    //检测文件类型的限制
	    var _extensions = option.extensions;//用逗号连接的扩展名列表
	    var fileName;
	    if(_extensions && _extensions.length > 0){
	    	for(var i=0;i<files.length;i++){
	    		fileName = files[i].fileName || files[i].name;
	    		if(_extensions.indexOf(fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase()) == -1){
		    		alert("只能上传扩展名为\"" + _extensions.replace(/,/g,"、") + "\"的文件！");
			    	bc.file.clearFileSelect($file);
		    		return;
	    		}
	    	}
	    }
	    
	    //显示所有要上传的文件
	    var f;
	    var batchNo = "k" + new Date().getTime() + "-";//批号
	    for(var i=0;i<files.length;i++){
	    	f=files[i];
	    	var key = batchNo + i;
			//上传进度显示
			var fileName = f.fileName || f.name;
			bc.msg.slide("正在上传文件：" + fileName);
			
//			var extend = fileName.substr(fileName.lastIndexOf(".")+1).toLowerCase();
//			var attach = bc.attach.tabelTpl.format(f.fileSize,bc.attach.getSizeInfo(f.fileSize),extend,fileName);
//			$(attach).attr("data-xhr",key).insertAfter($file.find(".header")).find(".progressbar").progressbar();
	    }

	    //开始上传
	    var $newAttachs = $file.find(".attach[data-xhr]");//含有data-xhr属性的代表还没上传
	    var i = 0;
	    setTimeout(function(){
	    	uploadNext();
	    },500);//延时小许时间再上传，避免太快看不到效果
		
	    //逐一上传文件
		function uploadNext(){
	    	if(i >= files.length){
		    	bc.file.clearFileSelect($file);
		    	bc.msg.slide("文件上传完毕！");
	    		return;//全部上传完毕
	    	}
	    	
	    	var key = batchNo + i;
			logger.info("uploading:i=" + i);
			//继续上传下一个附件
			uploadOneFile(key,files[i],url,uploadNext);
		}
	   
		bc.file.xhrs=[];
		//上传一个文件
	    function uploadOneFile(key,f,url,callback){
	    	var xhr = new XMLHttpRequest();
	    	bc.file.xhrs[key] = xhr;
			if($.browser.safari){//Chrome12、Safari5
				xhr.upload.onprogress=function(e){
					if(option.source){
						var progressbarValue = Math.round((e.loaded / e.total) * 100);
						logger.info(i + ":upload.onprogress:" + progressbarValue + "%");
						$file.closest(".bc-page").find(option.source).val("(" + (i+1) + "/" + files.length + ") " + progressbarValue + "%");
					}
				};
			}else if($.browser.mozilla){//Firefox4
				xhr.onuploadprogress=function(e){
					if(option.source){
						var progressbarValue = Math.round((e.loaded / e.total) * 100);
						logger.info(i + ":upload.onprogress:" + progressbarValue + "%");
						option.source.val("(" + (i+1) + "/" + files.length + ") " + progressbarValue + "%");
					}
				};
			}
			
			//上传完毕的处理
			xhr.onreadystatechange=function(){
				if(xhr.readyState===4){
					bc.file.xhrs[key] = null;
					//累计上传的文件数
					i++;
					logger.info(i + ":" + xhr.responseText);
					var json = eval("(" + xhr.responseText + ")");
					
					//附件总数加一
					option.totalCount += 1;
					
					//附件总大小添加该附件的部分
					option.totalSize = (option.totalSize || 0) + f.fileSize;
					
					//删除进度条、显示附件操作按钮（延时1秒后执行）
					setTimeout(function(){
//						var tds = $progressbar.parent();
//						var $operations = tds.next();
//						tds.remove();
//						$operations.empty().append(bc.file.operationsTpl);
//						
//						$attach.attr("data-id",json.msg.id)
//							.attr("data-name",json.msg.localfile)
//							.attr("data-url",json.msg.url)
//							.removeAttr("data-xhr");
					},1000);
					
					//调用回调函数
					if(typeof option.callback == "string")
						option.callback = bc.getNested(option.callback);
					if(typeof option.callback == "function")
						option.callback.call($file,json);
				}
			};
			
			xhr.onabort=function(){
				logger.info("onabort:i=" + i);
			}
//			xhr.upload.onabort=function(){
//				logger.info("upload.onabort:i=" + i);
//			}

			xhr.open("POST", url);
			xhr.setRequestHeader('Content-Type', 'application/octet-stream');
			//对文件名进行URI编码避免后台中文乱码（后台需URI解码）
			xhr.setRequestHeader('Content-Disposition', 'attachment; name="filedata"; filename="'+encodeURIComponent(f.fileName || f.name)+'"');
			if($.browser == "mozilla" && $.browser.version < 5)//Firefox4
				xhr.sendAsBinary(f.getAsBinary());
			else //Chrome12+,Firefox5+
				xhr.send(f);
	    }
	}
};

(function($){

//初始化文件控件的选择事件;Chrome12、Safari5、Firefox4、Opera
if($.browser.safari || $.browser.mozilla || $.browser.opera){
	$(":file.auto.uploadFile").live("change",function(e){
		logger.info("localfile=" + this.value);
		bc.file.upload.call(this,e.target.files,$(this).data("cfg"));
	});
}

})(jQuery);
/**
 * 图像上传、裁剪处理
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-08-22
 */
bc.image = {
	/** 
	 * 打开图像的裁剪上传对话框
	 * @param [Object] option
	 * @option [String] puid 所关联文档的UID
	 * @option [String] ptype 所关联文档的分类
	 * @option [String] extensions 图片扩展名的限制，用逗号连接多个，为空则使用系统app.attachs.images的配置
	 * @option [String] empty 空白图片的路径
	 * @option [Function] onOk 点击确认按钮后的回调函数，参数为图片处理后的数据
	 * @option [Number] ratio 限制图片裁剪的长宽比例，不设置则不限制
	 * @option [Number] width 处理后图片的宽度
	 * @option [Number] height 处理后图片的高度
	 */
	edit: function(option) {
		logger.debug("bc.image.crop");
		
		//将相关参数转换到data参数
		option.data = jQuery.extend({},option.data || {});
		if(option.puid)
			option.data.puid = option.puid;
		if(option.ptype)
			option.data.ptype = option.ptype;
		if(option.empty)
			option.data.empty = option.empty;
		if(option.preWidth)
			option.data.preWidth = option.preWidth;
		if(option.preHeight)
			option.data.preHeight = option.preHeight;
		
		var _this = this;
		bc.page.newWin(jQuery.extend({
			url: bc.root + "/bc/image/showCrop",
			name: "图片处理",
			mid: "cropImage",
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk.call(_this,status);
				}
			}
		},option));
	}
};

(function($){

// 自动绑定图片处理
$(".bc-imageEditor").live("click",function(e){
	var $this = $(this);
	
	//参数检验及处理
	var dataCfg = $this.attr("data-cfg");
	if(!dataCfg){
		alert("必须配置data-cfg属性的值");
		return false;
	}
	
	dataCfg = eval("(" + dataCfg + ")");
	if(!dataCfg.puid || dataCfg.puid.length == 0){
		alert("data-cfg属性中没有配置puid");
		return false;
	}
	var callback;
	if(dataCfg.onOk && dataCfg.onOk.length > 0){
		callback = bc.getNested(dataCfg.onOk);
		if(typeof callback != "function"){
			alert("data-cfg属性中配置的onOk值“" + dataCfg.onOk + "”对应的函数没有定义");
			return false;
		}
		dataCfg.onOk = callback;
	}else{
		alert("data-cfg属性中没有配置onOk");
		return false;
	}
	
	//打开图片编辑器
	bc.image.edit.call(this,dataCfg);
});

})(jQuery);
/**
 * desktop
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-09-29
 */
(function($, undefined) {
	// webkit特殊处理
	if(jQuery.browser.safari){
		$("body").addClass("webkit");
	}
	
	$.widget("ui.bcdesktop", {
		version : "1.0",
		options : {
			loadingText : "正在加载 ......"
		},

		_create : function() {
			var self = this;

			// 初始化顶部的系统菜单
			var $top = this.element.find(">#top");
			var $sysmenu = $top.find(">#sysmenu");
			$sysmenu.show().menubar({
				position : {
					within : $(window)
				},
				select : function(event, ui) {
					$li = ui.item;
					$a = $li.children("a");
					if(logger.infoEnabled)
						logger.info("click:name=" + $li.text() + ";href=" + $a.attr("href"));
					var option = $li.attr("data-option");
					if(!option || option.length == 0) option="{}";
					option = eval("("+option+")");
					option.mid=$li.attr("data-mid");
					option.name=$a.text();
					option.type=$li.attr("data-type");
					option.url=$a.attr("href");
					option.standalone=$li.attr("data-standalone")=="true";
					if(option.url && option.url.length>0 && option.url.indexOf("#")!=0)
						bc.page.newWin(option);

					//避免a的#跳转
					event.preventDefault();
				}
			});
			
			// 双击打开桌面快捷方式
			var $middle = this.element.find(">#middle");
			var $center = $middle.find(">#center");
			var $shortcuts = $center.find(">a.shortcut");
			
			//对ie，所有没有定义href属性的a，自动设置该属性为"#"，避免css中的:hover等没有效果
			if($.browser.msie){
				this.element.find("a[href=''],a:not([href])").each(function(){
					this.setAttribute("href","#");
				});
			}
			this.element.delegate("a.shortcut","dblclick",this.openModule);
			
			// 禁用桌面快捷方式的默认链接打开功能
			this.element.delegate("a.shortcut","click",function(){return false;});
			
			// 允许拖动桌面快捷方式
			var draggableOption = {containment: '#center',distance: 20,revert: function(droped){
				if(droped){
					var my = this.attr('data-aid') == userId;
					return !my;
				}
			}};
			$shortcuts.draggable(draggableOption);
			//$shortcuts.draggable({containment: '#desktop',grid: [20, 20]});
			//$("#shortcuts" ).selectable();
			
			// 允许拖动菜单项到桌面添加快捷方式的处理
			$sysmenu.find('li.ui-menu-item[data-type!=1]').draggable({
				containment: '#center',
				distance: 20,
				cursor: "move",
				helper: function(){
					var $this = $(this);
					var tpl = '<a class="shortcut ui-state-highlight"';
					tpl += ' data-mid="' + $this.attr("data-mid") + '"';
					tpl += ' data-aid="' + userId + '"';
					tpl += ' data-type="' + $this.attr("data-type") + '"';
					tpl += ' data-standalone="' + $this.attr("data-standalone") + '"';
					tpl += ' data-order="' + $this.attr("data-order") + '"';
					tpl += ' data-iconClass="' + $this.attr("data-iconClass") + '"';
					tpl += ' data-name="' + $this.attr("data-name") + '"';
					tpl += ' data-url="' + $this.attr("data-url") + '"';
					//if($this.attr("data-option"))tpl += ' data-option="' + $this.attr("data-option") + '"';
					tpl += '><span class="icon ' + $this.attr("data-iconClass") + '">';
					tpl += '</span><span class="text">' + $this.attr("data-name") + '</span></a>';
					tpl += '</a>';
					return $(tpl).appendTo("#top");
				}
			});
			$center.droppable({
				accept: 'li.ui-menu-item[data-type!=1]',
				activeClass: "ui-state-highlight",
				drop: function( event, ui ) {
					//$(this).addClass( "ui-state-highlight" );
					var $cur = $center.find("a.shortcut[data-mid='" + ui.helper.attr('data-mid') + "']");
					logger.info("$cur.size()=" + $cur.size());
					if($cur.size() == 0){
						var $shortcut = ui.helper.clone().css("top",(ui.helper.position().top - $middle.position().top) + "px")
						.removeClass("ui-state-highlight").hide().appendTo($center)
						.fadeIn().draggable(draggableOption);
						
						//通过ajax保存该快捷方式
						bc.ajax({
							url: bc.root + "/bc/shortcut/save4drag", 
							data: {mid:$shortcut.attr("data-mid")}, 
							dataType: "json",
							success:function(json){
								logger.info("data-id=" + json.id);
								$shortcut.attr("data-id",json.id);
								bc.msg.slide(json.msg);
							}
						});
					}else{
						//以动画显示已经存在的快捷方式
						$cur.addClass("hoverShortcut").fadeOut(function(){
							$cur.fadeIn(function(){
								$cur.removeClass("hoverShortcut");
							});
						});
					}
				}
			});
			
			$recyle = $center.children("a.recycle").droppable({
				accept: 'a.shortcut',
				hoverClass: "ui-state-highlight",
				activeClass: "ui-state-active",
				drop: function( event, ui ) {
					//通过ajax删除该快捷方式:只能删除自己的快捷方式
					if(ui.draggable.attr('data-aid') == userId){
						var id = ui.draggable.attr('data-id');
						bc.ajax({
							url: bc.root + "/bc/shortcut/delete?id=" + id, 
							dataType: "json",
							success:function(json){
								//修改回收站的图标
								$recyle.attr("data-iconClass","i0505").children("span.icon").addClass("i0505");
								
								//删除dom元素
								ui.draggable.remove();
								//显示提示信息
								bc.msg.slide("快捷方式“" + ui.draggable.attr('data-name') + "”已删除！");
							}
						});
					}else{
						bc.msg.slide("此为系统级通用快捷方式，不允许删除！");
					}
				}
			});

			// 快速工具条中条目的鼠标控制
			var $bottom = this.element.find(">#bottom");
			$bottom.delegate(".quickButton","mouseover", function() {
				$(this).addClass("ui-state-hover");
			});
			$bottom.delegate(".quickButton","mouseout", function() {
				$(this).removeClass("ui-state-hover");
			});
			$bottom.delegate(".quickButton","click", function() {
				$this = $(this);
				var mid = $this.attr("data-mid");
				var $dialogContainer = $middle.find(">.ui-dialog>.ui-dialog-content[data-mid='" + mid + "']").parent();
				if ($this.hasClass("ui-state-active")) {
					$this.removeClass("ui-state-active")
					.find(">span.ui-icon").removeClass("ui-icon-folder-open").addClass("ui-icon-folder-collapsed");
					$dialogContainer.hide();
				} else {
					$this.addClass("ui-state-active")
					.find(">span.ui-icon").removeClass("ui-icon-folder-collapsed").addClass("ui-icon-folder-open")
					.end().siblings().toggleClass("ui-state-active",false);
					$dialogContainer.show().end().dialog("moveToTop");
				}
				$this.removeClass("ui-state-highlight");
				return false;
			});

			// 显示隐藏桌面的控制
			$bottom.find("#quickShowHide").click(function() {
				var $this = $(this);
				var $dialogContainer = $middle.find(">.ui-dialog");
				if ($this.attr("data-hide") == "true") {
					$this.attr("data-hide","false");
					$dialogContainer.show();
				} else {
					$this.attr("data-hide","true");
					$dialogContainer.hide();
				}
				return false;
			});

			// 注销的控制
			$top.find("#quickLogout").click(function() {
				bc.chat.destroy();
				window.open(bc.root + "/logout","_self");
				return false;
			});

			// 帮助
			var clWin=[];
			$top.find("#bchelp,#bcmail").click(function() {
				var $helpDlg = bc.msg.info('<a href="#" id="clClick_help">查看帮助</a>&nbsp;&nbsp;<a href="#" id="clClick_changelog">查看更新日志</a>',bc.title);
				
				// 帮助
				$helpDlg.find("#clClick_help").click(function showHelp(){
					try {
						//打开查看更新日志的窗口
						if (!clWin["help"] || clWin["help"].closed) {
							clWin["help"] = window.open(bc.root
									+ "/help/index.htm#xitongzhuye", "_blank");
						} else {
							//clWin["help"].document.location.reload(true);
							clWin["help"].focus();
						}
						
						//关闭对话框
						$helpDlg.dialog("close");
					} catch (e) {
						clWin["help"] = null;
						showHelp();
					}
					return false;
				});
				
				// 日志
				$helpDlg.find("#clClick_changelog").click(function showChangelog(){
					try {
						//打开查看更新日志的窗口
						if (!clWin["changelog"] || clWin["changelog"].closed) {
							clWin["changelog"] = window.open(bc.root
									+ "/changelog/changelog.html?ts=" + bc.ts, "_blank");
						} else {
							clWin["changelog"].document.location.reload(true);
							clWin["changelog"].focus();
						}
						
						//关闭对话框
						$helpDlg.dialog("close");
					} catch (e) {
						clWin["changelog"] = null;
						showChangelog();
					}
					return false;
				});
				return false;
			});

			// 聊天
			var $bcq = $top.find("#bcq");
			if($bcq.size() > 0){
				$bcq.click(function() {
					// ie的提示：微软计划ie10才开始支持websocket
					if(jQuery.browser.msie && jQuery.browser.version < 10){
						alert("当前浏览器不支持WebSocket技术，无法使用在线聊天工具！");
						return false;
					}
					
					bc.page.newWin({
						name: "BQ2012",
						mid: "bq",
						url: bc.root + "/bc/websocket/online"
					});
					return false;
				});
				
				//开启WebSocket
				bc.chat.init();
			}
			
			// 桌面日历
//			var $right = this.element.find(">#middle>#right");
//			$right.find("#indexCalendar").datepicker({
//				showWeek: true,
//				//showButtonPanel: true,//显示今天按钮
//				firstDay: 7,
//				showOtherMonths: true,
//				selectOtherMonths: true
//			});
			
			$center.show();
		},

		_destroy : function() {
			this.element.undelegate().unbind();
		},
		
		/**双击打开桌面快捷方式*/
		openModule: function() {
			$this = $(this);
			logger.debug("openModule:" + $this.attr("class"));
			var option = $this.attr("data-option");
			if(!option || option.length == 0) option="{}";
			option = eval("("+option+")");
			option.mid=$this.attr("data-mid");
			option.iconClass=$this.attr("data-iconClass");
			option.name=$this.attr("data-name");
			option.order=$this.attr("data-order");
			option.url=$this.attr("data-url");
			option.standalone=$this.attr("data-standalone")=="true";
			bc.page.newWin(option);
		}
	});

})(jQuery);
/**
 * 系统浏览器支持提示工具
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-29
 * @depend jquery-ui,bc.core
 */
(function($) {

bc.browser = {
	/**下载指定的浏览器安装文件
	 * @param puid 附件的puid 
	 */
	init: function(puid) {
		var browser = jQuery.browser.version;
		var lowerVersion = false;
		var unSupportHtml5 = false;
		if(browser.safari || browser.mozilla || browser.opera){
			//对现代化的浏览器不做任何提示
			//Chrome、Safari、Firefox、Opera
		}else if(browser.msie){
			lowerVersion = browser.version < 8;
			unSupportHtml5 = browser.version < 9;
		}
		if(lowerVersion || unSupportHtml5){
			bc.msg.slide("你的浏览器" + (lowerVersion ? "版本太低" : "") + (unSupportHtml5 ? "、不支持html5！" : "！"));
			//弹出窗口让用户下载浏览器
			bc.page.newWin({
				url: bc.root + "/bc/attach/browser",
				mid: "attach.browser",
				name: "下载系统支持的浏览器"
			});
		}
	},
	/**下载指定的浏览器安装文件
	 * @param puid 附件的puid 
	 */
	download: function(puid) {
		window.open(bc.root + "/bc/attach/download?puid=" + puid, "blank");
	}
};
	
bc.browser.init();

//事件处理
$("ul.browsers>li.browser").live("mouseover", function() {
	$(this).addClass("ui-state-hover");
}).live("mouseout", function() {
	$(this).removeClass("ui-state-hover");
}).live("click", function() {
	bc.browser.download($(this).attr("data-puid"));
});

})(jQuery);
/**
 * 自动处理溢出的tabs
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-09-17
 */
(function($, undefined) {

	$.widget("ui.bctabs", {
		version : "1.0",
		options : {
			offsetNext : 0,
			offsetPrev : 0,
			tabsScroll: true,
			animateMethod : 'slideH',// 动画的方法
			contentEasing : 'easeInOutExpo',// 动画的擦出方法，参考easing插件可用的方法
			direction : 'horizontal',// tabs的布局方向
			tabActiveClass: "ui-state-active",
			animate:true,//是否使用动画显示页签和其内容
			contentAnimateMethod:"slideH",//内容的动画显示方法
			contentAnimateDuration:600,//内容的动画显示时间
			contentAnimateEasing:"easeInOutExpo",//内容的动画擦除方法
			tabsAnimateDuration:150,//页签的动画显示时间
			tabsAnimateEasing:"",//页签的动画擦除方法
			heightAnimateDuration:150,//内容区高度变化的动画显示时间
			heightAnimateEasing:"easeInOutExpo",//内容区高度变化的动画擦除方法
			minHeight: 80,//内容区的最小高度
			height: 'auto',// tabs的总高度，默认根据内容的高度自动扩展
			loadingText:"正在加载 ......"
		},

		_create : function() {
			var _this = this;
			
			//获取基于dom的配置
			var cfg = this.element.attr("data-cfg");
			if(cfg && cfg.length > 0)
				cfg = eval("(" + cfg + ")");
			jQuery.extend(this.options,cfg);
			
			//标记水平垂直的参数
			if (this.options.direction == 'horizontal') {
				this.options.val={
					wh: 'outerWidth',
					lt: 'left',
					marginLT: 'marginLeft'
				};
			} else {
				this.options.val={
					wh: 'outerHeight',
					lt: 'top',
					marginLT: 'marginTop'
				};
			}
			
			//向前向后按钮点击事件
			this.element.delegate("div.prev,div.next", "click", function() {
				var $this = $(this);
				if($this.hasClass("next") && !$this.children("a").hasClass("ui-state-disabled")){
					_this.next();
				}else if($this.hasClass("prev") && !$this.children("a").hasClass("ui-state-disabled")){
					_this.prev();
				}
				return false;
			});
			
			//向前向后按钮的显示
			this._initPrevNext();
			
			//页签的点击事件
			this.element.delegate("ul.tabs>li.tab>a", "click", function() {
				if(logger.debugEnabled)logger.debug("tabs.click:id=" + _this.element.attr("id"));
				_this.load($(this).parent().index());
				return false;
			});
			
			//处理当前页签的显示
			var $activeTab = this.element.find("ul.tabs>li.tab.active");
			if(!$activeTab.size())
				this.load(0,true);
			
			//内容容器高度设置
			if(!(this.options.height == "auto")){
				var h = this.options.height - this.element.find(">.tabsContainer").outerHeight(true);
				var $contentContainer = this.element.find(">.contentContainer");
				h = h - ($contentContainer.outerHeight(true) - $contentContainer.height());
				h = Math.max(h,this.options.minHeight);
				$contentContainer.height(h);
			}
			
			//处理鼠标的滚轮事件
			if (this.element.find("div.tabsContainer.sliding").size() && this.options.tabsScroll == true && $.fn.mousewheel) {
				this.element.find("ul.tabs").mousewheel(function(event, delta) {
					if(logger.debugEnabled)logger.debug("mousewheel:delta=" + delta);
					(delta > 0) ? _this.prev() : _this.next();
					return false;
				});
			}
		},

		_destroy : function() {
			this.element.undelegate().unbind();
		},

	    _getIndex: function( index ) {
			if ( typeof index == "string" ) {
				index = this.element.find(".tabs>tab>a[href$=" + index + "]" ).parent().index();
			}
			return index;
		},
		
		/** 初始化前后按钮的显示 */
		_initPrevNext : function() {
			if(logger.debugEnabled)logger.debug("tabs._initPrevNext");
			var $tabs = this.element.find("ul.tabs");
			var $lastElem = $tabs.children('li:last');
			var $slidElem = $tabs.parent();
			var usePrevNext = ($lastElem.position()[this.options.val.lt] + $lastElem[this.options.val.wh](true)) > ($slidElem.width() - this.options.offsetNext);
			
			//自动创建前后按钮
			if(logger.debugEnabled)logger.debug("tabs._initPrevNext:usePrevNext=" + usePrevNext);
			$tabs.children('li').each(function(i){
				if(logger.debugEnabled)logger.debug("tabs._initPrevNext:-" + i + "=" + $(this).position().left);
			});
				
			if(logger.debugEnabled)logger.debug("tabs._initPrevNext:0=" + ($lastElem.position()[this.options.val.lt] + $lastElem[this.options.val.wh](true)));
			if(logger.debugEnabled)logger.debug("tabs._initPrevNext:1=" + ($slidElem.width() - this.options.offsetNext));
			if(usePrevNext && $slidElem.siblings().size() == 0){
				$slidElem.parent().append(''+
					'<div class="prev ui-widget-content">'+
						'<a href="#" class="prev ui-state-default ui-state-disabled"><span class="ui-icon ui-icon-triangle-1-w"></span></a>'+
					'</div>'+
					'<div class="next ui-widget-content">'+
						'<a href="#" class="next ui-state-default"><span class="ui-icon ui-icon-triangle-1-e"></span></a>'+
					'</div>')
				.toggleClass("sliding",true);
			}
			
			//prev
			if ($tabs.children('li:first').position()[this.options.val.lt] == (0 + this.options.offsetPrev)) {
				this._disablePrev();
			} else {
				this._enablePrev();
			}

			//next
			if (!usePrevNext) {
				this._disableNext();
			} else {
				this._enableNext();
			}
		},
		
		/** 启用向后按钮 */
		_enableNext : function() {
			this.element.find("div.next>a.next").toggleClass("ui-state-disabled",false)
			.hover(function(){$(this).addClass("ui-state-hover");},
					function(){$(this).removeClass("ui-state-hover");});
		},
		/** 禁用向后按钮 */
		_disableNext : function() {
			this.element.find("div.next>a.next").toggleClass("ui-state-disabled",true)
			.unbind();
		},
		/** 启用向前按钮 */
		_enablePrev : function() {
			if(logger.debugEnabled)logger.debug("_enablePrev");
			this.element.find("div.prev>a.prev").toggleClass("ui-state-disabled",false)
			.hover(function(){$(this).addClass("ui-state-hover");},
					function(){$(this).removeClass("ui-state-hover");});
		},
		/** 禁用向前按钮 */
		_disablePrev : function() {
			this.element.find("div.prev>a.prev").toggleClass("ui-state-disabled",true)
			.unbind();
		},
		
		/** 显示tab */
		_showTab : function($tab,$content) {
			if(logger.debugEnabled)logger.debug("tabs._showTab");
			//页签
			var $preActiveTab = $tab.siblings(".active");
			$tab.data("preTabIndex",$preActiveTab.index()).add($preActiveTab).toggleClass("active").end();
			$tab.children("a").add($preActiveTab.children("a")).toggleClass("ui-state-active");
			
			//定位页签
			var $tabs = $tab.parent();
			var lt = $tab.position()[this.options.val.lt];
			if (lt < 0) {
				this.prev();
			}else{
				var cwh = $tabs.parent()[this.options.val.wh](false);
				var mlt = parseInt($tabs.css(this.options.val.marginLT));
				var wh = $tab[this.options.val.wh](true);
				if(logger.debugEnabled)logger.debug("wh=" + wh + ",lt=" + lt + ",cwh=" + cwh + ",mlt=" + mlt);
				if((wh + lt) > (cwh - this.options.offsetNext)){
					this.next();
				}
			}
			
			//内容
			if(this.options.animate){
				var _this = this;
				this["_" + this.options.contentAnimateMethod]($tab,$content,function(){
					//抛出show事件
					_this._trigger("show",null,{content:$content,tab:$tab});
				});
			}else{
				$content.add($content.siblings(".active")).toggleClass("active");
				
				//抛出show事件
				this._trigger("show",null,{content:$content,tab:$tab});
			}
		},
		
		/** 水平方向动画显示内容 */
		_slideH : function($tab,$content,callback) {
			var _this = this;
			if(logger.debugEnabled)logger.debug("tabs._slideH");
			var w = $content.width();
			//上一内容
			$oldContent = this.element.find(">.contentContainer>.content.active");
			var $contentContainer = $oldContent.parent();
			
			//高度动画
			if(this.options.height == "auto"){
				var oldHeight = $oldContent.outerHeight(true);
				var newHeight = $content.outerHeight(true);
				if(logger.debugEnabled)logger.debug("tabs._slideH:oldHeight=" + oldHeight + ",newHeight=" + newHeight);
				$contentContainer.stop().css({height: oldHeight})
				.animate({height: newHeight}, this.options.heightAnimateDuration, this.options.heightAnimateEasing);
			}
			
			$contentContainer.children(".content").stop();
			//水平动画
			var rightToLleft = ($tab.index() > $tab.data("preTabIndex"));
			$oldContent.css({
				position: "absolute",
				left: "0px"
			}).animate({
				left: rightToLleft ? -w : w
			}, this.options.contentAnimateDuration, this.options.contentAnimateEasing, function() {
				$oldContent.toggleClass('active', false);
			});
			$content.css({
				position: "absolute",
				left: rightToLleft ? w : -w
			}).toggleClass('active', true).animate({
				left: "0px"
			}, this.options.contentAnimateDuration, this.options.contentAnimateEasing,function(){
				$oldContent.add($content).css({position: "relative"});
				if(_this.options.height == "auto")
					$contentContainer.css({height:"auto"});
				if(logger.debugEnabled)logger.debug("tabs._slideH:newHeight=" + $content.height());
				
				if(typeof callback == "function"){
					if(logger.debugEnabled)logger.debug("tabs._slideH.callback");
					callback.call(this);
				}
			});
		},
		
		/** 加载tab */
		load : function(index,force) {
			index = this._getIndex(index);
			if(force !== true && index == this.element.find("ul.tabs>li.active").index()){
				return this;
			}

			var $tab = this.element.find("ul.tabs>li:eq(" + index + ")" );
			var $a = $tab.children("a");
			
			var url = $a.attr("href");
			if(logger.debugEnabled)logger.debug("tabs.load:index=" + index + ",href=" + url);
			if(url.indexOf("#") == 0){
				var $content = this.element.find(">div.contentContainer>" + url);
				if(!$content.size())
					alert("this tab did not config content's div：href=" + url);
				this._showTab($tab,$content);
				return this;
			}
			
			var id = new Date().getTime();
			// 将url作为一个属性记录下来
			$a.attr("data-src",url).attr("href", "#" + id);
			
			//创建内容div，并显示加载动画
			var $contentContainer = this.element.find(">div.contentContainer");
			//$contentContainer.children(".active").toggleClass("active",false);
			var $content = $('<div id="'+id+'" class="content"><div class="loading">'+this.options.loadingText+'</div></div>')
				.appendTo($contentContainer);
			this._showTab($tab,$content);
			
			var _this = this;
			//通过ajax加载页签的内容
			$.get(url,function(html){
				$content.empty().append(html);
				
				// 设置内部页签的一些属性参数:与 bc.page.newWin的处理一致
				var $tabBCPage = $content.children("div.bc-page");
				if($tabBCPage.size() > 0){
					$tabBCPage.attr("data-src",url);
					
					// 获取父页面的data-mid
					var pmid = $content.closest("div.bc-page").attr("data-mid");
					if(!pmid){
						pmid = new Date();
					}
					if(logger.debugEnabled)logger.debug("pmid=" + pmid);
					$tabBCPage.attr("data-mid",pmid + ".tab" + index).attr("data-isTabContent","true");
				}
				
				//抛出加载完毕事件
				_this._trigger("load",null,{content:$content,tab:$tab});
				
				//_this._showTab($tab,$content);
			});
			
			return this;
		},

		/** 选中tab */
		select : function(index) {
			index = this._getIndex(index);
			if(index != this.element.find("ul.tabs>li.active").index()){
				this.load(index);
			}
			
			return this;
		},

		/** 显示上一个tab */
		prev : function() {
			var _this = this;
			//如果正在动画中就忽略不处理
			if (_this.element.find(":animated").length) {
				return false;
			}

			//显示页签
			var $tabs = this.element.find("ul.tabs");
			var $lis = $tabs.children('li');
			var cwh = $tabs.parent()[_this.options.val.wh](false);
			var mlt = parseInt($tabs.css(_this.options.val.marginLT));
			$lis.each(function(index) {
				$li = $(this);
				var wh = $li[_this.options.val.wh](true);
				var lt = $li.position()[_this.options.val.lt];
				if(logger.debugEnabled)logger.debug("wh=" + wh + ",lt=" + lt + ",cwh=" + cwh + ",mlt=" + mlt);
				if ((wh + lt) >= 0) {
					var newmlt = lt - mlt - _this.options.offsetPrev;
					if(logger.debugEnabled)logger.debug("next:index=" + index + ",newmlt=" + newmlt);
					
					//显示这个页签 
					if(_this.options.animate){
						var cfg = {};
						cfg[_this.options.val.marginLT] = -newmlt;
						$tabs.animate(cfg,_this.options.tabsAnimateDuration,_this.options.tabsAnimateEasing);
					}else{
						$tabs.css( _this.options.val.marginLT,-newmlt);
					}
					
					//处理前后按钮的显示
					_this._enableNext();
					if(index == 0){
						_this._disablePrev();
					}
					
					return false;
				}
			});
			
			return this;
		},

		/** 显示下一个tab */
		next : function() {
			var _this = this;
			
			//如果正在动画中就忽略不处理
			if (_this.element.find(":animated").length) {
				return false;
			}

			//显示页签
			var $tabs = this.element.find("ul.tabs");
			var $lis = $tabs.children('li');
			var cwh = $tabs.parent()[_this.options.val.wh](false);
			var mlt = parseInt($tabs.css(_this.options.val.marginLT));
			$lis.each(function(index) {
				$li = $(this);
				var wh = $li[_this.options.val.wh](true);
				var lt = $li.position()[_this.options.val.lt];
				if(logger.debugEnabled)logger.debug("wh=" + wh + ",lt=" + lt + ",cwh=" + cwh + ",mlt=" + mlt);
				if ((wh + lt) > (cwh - _this.options.offsetNext)) {
					var newmlt = wh + lt - mlt + _this.options.offsetNext - cwh;
					if(logger.debugEnabled)logger.debug("next:index=" + index + ",newmlt=" + newmlt);
					
					//显示这个页签 
					if(_this.options.animate){
						var cfg = {};
						cfg[_this.options.val.marginLT] = -newmlt;
						$tabs.animate(cfg,_this.options.tabsAnimateDuration,_this.options.tabsAnimateEasing);
					}else{
						$tabs.css( _this.options.val.marginLT,-newmlt);
					}
					
					//处理前后按钮的显示
					_this._enablePrev();
					if(index +1 >= $lis.size()){
						_this._disableNext();
					}
					
					return false;
				}
			});
			
			return this;
		},

		/** 重新根据容器调整尺寸 */
		resize : function() {
			if(logger.debugEnabled)logger.debug("tabs:resize");
			
			// 内容容器高度设置
			if(this.options.autoResize){
				var h = this.element.parent().height() - this.element.find(">.tabsContainer").outerHeight(true);
				var $contentContainer = this.element.find(">.contentContainer");
				h = h - ($contentContainer.outerHeight(true) - $contentContainer.height());
				h = Math.max(h,this.options.minHeight);
				$contentContainer.height(h);
			}
	
			//向前向后按钮的显示
			this._initPrevNext();
			
			// 将各个页签标记为父尺寸已变动
			this.element.find(".content").attr("data-resized","true");

			return this;
		}
	});

})(jQuery);
/*
 * jQuery UI Dialog 的扩展:(source:1.9pre Live from Git Thu Sep 29 10:15:03 UTC 2011)
 * 1)增加containment参数，控制对话框拖动的限制范围
 * 2)增加dragLimit参数，控制对话框拖动的范围
 */
(function( $, undefined ) {
	
/** copy过来的局部变量 */
var uiDialogClasses = "ui-dialog ui-widget ui-widget-content ui-corner-all ",
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	};

$.extend($.ui.dialog.prototype.options, {
	closable: true,//关闭按钮
	minimizable: false,//最小化按钮
	maximizable: false,//最大化按钮
	help: false,//帮助按钮
	print: false,//打印按钮
	appendTo: "body",
	dragLimit: [0,80,35,40]//上,右,下,左
});
$.extend($.ui.dialog.prototype.options.position, {
	// 修改为避免对话框顶部超出容器的top或left
	using: function( pos ) {
		//logger.info("pos=" + $.toJSON(pos));
		if ( pos.top < 0 ) {
			pos.top = 10;
		}
		if ( pos.left < 0 ) {
			pos.left = 10;
		}
		$( this ).css( pos );
	}
});

$.extend($.ui.dialog.prototype, {

	/** 增加最小化、最大化按钮 */
	_create: function() {
		this.originalTitle = this.element.attr( "title" );
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}

		this.options.title = this.options.title || this.originalTitle;
		var self = this,
			options = self.options,

			title = options.title || "&#160;",
			titleId = $.ui.dialog.getTitleId( self.element ),

			uiDialog = ( self.uiDialog = $( "<div>" ) )
				.addClass( uiDialogClasses + options.dialogClass )
				.css({
					display: "none",
					outline: 0, // TODO: move to stylesheet
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				.attr( "tabIndex", -1)
				.keydown(function( event ) {
					if ( options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
							event.keyCode === $.ui.keyCode.ESCAPE ) {
						self.close( event );
						event.preventDefault();
					}
				})
				.attr({
					role: "dialog",
					"aria-labelledby": titleId
				})
				.mousedown(function( event ) {
					self.moveToTop( false, event );
				})
				.appendTo( self.options.appendTo),

			uiDialogContent = self.element
				.show()
				.removeAttr( "title" )
				.addClass( "ui-dialog-content ui-widget-content" )
				.appendTo( uiDialog ),

			uiDialogTitlebar = ( self.uiDialogTitlebar = $( "<div>" ) )
				.addClass( "ui-dialog-titlebar  ui-widget-header  " +
					"ui-corner-all  ui-helper-clearfix" )
				.prependTo( uiDialog ),

//			uiDialogTitlebarClose = $( "<a href='#'></a>" )
//				.addClass( "ui-dialog-titlebar-close  ui-corner-all" )
//				.attr( "role", "button" )
//				.click(function( event ) {
//					event.preventDefault();
//					self.close( event );
//				})
//				.appendTo( uiDialogTitlebar ),
//
//			uiDialogTitlebarCloseText = ( self.uiDialogTitlebarCloseText = $( "<span>" ) )
//				.addClass( "ui-icon ui-icon-closethick" )
//				.text( options.closeText )
//				.appendTo( uiDialogTitlebarClose ),

			uiDialogTitle = $( "<span>" )
				.addClass( "ui-dialog-title" )
				.attr( "id", titleId )
				.html( title )
				.prependTo( uiDialogTitlebar );
		
		// 添加右上角的按钮容器
		var $topRightButtons = $('<div class="ui-dialog-titlebar-buttons"></div>').appendTo( uiDialogTitlebar );
		
		// 添加打印按钮：
		if (options.print) {
			$('<a href="#" class="ui-corner-all"><span class="ui-icon ui-icon-print">print</span></a>')
			.appendTo($topRightButtons)
			.attr("data-print",options.print)
			.click(function( event ) {
				event.preventDefault();
				self.print( event,this );
			});
		}
		
		// 添加帮助按钮：
		if (options.help) {
			$('<a href="#" class="ui-corner-all"><span class="ui-icon ui-icon-help">help</span></a>')
			.appendTo($topRightButtons)
			.attr("data-help",options.help)
			.click(function( event ) {
				event.preventDefault();
				self.help( event,this );
			});
		}
		
		// 添加最小化按钮：
		if (options.minimizable) {
			$('<a href="#" class="ui-corner-all"><span class="ui-icon ui-icon-minusthick">minimize</span></a>')
			.appendTo($topRightButtons)
			.click(function( event ) {
				event.preventDefault();
				self.minimize( event );
			});
		}
		
		// 添加最大化按钮：maximized
		if (options.maximizable) {
			$('<a href="#" class="ui-corner-all"><span class="ui-icon ui-icon-extlink">maximize</span></a>')
			.appendTo($topRightButtons)
			.click(function( event ) {
				event.preventDefault();
				self.maximize( event );
			});
		}
		
		// 最后添加右上角的关闭按钮
		if (options.closable) {
			$('<a href="#" class="ui-corner-all"><span class="ui-icon ui-icon-closethick">close</span></a>')
			.appendTo($topRightButtons)
			.click(function( event ) {
				event.preventDefault();
				self.close( event );
			});
		}

		uiDialogTitlebar.find( "*" ).add( uiDialogTitlebar ).disableSelection();
		this._hoverable($topRightButtons.children());
		this._focusable($topRightButtons.children());

		if ( options.draggable && $.fn.draggable ) {
			self._makeDraggable();
		}
		if ( options.resizable && $.fn.resizable ) {
			self._makeResizable();
		}

		self._createButtons( options.buttons );
		self._isOpen = false;

		if ( $.fn.bgiframe ) {
			uiDialog.bgiframe();
		}
	},
	
	/** 
	 * 1)修改创建button的方式
	 */
	_createButtons: function( buttons ) {
		var self = this,
			hasButtons = false;

		// if we already have a button pane, remove it
		self.uiDialog.find( ".ui-dialog-buttonpane" ).remove();

		if ( typeof buttons === "object" && buttons !== null ) {
			$.each( buttons, function() {
				return !(hasButtons = true);
			});
		}
		if ( hasButtons ) {
			var uiDialogButtonPane = $( "<div>" )
					.addClass( "ui-dialog-buttonpane  ui-widget-content ui-helper-clearfix" ),
				uiButtonSet = $( "<div>" )
					.addClass( "ui-dialog-buttonset" )
					.appendTo( uiDialogButtonPane );

			$.each( buttons, function( name, props ) {
				if(props && props.html ){
					//这里是添加的扩展处理，让按钮支持使用ToolbarButton生成的html代码
					uiButtonSet.append(props.html);
				}else{
					props = $.isFunction( props ) ?
						{ click: props, text: name } :
						props;
					
					var button = $( "<button type='button'>" )
						.attr( props, true )
						.unbind( "click" )
						.click(function() {
							props.click.apply( self.element[0], arguments );
						})
						.appendTo( uiButtonSet );
					if ( $.fn.button ) {
						button.button();
					}
				}
			});
			self.uiDialog.addClass( "ui-dialog-buttons" );
			uiDialogButtonPane.appendTo( self.uiDialog );
		} else {
			self.uiDialog.removeClass( "ui-dialog-buttons" );
		}
	},
	
	/** 
	 * 1)增加containment参数，控制对话框拖动的限制范围；
	 * 2)增加dragLimit参数，控制对话框拖出容器的范围；
	 */
	_makeDraggable: function() {
		var self = this,
		options = self.options,
		doc = $( document );

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}
		
		var parent =  $(options.appendTo);
		var minTop = options.dragLimit[0];
		var maxTop = parent.height() - options.dragLimit[2];
		var minLeft = options.dragLimit[3] - self.uiDialog.width();
		var maxLeft = parent.width() - options.dragLimit[1];
	
		self.uiDialog.draggable({
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-buttons",
			handle: ".ui-dialog-titlebar",
			containment: self.options.containment,//这里是修改的代码
			helper: function(e){
				//性能优化添加的代码：使用马甲代替窗口的动态移动
				var w = self.uiDialog.width();
				var h = self.uiDialog.height();
				return '<div class="'+self.uiDialog.attr("class")+'" style="background:none;'
					+"border-style:dotted;border-width:3px;border-radius:0;box-shadow:none;"
					+"width:"+w+'px;height:'+h+'px;z-index:'+($.ui.dialog.maxZ+1)+'"></div>';
			},
			start: function( event, ui ) {
				$( this ).addClass( "ui-dialog-dragging" );
				self._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				if(!self.options.containment && options.dragLimit){
					//logger.info("parent:" + $.toJSON(parent.position()) + ",w" + parent.width() + ",h" + parent.height());
					//logger.info("position:" + $.toJSON(ui.position));
					
					var parent =  $(options.appendTo);
					var minTop = options.dragLimit[0];
					var maxTop = parent.height() - options.dragLimit[2];
					var minLeft = options.dragLimit[3] - self.uiDialog.width();
					var maxLeft = parent.width() - options.dragLimit[1];
					
					//控制top
					if(ui.position.top > maxTop){
						ui.position.top = maxTop;
					}else if(ui.position.top < minTop){
						ui.position.top = minTop;
					}
					
					//控制left
					if(ui.position.left > maxLeft){
						logger.info("maxLeft:" + maxLeft);
						ui.position.left = maxLeft;
					}else if(ui.position.left < minLeft){
						ui.position.left = minLeft;
					}
				}
				self._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.position = [
					ui.position.left - doc.scrollLeft(),
					ui.position.top - doc.scrollTop()
				];
				
				//性能优化添加的代码：根据马甲的位置重新定位窗口的位置
				self.uiDialog.css({left:options.position[0],top:options.position[1]});
				
				$( this )
					.removeClass( "ui-dialog-dragging" );
				self._trigger( "dragStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		});
	},
	/** 最大化窗口 */
	maximize: function(event) {
		var self = this;
		
		// 修改按钮样式
		var $maxOrMin = self.uiDialog.find(".ui-icon-extlink,.ui-icon-newwin");
		var isMax = $maxOrMin.hasClass("ui-icon-newwin");
		self.options.isMax = isMax;
		$maxOrMin.toggleClass("ui-icon-extlink ui-icon-newwin");
		
		// 记录原始状态
		var newWidth,newHeight,newLeft,newTop,$appendTo = $(self.options.appendTo);
		var s = 0;//最大化后周边预留的间隙
		if(!self.options.isMax){
			self.options.originalHeight = self.uiDialog.height();
			self.options.originalWidth = self.uiDialog.width();
			var p = self.uiDialog.position();
			self.options.originalLeft = p.left;
			self.options.originalTop = p.top;
			
			newLeft = s;
			newTop = s;
			newWidth = $appendTo.width() - 2*s - (self.uiDialog.outerWidth(true) - self.options.originalWidth);
			newHeight = $appendTo.height() - 2*s - (self.uiDialog.outerHeight(true) - self.options.originalHeight);
			
			// 禁止移动、改变窗口的大小
			self.uiDialog.draggable("disable");
			self.uiDialog.resizable("disable");
			self.uiDialog.removeClass("ui-state-disabled").children(".ui-dialog-titlebar").css("cursor","default");
		}else{
			newWidth = self.options.originalWidth;
			newHeight = self.options.originalHeight;
			newLeft = self.options.originalLeft;
			newTop = self.options.originalTop;
			
			// 重新启用移动、改变窗口的大小
			self.uiDialog.draggable("enable");
			self.uiDialog.resizable("enable");
			self.uiDialog.children(".ui-dialog-titlebar").css("cursor","move");
		}
		
		// 处理窗口的大小
		self.uiDialog.css({left:newLeft, top:newTop, width:newWidth, height:newHeight});
		
		// 处理窗口内容元素的大小
		self.element.css({
			width: newWidth - (self.element.outerWidth(true) - self.element.width()), 
			height: newHeight - (self.element.outerHeight(true) - self.element.height()) - self.uiDialog.children(".ui-dialog-titlebar").outerHeight(true) - self.uiDialog.children(".ui-dialog-buttonpane").outerHeight(true)
		});
		
		self._trigger('resize', event);
		
		self._trigger('maximize', event);
		return self;
	},
	/** 最小化窗口 */
	minimize: function(event) {
		var self = this;
		self._trigger('minimize', event);
		return self;
	},
	/** 点击帮助按钮 */
	help: function(event,clickDom) {
		var self = this;
		self._trigger('help', event,clickDom);
		return self;
	},
	/** 点击打印按钮 */
	print: function(event,clickDom) {
		var self = this;
		self._trigger('print', event,clickDom);
		return self;
	}
});

//遮罩的扩展
$.extend( $.ui.dialog.overlay, {
	create: function( dialog ) {
		if ( this.instances.length === 0 ) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ( $.ui.dialog.overlay.instances.length ) {
					$( document ).bind( $.ui.dialog.overlay.events, function( event ) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ( $( event.target ).zIndex() < $.ui.dialog.overlay.maxZ ) {
							return false;
						}
					});
				}
			}, 1 );

			// allow closing by pressing the escape key
			$( document ).bind( "keydown.dialog-overlay", function( event ) {
				if ( dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
					event.keyCode === $.ui.keyCode.ESCAPE ) {
					
					dialog.close( event );
					event.preventDefault();
				}
			});

			// handle window resize
			$( window ).bind( "resize.dialog-overlay", $.ui.dialog.overlay.resize );
		}

		var $el = ( this.oldInstances.pop() || $( "<div>" ).addClass( "ui-widget-overlay" ) )
			.appendTo( dialog.options.appendTo || document.body )//修改的代码
			.css({
				width: this.width(),
				height: this.height()
			});

		if ( $.fn.bgiframe ) {
			$el.bgiframe();
		}

		this.instances.push( $el );
		return $el;
	}
});

}(jQuery));

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
			bc.ws = new window.WebSocket(bc.wsurl + "?sid=" + bc.sid + "&c=" + userId + "," + userName, "chat");
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
						bc.chat.receive($msgDialog,className,userName,toSid,json.time,json.msg);
					}else{
						//用户还没有打开聊天窗口就提示一下
						//TODO 记录这些信息以便在用户打开聊天窗口后自动添加进去
						bc.msg.slide(json.name + "：" + json.msg);
					}
				}else if(json.type == 0 || json.type == 1){//上下线信息
					if(json.type == 1 && json.sid == bc.sid){//自己登录后的超时下线
						bc.chat.autologin(json.sid);
					}else{
						//寻找在线用户列表对话框
						var $msgDialog = $(".ui-dialog>.ui-dialog-content.online[data-mid='bq']").parent();
						var $sidDialog = $(".ui-dialog>.ui-dialog-content.chatMsg[data-mid='chat-" + json.sid + "']").parent();
						if($msgDialog.size()){//找到对话框
							if(json.type == 0){//上线
								//添加在线用户
								bc.chat.addUser($msgDialog,json);
								
								//提示上线
								bc.chat.receive($sidDialog,"sys","系统",json.sid,json.time,json.msg);
							}else if(json.type == 1){//下线
								//删除离线用户
								bc.chat.removeUser($msgDialog,json.sid);
							}
							
							//如果对话框当前被隐藏，提示一下
							if ($msgDialog.is(":hidden")) {
								bc.page.quickbar.warn("bq");
								bc.msg.slide(json.msg);
							}
						}else{
							bc.msg.slide(json.msg);
						}
						
						// 寻找当前打开的聊天对话框并提示
						if(json.type == 1){//下线
							bc.chat.receive($sidDialog,"sys","系统",json.sid,json.time,json.msg);
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
	/**接收一条聊天记录*/
	receive:function($page,className,userName,fromSid,time,msg){
		if($page.size() == 0) return;

		//插入聊天消息
		bc.chat.addHistory($page,bc.chat.historyItemTpl.format(className,userName,time,msg));
		
		//如果对话框当前被隐藏，任务栏搞动一下
		if ($page.is(":hidden")) {
			bc.page.quickbar.warn("chat-" + fromSid);
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
		var $count = $page.find("#count");
		$count.text(parseInt($count.text()) + 1);
	},
	/**删除离线用户*/
	removeUser:function($page,sid){
		if(bc.sid == sid){	// 自己登录超时导致的离线，提示用户重新登录
			bc.chat.relogin(sid);
		}else{				// 别人离线
			$page.find("li.item[data-sid='" + sid + "']").remove();
		}
		var $count = $page.find("#count");
		$count.text(parseInt($count.text()) - 1);
	},
	/** 手动重新登录 */
	relogin:function(sid,title){
		// 让用户输入密码重新登录
		bc.page.newWin({
			mid: 'relogin',
			url: bc.root + '/relogin',
			name: title || '重新登录',
			modal: true
		});
		//bc.chat.stopReconnect = true;
		//bc.chat.destroy();
	},
	/** 自动重新登录 */
	autologin:function(sid){
		bc.msg.slide("登录超时，正在重新登录...");
		bc.ajax({
			url : bc.root + "/doLogin",
			data : {
				name : userCode,
				password : bc.md5,
				sid: sid,
				relogin: true
			},
			type : "POST",
			dataType: "json",
			success : function(json) {
				if(json.success){
					bc.msg.slide("重新登录成功！");
					bc.sid = json.sid;
				}else{
					logger.info("autoRelogin failed:" + json.msg);
					// 转到手动登录
					bc.chat.relogin(sid, '重新登录系统');
				}
			},
			error : function(json) {
				logger.info("autoRelogin error:" +　$.toJSON(json));
				// 转到手动登录
				bc.chat.relogin(sid, '登录系统');
			}
		});
	}
};
})(jQuery);
