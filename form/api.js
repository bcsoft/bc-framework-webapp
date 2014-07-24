/**
 * 表单模块通用API
 */
bc.namespace("bc.customForm");

/**
 * 渲染业务对象表单
 * 如果业务对象的表单不存在则自动创建一个
 * @param {Object} option 配置参数
 * @option {String} type [必填]表单业务类别，如：CarManCert（司机证件）
 * @option {String} code [必填]表单业务编码，如：certIdentity（身份证）
 * @option {Integer} pid [必填]表单业务ID，如：司机招聘表的ID
 * @option {String} ver [可选]版本号，没有指定代表最新版本
 * @option {String} tpl [必填]模板编码
 * @option {String} subject [必填]标题
 * @option {String} role [可选]对表单进行编辑需要的角色，使用"|"连接多个角色编码代表或关系，使用"+"连接多个角色编码代表和关系
 * @option {boolean} readonly [可选]是否强制只读显示，默认自动根据 role 参数的值判断
 * @option {Object} extraData [可选]附加数据，格式为：[{name: "sex", value: 1, type: "int"}, ...]
 * @option {boolean} replace [可选]如果现存表单中含有data参数中的数据，是否优先使用data中的数据，默认false
 * @option {String} onOk [可选]表单成功修改后的回调函数
 */
bc.customForm.render = function(option){
	if (!option || !option.type || !option.code || !option.pid || !option.subject || !option.tpl) {
		bc.msg.alert("必须配置 type、code、pid、subject、tpl 参数 - bc.customForm.render");
		return;
	}

	// 组装参数
	var data = {
		type: option.type,
		code: option.code,
		pid: option.pid,
		tpl: option.tpl,
		subject: option.subject
	};
	if(option.role) data.role = option.role;
	if(option.ver) data.ver = option.ver;
	if(option.readonly) data.readonly = option.readonly;
	if(option.replace) data.replace = option.replace;
	if(option.extraData) data.extraData = $.toJSON(option.extraData);

	// 弹出渲染窗口
	bc.page.newWin({
		url: bc.root + "/bc/customForm/render",
		data: data,
		mid: option.type + "." + option.code + "." + option.pid + "." + (option.ver ? option.ver : "newest"),
		name: option.subject,
		title: option.subject,
		afterClose: function(status){
			if(status && option.onOk){
				option.onOk.call(this, status);
			}
		}
	});
};

/**
 * 删除业务对象表单
 * @param {Object} option 配置参数
 * @option {String} type [必填]表单业务类别，如：CarManCert（司机证件）
 * @option {String} code [必填]表单业务编码，如：certIdentity（身份证）
 * @option {Integer} pid [必填]表单业务ID，如：司机招聘表的ID
 * @option {String} ver [可选]版本号，没有指定代表最新版本
 * @option {String} onOk [可选]表单成功删除后的回调函数
 */
bc.customForm.delete_ = function(option){
	if (!option || !option.type || !option.code || !option.pid || !option.ver) {
		bc.msg.alert("必须配置 type、code、pid、ver 参数 - bc.customForm.delete_");
		return;
	}

	// 组装参数
	var data = {
		type: option.type,
		code: option.code,
		pid: option.pid,
		ver: option.ver
	};
	$.ajax({
		method: "POST",
		dataType: "json",
		url: bc.root + "/customForm/delete",
		data: {id: id},
		success: function(json){
			if(json.success){
				if(typeof option.onOk == "function"){
					option.onOk.call(this, json);
				}
			}else{
				bc.msg.info(json.msg);
			}
		}
	});
};

/**
 * 升级创建新版本
 * @param {Integer} id 要升级的表单ID
 * @param {Function} onOk 【可选】升级成功的回调函数
 *
 */
bc.customForm.upgrade = function(id, onOk){
	if (!id) {
		bc.msg.alert("必须配置 id 参数 - bc.customForm.upgrade");
		return;
	}
	$.ajax({
		method: "POST",
		dataType: "json",
		url: bc.root + "/customForm/upgrade",
		data: {id: id},
		success: function(json){
			if(typeof onOk == "function"){
				onOk.call(this, json);
			}
		}
	});
};

/**
 * 默认的表单初始化方法
 */
bc.customForm.init = function(){
	var $page = $(this);
	var ns = $page.attr("data-namespace");
	if(ns && ns.length > 0){
		ns = bc.getNested(ns);
		if(ns && ns["init"]){
			//console.debug("call " + $page.attr("data-namespace") + ".init");
			ns["init"].call(this);// 调用模块自定义的初始化方法
		}
	}
};

/**
 * 默认的表单确认按钮
 */
bc.customForm.onOk = function(){
	console.log("TODO: bc.customForm.onOk")
};