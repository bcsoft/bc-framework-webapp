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

/**
 * 获取一个新的UID
 * @param {String} type 类别
 * @param {Function} callback 回调函数，第一个参数为UID的值
 */
bc.nextUid = function (type, callback) {
	bc.ajax({
		url : bc.root + "/bc/nextuid",
		data : {type: type},
		dataType : "html",
		success : function(uid) {
			callback && callback.call(this, uid);
		}
	});
};

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
/** 格式化时间信息，格式为HH:mm:ss
 * @return
 */
bc.formatTime = function(hour,minute,second,millisecond){
	var time = (hour < 10 ? "0" : "") + hour;//时
	if(typeof minute != "undefined")
		time += (minute < 10 ? ":0" : ":") + minute;//分
	if(typeof second != "undefined")
		time += (second < 10 ? ":0" : ":") + second;//秒
	if(typeof millisecond != "undefined")
		time += millisecond;//豪秒
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

/**
 * 从配置中解析出要加载的js、css文件
 *
 * @param cfg 配置，多个js、css文件间用逗号连接：js:[key],subpath/to/your.js
 * @return
 */
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
		}else if(cfg[i].indexOf("wf:") == 0){//预定义的流程资源文件
			cfg[i] = bc.root + "/bc-workflow/resource?key=" + cfg[i].substr(3);
		}else if(cfg[i].indexOf("http") != 0 && cfg[i].indexOf("/") != 0){//相对路径的文件
			cfg[i] = bc.root + "/" + cfg[i];
		}
	}
	return cfg;
};

/**
 * 获取模板信息
 *
 * @param source {String} 源配置，如果以字符"TPL."开头，则当作模板的key从模版库中获取，否则直接返回source
 * @return
 */
bc.getTpl = function(source){
	if(!source)
		return null;
	if(source.indexOf("TPL.") == 0){
		return bc.getNested(source);
	}else{
		return source;
	}
};

/**
 * 用指定的参数格式化模板
 *
 * @param source {String} 模板，如果以字符"TPL."开头，则当作模板的key从模版库中获取后再进行格式化
 * @param params {Object|Array} 格式化参数
 * @return
 */
bc.formatTpl = function(source,params){
	return Mustache.render(bc.getTpl(source), params)
};

/**
 * 对指定的url地址，请求回来的内容进行打印
 * @param option {Object} 配置参数
 * @option url {String} url地址
 * @option method {String} POST|GET
 * @option data {Object} [可选]要传输的数据
 * @option isOpenNewWin {Boolean} [可选]是否在新窗口打开打印界面（默认false）
 * @option autoPrint {Boolean} [可选]是否自动开始打印（默认true）
 */
bc.print = function(option) {
    var _option = option;
    option = {
        isOpenNewWinL: false,       //是否在新窗口打开打印界面（默认false）
        autoPrint: true             //是否自动开始打印（默认true）
    };
    if(typeof _option == "string"){
        option = jQuery.extend(option,{
            url: _option,
            isOpenNewWinL: (arguments.length > 1 ? arguments[1] : false),
            autoPrint: (arguments.length > 2 ? arguments[2] : true),
            old: true
        });
    }else{
        option = _option;
    }
    if(!option.url) alert("必须设置打印的 url 参数！");
    if(option.isOpenNewWin) option.target = "_blank";

    //console.log("option=" + $.toJSON(option));

    if(!option.old) {// 使用表单方式提交
        var $form = $("form[name='temp']");
        if (!$form.length) {
            //console.log("create new form for post url with data.");
            $form = $("<form name='temp' method='post' style='display:none'></form>").appendTo("body");
        }
        $form.attr("method", option.method || "post");
        $form.attr("target", option.target || "print");
        $form.attr("action", option.url);
        $form.empty();// 清空提交环境
        var form = $form[0];
        if (option.data) {// 利用隐藏域保存数据
            //console.log("TODO: post data.");
            var html = [];
            for (var key in option.data) {
                html.push("<input type='hidden' name='" + key + "' value='" + option.data[key] + "'/>");
            }
            $form.html(html.join(""));
        }

        if(form.target == "print") {  // 通过iframe打印
            // 获取打印用的隐藏 iframe
            var $iframe = $("iframe[name='print']");
            if(!$iframe.length){
                //console.log("create new iframe for print.");
                $iframe = $("<iframe name='print' style='display:none'></iframe>").appendTo("body");
            }
            form.submit();  // 提交表单

            $iframe.one("load", function(){
                //调用打印方法打印iframe的内容
                this.contentWindow.print();
                //打单操作结束后，清空iframe内容节约资源
                $iframe.attr("src","about:blank");
            });
        }else {// 新窗口：不支持 autoPrint 参数
            form.submit();  // 提交表单
        }
        $form.attr("action","about:blank").empty(); // 清空form数据释放资源
    }else { // 非表单方式提交
        // 将data附加到url
        if(option.data){
            for(var key in option.data){
                option.url = bc.addParamToUrl(option.url, key + "=" + option.data[key]);
            }
        }

        if(!option.isOpenNewWin){// 通过iframe打印
            // 获取打印用的隐藏 iframe
            var $iframe = $("iframe[name='print']");
            if(!$iframe.length){
                //console.log("create new iframe for print.");
                $iframe = $("<iframe name='print' style='display:none'></iframe>").appendTo("body");
            }

            $iframe.attr("src", option.url);
            $iframe.one("load", function(){
                //调用打印方法打印iframe的内容
                this.contentWindow.print();
                //打单操作结束后，清空iframe内容节约资源
                $iframe.attr("src","about:blank");
            });
        }else {// 在新窗口打印
            var win = window.open(url, "_blank");
            if(option.autoPrint) win.print();
        }
    }
};
// support requirejs
if (typeof define === "function" && define.amd) {
	define("bc", [], function () {
		return bc;
	});
}