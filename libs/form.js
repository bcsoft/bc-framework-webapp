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
			$form.find('.bc-date[readonly!="readonly"],.bc-time[readonly!="readonly"],.bc-datetime[readonly!="readonly"]').each(function(){
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
					//showButtonPanel: true,//显示今天按钮、
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
		}
	}
};