/**
 * 自定义变淡操作方法
 * 
 */
bc.customForm = {
	/**
	 * 自定义表单创建方法
	 * 
	 * @param {Object}
	 *            option 配置参数
	 * @option {String} tpl [必填]模板编码
	 * @option {String} subject [必填]标题
	 * @option {String} type [必填]类别
	 * @option {Integer} pid [必填]pid 新建为时0
	 * @option {String} code [必填]编码 新建为时空字符窜
	 * @option {String} readonly [可选]是否只读-- true为只读 false为可编辑,默认为false
	 * @option {Object} extraData [可选]附带数据 如[{name : "sex",value : 1,type :
	 *         "int"}]
	 * @option {String} afterOpen [可选]窗口新建好后的回调函数
	 * @option {String} afterClose [可选]窗口关闭后的回调函数。function(event, ui)
	 * @option {String} beforeClose
	 *         [可选]窗口关闭前的回调函数，返回false将阻止关闭窗口。function(event, ui)
	 * @option {Object} buttons [可选]扩展按钮如[{click : saveClick, text :"保存"
	 *         }(click为自定义点击事件，text为按钮名称) 默认添加保存按钮
	 * 
	 */
	render : function(option) {
		if (!(option && option.tpl && option.subject && option.type
				&& option.pid && option.code)) {
			alert("必须设置option参数！");
			return;
		}

		if (!option.name)
			option.name = option.subject;
		if (!option.title)
			option.title = option.subject;
		if (option.pid && option.code) {
			option.mid = option.type + option.pid + option.code;
		}
		if (!option.data) {
			option.data = {}
		}

		if (option.extraData) {
			option.data = {
				tpl : option.tpl,
				subject : option.subject,
				type : option.type,
				pid : option.pid,
				code : option.code,
				extraData : $.toJSON(option.extraData)
			};
		} else {
			option.data = {
				tpl : option.tpl,
				subject : option.subject,
				type : option.type,
				pid : option.pid,
				code : option.code
			};
		}

		if (typeof (option.readonly) == "undefined") {
			option.readonly = false;
		}
		// 如果为只读状态
		if (option.readonly == true) {
			bc.customForm.open(option);
			return;
		}

		option.url = bc.root + "/bc/customForm/render";
		var saveBtn = {
			click : "bc.customForm.save",
			text : "保存"
		};
		if (!option.buttons) {
			option.buttons = [];
		}
		option.buttons.push(saveBtn);

		var afterOpen;
		if (option.afterOpen) {
			afterOpen = option.afterOpen;
		}

		// 对模板表单中form-info加入模板编码、类别、标题 、pid、code
		option.afterOpen = function() {
			var $page = $(this);
			var $form = $("form", $page);
			bc.customForm.setFormInfo($form, {
				tpl : option.tpl,
				subject : option.subject,
				type : option.type,
				pid : option.pid,
				code : option.code
			});
			if (afterOpen) {
				afterOpen.call($page);
			}
		}

		bc.page.newWin(option);

	},

	/** 打开表单 */
	open : function(option) {
		option.url = bc.root + "/bc/customForm/open";

		var afterOpen;
		if (option.afterOpen) {
			afterOpen = option.afterOpen;
		}
		option.afterOpen = function() {
			var $page = $(this);
			var $form = $("form", $page);
			// 只读表单的处理
			$form.find(":input:visible:not('.custom')").each(function() {
				logger.debug("disabled:" + this.name);
				var $in = $(this);
				if ($in.is("select,:checkbox,:radio"))
					this.disabled = true;
				else
					this.readOnly = true;
			});
			$form.find("ul.inputIcons,span.selectButton").each(function() {
				$(this).hide();
			});
			$form.find(".bc-date").each(function() {
				$(this).unbind();
			});

			if (afterOpen) {
				afterOpen.call($page);
			}
		}
		bc.page.newWin(option);
	},
	/** 保存表单 */
	save : function(option) {
		var $page = $(this);
		var $form = $("form", $page);
		// 表单验证
		if (!bc.validator.validate($form))
			return;
		// 判断是否正在保存，若是就返回
		if ($page.data("saving"))
			return;

		var formData = bc.customForm.getFormData($form);
		if (formData.length == 0) {
			bc.msg.alert("没有可保存的表单数据！");
			return;
		}
		// 将表单的状态设为正常
		var formInfo = bc.customForm.setFormInfo($form, {
			status : 0
		});
		// 设置是否正在保存的标识为true[正在保存]
		$page.data("saving", true);
		bc.ajax({
			url : bc.root + "/bc/customForm/save",
			data : {
				formInfo : formInfo,
				formData : $.toJSON(formData)
			},
			dataType : "json",
			success : function(json) {
				if (logger.debugEnabled)
					logger.debug("save success.json=" + jQuery.param(json));
				if (json.success === false) {
					bc.msg.info(json.msg);
				} else {
					bc.customForm.setFormInfo($form, {
						id : json.id,
						formData : json.formData
					});
					bc.customForm.loadFormData.call($page);
					// 记录已保存状态
					$page.attr("data-status", "saved").data("data-status",
							"saved");
					// 调用回调函数
					var showMsg = true;
					if (typeof option.callback == "function") {
						// 返回false将禁止保存提示信息的显示
						if (option.callback.call($page[0], json) === false)
							showMsg = false;
					}
					if (showMsg) {
						bc.msg.slide(json.msg);
					}
				}

				// 将正在保存标识设为false[已保存]
				$page.data("saving", false);
			}
		});
	},

	/**
	 * 自定义表单删除方法
	 * 
	 * @param {Object}
	 *            option [可选]配置参数
	 * @option {String} tpl 模板编码
	 * @option {String} subject 标题
	 * @option {String} type 类别
	 * @option {Integer} pid pid 新建为时0
	 * @option {String} code 编码 新建为时空字符窜
	 * @option {String} readonly [可选]是否只读-- true为只读 false为可编辑,默认为true
	 */
	delete_ : function(option) {
		if (!(option && option.tpl && option.subject && option.type
				&& option.pid && option.code)) {
			bc.customForm.deleteById();
		} else {
			bc.customForm.deleteByOption(option);
		}

	},
	// 通过id删除
	deleteById : function() {
		var $page = $(this);
		var url = bc.root + "/bc/customForm/delete";

		var data = null;
		var $tds = $page
				.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if ($tds.length == 1) {
			data = "id=" + $tds.attr("data-id");
		} else if ($tds.length > 1) {
			data = "ids=";
			$tds.each(function(i) {
				data += $(this).attr("data-id")
						+ (i == $tds.length - 1 ? "" : ",");
			});
		}
		if (logger.infoEnabled)
			logger.info("bc.page.delete_: data=" + data);
		if (data == null) {
			bc.msg.slide("请先选择要删除的条目！");
			return;
		}
		bc.msg.confirm("确定要删除选定的 <b>" + $tds.length + "</b> 项吗？", function() {
			bc.ajax({
				url : url,
				data : data,
				dataType : "json",
				success : function(json) {
					if (logger.debugEnabled)
						logger.debug("delete success.json=" + $.toJSON(json));
					if (json.success === false) {
						bc.msg.alert(json.msg);// 仅显示失败信息
					} else {
						// 调用回调函数
						var showMsg = true;
						if (typeof option.callback == "function") {
							// 返回false将禁止保存提示信息的显示
							if (option.callback.call($page[0], json) === false)
								showMsg = false;
						}
						if (showMsg)
							bc.msg.slide(json.msg);

						// 重新加载列表
						bc.grid.reloadData($page);
					}
				}
			});
		});
	},
	// 通过option删除
	deleteByOption : function(option) {
		var $page = $(this);
		var url = bc.root + "/bc/customForm/delete";

		if (!option) {
			option.data = {};
		}

		var formInfo = {
			tpl : option.tpl,
			subject : option.subject,
			type : option.type,
			pid : option.pid,
			code : option.code
		}

		var data = $.extend(option.data, formInfo);

		if (logger.infoEnabled)
			logger.info("bc.page.delete_: data=" + data);
		if (data == null) {
			bc.msg.slide("请先选择要删除的条目！");
			return;
		}
		bc.msg.confirm("确定要删除选定的 <b>" + 1 + "</b> 项吗？", function() {
			bc.ajax({
				url : url,
				data : data,
				dataType : "json",
				success : function(json) {
					if (logger.debugEnabled)
						logger.debug("delete success.json=" + $.toJSON(json));
					if (json.success === false) {
						bc.msg.alert(json.msg);// 仅显示失败信息
					} else {
						// 调用回调函数
						var showMsg = true;
						if (typeof option.callback == "function") {
							// 返回false将禁止保存提示信息的显示
							if (option.callback.call($page[0], json) === false)
								showMsg = false;
						}
						if (showMsg)
							bc.msg.slide(json.msg);

						// 重新加载列表
						bc.grid.reloadData($page);
					}
				}
			});
		});
	},

	/** 获取表单数据 */
	getFormData : function($form) {
		// 默认的表单数据获取方法
		var datas = [];

		// input类型为text
		var $texts = $form.find(":text:not(.ignore)");
		if ($texts.size() != 0) {
			$texts.each(function() {
				var $text = $(this);
				var data = {};
				data.name = this.name;
				data.value = $text.val();
				data.type = $text.attr("data-type") || "string";

				var id = $text.attr("data-id");
				if (id)
					data.id = id;
				var label = $text.attr("data-label");
				if (label)
					data.label = label;

				datas.push(data);
			});
		}

		// input类型为radio
		var $radios = $form.find(":radio:not(.ignore):checked");
		if ($radios.size() != 0) {
			$radios.each(function() {
				var $radio = $(this);
				var data = {};
				data.name = this.name;
				data.value = $radio.val();
				data.type = $radio.attr("data-type") || "string";

				var id = $radio.attr("data-id");
				if (id)
					data.id = id;
				var label = $radio.attr("data-label");
				if (label)
					data.label = label;

				datas.push(data);
			});
		}

		// input类型为checkbox
		var $checkboxes = $form.find(":checkbox:not(.ignore):checked");
		if ($checkboxes.size() != 0) {
			for ( var i = 0; i < $checkboxes.size(); i++) {
				var $checkbox = $checkboxes.eq(i);
				if (i == 0) { // 如果对象数组下标等于0
					var data = {};
					data.name = $checkbox.attr("name");
					data.value = [];
					data.type = $checkbox.attr("data-type") || "string";
					if (data.type == "int" || data.type == "int[]"
							|| data.type == "long" || data.type == "long[]") {
						data.value.push(parseInt($checkbox.val()));
					} else if (data.type == "float" || data.type == "float[]"
							|| data.type == "double" || data.type == "double[]") {
						data.value.push(parseFloat($checkbox.val()));
					} else {
						data.value.push($checkbox.val());
					}

					var id = $checkbox.attr("data-id");
					if (id)
						data.id = id;
					var label = $checkbox.attr("data-label");
					if (label)
						data.label = label;
					datas.push(data);
				} else { // 如果对象数组下标大于0
					if ($checkbox.attr("name") == $checkboxes.eq(i - 1).attr(
							"name")) { // 当前checkbox的name==前一个checkbox的name
						if (data.type == "int" || data.type == "int[]"
								|| data.type == "long" || data.type == "long[]") {
							data.value.push(parseInt($checkbox.val()));
						} else if (data.type == "float"
								|| data.type == "float[]"
								|| data.type == "double"
								|| data.type == "double[]") {
							data.value.push(parseFloat($checkbox.val()));
						} else {
							data.value.push($checkbox.val());
						}
					} else { // 当前checkbox的name不等于前一个checkbox的name
						data = {};
						data.name = $checkbox.attr("name");
						data.value = [];
						data.type = $checkbox.attr("data-type") || "string";
						if (data.type == "int" || data.type == "int[]"
								|| data.type == "long" || data.type == "long[]") {
							data.value.push(parseInt($checkbox.val()));
						} else if (data.type == "float"
								|| data.type == "float[]"
								|| data.type == "double"
								|| data.type == "double[]") {
							data.value.push(parseFloat($checkbox.val()));
						} else {
							data.value.push($checkbox.val());
						}

						var id = $checkbox.attr("data-id");
						if (id)
							data.id = id;
						var label = $checkbox.attr("data-label");
						if (label)
							data.label = label;
						datas.push(data);
					}
				}
			}
		}
		// texterea
		var $textareas = $form.find("textarea:not(.ignore)");
		if ($textareas.size() != 0) {
			$textareas.each(function() {
				var $textarea = $(this);
				var data = {};
				data.name = $textarea.attr("name");

				if ($textarea.val() == null || $textarea.val() == "") {
					data.value = "";
				} else {
					data.value = $textarea.val();
				}
				data.type = $textarea.attr("data-type") || "string";

				var id = $textarea.attr("data-id");
				if (id)
					data.id = id;
				var label = $textarea.attr("data-label");
				if (label)
					data.label = label;

				datas.push(data);
			});
		}

		return datas;
	},
	/**
	 * 打印
	 */
	print : function() {
		bc.page.print("callback");
	},

	/** 设置data-form-info 信息 * */
	setFormInfo : function($form, extData) {
		var form_info = $form.attr("data-form-info");
		if (form_info && /^\{/.test($.trim(form_info))) {
			// 对json格式进行解释
			form_info = eval("(" + form_info + ")");
		} else {
			form_info = {};
		}
		form_info = $.extend(form_info, extData);
		var to_form_info = $.toJSON(form_info);
		$form.attr("data-form-info", to_form_info);
		return to_form_info;
	},
	/**
	 * 根据formData信息id信息 加载到对应input标签的字段中
	 */
	loadFormData : function() {
		var $page = $(this);
		var $form = $("form", $page);
		var form_info = $form.attr("data-form-info");
		if (form_info && /^\{/.test($.trim(form_info))) {
			// 对json格式进行解释
			form_info = eval("(" + form_info + ")");
		} else {
			form_info = {};
		}
		var $formData = form_info.formData;
		$.each($formData, function(index, value) {
			var $input = $form.find(':input[name=' + value.name + ']');
			$input.attr("data-id", value.id);
		});
	}
}