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
			$form.find(":input:visible").each(function(){
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
$(document).delegate("li.inputIcon",{
	mouseover: function() {
		$(this).addClass("hover");
	},
	mouseout: function() {
		$(this).removeClass("hover");
	}
});
//清空选择的自动处理
$document.delegate(".clearSelect",{
	click: function() {
		var $this = $(this);
		var cfg = $this.data("cfg");
		if(logger.debugEnabled)logger.debug("cfg=" + $.toJSON(cfg));
		if(!cfg){
			// 自动查找临近的元素
			var $s = $this.parent("ul.inputIcons").siblings("input[type='text'],input[type='hidden']");
			$s.val("");
			
			// 调用自定义的回调函数
			$s = $s.filter("input[type='text']");//主配置元素
			if($s.size() > 0){
				cfg = $s.data("cfg");
				if(cfg && (typeof cfg.callback == "string")){
					var callback = bc.getNested(cfg.callback);
					if(typeof callback != "function"){
						alert("没有定义的回调函数：callback=" + cfg.callback);
					}else{
						callback.apply(this,arguments);
					}
				}
			}
			
			//alert("没有配置dom元素data-cfg属性的值，无法处理！");
		}else{
			var cfgs = cfg.split(",");
			var c;
			var $form = $this.closest("form");
			for(var i=0;i<cfgs.length;i++){
				c = cfgs[i].split("=");
				$form.find(":input[name='" + c[0] + "']").val(c.length > 1 ? c[1] : "");
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