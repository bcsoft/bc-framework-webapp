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
		$form.find("textarea.bc-editor").each(function(){
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
				this.disabled=true;
			});
			$form.find("ul.inputIcons,span.selectButton").each(function(){
				$(this).hide();
			});
		}
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
				//changeMonth: true,
				changeYear: true,
				showOtherMonths: true,
				selectOtherMonths: true,
				firstDay: 7,
				dateFormat:"yy-mm-dd"//yy4位年份、MM-大写的月份
			},cfg);
			
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
			$this.parent("ul.inputIcons").siblings("input[type='text'],input[type='hidden']").val("");
			
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