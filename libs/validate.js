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
		},
		/** 自定义正则表达式的验证 */
		regexp: function(element) {
			if(!this.pattern){
				alert("没有指定正则表达式的值！");
				return false;
			}
			//最小长度验证
			var ok;
			if(this.minLen || this.minLen === 0 ){
				ok = bc.validator.methods.minLen.call(this,element);
				if(!ok){
					bc.validator.remind(element, "minLen", [this.minLen+""],this);
					return false;
				}
			}
			//最大长度验证
			if(this.maxLen || this.maxLen === 0 ){
				ok = bc.validator.methods.maxLen.call(this,element);
				if(!ok){
					bc.validator.remind(element, "maxLen", [this.maxLen+""],this);
					return false;
				}
			}
			//alert(/[\da-zA-Z]*\d+[a-zA-Z]+[\da-zA-Z]*/.test(element.value) + "," + element.value)
			//alert(new RegExp("[\\da-zA-Z]*\\d+[a-zA-Z]+[\\da-zA-Z]*").test(element.value) + "-" + element.value)
			
			// 正则表达式验证
			var re;
			if(this.flags)
				re = new RegExp(this.pattern, this.flags);
			else
				re = new RegExp(this.pattern);
				
			return re.test(element.value);
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