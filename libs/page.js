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
	 * @option {String} method 请求的方法 GET|POST|DELETE|PUT|...，默认 POST
	 * @option {String} mid [可选]对话框的唯一标识id
	 * @option {String} from [可选]打开此对话框的源对话框的mid
	 * @option {String} name [可选]任务栏显示的名称或对话框的标题
	 * @option {String} title [可选]对话框的标题,如果不指定则使用请求返回的值
	 * @option {String} data [可选]附加的数据
	 * @option {String} afterOpen [可选]窗口新建好后的回调函数
	 * @option {String} afterClose [可选]窗口关闭后的回调函数。function(event, ui)
	 * @option {String} beforeClose [可选]窗口关闭前的回调函数，返回false将阻止关闭窗口。function(event, ui)
	 */
	newWin: function (option) {
		option = option || {};

		//在单独的浏览器窗口中打开
		if (option.standalone) {
			logger.debug("newWin:option.standalone=" + option.standalone);
			window.open(option.url, "_blank");
			return;
		}

		// 任务栏显示正在加载的信息
		if (bc.page.quickbar.has(option.mid)) {
			logger.debug("newWin:active=" + option.mid);
			bc.page.quickbar.active(option.mid);//仅显示现有的窗口
			return;
		} else {
			logger.debug("newWin:create=" + option.mid);
			bc.page.quickbar.loading(option);
		}

		logger.profile("newWin.ajax." + option.mid);

		//内部处理
		logger.debug("newWin:loading html from url=" + option.url);
		if(!option.url || option.url.indexOf(":") == 0) {  // 前缀":"代表使用 require 加载 (结果被缓存)
			require(option.url ? option.url.substr(1).split(",") : [], function success(html) {
				html = html || option.html;
				logger.profile("newWin.require: mid=" + option.mid);
				var _option = jQuery.extend({}, option);
				_option.html = html;
				bc.page._createWin(_option);
			});
		}else {
			var op = {
				url: option.url, data: option.data || null,
				dataType: "html",
				success: function (html) {
					logger.profile("newWin.ajax: mid=" + option.mid);
					var _option = jQuery.extend({}, option);
					//delete _option.url;
					_option.html = html;
					bc.page._createWin(_option);
				},
				error: function (request, textStatus, errorThrown) {
					//var msg = "bc.ajax: textStatus=" + textStatus + ";errorThrown=" + errorThrown;
					//alert("喔唷，出错啦！");
					//显示漂亮的错误提示窗口
					bc.page.showError({
						url: option.url,
						more: request.responseText || request.responseHTML,
						from: "bc.page.newWin->bc.ajax.error"
					});

					//删除任务栏对应的dom元素
					$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();

					//出错后通知任务栏模块加载完毕，避免长期显示加载动画
					//bc.page.quickbar.loaded(option.mid);
				}
			};
			if ($.prototype.jquery >= "1.9") op.method = option.method || "POST";
			else op.type = option.method || "POST";
			bc.ajax(op);
		}
	},
	/**
	 * 创建窗口
	 */
	_createWin: function (option) {
		var $dom = $(option.html);
		if ($dom.size() > 1) {
			//logger.error("error page. try set theme='simple' for struts2 tag");
			$dom.remove();

			//alert("喔唷，出错啦！");
			//显示漂亮的错误提示窗口
			bc.page.showError({
				url: option.url,
				more: option.html,
				from: "bc.page.newWin->bc.ajax.success->$dom.size()>1"
			});

			//删除任务栏对应的dom元素
			$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();
			return;
		}
		if(option.data) $dom.data("data", option.data);
		function _init() {
			//从dom构建并显示桌面组件
			var cfg = $dom.attr("data-option");
			//logger.info("cfg=" + cfg);
			if (cfg && /^\{/.test($.trim(cfg))) {
				//对json格式进行解释
				cfg = eval("(" + cfg + ")");
			} else {
				cfg = {};
			}
			cfg.dialogClass = cfg.dialogClass || "bc-ui-dialog ui-widget-header";// ui-widget-header";
			if ($dom.attr("data-type"))
				cfg.dialogClass += " " + $dom.attr("data-type");
			//cfg.afterClose=option.afterClose || null;//传入该窗口关闭后的回调函数
			//if(!$dom.attr("title")) cfg.title=option.name;
			cfg.title = option.title || $dom.attr("title");// 对话框标题
			if ($dom.attr("data-type") == "form") {
				if (typeof(cfg.minimizable) == "undefined") {
					cfg.minimizable = true;// 默认为表单添加最小化按钮
				}
				if (typeof(cfg.maximizable) == "undefined") {
					cfg.maximizable = true;// 默认为表单添加最大化按钮
				}
			}

			if (option.buttons) cfg.buttons = option.buttons;//使用传入的按钮配置

			$dom.dialog($.extend(bc.page._rebuildWinOption.call($dom, cfg), {
				open: function (event, ui) {
					var dataType = $dom.attr("data-type");
					if (!("ontouchend" in document)) {// 触摸屏不聚焦，避免输入法框的弹出
						if (dataType == "list") {//视图
							//视图聚焦到搜索框
							$dom.find("#searchText").focus();
						} else if (dataType == "form") {//表单
							//聚焦到表单的第一个可输入元素
							$dom.find(":input:eq(0)").focus();
						}
					}
				},
				appendTo: "#middle",
				scroll: false,
				containment: false//"#middle"
			}));
			$dom.bind("dialogbeforeclose", function (event, ui) {
				var status = $dom.data("data-status") || $dom.data("status");
				//调用回调函数
				if (option.beforeClose)
					return option.beforeClose.call($dom[0], status);
			}).bind("dialogclose", function (event, ui) {
				var $this = $(this);
				var status = $dom.data("data-status") || $dom.data("status");

				//在ie9，如果内含<object>,$this.remove()会报错,故先处理掉object
				//ie8试过没问题
				if (jQuery.browser.msie && jQuery.browser.version >= 9) {
					logger.info("IE9坑爹啊");
					$this.find("object").each(function () {
						this.parentNode.innerHTML = "";
					});
				}

				// 保存窗口状态
				var maximized = $this.dialog("widget").hasClass("maximized");
				logger.debug("maximized=" + maximized);
				var cookieId;
				var ci = option.mid.indexOf("::");
				if (ci > 0) {
					cookieId = option.mid.substring(0, ci);// 使用自定义分类标记
				} else {
					cookieId = option.url;// 使用url
				}
				if (maximized) {
					$.cookie("size::" + cookieId, "maximized");
				} else {
					$.removeCookie("size::" + cookieId);
				}

				//彻底删除所有相关的dom元素
				$this.dialog("destroy").remove();
				//删除任务栏对应的dom元素
				$(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']").unbind().remove();

				//调用回调函数
				if (option.afterClose) option.afterClose.call($dom[0], status);
			}).attr("data-src", option.url || "").attr("data-mid", option.mid)
				.bind("dialogfocus", function (event, ui) {
					//logger.debug("dialogfocus");
					var cur = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + option.mid + "']");
					if (!cur.hasClass("ui-state-active"))
						cur.addClass("ui-state-active").siblings().toggleClass("ui-state-active", false);
				});
			//.disableSelection();这个会导致表单中输入框部分浏览器无法获取输入焦点

			// 记录来源窗口的id
			if (option.from) {
				if (typeof option.from == "string") {//直接传入来源窗口的mid
					$dom.attr("data-from", option.from);
				} else if (option.from instanceof jQuery) {//传入的是来源窗口的jQuery对象
					logger.info("option.from instanceof jQuery == true");
					$dom.attr("data-from", option.from.attr("data-from") || option.from.attr("data-mid"));
				} else {
					alert("不支持的from对象类型！");
				}
			}
			if (option.fromType) {
				$dom.attr("data-fromType", option.fromType);
			}

			// requirejs 模块的处理
			if ($dom.data("requirejs")) { // 使用requirejs的初始化处理
				var module = arguments[arguments.length - 1];
				if (typeof module === "function") {                              // 定义为类时
					var instance = new module($dom, cfg, cfg.readonly);          // 实例化类
					$dom.data("scope", instance).data("scopeType", "instance");   // 记录此实例
				} else if (typeof module === "object") {                         // 定义为 literal object 时
					$dom.data("scope", module).data("scopeType", "module");       // 记录此类
				}
			}

			// 全局视图、表单的初始化
			var dataType = $dom.attr("data-type");
			if (dataType == "list") {//视图
				if ($dom.find(".bc-grid").size()) {//表格的额外处理
					bc.grid.init($dom, cfg, cfg.readonly);
				}
			} else if (dataType == "form") {//表单
				bc.form.init($dom, cfg, cfg.readonly);//如绑定日期选择事件等
			}

			// 执行组件指定的额外初始化方法，上下文为$dom
			var method = $dom.attr("data-initMethod");
			logger.debug("initMethod=" + method);
			if (method) {
				if ($dom.data("requirejs")) {   // requirejs
					var scope = $dom.data("scope");
					if (typeof scope === "object") {
						method = scope[method];
					} else {
						method = null;
					}
					if (typeof method == "function") {
						if ($dom.data("scopeType") === "instance") {
							method.call(scope, cfg, cfg.readonly);// 调用实例方法
						} else if ($dom.data("scopeType") === "module") {
							method.call($dom, cfg, cfg.readonly); // 调用类的静态方法
						}
					} else {
						alert("undefined function: " + $dom.attr("data-initMethod"));
					}
				} else { // 原始的初始化处理
					method = bc.getNested(method);
					if (typeof method == "function") {
						method.call($dom, cfg, cfg.readonly);
					} else {
						alert("undefined function: " + $dom.attr("data-initMethod"));
					}
				}
			}

			// 窗口最小化的处理
			if (cfg.minimizable) {
				$dom.bind("dialogminimize", function (event, ui) {
					$dom.parent().hide();
					$("#bottom").find(".quickButton[data-mid='" + option.mid + "']")
						.removeClass("ui-state-active")
						.find(">span.ui-icon")
						.removeClass("ui-icon-folder-open").addClass("ui-icon-folder-collapsed");
				});
			}

			// 窗口最大化的处理
			if (cfg.maximizable) {
				$dom.bind("dialogmaximize", function (event, ui) {
					if (logger.infoEnabled)logger.info("--maximize");
				});

				// 首次打开就最大化:检测cookie中此url的对话框是否保存为最大化状态，是才最大化
				var cookieId;
				var ci = option.mid.indexOf("::");
				if (ci > 0) {
					cookieId = option.mid.substring(0, ci);// 使用自定义分类标记
				} else {
					cookieId = option.url;// 使用url
				}
				var v = $.cookie("size::" + cookieId);
				logger.info("c=" + v);
				if (v == "maximized") {
					var $maxBtn = $dom.closest(".bc-ui-dialog").find(">.ui-dialog-titlebar .maximizeBtn");
					$maxBtn.click();
				}
			}

			// 窗口帮助的处理
			if (cfg.help) {
				var helpWin = [];
				$dom.bind("dialoghelp", function showHelp(event, clickDom) {
					var helpAnchor = $(clickDom).attr("data-help");
					if (logger.infoEnabled)logger.info("--help=" + helpAnchor);
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
						showHelp(event, clickDom);
					}
					return false;
				});
			}

			// 窗口打印的处理
			if (cfg.print) {
				$dom.bind("dialogprint", function (event, clickDom) {
					if (logger.infoEnabled)logger.info("--print=" + $(clickDom).attr("data-print"));
					bc.page.print.call($(clickDom).closest(".bc-ui-dialog").children(".bc-page"), cfg.print);
					//bc.msg.alert("功能开发中");
				});
			}

			//通知任务栏模块加载完毕
			bc.page.quickbar.loaded(option.mid);

			//调用回调函数
			if (option.afterOpen) option.afterOpen.call($dom[0]);
		}

		//alert(html);

		// 加载js、css文件
		var jsCfg = $dom.data("js");
		//console.log("jsCfg type=%s", typeof(jsCfg));
		if (!jsCfg || (typeof jsCfg == "string")) {// 原始的js加载
			//console.log("原始的js加载");
			var dataJs = bc.getJsCss(jsCfg);
			if (dataJs && dataJs.length > 0) {
				dataJs.push(_init);
				bc.load(dataJs);
			} else {
				//执行模块指定的初始化方法
				_init();
			}
		} else if (jQuery.isArray(jsCfg)) {    // 使用 requireJs
			//console.log("使用 requireJs");
			$dom.data("requirejs", true);
			require(jsCfg, function () {
				_init.apply($dom, arguments);
			});
		}
	},

	/**
	 * 显示请求错误的提示窗口
	 */
	showError: function (option) {
		//alert(option.url + ";" + option.more);
		//alert("喔唷，出错啦！");
		//显示漂亮的错误提示窗口
		var errorDom = [
			'<div style="text-align: center;"><table class="error" cellspacing="0" cellpadding="0" data-from="' + option.from + '" style="width:300px;">'
			, '<tr>'
			, '<td class="icon" style="width:52px;" title="url:' + option.url + ',from:' + option.from + '"><div class="icon"></div></td>'
			, '<td class="label">喔唷，出错啦！</td>'
			, '</tr>'
			, '<tr><td class="detail" colspan="2">处理过程出现了错误，请重新尝试或联系管理员。</td></tr>'
		];
		if (option.more)
			errorDom.push('<tr><td class="detail" colspan="2" style="width:52px;text-align: center;"><span class="more">了解详情</span></td></tr>');
		errorDom.push('</table></div>');
		errorDom = errorDom.join("");

		var $error = $(errorDom).dialog({
			width: 380,
			height: 150,
			modal: true,
			dialogClass: "bc-ui-dialog ui-widget-header"
		});
		$error.bind("dialogclose", function (event, ui) {
			$error.unbind().remove();
		});
		$error.find("span.more").click(function () {
			if (logger.infoEnabled)logger.info("span.more");
			var errorWin = window.open('', 'bcErrorShow');
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
	innerInit: function () {

	},
	/** 上下文为 $dom */
	_rebuildWinOption: function (option) {
		var $page = this;
		var _option = option || {};
		if (_option.buttons) {
			var btn;
			for (var i in _option.buttons) {
				btn = _option.buttons[i];
				if (btn.action == "save") {//内部的表单保存
					btn.click = bc.page.save;
				} else if (btn.action == "submit") {//提交表单保存，成功后自动关闭对话框
					btn.click = bc.page.submit;
				} else if (btn.action == "cancel") {//关闭对话框
					btn.click = bc.page.cancel;
				} else if (btn.action == "create") {//新建
					btn.click = bc.page.create;
				} else if (btn.action == "delete") {//删除
					btn.click = bc.page.delete_;
				} else if (btn.action == "edit") {//编辑
					btn.click = bc.page.edit;
				} else if (btn.action == "open") {//打开
					btn.click = bc.page.open;
				} else if (btn.action == "print") {//打印
					btn.click = bc.page.print;
				} else if (btn.action == "preview") {//预览xheditor的内容
					btn.click = bc.page.preview;
				} else if (btn.action == "more") {//带下拉菜单的按钮
					btn.click = bc.page.more;
				} else if (btn.fn) {//调用自定义函数
					btn.click = bc.getNested(btn.fn);
				}

				//如果click为字符串，当成是函数名称处理
				if (typeof btn.click == "string") {
					btn.click = jQuery.proxy(function() {
						var fnName = this.fnName;
						//console.log("fnName=", fnName);
						var scope = $page.data("scope");
						var fn = scope ? scope[fnName] : bc.getNested(fnName);
						if(typeof fn == "function") {
							// 上下文为页面DOM或页面实例
							return fn.apply(scope && $page.data("scopeType") === "instance" ? scope : $page.get(0), arguments);
						}else{
							alert("回调函数没有定义：" + fnName);
						}
					}, {fnName: btn.click});
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
	save: function (option, isValidationValue) {
		//默认须要验证
		var isValidation = true;
		if (isValidationValue != undefined && !isValidationValue) {
			isValidation = isValidationValue;
		}

		option = option || {};
		var $page = $(this);
		var url = $page.attr("data-saveUrl");
		if (!url || url.length == 0) {
			url = $page.attr("data-namespace");
			if (!url || url.length == 0) {
				alert("Error:页面没有定义data-saveUrl或data-namespace属性的值");
				return;
			} else {
				url += "/save";
			}
		}
		if (logger.infoEnabled)logger.info("saveUrl=" + url);
		var $form = $page.is("form") ? $page : $("form", $page);

		//判断是否正在保存，若是就返回
		if ($page.data("saving")) return;
		//设置是否正在保存的标识为true[正在保存]
		$page.data("saving", true);

		//表单验证
		var scope = $page.data("scope");
		var customValidate = scope && scope["validateForm"];
		if (isValidation && !(
				customValidate ? (
					scope["validateForm"].call($page.data("scopeType") === "instance" ? scope : $form)
				) : bc.validator.validate($form)
			)) {
			$page.data("saving", false);
			return;
		}
		//使用ajax保存数据
		var data = $form.serialize();
		bc.ajax({
			url: url, data: data, dataType: "json",
			success: function (json) {
				if (logger.debugEnabled)logger.debug("save success.json=" + jQuery.param(json));
				if (json.success === false) {
					bc.msg.info(json.msg);
				} else {
					if (json.id) {
						$form.find("input[name='e.id']").val(json.id);
					}
					//记录已保存状态
					$page.attr("data-status", "saved").data("data-status", "saved").data("status", "saved");

					//调用回调函数
					var showMsg = true;
					if (typeof option.callback == "function") {
						//返回false将禁止保存提示信息的显示
						if (option.callback.call($page[0], json) === false)
							showMsg = false;
					}
					if (showMsg) {
						bc.msg.slide(json.msg);
					}
				}

				//将正在保存标识设为false[已保存]
				$page.data("saving", false);
			}
		});
	},
	/**提交表单保存数据后自动关闭表单对话框，上下文为页面对象*/
	submit: function (option) {
		option = option || {};
		var $page = $(this);
		bc.page.save.call(this, {
			callback: function (json) {
				if (typeof option.callback == "function") {
					//返回false将禁止提示信息的显示
					if (option.callback.call($page[0], json) === false)
						return false;
					;
				} else {
					bc.msg.slide("提交成功！");
					$page.data("data-status", true).data("status", true);
					$page.dialog("close");
					return false;
				}
			}
		});
	},
	/**删除*/
	delete_: function (option) {
		option = option || {};
		var $page = $(this);
		var url = $page.attr("data-deleteUrl");
		if (!url || url.length == 0) {
			url = $page.attr("data-namespace");
			if (!url || url.length == 0) {
				alert("Error:页面没有定义data-deleteUrl或data-namespace属性的值");
				return;
			} else {
				url += "/delete";
			}
		}
		var data = null;
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if ($tds.length == 1) {
			data = "id=" + $tds.attr("data-id");
		} else if ($tds.length > 1) {
			data = "ids=";
			$tds.each(function (i) {
				data += $(this).attr("data-id") + (i == $tds.length - 1 ? "" : ",");
			});
		}
		if (logger.infoEnabled) logger.info("bc.page.delete_: data=" + data);
		if (data == null) {
			bc.msg.slide("请先选择要删除的条目！");
			return;
		}
		bc.msg.confirm("确定要删除选定的 <b>" + $tds.length + "</b> 项吗？", function () {
			bc.ajax({
				url: url, data: data, dataType: "json",
				success: function (json) {
					if (logger.debugEnabled)logger.debug("delete success.json=" + $.toJSON(json));
					if (json.success === false) {
						bc.msg.alert(json.msg);// 仅显示失败信息
					} else {
						//调用回调函数
						var showMsg = true;
						if (typeof option.callback == "function") {
							//返回false将禁止保存提示信息的显示
							if (option.callback.call($page[0], json) === false)
								showMsg = false;
						}
						if (showMsg)
							bc.msg.slide(json.msg);

						//重新加载列表
						bc.grid.reloadData($page);
					}
				}
			});
		});
	},
	/**禁用*/
	disabled: function (option) {
		option = option || {};
		var $page = $(this);
		var url = $page.attr("data-deleteUrl");
		if (!url || url.length == 0) {
			url = $page.attr("data-namespace");
			if (!url || url.length == 0) {
				alert("Error:页面没有定义data-deleteUrl或data-namespace属性的值");
				return;
			} else {
				url += "/delete";
			}
		}
		var data = null;
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if ($tds.length == 1) {
			data = "id=" + $tds.attr("data-id");
		} else if ($tds.length > 1) {
			data = "ids=";
			$tds.each(function (i) {
				data += $(this).attr("data-id") + (i == $tds.length - 1 ? "" : ",");
			});
		}
		if (logger.infoEnabled) logger.info("bc.page.delete_: data=" + data);
		if (data == null) {
			bc.msg.slide("请先选择要禁用的条目！");
			return;
		}
		bc.msg.confirm("确定要禁用选定的 <b>" + $tds.length + "</b> 项吗？", function () {
			bc.ajax({
				url: url, data: data, dataType: "json",
				success: function (json) {
					if (logger.debugEnabled)logger.debug("disabled success.json=" + jQuery.param(json));
					//调用回调函数
					var showMsg = true;
					if (typeof option.callback == "function") {
						//返回false将禁止保存提示信息的显示
						if (option.callback.call($page[0], json) === false)
							showMsg = false;
					}
					if (showMsg)
						bc.msg.slide(json.msg);

					//重新加载列表
					bc.grid.reloadData($page);
				}
			});
		});
	},
	/**关闭表单对话框，上下文为dialog的原始dom元素*/
	cancel: function (option) {
		$(this).dialog("destroy").remove();
	},
	/**新建表单*/
	create: function (option) {
		option = option || {};
		var $page = $(this);
		var url = $page.attr("data-createUrl");
		if (!url || url.length == 0) {
			url = $page.attr("data-namespace");
			if (!url || url.length == 0) {
				alert("Error:页面没有定义data-createUrl或data-namespace属性的值");
				return;
			} else {
				url += "/create";
			}
		}

		//附加固定的额外参数
		var data = option.data || {};
		var extras = option.extras || $page.data("extras");
		if (extras) {
			data = $.extend(data, extras);
		}

		var fromMID = $page.attr("data-mid");
		bc.page.newWin({
			url: url,
			from: fromMID,
			mid: fromMID + ".0",
			name: "新建" + ($page.attr("data-name") || "未定义"),
			afterClose: function (status) {
				if (status)bc.grid.reloadData($page);
			},
			afterOpen: option.callback,
			data: data
		});
	},
	/**编辑*/
	edit: function (option) {
		option = option || {};
		var $page = $(this);
		var url = option.url || $page.attr("data-editUrl");
		if (!url || url.length == 0) {
			url = $page.attr("data-namespace");
			if (!url || url.length == 0) {
				alert("Error:页面没有定义data-editUrl或data-namespace属性的值");
				return;
			} else {
				url += "/edit";
			}
		}
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if ($tds.length == 1) {
			var data = {id: $tds.attr("data-id")};

			//附加固定的额外参数
			var extras = option.extras || $page.data("extras");
			if (extras) {
				data = $.extend(data, extras);
			}

			var fromMID = $page.attr("data-mid");
			bc.page.newWin({
				url: url, data: data || null,
				from: fromMID,
				mid: fromMID + "." + $tds.attr("data-id"),
				name: $tds.attr("data-name") || "未定义",
				title: $tds.attr("data-name"),
				afterClose: function (status) {
					if (status)
						bc.grid.reloadData($page);
				},
				afterOpen: option.callback
			});
		} else if ($tds.length > 1) {
			bc.msg.slide("一次只可以编辑一条信息，请确认您只选择了一条信息！");
			return;
		} else {
			bc.msg.slide("请先选择要编辑的信息！");
			return;
		}
	},
	/**查看*/
	open: function (option) {
		option = option || {};
		var $page = $(this);
		var url = $page.attr("data-openUrl");
		if (!url || url.length == 0) {
			url = $page.attr("data-namespace");
			if (!url || url.length == 0) {
				alert("Error:页面没有定义data-openUrl或data-namespace属性的值");
				return;
			} else {
				url += "/open";
			}
		}
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if ($tds.length == 1) {
			var data = {id: $tds.attr("data-id")};

			//附加固定的额外参数
			var extras = option.extras || $page.data("extras");
			if (extras) {
				data = $.extend(data, extras);
			}

			var fromMID = $page.attr("data-mid");
			bc.page.newWin({
				url: url, data: data || null,
				from: fromMID,
				fromType: $page.is("[data-isTabContent='true']") ? "tab" : null,
				mid: fromMID + "." + $tds.attr("data-id"),
				name: $tds.attr("data-name") || "未定义",
				title: $tds.attr("data-name"),
				afterClose: function (status) {
					if (status)
						bc.grid.reloadData($page);
				},
				afterOpen: option.callback
			});
		} else if ($tds.length > 1) {
			bc.msg.slide("一次只可以查看一条信息，请确认您只选择了一条信息！");
			return;
		} else {
			bc.msg.slide("请先选择要查看的信息！");
			return;
		}
	},
	/**预览xheditor的内容，上下文为dialog对象*/
	preview: function () {
		$(this).find(".bc-editor").xheditor({tools: 'mini'}).exec("Preview");
	},
	/**打印表单*/
	print: function (key) {
		if (key) {
			if (key.indexOf("callback:") == 0) {// 调用自定义的函数
				var _fn = key.substr("callback:".length);
				var fn = bc.getNested(_fn);
				if (typeof fn == "function") {
					fn.call(this, key);
				} else {
					alert("指定的函数没有定义：" + _fn);
				}
				return false;
			} else if (key.indexOf("tpl:") == 0) {// 调用内定的模板格式化打印处理
				var templateCode = key.substring("tpl:".length, key.lastIndexOf(":")); // 模板的编码
				logger.info("templateCode=" + templateCode);
				var formatSqlArr = key.substring(key.lastIndexOf(":") + 1).split("&");
				var dataObj;
				var dataArr = [];
				for (var i = 0; i < formatSqlArr.length; i++) {
					dataObj = {};
					var tempstr = formatSqlArr[i];
					var indx = tempstr.indexOf("=");
					if (indx > 0 && indx < tempstr.length) {
						var key = tempstr.substring(0, indx);
						var value = tempstr.substring(indx + 1);
						dataObj.key = key;
						dataObj.value = value;
						dataArr.push(dataObj);
					} else {
						alert("key：" + key + ",格式化错误！");
						return false;
					}
				}
				var url = bc.root + "/bc/templatefile/inline?code=" + templateCode;
				if (dataArr.length > 0) {
					url += "&formatSqlJsons=" + $.toJSON(dataArr);
				}
				var win = window.open(url, "_blank");
				return false;
			}
		}
		var $this = $(this);
		var type = $this.attr("data-type");
		var $form = $this;
		if ("form" == type) {
			$form = $this.find(">form");
			if ($form.size() == 0)
				$form = $this;
		}
		if ($form.size() == 0) {
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
		$form.data("isPrinting", true);

		// 隐藏body下的所有一级子节点
		var node;
		logger.info("childNodes.length=" + childNodes.length);
		childNodes.each(function (i) {
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
			childNodes.each(function (i) {
				this.style.display = origDisplay[i];
			});

			$form.data("isPrinting", false);
		}, 1000);
	}
};

jQuery(function ($) {
	bc.page.innerInit();
});

bc.page.quickbar = {
	id: "#quickButtons",
	/**
	 * 判断指定的模块当前是否已经加载
	 * @param mid 模块的id
	 */
	has: function (mid) {
		return $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']").length > 0;
	},
	/**
	 * 激活已经加载的现有模块
	 * @param mid 模块的id
	 */
	active: function (mid) {
		$(".ui-dialog>.ui-dialog-content[data-mid='" + mid + "']").parent().show()
			.end().siblings().toggleClass("ui-state-active", false)
			.end().dialog("moveToTop");
	},
	/**
	 * 设置指定的模块开始加载中
	 * @param option 模块的配置
	 */
	loading: function (option) {
		$(bc.page.quickbar.id).append('<a id="quickButton-' + option.mid
		+ '" class="quickButton ui-corner-all ui-state-default" data-mid="' + option.mid
		+ '" data-name="' + option.name + '" title="' + option.name + '">'
		+ '<span class="ui-icon loading"></span>'
		+ '<span class="text">正在加载：' + option.name + '</span></a>');
	},
	/**
	 * 设置指定的模块加载完毕
	 * @param mid 模块的id
	 */
	loaded: function (mid) {
		var $item = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']");
		$item.find(">span.text").text($item.attr("data-name"));
		$item.find(">span.ui-icon").removeClass("loading").addClass("ui-icon-folder-open");
		$item.toggleClass("ui-state-active", true).siblings().toggleClass("ui-state-active", false);
	},
	/**
	 * 设置指定的模块的警告显示
	 * @param mid 模块的id
	 */
	warn: function (mid) {
		var $item = $(bc.page.quickbar.id).find(">a.quickButton[data-mid='" + mid + "']");
		$item.toggleClass("ui-state-highlight", true);
	}
};

/**
 * 初始化表单中的页签页面
 * 上下文及参数同tabs的事件参数一致
 */
bc.page.initTabPageLoad = function (event, ui) {
	if ($.data(ui.tab, "bcInit.tabs")) return;

	var $tabPanel = $(ui.panel);
	var $page = $tabPanel.find(">.bc-page");
	if (logger.infoEnabled)logger.info("bc-page.size:" + $page.size());
	if (!$page.size()) return;

	$page.height($tabPanel.height());
	//logger.info("show:" + $page.attr("class"));

	//对视图和表单执行额外的初始化
	var dataType = $page.attr("data-type");
	if (dataType == "list") {//视图
		if ($page.find(".bc-grid").size()) {//表格的额外处理
			bc.grid.init($page);
			$page.removeAttr("title");
		}
	} else if (dataType == "form") {//表单
		bc.form.init($page);//如绑定日期选择事件等
		$page.removeAttr("title");
	}

	//标记已经初始化过
	$.data(ui.tab, "bcInit.tabs", true);
};

/**
 * 表单中的页签创建事件的通用处理函数
 * 上下文及参数同tabs的事件参数一致
 */
bc.page.initTabPageCreate = function (event, ui) {
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
function _initBcTabsLoad() {
	var $page = this;

	//执行组件指定的额外初始化方法，上下文为$dom
	if ($page.data("requirejs")) { // 使用requirejs的初始化处理
		var module = arguments[arguments.length - 1];
		if (typeof module === "function") {                              // 定义为类时
			var instance = new module($page, cfg, cfg.readonly);          // 实例化类
			$page.data("scope", instance).data("scopeType", "instance");   // 记录此实例
		} else if (typeof module === "object") {                         // 定义为 literal object 时
			$page.data("scope", module).data("scopeType", "module");       // 记录此类
		}
	}
	var method = $page.attr("data-initMethod");
	logger.debug("bctabs:initMethod=" + method);
	if (method) {
		var cfg = $page.attr("data-option");
		//logger.info("cfg=" + cfg);
		if (cfg && /^\{/.test($.trim(cfg))) {
			//对json格式进行解释
			cfg = eval("(" + cfg + ")");
		} else {
			cfg = {};
		}

		if ($page.data("requirejs")) {   // requirejs
			var scope = $page.data("scope");
			if (typeof scope === "object") {
				method = scope[method];
			} else {
				method = null;
			}
			if (typeof method == "function") {
				if ($page.data("scopeType") === "instance") {
					method.call(scope, cfg, cfg.readonly);// 调用实例方法
				} else if ($page.data("scopeType") === "module") {
					method.call($page, cfg, cfg.readonly); // 调用类的静态方法
				}
			} else {
				alert("undefined function: " + $page.attr("data-initMethod"));
			}
		} else { // 原始的初始化处理
			method = bc.getNested(method);
			if (typeof method == "function") {
				method.call($page, cfg, cfg.readonly);
			} else {
				alert("undefined function: " + $page.attr("data-initMethod"));
			}
		}
	}
};

/**
 * 表单中的bctabs页签的默认配置
 * 上下文及参数同bctabs的事件参数一致
 */
bc.page.defaultBcTabsOption = {
	load: function (event, ui) {
		if (logger.infoEnabled)logger.info("load:" + $(this).attr("class"));
		var $page = ui.content.children(".bc-page");
		if (logger.debugEnabled)logger.debug("tabs.load:bc-page.size=" + $page.size());
		if (!$page.size()) return;

		// 加载js、css文件
		var jsCfg = $page.data("js");
		//console.log("jsCfg type=%s", typeof(jsCfg));
		if (!jsCfg || (typeof jsCfg == "string")) {// 原始的js加载
			//console.log("原始的js加载");
			var dataJs = bc.getJsCss(jsCfg);
			if (dataJs && dataJs.length > 0) {
				dataJs.push(jQuery.proxy(_initBcTabsLoad, $page));
				bc.load(dataJs);
			} else {
				//执行模块指定的初始化方法
				_initBcTabsLoad.call($page);
			}
		} else if (jQuery.isArray(jsCfg)) {    // 使用 requireJs
			//console.log("使用 requireJs");
			$page.data("requirejs", true);
			require(jsCfg, function () {
				_initBcTabsLoad.apply($page, arguments);
			});
		}

		//对视图和表单执行额外的初始化
		var dataType = $page.attr("data-type");
		if (logger.debugEnabled)logger.debug("tabs.load:dataType=" + dataType);
		if (dataType == "list") {//视图
			if ($page.find(".bc-grid").size()) {//表格的额外处理
				bc.grid.init($page);
				$page.removeAttr("title");

				// 绑定窗体尺寸变动事件
				$page.parent().closest(".bc-page").bind("dialogresize", function () {
					// 调整当前页签内grid的尺寸
					if (ui.content.is(":visible") && ui.content.attr("data-resized") == "true") {
						if (logger.debugEnabled)logger.debug("resized=true,index=" + ui.content.index());
						bc.grid.init($page);
						ui.content.attr("data-resized", "false");
					}
				});
			}
		} else if (dataType == "form") {//表单
			bc.form.init($page);//如绑定日期选择事件等
			$page.removeAttr("title");
		}
	},
	show: function (event, ui) {
		if (logger.debugEnabled)logger.debug("show:" + ui.content.attr("class"));
		// 调整当前页签内grid的尺寸
		if (ui.content.attr("data-resized") == "true") {
			if (logger.debugEnabled)logger.debug("show.resized=true,index=" + ui.content.index());
			bc.grid.init(ui.content.children(".bc-page"));
			ui.content.attr("data-resized", "false");
		}
	},
	/** 内容容器的高度是否自动根据tabs容器的高度变化 */
	autoResize: true
};

// support requirejs
//if (typeof define === "function" && define.amd) {
//	define("BCPage", [], function () {
//		return bc.page;
//	});
//}