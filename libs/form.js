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
  init: function ($form, option, readonly) {
    logger.info("bc.form.init:readonly=" + readonly);

    //绑定富文本编辑器
    $form.find("textarea.bc-editor").filter(":not('.custom')").each(function () {
      $this = $(this);
      $this.xheditor(bc.editor.getConfig({
        ptype: $this.attr("data-ptype"),
        puid: $this.attr("data-puid"),
        readonly: "true" == $this.attr("data-readonly"),
        tools: $this.attr("data-tools")
      }));
    });

    if (!readonly) {
      //绑定日期选择
      bc.form.initCalendarSelect($form);

      //绑定flash上传附件
      $form.find(".attachs.flashUpload").has(":file.uploadFile").each(function () {
        bc.attach.flash.init.call(this);
      });
    } else {
      //只读表单的处理
      $form.find(":input:visible:not('.custom')").each(function () {
        logger.debug("disabled:" + this.name);
        var $in = $(this);
        if ($in.is("select,:checkbox,:radio"))
          this.disabled = true;
        else
          this.readOnly = true;
      });
      $form.find("ul.inputIcons:not('.ignore'),span.selectButton").each(function () {
        $(this).hide();
      });
    }

    // 绑定多页签处理
    $form.find(".formTabs").filter(":not('.custom')").each(function () {
      var $tabs = $(this).bctabs(bc.page.defaultBcTabsOption);
      $form.bind("dialogresize", function (event, ui) {
        bc.form.resizeFromTabs.call($tabs, $form);
      });
    });

    // 自动高度调整
    $form.find(".autoHeight").keyup();
  },

  /** 重新调整tab的尺寸
   */
  resizeFromTabs: function ($form) {
    if (logger.debugEnabled) logger.debug("resizeFromTabs");
    this.bctabs("resize");
  },

  /** 初始化日期、时间控件的事件绑定
   */
  initCalendarSelect: function ($form) {
    $form.find('.bc-date[readonly!="readonly"],.bc-time[readonly!="readonly"],.bc-datetime[readonly!="readonly"]')
      .filter(":not('.custom')")
      .each(function bindSelectCalendar() {
        // 获取用户配置
        var $this = $(this);
        var cfg = $this.attr("data-cfg");
        if (cfg && cfg.length > 0) {
          cfg = eval("(" + cfg + ")");
        } else {
          cfg = {};
        }
        var $page = $this.closest(".bc-page");
        var scope = $page.data("scope");

        // 重构 onSelect 配置
        if (typeof cfg.onSelect == "string") {
          var fn;
          if ($page.size() > 0 && scope) {
            fn = scope[cfg.onSelect];
            if (typeof fn === "function") fn = fn.bind(scope)
          } else {
            fn = bc.getNested(cfg.onSelect);
          }
          if (typeof fn != "function") {
            alert('函数“' + cfg.onSelect + '”没有定义！');
            return false;
          }
          cfg.onSelect = fn;
        }

        // 重构 onClose 配置
        if (typeof cfg.onClose == "string") {
          var fn;
          if ($page.size() > 0 && scope) {
            fn = scope[cfg.onClose];
            if (typeof fn === "function") fn = fn.bind(scope)
          } else {
            fn = bc.getNested(cfg.onClose);
          }
          if (typeof fn != "function") {
            alert('函数“' + cfg.onClose + '”没有定义！');
            return false;
          }
          cfg.onClose = fn;
        }

        // 添加默认配置
        cfg = jQuery.extend({
          //showWeek: true,//显示第几周
          //showButtonPanel: true,//显示今天按钮
          //changeMonth: true,//显示月份下拉框
          changeYear: true,//显示年份下拉框
          showOtherMonths: true,
          selectOtherMonths: true,
          firstDay: 7,
          dateFormat: "yy-mm-dd",//yy4位年份、MM-大写的月份,
          timeFormat: "HH:mm"
        }, cfg);

        // 额外的处理
        if (cfg.addYear) {//自动将另一控件的值设置为此控件值加指定年份后的值的处理
          logger.debug("addYear=" + cfg.addYear);
          var ss = cfg.addYear.split("|");
          var $toField;
          if (ss.length < 2) {//自动找到另一个控件
            $toField = $this.parent(".bc-dateContainer").siblings(".bc-dateContainer")
              .children("input[type='text']");
          } else {
            //按类似“3 1 -2|fieldName”的格式解析出另一个控件，“3 1 -2”表示加3年再加1月再减2日
            $toField = $form.find("input[name='" + ss[1] + "']");
          }

          if ($toField.length) {
            var oldFun = cfg.onSelect;
            cfg.onSelect = function (dateText, inst) {
              // 转换字符串为日期值：http://docs.jquery.com/UI/Datepicker/parseDate
              var _date = $.datepicker.parseDate(cfg.format || 'yy-mm-dd', dateText);
              var sss = ss[0].split(" ");
              _date.setFullYear(_date.getFullYear() + parseInt(sss[0]));//加年
              if (sss.length > 1) _date.setMonth(_date.getMonth() + parseInt(sss[1]));//加月
              if (sss.length > 2) _date.setDate(_date.getDate() + parseInt(sss[2]));//加日
              if (sss.length > 3) _date.setHours(_date.getHours() + parseInt(sss[3]));//加时
              if (sss.length > 4) _date.setMinutes(_date.getMinutes() + parseInt(sss[4]));//加分
              if (sss.length > 5) _date.setSeconds(_date.getSeconds() + parseInt(sss[5]));//加秒

              // 设置联动值：http://docs.jquery.com/UI/Datepicker/formatDate
              $toField.val($.datepicker.formatDate(cfg.format || 'yy-mm-dd', _date));

              //调用原来的回调函数
              if (typeof oldFun == "function") {
                return oldFun.call(scope || this, dateText, inst);
              }
            };
          }
        }

        // 重构 onClose 回调函数，使控件重新获取焦点再调用用户自定义的 onClose 函数
        var customOnClose = cfg.onClose;
        cfg.onClose = function () {
          $this.focus();

          // 调用用户自定义的 onClose 函数
          if (typeof customOnClose == "function") {
            return customOnClose.apply(scope || this, arguments);
          }
        };

        if ($this.hasClass('bc-date'))
          $this.datepicker(cfg);
        else if ($this.hasClass('bc-datetime'))
          $this.datetimepicker(cfg);
        else
          $this.timepicker(cfg);
      });
  }
};

var $document = $(document);
//表单域内的选择按钮鼠标样式切换
$document.delegate(".inputIcon", {
  mouseover: function () {
    $(this).addClass("hover");
  },
  mouseout: function () {
    $(this).removeClass("hover");
  },
  click: function () {
    var $this = $(this);
    // 获取回调函数
    var fn = $this.attr("data-click");
    if (!fn) return;

    var $page = $this.closest(".bc-page");
    var scope = $page.data("scope");
    var fn = scope ? scope[fn] : bc.getNested(fn);
    if (typeof fn != "function") {
      alert("回调函数没有定义：" + $this.attr("data-click"));
      return;
    }

    // 获取函数参数，调用回调函数
    var args = $this.attr("data-click-args");
    var context = scope && $page.data("scopeType") === "instance" ? scope : $page.get(0);
    if (args) {
      args = eval("(" + args + ")");
      if ($.isArray(args)) {
        fn.apply(context, args);
      } else {
        fn.call(context, args);
      }
    } else {
      fn.call(context);
    }
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
$document.delegate(".clearSelect", {
  click: function () {
    var $this = $(this);
    var cfg = $this.attr("data-cfg");
    if (cfg) {
      if (/^\{/.test($.trim(cfg))) {	//对json格式进行解释
        cfg = eval("(" + cfg + ")");
      } else {							// 将简易配置转换为标准配置
        cfg = {fields: cfg};
      }
    } else {
      cfg = {};
    }
    if (logger.debugEnabled) logger.debug("cfg=" + $.toJSON(cfg));

    // 清空相关元素的值
    if (!cfg.fields) {// 按标准结构获取要清空值的元素
      cfg.fields = $this.parent("ul.inputIcons").siblings("input[type='text'],input[type='hidden']");
      cfg.fields.val("");// 清空值
    } else {// 简易配置的处理（用逗号连接的多个控件名称的字符串）
      var nvs = cfg.fields.split(",");
      var c;
      var $form = $this.closest("form");
      for (var i = 0; i < nvs.length; i++) {
        c = nvs[i].split("=");// 有等于号相当于配置其默认值而不是清空
        $form.find(":input[name='" + c[0] + "']").val(c.length > 1 ? c[1] : "");
      }
    }

    // 调用回调函数
    if (typeof cfg.callback == "string") {
      var callback = bc.getNested(cfg.callback);
      if (typeof callback != "function") {
        alert(this.name + "指定的回调函数没有定义：cfg.callback=" + cfg.callback);
      } else {
        callback.apply(this, arguments);
      }
    }
  }
});
//选择日期的自动处理
$document.delegate(".selectCalendar", {
  click: function () {
    var $this = $(this);
    var fieldName = $this.attr("data-cfg");
    if (logger.debugEnabled) logger.debug("fieldName=" + fieldName);
    var $calendarField;
    if (!fieldName) {
      // 自动查找临近的元素
      $calendarField = $this.parent("ul.inputIcons").siblings("input[type='text']");

      //alert("没有配置dom元素data-cfg属性的值，无法处理！");
    } else {
      var f = "[name='" + fieldName + "']";
      $calendarField = $this.closest("form").find("input.bc-date" + f + "," + "input.bc-datetime" + f + "," + "input.bc-time" + f);
    }

    $calendarField.each(function () {
      var $this = $(this);
      if ($this.hasClass('bc-date'))
        $this.datepicker("show");
      else if ($this.hasClass('bc-datetime'))
        $this.datetimepicker("show");
      else
        $this.timepicker("show");
    });
  }
});
//自动内容高度
$document.delegate(".autoHeight", {
  keyup: function () {
    var $this = $(this);
    $this.height(0);
    var maxHeight = parseInt($this.css("max-height")) || 2000;// 最大高度
    var minHeight = parseInt($this.css("min-height")) || 0;// 最小高度
    var h;
    if (maxHeight < this.scrollHeight) {
      h = maxHeight;
      $this.css("overflow", "auto");
    } else if (minHeight > this.scrollHeight) {
      h = minHeight;
      $this.css("overflow", "auto");
    } else {
      h = this.scrollHeight;
      $this.css("overflow", "hidden");
    }
    //console.log("minHeight=%s, scrollHeight=%s, h=%s", minHeight, this.scrollHeight, h);
    $this.height(h + 2);// + ($.browser.mozilla ? 10 : 2));
  }
});