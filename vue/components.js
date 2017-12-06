/**
 * theme component
 * <pre>
 *   usage: <bc-theme [:size="12"] [:unit="px"]></bc-theme>
 * </pre>
 */
define('bc/vue/theme',['jquery', 'vue'], function ($, Vue) {
	'use strict';
	var DEFAULT = {
		UNIT_EM: {
			UNIT: "em",
			SIZE: 1,
			STEP: 0.1,
			MIN: 0.1,
			MAX: 4
		},
		UNIT_PX: {
			UNIT: "px",
			SIZE: 16,
			STEP: 1,
			MIN: 1,
			MAX: 64
		}
	};
	return Vue.component('bc-theme', {
		template: '<div class="ui-widget-content" style="margin:0.2em;padding:0.2em;font-size:16px;position:absolute;right:1em;top:0">' +
		'字体大小：<input type="number" min="{{min}}" max="{{max}}" step="{{step}}" v-model="size"  style="width:3em"/>' +
		'<label><input type="radio" value="em" v-model="unit">em</label>' +
		'<label><input type="radio" value="px" v-model="unit">px</label>' +
		'</div>',
		replace: true,
		props: {
			size: { type: Number, required: false, default: DEFAULT.UNIT_EM.SIZE },
			unit: { type: String, required: false, default: DEFAULT.UNIT_EM.UNIT }
		},
		created: function () {
			this.initByUnit(this.unit);
			if (this.fontSize != DEFAULT.UNIT_EM.SIZE + DEFAULT.UNIT_EM.UNIT)
				this.change();
		},
		data: function () {
			return {
				min: DEFAULT.UNIT_EM.MIN,
				max: DEFAULT.UNIT_EM.MAX,
				step: DEFAULT.UNIT_EM.STEP
			}
		},
		computed: {
			fontSize: function () {
				return this.size + this.unit;
			}
		},
		watch: {
			unit: function (value, old) {
				this.initByUnit(value, old);
			},
			fontSize: function (value, old) {
				this.change();
			}
		},
		methods: {
			initByUnit: function (unit, old) {
				if (unit == "em") {
					this.min = DEFAULT.UNIT_EM.MIN;
					this.max = DEFAULT.UNIT_EM.MAX;
					this.step = DEFAULT.UNIT_EM.STEP;
					if (old) this.size = this.size / 16;
				} else {
					this.min = DEFAULT.UNIT_PX.MIN;
					this.max = DEFAULT.UNIT_PX.MAX;
					this.step = DEFAULT.UNIT_PX.STEP;
					if (old) this.size = this.size * 16;
				}
			},
			change: function () {
				// console.log("[theme] change font-size=%s%s", this.size, this.unit);
				document.body.style.fontSize = this.size + this.unit;
				this.$nextTick(function () {
					this.$dispatch("change-font-size", this.size, this.unit);
				});
			}
		}
	});
});
/**
 * 按钮组件
 * <pre>
 *   UI 使用：
 *   <bc-buttton [@click="yourMethodName"]/>
 * 
 *   参数说明：
 *   <ul>
 *     <li>text {String} [可选] 按钮显示的文字</li>
 *     <li>click {Event} 点击按钮分发的事件</li>
 *   </ul>
 * </pre>
 */
define('bc/vue/button',['jquery', 'vue'], function ($, Vue) {
	'use strict';
	return Vue.component('bc-button', {
		template: '<button class="bc-vue-button ui-button ui-widget ui-state-default ui-corner-all" style="font-family:inherit" type="button" :class="btnClass">' +
		'<span class="ui-button-icon-primary ui-icon" v-if="iconClass" :class="iconClass"></span>' +
		'<span class="ui-button-text">{{text}}<slot></slot></span>' +
		'</button>',
		replace: true,
		props: {
			text: { type: String, required: false, default: "　" },
			iconClass: { type: String, required: false }
		},
		computed: {
			btnClass: function () {
				var c, hasText = this.text && this.text != "　";
				if (hasText && this.iconClass) c = "ui-button-text-icon-primary";
				else if (!hasText && this.iconClass) c = "ui-button-icon-only";
				else if (hasText && !this.iconClass) c = "ui-button-text-only";
				else c = "ui-button-text-only";
				//console.log("[Button] computed.btnClass=%s", c);
				return c;
			}
		},
		ready: function () {
			var $el = $(this.$el);
			// 鼠标悬停样式的控制
			$el.on({
				"mouseover": function () {
					$(this).addClass("ui-state-hover");
				},
				"mouseout": function () {
					$(this).removeClass("ui-state-hover");
				}
			});
		},
		beforeDestroy: function () {
			$(this.$el).off(); // 移除用jq绑定的所有事件处理程序
		},
		methods: {}
	});
});
/**
 * 单选按钮组件
 * <pre>
 *   UI 使用：
 *   <bc-buttton-set items="['a', 'b']" value="a"></bc-button-set>
 * 
 *   参数说明：
 *   <ul>
 *     <li>items {Array} 选项列表，结构为 [{id: 1, label: "a", active: true|false}, ...], active 为 true 代表此选项被选中</li>
 *     <li>value {Striog|Number} 当前值</li>
 *     <li>change {Event} 选中值变动分发的事件。
 *         事件第 1 个参数为新选中的项的值,
 *         事件第 2 个参数为原选中的项的值
 *     </li>
 *   </ul>
 * </pre>
 */
define('bc/vue/button-set',['jquery', 'vue'], function ($, Vue) {
	'use strict';
	return Vue.component('bc-button-set', {
		template: '<div class="bc-vue-button-set ui-buttonset" style="display:inline-block">' +
		'<div v-for="i in items" data-id="{{i.hasOwnProperty(\'id\') ? i.id : $index}}" class="ui-button ui-widget ui-state-default ui-button-text-only" style="font-family:inherit;font-size:1em"' +
		' :class="{\'ui-corner-left\': $index == 0, \'ui-corner-right\': $index == items.length - 1, \'ui-state-active\': isActive(i)}"' +
		' :style="{\'margin-right\': \'-1px\', \'z-index\': value == i.id ? items.length : 0}">' +
		'<span style="font-size: 1em" class="ui-button-text" @click="clickItem(i, $index)">{{i.label || i}}</span>' +
		'</div>' +
		'</div>',
		replace: true,
		props: {
			items: { type: Array, required: true },     // 可选列表
			value: { required: false, default: null }   // 当前值
		},
		created: function () {
			if (this.value === null) { // 未设置就从列表中取 active=true 项的 id 值
				for (var i = 0; i < this.items.length; i++) {
					if (this.items[i].active) {
						this.value = this.items[i].id;
						break;
					}
				}
			}
		},
		watch: {
			value: function (value, old) {
				this.$dispatch("change", value, old);
			}
		},
		methods: {
			clickItem: function (item, index) {
				this.value = (typeof item == "object" ? item.id : item);
			},
			isActive: function (item) {
				if (typeof item == "object") return this.value == item.id;
				else return this.value == item;
			}
		}
	});
});

define('text!bc/vue/search.html',[],function () { return '<div class="bc-vue-search">\r\n\t<div class="fuzzy" :style="{\'text-align\': align}">\r\n\t\t<div>\r\n\t\t\t<span @click.stop="search" class="search ui-icon ui-icon-search" title="执行查询"></span>\r\n\t\t\t<input debounce="200" @keyup.enter.stop="search" type="text" v-model="value" class="fuzzy ui-widget-content" :placeholder="placeholder" @change.stop>\r\n\t\t\t<span v-if="advanceConfig" @click.stop="toggleAdvance" class="add ui-icon ui-icon-triangle-1-{{showAdvance ? \'n\' : \'s\'}}" title="{{showAdvance ? \'隐藏高级搜索\' : \'显示高级搜索\'}}"></span>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class="advance ui-widget-content ui-state-highlight" v-if="showAdvance" :style="advanceStyle">\r\n\t\t<ul class="conditions">\r\n\t\t\t<li class="condition" v-for="c in displayConditions">\r\n\t\t\t\t<div class="label">{{c.label}}</div>\r\n\t\t\t\t<div class="value">\r\n\t\t\t\t\t<template v-if="!c.diadic">\r\n\t\t\t\t\t\t<input v-if="!c.tag || c.tag == \'input\'" debounce="200" type="{{getInputType(c)}}" class="value ui-widget-content" v-model="c.value"\r\n\t\t\t\t\t\t\t:step="c.step" :min="c.min" :max="c.max"\r\n\t\t\t\t\t\t\t@keyup.enter.stop="search"\r\n\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t<select v-if="c.tag == \'select\'" class="value ui-widget-content" v-model="c.value"\r\n\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t<option v-for="option in c.options" v-bind:value="option.hasOwnProperty(\'value\') ? option.value : option">\r\n\t\t\t\t\t\t\t\t{{ option.hasOwnProperty(\'value\') ? option.text : option }}\r\n\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</template>\r\n\t\t\t\t\t<template v-if="c.diadic">\r\n\t\t\t\t\t\t<div class="left">\r\n\t\t\t\t\t\t\t<input v-if="!c.tag || c.tag == \'input\'" debounce="200" type="{{getInputType(c)}}" class="value ui-widget-content" v-model="c.value[0]"\r\n\t\t\t\t\t\t\t\t:step="c.step" :min="c.min" :max="c.max"\r\n\t\t\t\t\t\t\t\t@keyup.enter.stop="search"\r\n\t\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t<select v-if="c.tag == \'select\'" class="value ui-widget-content" v-model="c.value[0]"\r\n\t\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t\t<option v-for="option in c.options" v-bind:value="option.hasOwnProperty(\'value\') ? option.value : option">\r\n\t\t\t\t\t\t\t\t\t{{ option.hasOwnProperty(\'value\') ? option.text : option }}\r\n\t\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class="center">～</div>\r\n\t\t\t\t\t\t<div class="right">\r\n\t\t\t\t\t\t\t<input v-if="!c.tag || c.tag == \'input\'" debounce="200" type="{{getInputType(c)}}" class="value ui-widget-content" v-model="c.value[1]"\r\n\t\t\t\t\t\t\t\t:step="c.step" :min="c.min" :max="c.max"\r\n\t\t\t\t\t\t\t\t@keyup.enter.stop="search"\r\n\t\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t<select v-if="c.tag == \'select\'" class="value ui-widget-content" v-model="c.value[1]"\r\n\t\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t\t<option v-for="option in c.options" v-bind:value="option.hasOwnProperty(\'value\') ? option.value : option">\r\n\t\t\t\t\t\t\t\t\t{{ option.hasOwnProperty(\'value\') ? option.text : option }}\r\n\t\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</template>\r\n\t\t\t\t</div>\r\n\t\t\t</li>\r\n\t\t</ul>\r\n\t\t<div class="operate ui-widget-content">\r\n\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="search">\r\n\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-search"></span>\r\n\t\t\t\t<span class="ui-button-text">查询</span>\r\n\t\t\t</button>\r\n\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="clearCondition">\r\n\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-minus"></span>\r\n\t\t\t\t<span class="ui-button-text">清空</span>\r\n\t\t\t</button>\r\n\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="showAdvance = false">\r\n\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span>\r\n\t\t\t\t<span class="ui-button-text">关闭</span>\r\n\t\t\t</button>\r\n\t\t</div>\r\n\t\t<table cellspacing="0" cellpadding="0" style="display:none">\r\n\t\t\t<tbody>\r\n\t\t\t\t<tr v-for="c in displayConditions" class="condition">\r\n\t\t\t\t\t<td class="ui-widget-content">\r\n\t\t\t\t\t\t<select class="id ui-widget-content" v-model="c.id" @change.stop="editCondition(\'id\', c)">\r\n\t\t\t\t\t\t\t<option v-for="cfg in advanceConfig.options" :value="cfg.id">{{cfg.label}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td class="ui-widget-content" style="max-width:7em">\r\n\t\t\t\t\t\t<select class="operator ui-widget-content" v-model="c.operator" @change.stop="editCondition(\'operator\', c)">\r\n\t\t\t\t\t\t\t<option v-for="o in operators(c.id)" :value="o.id">{{o.label}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td class="ui-widget-content">\r\n\t\t\t\t\t\t<input v-if="!c.tag || c.tag == \'input\'" debounce="200" type="{{getInputType(c)}}" class="value ui-widget-content" v-model="c.value"\r\n\t\t\t\t\t\t\t:step="c.step" :min="c.min" :max="c.max"\r\n\t\t\t\t\t\t\t@keyup.enter.stop="search"\r\n\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t<select v-if="c.tag == \'select\'" class="value ui-widget-content" v-model="c.value"\r\n\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t<option v-for="option in c.options" v-bind:value="option.hasOwnProperty(\'value\') ? option.value : option">\r\n\t\t\t\t\t\t\t\t{{ option.hasOwnProperty(\'value\') ? option.text : option }}\r\n\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td class="ui-widget-content">\r\n\t\t\t\t\t\t<span @click.stop="deleteCondition($index)" class="delete ui-icon ui-icon-minusthick" title="移除此条件"></span>\r\n\t\t\t\t\t\t<span @click.stop="c.value = \'\'" class="clear ui-icon ui-icon-cancel" title="清空条件值"></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr class="operate">\r\n\t\t\t\t\t<td class="ui-widget-content" colspan="4">\r\n\t\t\t\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="search">\r\n\t\t\t\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-search"></span>\r\n\t\t\t\t\t\t\t<span class="ui-button-text">查询</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="clearCondition">\r\n\t\t\t\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-minus"></span>\r\n\t\t\t\t\t\t\t<span class="ui-button-text">清空</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="addCondition">\r\n\t\t\t\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-plus"></span>\r\n\t\t\t\t\t\t\t<span class="ui-button-text">添加</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="showAdvance = false">\r\n\t\t\t\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span>\r\n\t\t\t\t\t\t\t<span class="ui-button-text">关闭</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t</tbody>\r\n\t\t</table>\r\n\t</div>\r\n</div>';});


define('css!bc/vue/search',[],function(){});
/**
 * 搜索组件
 * <pre>
 *   UI 使用：
 *   <bc-search [quick="true|false"] [value="xxx"] [placeholder="xxx"] 
 *              [@search="xxx"] [@change="xxx"]></bc-search>
 *   参数说明：
 *   <ul>
 *     <li>placeholder {String} [可选] 搜索框未输入信息时的背景文字</li>
 *     <li>value {String} [可选] 模糊搜索的默认值，即搜索框默认输入的文字</li>
 *     <li>advanceValue {Array} [可选] 高级搜索值，格式为 [[id, value[, type, operator]], ...]，operator 默认 '='，type 默认 'string'</li>
 *     <li>mixValue {Array} [可选] 搜索的混合值，包含模糊搜索和高级搜索。
 *         模糊搜索的数据结构为 ['fuzzy', 'val'], 高级搜索的数据结构 advanceValue</li>
 *     <li>quick {Boolean} [可选] 是否即输即搜(输入值变化时就分发搜索事件)，默认 false (按回车键时触发)</li>
 *     <li>align {String} [可选] 高级搜索区出现时与模糊搜索区的对齐方式，left|center|right，默认 left</li>
 *     <li>advanceConfig {Array} [可选] 高级搜索条件的配置，不配置代表无高级搜索功能，可配置为 3 种格式。
 *       格式1 - 数组类型，指定配置的条件列表：
 *           [{id, label[, type][, ui][, operator][, hidden][, value]}[, ...]]
 *           <ul>
 *             <li>id {String} 条件的标识符</li>
 *             <li>label {String} 条件的显示文字</li>
 *             <li>type {String} [可选] 值的类型，string|int|float|double|long|date|month|time|datetime|money，无默认值</li>
 *             <li>ui {String} [可选] UI 控件类型，现时支持 input 的 text|number|datetime-local|date|time|month，默认 text。
 *                 对于 number 还可以额外配置 input 控件的 min、max、step 属性值</li>
 *             <li>hidden {Boolean} [可选] 是否显示此条件，默认 false 显示，通过设置为 true 不显示，实现隐藏条件</li>
 *             <li>value {String} [可选] 默认值</li>
 *             <li>operator {String} [可选] 操作符号：@ 包含、=、>、>=、<、<=、!=、[]、(]、[)、()、...，无默认值</li>
 *           </ul>
 *       格式2 - 字符串类型，指定 url，通过异步加载此 url 的内容来获取格式 1 的配置值。
 *       格式3 - 对象类型，结构为 {height: 15em, options: [...], url: '...'}，
 *               height 用于指定高级搜索框的高度，条件太多超出高度则自动出现滚动条。
 *               options 与格式 1 相同功能。
 *               url 与格式 2 相同功能。
 *     </li>
 *     <li>search {Event} 分发的搜索事件，事件第 1 个参数为模糊搜索的值，第 2 个参数为高级搜索的值，第 3 个参数为混合搜索的值</li>
 *     <li>change {Event} 搜索条件变动时分发的事件，事件第 1 个参数为新的搜索值，参考 search 事件</li>
 *   </ul>
 * </pre>
 */
define('bc/vue/search',['vue', 'text!bc/vue/search.html', 'css!bc/vue/search'], function (Vue, template) {
	'use strict';
	var DEFAULT_FUZZY_ID = 'fuzzy';

	/** 判断条件是否为双值配置 */
	function isDiadic(operator) {
		// []、[)、()、(]
		return /(^\[\]$)|(^\[\)$)|(^\(\]$)|(^\(\)$)/.test(operator);
	}

	/** 初始化高级搜索显示的条件列表 */
	function initAdvanceOptions(vm) {
		if (vm.advanceConfig && vm.advanceConfig.options) {
			vm.displayConditions.length = 0;
			var cp;
			vm.advanceConfig.options.forEach(function (option) {
				option.diadic = isDiadic(option.operator); // 是否为双值条件
				option.value = option.diadic ? [] : null;
				if (option.hidden !== true) {
					cp = {};
					for (var key in option) cp[key] = option[key];
					vm.displayConditions.push(cp);
				}
			});
			//console.log("[initAdvanceOptions] displayConditions=%s", JSON.stringify(vm.displayConditions));
		}
	}

	return Vue.component('bc-search', {
		template: template,
		replace: true,
		props: {
			placeholder: { type: String, required: false },
			align: { type: String, required: false, default: 'left' },
			quick: { type: Boolean, required: false, default: false },
			value: { type: String, required: false, default: '' },
			advanceValue: { type: Array, required: false },
			mixValue: { type: Array, required: false },
			advanceConfig: { type: [String, Array, Object], required: false, default: null },
		},
		data: function () {
			return {
				displayConditions: [], // 当前显示的高级搜索条件列表
				showAdvance: false, // 高级搜索条件是否处于显示状态
			};
		},
		computed: {
			advanceStyle: function () {
				if (!this.advanceConfig) return null;
				else {
					return {
						maxHeight: this.advanceConfig.maxHeight,
						height: this.advanceConfig.height,
						width: this.advanceConfig.width,
						maxWidth: this.advanceConfig.maxWidth
					};
				}
			},
			/** 模糊搜索值的高级条件对象封装 */
			fuzzyValueObj: function () {
				return this.value !== null && this.value !== '' ? [DEFAULT_FUZZY_ID, this.value] : null;
			},
			/** 获取有效配置的高级条件 */
			advanceValue_: function () {
				if (!this.advanceConfig) return null;
				var all = [], one, value;
				this.displayConditions.forEach(function (d) {
					if (d.diadic) {
						value = [];
						if (d.value[0] !== "" && d.value[0] !== null && d.value[0] !== undefined) value[0] = d.value[0];
						if (d.value[1] !== "" && d.value[1] !== null && d.value[1] !== undefined) value[1] = d.value[1];
						if (!value.length) value = null;
					} else {
						value = d.value !== "" ? d.value : null;
					}
					if (d.id && value) {
						// [id, value, type, operator]
						one = [d.id, value];
						d.type && one.push(d.type);
						if (d.operator) {
							if (!d.type) one.push(null);
							one.push(d.operator);
						}
						all.push(one);
					}
				});
				return all.length ? all : null;
			},
			/** advanceValue_ 的字符表示, 用于监控高级条件的值是否改变，从而正确触发 change 事件 */
			advanceValueStr: function () {
				return this.advanceValue_ ? JSON.stringify(this.advanceValue_) : this.advanceValue_;
			},
			/** 
			 * 搜索条件的混合值，返回 value、advanceValue_ 混合后的数组值，value 被封装为如下结构：
			 *    ['fuzzy', value]
			 * @return {Array}
			 */
			mixValue_: function () {
				var v;
				if (!this.advanceValue_) {	// 无高级查询条件
					v = this.fuzzyValueObj ? [this.fuzzyValueObj] : null;
				} else {                              // 有高级查询
					if (this.fuzzyValueObj) v = [].concat(this.advanceValue_, [this.fuzzyValueObj]);
					else v = [].concat(this.advanceValue_);
				}
				return v;
			}
		},
		created: function () {
			// 延迟观察 value 的变化
			this.$watch('value', function (value, old) {
				this.change();
			});

			// 重新整理 advanceConfig 为标准结构 
			// {url, options, style}
			if (typeof (this.advanceConfig) == "string") {  // url
				this.advanceConfig = { url: this.advanceConfig };
				this.hasAdvance = true;
			} else if (Array.isArray(this.advanceConfig)) { // options
				this.advanceConfig = { options: this.advanceConfig };
				this.hasAdvance = true;
			} else if (Object.prototype.toString.call(this.advanceConfig) === "[object Object]") {
				// all
				this.hasAdvance = true;
			} else {
				this.advanceConfig = null;
				this.hasAdvance = false;
			}
			//console.log("[created] advanceConfig=%s", JSON.stringify(this.advanceConfig));
			initAdvanceOptions(this);
		},
		watch: {
			advanceValueStr: function (value, old) {
				this.change();
			}
		},
		ready: function () {
			// 监听 operate 按钮事件
			$(this.$el).on({
				"mouseover": function () {
					$(this).addClass("ui-state-hover");
				},
				"mouseout": function () {
					$(this).removeClass("ui-state-hover");
				}
			}, '.operate button');
		},
		destroyed: function () {
			console.log('[search] destroyed');
			$(this.$el).off();
		},
		methods: {
			/** 切换高级搜索区的显示 */
			toggleAdvance: function () {
				var vm = this;
				if (this.advanceConfig.loading) {       // 异步加载中就直接返回
					return;
				} else if (this.advanceConfig.options) { // 已有候选条件就直接切换显示
					this.showAdvance = !this.showAdvance;
					return;
				} else { // 异步加载高级搜索配置后再显示
					if (!this.advanceConfig.url) {
						alert("缺少高级搜索的 advanceConfig.url 属性配置");
						return;
					}

					vm.advanceConfig.loading = true;
					fetch(this.advanceConfig.url, {
						headers: { "Content-Type": "application/json;charset=utf-8" },
						credentials: 'include'  // include cookies
					}).then(function (res) {
						return res.ok ? res.json() : res.text().then(function (msg) { throw new Error(msg) });
					}).then(function (options) {
						if (Array.isArray(options)) {
							vm.advanceConfig.options = options;
							initAdvanceOptions(vm);
							vm.showAdvance = true;
						}
						else alert("高级搜索异步返回值不是数组格式！options=%s" + JSON.stringify(options));
						vm.advanceConfig.loading = false;
					}).catch(function (error) {
						console.log("[grid] reload error: url=%s, error=%o", vm.url, error);
						var msg = error.message || "加载高级搜索配置失败！";
						if (window["bc"] && bc.msg) bc.msg.alert(msg);
						else alert(msg);

						vm.advanceConfig.loading = false;
					});
				}
			},
			/** 触发 change 事件 */
			change: function () {
				// 输出条件值
				this.mixValue = this.mixValue_;
				this.advanceValue = this.advanceValue_;

				// 触发事件
				this.$dispatch("change", this.value, this.advanceValue, this.mixValue);
				if (this.quick) this.$dispatch("search", this.value, this.advanceValue, this.mixValue);
			},
			/** 触发 search 事件 */
			search: function () {
				this.$dispatch("search", this.value, this.advanceValue_, this.mixValue_);
			},
			/** 获取条件的可用操作符列表 */
			operators: function (id) {
				var operators = [
					{ id: '=', label: '等于' },
					{ id: '>=', label: '大于等于' },
					{ id: '<=', label: '小于等于' },
					{ id: '>', label: '大于' },
					{ id: '<', label: '小于' },
					{ id: '!=', label: '不等于' }
				];
				var cfg = this.getConditionConfig(id);
				if (!cfg || !cfg.type || cfg.type == 'string') {
					operators.push({ id: '@', label: '包含' });
					//operators.push({ id: '@left', label: '开头包含' });
					//operators.push({ id: '@right', label: '结尾包含' });
				}
				return operators;
			},
			/** 添加新条件 */
			addCondition: function () {
				this.displayConditions.push({ id: null, operator: '=', value: null, type: null });
			},
			/** 删除条件 */
			deleteCondition: function (index) {
				this.displayConditions.splice(index, 1);
				if (!this.displayConditions.length) {
					this.showAdvance = false;
				}
			},
			/** 清空所有条件 */
			clearCondition: function () {
				this.displayConditions.forEach(function (c) {
					c.value = c.diadic ? [] : null;
				});
			},
			/** 获取条件的配置信息 */
			getConditionConfig: function (id) {
				if (this.advanceConfig) {
					for (var i = 0; i < this.advanceConfig.length; i++)
						if (this.advanceConfig[i].id == id) return this.advanceConfig[i];
				}
				return null;
			},
			/** 内部控件的条件变动事件 
			 * @param type {String} 变动类型：
			 *        type='id'：用户改变了条件的标识符
			 *        type='operator'：用户改变了条件的操作符
			 *        type='value'：用户改变了条件的输入值
			 * @param condition {Object} 条件
			 */
			editCondition: function (type, condition) {
				// 切换条件就清空值
				if (type == 'id') {
					condition.value = null;
					var cfg = this.getConditionConfig(condition.id);
					condition.type = cfg.type;
				}
			},
			/** 
			 * 获取条件的输入控件类型
			 * 
			 * @param condition {Object} 条件
			 */
			getInputType: function (condition) {
				 return condition.ui || condition.type || 'text';
			}
		}
	});
});

define('css!bc/vue/toolbar',[],function(){});
/**
 * 工具条组件
 * <pre>
 *   UI 使用：
 *   <bc-toolbar [@click="yourMethodName"]>
 *     ...[slot content]
 *   </bc-toolbar>
 * </pre>
 */
define('bc/vue/toolbar',['vue', "css!bc/vue/toolbar"], function (Vue) {
	'use strict';
	return Vue.component('bc-toolbar', {
		template: '<div class="bc-vue-toolbar ui-widget-content">' +
		'<slot></slot>' +
		'</div>',
		replace: true,
		props: {}
	});
});

define('text!bc/vue/box-pointer.html',[],function () { return '<div class="bc-box-pointer left-top" :style="{display: hidden ? \'none\' : \'block\'}">\r\n\t<s class="pointer-border ui-widget ui-state-highlight">\r\n\t</s>\r\n\t<s class="pointer-back ui-widget ui-state-highlight"></s>\r\n\t<div class="box ui-widget ui-state-highlight ui-corner-all" :style="{width: width}">\r\n\t\t<div class="content">\r\n\t\t\t<slot></slot>\r\n\t\t</div>\r\n\t\t<s class="close ui-state-default ui-corner-all" :class="closeClass"\r\n\t\t\t@click.prevent.stop="close"\r\n\t\t\t@mouseover.prevent.stop="closeClass = \'ui-state-hover\'"\r\n\t\t\t@mouseout.prevent.stop="closeClass = \'\'">\r\n\t\t\t<span class="ui-icon ui-icon-closethick"></span>\r\n\t\t</s>\r\n\t</div>\r\n</div>';});


define('css!bc/vue/box-pointer',[],function(){});
/**
 * 气泡组件
 * <pre>
 *   UI 使用：
 *   <bc-box-pointer [hidden="true"] [width="8em"]/>
 * 
 *   参数说明：
 *   <ul>
 *     <li>hidden {Boolean} [可选] 是否隐藏不显示，默认为 true</li>
 *     <li>width {String} [可选] 宽度，默认为 'auto'</li>
 *   </ul>
 * </pre>
 */
define('bc/vue/box-pointer',['vue', 'text!bc/vue/box-pointer.html', 'css!bc/vue/box-pointer'], function (Vue, template) {
	'use strict';
	return Vue.component('bc-box-pointer', {
		template: template,
		replace: true,
		props: {
			hidden: { type: Boolean, required: false, default: true },
			width: { type: String, required: false, default: "auto" }
		},
		data: function () {
			return {
				closeClass: ''
			}
		},
		methods: {
			close: function(){
				this.hidden = true;
				this.$dispatch("closed");
			}
		}
	});
});

define('css!bc/vue/loading',[],function(){});
/**
 * 加载提示组件
 * <pre>
 *   UI 使用：
 *   <bc-loading [@speed="2000ms"] [@size="80"]/>
 * 
 *   参数说明：
 *   <ul> 
 *     <li>speed {String} [可选] 动画速度，如 2000ms、1s</li>
 *     <li>size {String} [可选] 尺寸大小，如 5em、80px</li>
 *     <li>maskable {Boolean} [可选] 是否显示蒙罩，默认显示</li>
 *     <li>countable {Boolean} [可选] 是否显示计时，默认不显示</li>
 *     <li>transparent {Boolean} [可选] 背景是否透明，默认透明</li>
 *   </ul>
 * </pre>
 */
define('bc/vue/loading',['vue', 'css!bc/vue/loading'], function (Vue) {
	'use strict';
	return Vue.component('bc-loading', {
		template: '<div class="bc-vue-loading-container ui-overlay">' +
		'<div v-if="maskable" class="mask ui-widget-overlay"></div>' +
		'<div class="actor ui-state-active"' +
		' :style="{\'width\': size, \'height\': size, \'animation-duration\': speed, \'margin-top\': \'calc(\'+ size + \' / -2)\', \'margin-left\': \'calc(\'+ size + \' / -2)\'}"' +
		' :class="{transparent: transparent}">' +
		'</div>' +
		'<div v-if="countable" class="counter ui-state-disabled">{{minutes_}} : {{seconds_}}</div>' +
		'</div>',
		replace: true,
		props: {
			size: { type: String, required: false, default: "4.5em" },
			speed: { type: String, required: false, default: "1s" },
			maskable: { type: Boolean, required: false, default: true },
			countable: { type: Boolean, required: false, default: false },
			transparent: { type: Boolean, required: false, default: true }
		},
		data: function () {
			return { counter: 0, minutes: 0, seconds: 0 };
		},
		computed: {
			minutes_: function () {
				if (this.minutes < 10) return "0" + this.minutes;
				else return "" + this.minutes;
			},
			seconds_: function () {
				if (this.seconds < 10) return "0" + this.seconds;
				else return "" + this.seconds;
			}
		},
		ready: function () {
			var self = this;
			var max = 11;
			setInterval(function () {
				self.seconds++;
				if (self.seconds == max) {
					self.seconds = 0;
					self.minutes++;
					if (self.minutes == max) self.minutes = 0;
				}
			}, 1000);
		},
		methods: {
			reset: function () {
				this.minutes = 0;
				this.seconds = 0;
			}
		}
	});
});
/**
 * Table 列宽定义组件
 * <pre>
 *   UI 使用：
 *   <table>
 *     <colgroup is="tableCol" :columns="columns" [:add-sn="true"] [:add-empty="true"]></colgroup>
 *     ...
 *   </table>
 *
 *   JS 代码：
 *   new Vue({
 *     data: {
 *       columns: [
 *         { id: "name", label: "姓名", width: "20em" },
 *         { id: "age", label: "年龄", width: "10em" },
 *         { id: "sex", label: "性别", width: "10em" }
 *       ]
 *     }
 *   });
 * 
 *   参数说明：
 *   <ul>
 *     <li>columns {Array} 列宽定义数组，如 [{key: "name", label: "姓名", width: "20em"}, ...]</li>
 *     <li>addSn {Boolean} [可选] 是否在开头自动添加序号列，默认 false</li>
 *     <li>addEmpty {Boolean} [可选] 是否在末尾自动添加空白自动列宽列，默认 false</li>
 *   </ul>
 * </pre>
 */
define('bc/vue/table-col',['vue'], function (Vue) {
	'use strict';
	return Vue.component('bc-table-col', {
		template1: '<colgroup data-rowspan={{rowspan}}>' +
		'<col v-if="addSn" data-id="_sn" style="width:3em">' +
		'<col v-for="c in columns" data-id="{{c.id}}" :style="{width:c.width}">' +
		'<col v-if="addEmpty" data-id="_empty" style="width:auto;min-width:1em;">' +
		'</colgroup>',
		template: '<colgroup v-if="addSn" data-id="_sn" style="width:3em"></colgroup>' +
		'<colgroup v-for="c in columns" data-id="{{c.id}}" :style="{width:c.width}" span="{{c.children ? c.children.length || 1 : 1}}">' +
		'<col v-if="c.children" v-for="d in c.children" data-id="{{d.id}}" :style="{width:d.width}">' +
		'</colgroup>' +
		'<colgroup v-if="addEmpty" data-id="_empty" style="width:auto;min-width:1em;"></colgroup>',
		replace: true,
		props: {
			columns: { type: Array, required: true },
			addSn: { type: Boolean, required: false, default: false },
			addEmpty: { type: Boolean, required: false, default: false }
		},
		computed: {
			rowspan: function () {
				var rowspan = 1;
				for (var i = 0; i < this.columns.length; i++) {
					if (this.columns[i].children && this.columns[i].children.length) {
						rowspan = 2; // 复杂表头（仅支持跨一行）
						break;
					}
				}
				return rowspan;// 简单表头
			}
		}
	});
});

define('text!bc/vue/page-bar.html',[],function () { return '<ul class="bc-page-bar ui-widget-content ui-widget ui-helper-clearfix">\r\n\t<li v-if="refreshable" class="icon ui-state-default ui-corner-all" title="刷新" @click="this.$dispatch(\'change\', \'clickRefresh\', this.pageNo, this.pageSize)">\r\n\t\t<span class="ui-icon ui-icon-refresh"></span>\r\n\t</li>\r\n\t<template v-if="pageable">\r\n\t\t<li class="icons ui-state-default ui-corner-all">\r\n\t\t\t<a href="#" class="icon ui-state-default ui-corner-all" @click.prevent.stop="toPage(1)">\r\n\t\t\t\t<span class="ui-icon ui-icon-seek-first" title="首页"></span>\r\n\t\t\t</a>\r\n\t\t\t<a href="#" class="icon ui-state-default ui-corner-all" @click.prevent.stop="toPage(Math.max((this.pageNo || 1) - 1, 1))">\r\n\t\t\t\t<span class="ui-icon ui-icon-seek-prev" title="上一页"></span>\r\n\t\t\t</a>\r\n\t\t\t<span class="pageNo">\r\n\t\t\t\t<span>{{pageNo || 1}}</span>/<span>{{pageCount}}</span>(<span>{{count}}</span>)\r\n\t\t\t</span>\r\n\t\t\t<a href="#" class="icon ui-state-default ui-corner-all" @click.prevent.stop="toPage(Math.min((this.pageNo || 1) + 1, this.pageCount))">\r\n\t\t\t\t<span class="ui-icon ui-icon-seek-next" title="下一页"></span>\r\n\t\t\t</a>\r\n\t\t\t<a href="#" class="icon ui-state-default ui-corner-all" @click.prevent.stop="toPage(this.pageCount)">\r\n\t\t\t\t<span class="ui-icon ui-icon-seek-end" title="尾页"></span>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li class="icons ui-state-default ui-corner-all" title="每页显示的数量">\r\n\t\t\t<a href="#" v-for="s in pageSizes" class="icon ui-state-default ui-corner-all" :class="{\'ui-state-active\': _pageSize == s}" @click.prevent.stop="changePageSize(s)">\r\n\t\t\t\t<span class="pageSize">{{s}}</span>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t</template>\r\n\t<!-- 扩展按钮 -->\r\n\t<slot></slot>\r\n</ul>';});


define('css!bc/vue/page-bar',[],function(){});

define('text!bc/vue/page-bar-importer.html',[],function () { return '<li class="bc-page-bar-importer icon ui-state-default ui-corner-all" :title="title">\r\n\t<span class="ui-icon" :class="iconClass" @click="hidden = !hidden"></span>\r\n\t<bc-box-pointer :width.sync="width" :hidden.sync="hidden" title="" @closed="reset">\r\n\t\t<form name="importer" method="post" \r\n\t\t\t@dragenter.prevent.stop="dragging = true" \r\n\t\t\t@dragover.prevent.stop="dragging = true" \r\n\t\t\t@dragleave.prevent.stop="dragging = false" \r\n\t\t\t@drop.prevent.stop="drop($event)">\r\n\t\t\t<div class="info">\r\n\t\t\t\t导入数据前请确保数据文件符合模板格式，可以通过下载模板获知格式的详细要求！\r\n\t\t\t</div>\r\n\t\t\t<div class="buttons">\r\n\t\t\t\t<!-- 上传数据 -->\r\n\t\t\t\t<label class="button upload">上传数据\r\n\t\t\t\t\t<input type="file" name="upload" @change.prevent.stop="upload($event.target.files[0])" \r\n\t\t\t\t\t  :accept="accept" style="display: none">\r\n\t\t\t\t</label>\r\n\t\t\t\t<!-- 下载模板 -->\r\n\t\t\t\t<a href="#" class="button download" @click.prevent.stop="download">下载模板</a>\r\n\t\t\t\t<!-- 取消 -->\r\n\t\t\t\t<a href="#" class="button cancel" @click.prevent.stop="hidden = !hidden">取消</a>\r\n\t\t\t</div>\r\n\t\t</form>\r\n\t\t<div v-if="processing" class="processing ui-state-highlight">\r\n\t\t\t<div v-if="!loading" style="margin:auto">\r\n\t\t\t\t{{resultSubject}}\r\n\t\t\t\t<template v-if="result.errorCount">\r\n\t\t\t\t\t<br><a href="#" class="show-result-detail" @click="showResultDetail">点击查看详情</a>\r\n\t\t\t\t</template>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<!-- 上传进度显示 -->\r\n\t\t<bc-loading v-if="loading" v-ref:loader :countable="true" :transparent="false"\r\n\t\t  :maskable="true" size="5em" speed="1000ms">\r\n\t\t</bc-loading>\r\n\t</bc-box-pointer>\r\n</li>';});


define('css!bc/vue/page-bar-importer',[],function(){});
/**
 * 分页条的导入组件
 * <pre>
 *   UI 使用：
 *   <bc-page-bar-importer [title="导入"] [url="..."] [tpl-url="..."]/>
 * 
 *   参数说明：
 *   <ul>
 *     <li>title {String} [可选] 按钮的鼠标提示文字，默认为 “导入”</li>
 *     <li>iconClass {String} [可选] 按钮的图标样式，默认为 “ui-icon-arrowthickstop-1-n”</li>
 *     <li>width {String} [可选] box-pointer 的宽度，默认为 'auto'</li>
 *     <li>hidden {Boolean} [可选] 是否隐藏不显示 box-pointer，默认为 true</li>
 *     <li>tplUrl {String} [必须] 下载模板的 URL</li>
 *     <li>accept {String} [可选] 上传数据时可选择的文件类型，默认为 ".xls,.xlsx"</li>
 *     <li>imported {Event} 导入完毕后的事件，
 *           第 1 个参数为代表导入是否全部成功的标记（(status=2xx && errorCount=0) or status!=2xx），
 *           第 2 个参数为服务器返回的数据（如果为 json 格式则为解析后的 json 对象，否则为响应的纯文本信息）</li>
 *   </ul>
 * </pre>
 */
define('bc/vue/page-bar-importer',[
	'jquery', 'vue', 'text!bc/vue/page-bar-importer.html', 'css!bc/vue/page-bar-importer', 
	'bc/vue/box-pointer', 'bc/vue/loading'
], function ($, Vue, template) {
	'use strict';

	// common mapping for ext to accept
	// see https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv#answer-11834872
	// see https://www.iana.org/assignments/media-types/media-types.xhtml
	const ext2accept = {
		'.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // 'Microsoft Excel 工作表'
		'.xls': 'application/vnd.ms-excel',                                           // 'Microsoft Excel 97-2003 工作表'
		'.docx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // 'Microsoft Word 文档'
		'.doc': 'application/msword',                                                 // 'Microsoft Word 97-2003 文档'
		'.pdf': 'application/pdf',  // 'PDF 文件(.pdf)'
		'.image': 'image/*',        // '图片文件'
		'.audio': 'audio/*',        // '音频文件'
		'.video': 'video/*',        // '视频文件'
	};

	return Vue.component('bc-page-bar-importer', {
		template: template,
		replace: true,
		props: {
			title: { type: String, required: false, default: "导入" },
			iconClass: { type: String, required: false, default: "ui-icon-arrowthickstop-1-n"},
			hidden: { type: Boolean, required: false, default: true },
			showResult: { type: Boolean, required: false, default: true }, // 是否显示导入结果
			width: { type: String, required: false, default: "auto" },
			accept: { type: String, required: false, default: "" },
			url: { type: String, required: false, default: null },   // 如无配置默认取 this.$parent.url + '/import'
			tplUrl: { type: String, required: false, default: null } // 如无配置默认取 this.url
		},
		data: function () {
			return {
				fileEl: null,     // 文件控件的 dom 对象
				processing: false,// 是否处理中
				loading: false,   // 是否显示进度条
				catching: false,  // 导入的 response 状态码不是 2xx 是为 true  
				dragging: false,  // 是否拖拽中
				result: {}        // 导入后的结果
			}
		},
		ready: function(){
			this.fileEl = this.$el.querySelector("input[name=upload]");
		},
		computed: {
			resultSubject: function () {
				if (this.catching) return "服务器异常！";
				let r = this.result;
				let msg;
				if (!r.errorCount) { // 成功
					msg = `成功导入 ${r.successCount} 条数据`;
					if (r.ignoreCount) msg += `，有 ${r.ignoreCount} 条数据因重复被忽略。`;
					else msg += "。";
				} else {            // 失败
					msg = `总共 ${r.totalCount} 条数据，有 ${r.errorCount} 条数据因存在异常导致导入失败`;
					if (r.ignoreCount) msg += `，有 ${r.ignoreCount} 条数据因重复而被忽略。`;
					else msg += "。";
				}
				return msg;
			}
		},
		methods: {
			// 重置
			reset: function(){
				this.fileEl.value = ''; // reset input[name=file]. will fire change event on IE11
				this.hidden = true;
				this.processing = false;
				this.loading = false;
				this.catching = false;
				this.dragging = false;
				this.result = {};
			},
			// 用户拖放上传文件
			drop: function(e){
				this.dragging = false;
				this.upload(e.dataTransfer.files[0]);
			},
			// 上传文件
			upload: function(file){
				if(!file) return;
				//console.log("name=" + file.name + ", type=" + file.type + ", size=" + file.size);

				this.processing = this.loading = true;

				// ajax 上传
				fetch(this.url || this.$parent.url + "/import", {
					method: 'POST',
					headers: { 
						'Authorization': window.localStorage.authorization,
						'Content-Type': 'application/octet-stream',
						'Content-Disposition': 'attachment; filename="' + encodeURIComponent(file.name) + '"'
					},
					body: file
				}).then((res) => {
					return res.ok ? res.json() : res.text().then(function (msg) { throw new Error(msg) });
				}).then((result) => {
					this.loading = false;
					this.result = result;
					// 触发事件
					this.$dispatch("imported", true, result);
				}).catch((error) => {
					this.loading = false;

					// 触发事件
					this.$dispatch("imported", false, error.message, error);

					// 显示结果
					if (this.showResult) {
						var msg = error.message || "导入失败！";
						if (window['bc'] && bc.msg) bc.msg.alert(msg, "导入异常");
						else alert(msg);
					}

					// 出现服务器异常就重置
					this.reset();
				});
			},
			// 下载模板
			download: function(){
				window.open(this.tplUrl || this.url || this.$parent.url + "/import", "blank");
			},
			// 显示导入结果
			showResultDetail: function(){
				let result = this.result;
				//打开查看详情的窗口
				let errorWin = window.open('', 'showImportedResult');
				let errorDoc = errorWin.document;
				errorDoc.open();
				let html = [];
				let title = '数据导入异常列表';
				html.push('<!DOCTYPE html>');
				html.push('<html>');
				html.push('<head>');
				html.push('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');
				// 获取视图的标题
				html.push('<title>' + title + '</title>');
				html.push('<style type="text/css">');
				html.push('body>h2{margin:0.25em 0}');
				html.push('div{color:red;font-weight:bold;font-size:100%}');
				html.push('table{border:none;border-collapse:collapse}');
				html.push('thead{font-weight:bold;}');
				html.push('td{border:1px solid gray;padding:2px;}');
				html.push('td:nth-child(1),td:nth-child(2){color:red;font-weight:bold;}');
				html.push('td:nth-child(2){max-width:600px;}');
				html.push('</style>');
				html.push('</head>');
				html.push('<body>');

				html.push('<h2>' + title + '</h2>');
				html.push('<div>' + this.resultSubject + '</div>');
				html.push('<table>');

				// 构建列头行
				let columnNames = result.columnNames;
				html.push('<thead><tr>');
				html.push('<td>行号</td><td>异常信息</td>');
				for (let i = 0; i < columnNames.length; i++) {
					html.push('<td>' + columnNames[i] + '</td>');
				}
				html.push('</tr></thead>');

				// 构建数据行
				html.push('<tbody>');
				let errors = result.errors;
				let error, source, value;
				for (let i = 0; i < errors.length; i++) {
					error = errors[i];
					html.push('<tr>');
					html.push('<td>' + (error.index + 1) + '</td>');
					html.push('<td>' + error.msg + '</td>');
					source = error.source;
					for (let j = 0; j < source.length; j++) {
						value = source[j];
						html.push('<td>' + (value == 0 || value ? value : "") + '</td>');
					}
					html.push('</tr>');
				}
				html.push('</tbody></table>');

				html.push('</body>');
				html.push('</html>');
				errorDoc.write(html.join(""));
				errorDoc.close();
				errorWin.focus();
				return false;
			}
		}
	});
});

define('text!bc/vue/page-bar-exporter.html',[],function () { return '<li class="bc-page-bar-exporter icon ui-state-default ui-corner-all" :title="title">\r\n\t<span class="ui-icon" :class="iconClass" @click="hidden = !hidden"></span>\r\n\t<bc-box-pointer :width.sync="width" :hidden.sync="hidden" title="" @closed="reset">\r\n\t\t<div class="info" :class="serverError ? \'ui-state-error\' : \'\'"><div>{{{tip}}}</div></div>\r\n\t\t<div class="buttons" v-if="!outOfLimit && !loading && !serverError">\r\n\t\t\t<!-- 继续 -->\r\n\t\t\t<a href="#" class="button continue" @click.prevent.stop="export">继续</a>\r\n\t\t\t<!-- 取消 -->\r\n\t\t\t<a href="#" class="button cancel" @click.prevent.stop="hidden = true">取消</a>\r\n\t\t</div>\r\n\t\t<!-- 进度显示 -->\r\n\t\t<bc-loading v-if="loading" size="5em" speed="1000ms" :countable="true" :transparent="true" :maskable="false">\r\n\t\t</bc-loading>\r\n\t</bc-box-pointer>\r\n</li>';});


define('css!bc/vue/page-bar-exporter',[],function(){});
/**
 * 分页条的导入组件
 * <pre>
 *   UI 使用：
 *   <bc-page-bar-exporter [url="..."] [max="3500"]/>
 * 
 *   参数说明：
 *   <ul>
 *     <li>url {String} [可选] 导出使用的 URL</li>
 *     <li>title {String} [可选] 按钮的鼠标提示文字，默认为 “导出”</li>
 *     <li>iconClass {String} [可选] 按钮的图标样式，默认为 “ui-icon-arrowthickstop-1-s”</li>
 *     <li>width {String} [可选] box-pointer 的宽度，默认为 'auto'</li>
 *   </ul>
 * </pre>
 */
define('bc/vue/page-bar-exporter',[
	'jquery', 'vue', 'text!bc/vue/page-bar-exporter.html', 'css!bc/vue/page-bar-exporter',
	'bc/vue/box-pointer', 'bc/vue/loading'
], function ($, Vue, template) {
	'use strict';

	return Vue.component('bc-page-bar-exporter', {
		template: template,
		replace: true,
		props: {
			url: { type: String, required: false, default: null }, // 如无配置默认取 this.$parent.url + '/export'
			max: { type: Number, required: false, default: 3500 }, // 导出条目数的限制
			filename: { type: String, required: false, default: null }, // 浏览器保存下载的文件时使用的文件名，不指定则使用服务器的配置

			title: { type: String, required: false, default: "导出" },
			iconClass: { type: String, required: false, default: "ui-icon-arrowthickstop-1-s" },
			width: { type: String, required: false, default: "auto" }
		},
		data: function () {
			return {
				hidden: true,       // 控制 box-pointer 的显示
				loading: false,
				serverError: null   // 导出失败的服务端错误信息
			}
		},
		computed: {
			outOfLimit: function () {
				return this.max > 0 && this.$parent.count > this.max;
			},
			tip: function () {
				if (this.serverError) return this.serverError;

				if (!this.loading) {
					if (this.max > 0) {
						let grid = this.$parent;
						let self = this;
						if (grid.count > this.max) return `系统限制每次最多导出 ${self.max} 条数据，当前共有 ${grid.count} 条数据，
					  已超出限制，无法导出。请先通过条件搜索减少导出数据的条目数！`;
					}

					return "导出数据可能耗时较长，需要耐心等待！";
				} else {
					return "导出中...";
				}
			}
		},
		methods: {
			// 重置
			reset: function () {
				this.hidden = true;
				this.loading = false;
				this.serverError = null;
			},
			// 导出
			export: function () {
				let grid = this.$parent;

				// 获取搜索条件
				let params = {};
				if (grid.query) {
					if (Array.isArray(grid.query)) {               // 数组
						params[grid.queryKey] = JSON.stringify(grid.query);
					} else if (typeof grid.query == "object") {    // json 对象
						let q = grid.query;
						Object.keys(q).forEach(function (key) {
							let v = q[key], t = typeof (v);
							if (v !== null && v !== "" && t !== "undefined")
								params[key] = v;
						});
					} else if (typeof grid.query == "string") {    // 字符
						params[grid.queryKey] = grid.query;
					}
				}

				// 将参数附加到url后面
				let url = this.url || grid.url + "/export";
				let s = [];
				Object.keys(params).forEach(function (key) {
					s.push(key + "=" + params[key]);
				});
				if (s.length) url += "?" + s.join("&");

				// 异步下载文件
				this.loading = true;
				let filename;
				fetch(url, {
					method: 'GET',
					headers: {
						'Authorization': window.localStorage.authorization
					}
				}).then(res => {
					if (!this.filename) {
						// 从响应头中获取服务端指定的文件名
						//for(let key of res.headers.keys()) console.log("key=" + key);
						let h = res.headers.get('Content-Disposition');
						if (h && h.includes('filename=')) {
							filename = h.substring(h.indexOf('filename=') + 9);
							if(filename.startsWith('"')) filename = filename.substring(1, filename.length - 1);
							filename = decodeURIComponent(filename);
						} else {
							h = res.headers.get('filename');
							filename = h ? decodeURIComponent(h) : null;
						}
					} else filename = this.filename;

					return res.ok ? res.blob() : res.text().then(function (msg) { throw new Error(msg) });
				}).then(blob => {
					// 100mb is test ok
					// see https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch
					const data = window.URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = data;
					a.download = filename || "NONAME"; // 浏览器保存下载的文件时使用的文件名
					a.click();

					// 重置
					this.reset();
				}).catch(error => {
					this.loading = false;
					this.serverError = "导出失败：<br>" + error.message;
				});
			}
		}
	});
});
/**
 * 分页条组件
 * <pre>
 *   UI 使用：
 *   <bc-page-bar [:pageable="true"] [:page-no="pageNo"] [:page-size="pageSize"] [:page-sizes="pageSizes"] [:count="count"]
 *                [:refreshable="true"] [:exportable="true"] [@change="reload"]/>
 * 
 *   参数说明：
 *   <ul>
 *     <li>pageable {Boolean} [可选] 是否可分页，默认 false</li>
 *     <li>pageNo {Number} [可选] 当前页码，不指定默认为 1</li>
 *     <li>pageSize {Number} [可选] 当前页容量，不指定默认为 25</li>
 *     <li>count {Number} [可选] 总条目数，一般不指定，由服务端决定</li>
 * 
 *     <li>refreshable {Boolean} [可选] 是否显示刷新按钮，默认 false</li>
 *     <li>exportable {Boolean} [可选] 是否显示导出按钮，默认 false</li>
 *     <li>importable {Boolean} [可选] 是否显示导入按钮，默认 false</li>
 * 
 *     <li>change {Event} 分页参数变动、点击刷新按钮分发的事件。
 *         事件第 1 个参数为引发事件的原因（'changePageNo' - 页码变动、'changePageSize' - 页容量变动、'clickRefresh' - 点击刷新按钮）,
 *         事件第 2 个参数为新 pageNo 的值，
 *         事件第 3 个参数为新 pageSize 的值
 *     </li>
 *     <li>export {Event} 点击导出按钮分发的事件。事件第 1 个参数为要导出的页码(pageNo)，-1 代表导出全部</li>
 *     <li>import {Event} 点击导入按钮分发的事件。</li>
 *   </ul>
 * </pre>
 */
define('bc/vue/page-bar',[
	'jquery', 'vue', 'text!bc/vue/page-bar.html', 'css!bc/vue/page-bar', 
	'bc/vue/page-bar-importer', 'bc/vue/page-bar-exporter'
], function ($, Vue, template) {
	'use strict';
	// Grid 组件的分页条 - 注册为全局组件
	var DEFAULT_PAGE_SIZES = [25, 50, 100];
	return Vue.component('bc-page-bar', {
		template: template,
		replace: true,
		props: {
			pageable: { type: Boolean, required: false, default: false },   // 可分页
			pageNo: { type: Number, required: false },                      // 当前页码
			pageSize: { type: Number, required: false },                    // 当前页容量
			pageSizes: { type: Array, required: false, default: function () { return DEFAULT_PAGE_SIZES } }, // 可选页容量
			count: { type: Number, required: false, default: 0 },           // 总条目数

			refreshable: { type: Boolean, required: false, default: true }, // 刷新
			exportable: { type: Boolean, required: false, default: false }, // 导出
			importable: { type: Boolean, required: false, default: false }  // 导入
		},
		data: function () {
			return { pageCount: Math.ceil(this.count / (this.pageSize || DEFAULT_PAGE_SIZES[0])) };    // 页码数
		},
		computed: {
			_pageNo: function () {
				return (!this.pageNo || this.pageNo <= 0) ? 1 : this.pageNo;
			},
			_pageSize: function () {
				return this.pageSize || DEFAULT_PAGE_SIZES[0];
			}
		},
		ready: function () {
			var $el = $(this.$el);
			// 鼠标悬停样式的控制
			$el.on({
				"mouseover": function () {
					$(this).addClass("ui-state-hover");
				},
				"mouseout": function () {
					$(this).removeClass("ui-state-hover");
				}
			}, ".icon");
		},
		beforeDestroy: function () {
			$(this.$el).off(); // 移除用jq绑定的所有事件处理程序
		},
		watch: {
			count: function (val, oldVal) {
				//console.log('[PageBar] watch.count: new=%s, old=%s', val, oldVal);
				this.pageCount = Math.ceil(val / (this.pageSize || DEFAULT_PAGE_SIZES[0]));
			}
		},
		methods: {
			/** 首页、上一页、下一页、尾页 */
			toPage: function (pageNo) {
				pageNo = Math.max(1, pageNo) || 1; // 最小为第一页
				if (pageNo == this._pageNo) return;
				//console.log('[PageBar] toPage: new=%s, old=%s', pageNo, this.pageNo, this.pageNo);
				this.pageNo = pageNo;
				this.$dispatch('change', 'changePageNo', this.pageNo, this.pageSize);
			},
			/** 改变 pageSize */
			changePageSize: function (pageSize) {
				if (pageSize == this._pageSize) return;
				//console.log('[PageBar] changePageSize: new=%s, old=%s', pageSize, this.pageSize);
				this.pageNo = Math.floor(((this._pageNo - 1) * this._pageSize / pageSize + 1));
				this.pageSize = pageSize;
				this.pageCount = Math.ceil(this.count / this.pageSize);
				this.$dispatch('change', 'changePageSize', this.pageNo, this.pageSize);
			}
		}
	});
});
/**
 * 跨域访问方法封装。
 * 
 * cors('my-url', 'GET')
 * .then(data -> {...})  // 2xx 响应时
 * .catch(error -> {...}) // error 或非 2xx 响应
 */
define('bc/vue/cors',[], function () {
	"use strict";

  function getAuthorizationHeaders() {
    return {"Authorization": localStorage.authorization};
	}

  /** 跨域访问方法封装 */
  function cors(url, method, body, contentType) {
    let options = {headers: getAuthorizationHeaders()};
    if (method) options.method = method;
    if (body) options.body = body;
    if (contentType) options.headers["Content-Type"] = contentType;
    return fetch(url, options).then(function (res) {
      return res.ok ? (res.status === 204 ? null : res.json()) : res.text().then(function (msg) {
        throw new Error(msg)
      });
    });
	}

  // 附加 URL 参数
  function appendUrlParams(url, params) {
    if (!params) return url;

    let kv = [];
    for (let key in params) kv.push(key + '=' + encodeURIComponent(params[key]));
    if (kv.length) url += (url.indexOf('?') !== -1 ? '&' : '?') + kv.join('&');
    return url;
	}
	
	return {
		get: function(url){
			return cors(url, 'GET');
		},
		post: function(url, body, contentType){
			return cors(url, 'POST', body, contentType);
		},
		appendUrlParams: function(url, params){
			return appendUrlParams(url, params);
		}
	};
});

define('text!bc/vue/grid.html',[],function () { return '<div class="bc-vue-grid ui-widget-content">\r\n\t<!-- 顶部扩展区 -->\r\n\t<slot name="top"></slot>\r\n\r\n\t<!-- 表头 -->\r\n\t<table class="head" :style="{width:\'100%\',position:\'relative\',\'user-select\':\'initial\',left:v.scrollLeft + \'px\'}">\r\n\t\t<colgroup v-ref:cols is="bc-table-col" :columns="columns" :add-sn="true" :add-empty="true">\r\n\t\t</colgroup>\r\n\t\t<thead>\r\n\t\t\t<tr class="main head ui-widget-content">\r\n\t\t\t\t<th rowspan="{{headRowspan}}" data-id="_sn" class="sn"><input type="checkbox" v-if="!singleChoice" v-model="v.selectAll" title="{{v.selectAll ? \'点击全部不选择\' : \'点击选择全部\'}}" @change.stop></th>\r\n\t\t\t\t<th v-for="c in columns" class="cell text" :class="c.headCellClass" :style="c.headCellStyle" data-id="{{c.id}}" colspan="{{c.children && c.children.length > 0 ? c.children.length : 1}}" rowspan="{{c.children && c.children.length > 0 ? 1 : headRowspan}}">{{c.label}}</th>\r\n\t\t\t\t<th rowspan="{{headRowspan}}" data-id="_empty" class="empty"></th>\r\n\t\t\t</tr>\r\n\t\t\t<!-- 分组的表头 -->\r\n\t\t\t<tr class="sub head ui-widget-content" v-if="headRowspan > 1">\r\n\t\t\t\t<template v-for="c in columns | filterBy isGroupColumn">\r\n\t\t\t\t\t<th v-for="d in c.children" class="cell text" data-id="{{d.id}}">{{d.label}}</th>\r\n\t\t\t\t</template>\r\n\t\t\t</tr>\r\n\t\t</thead>\r\n\t</table>\r\n\r\n\t<!-- 数据 -->\r\n\t<div class="rows" :style="{overflow:\'auto\',\'user-select\':\'initial\'}" @scroll="v.scrollLeft = -1 * $event.target.scrollLeft">\r\n\t\t<table class="rows" style="width:100%">\r\n\t\t\t<colgroup is="bc-table-col" :columns="columns" :add-sn="true" :add-empty="true"></colgroup>\r\n\t\t\t<tbody>\r\n\t\t\t\t<tr class="row" v-for="r in rows" data-id="{{r.id}}" class="{{r.class}}" :class="{\'ui-state-highlight\': r.selected, \'ui-widget-content\': true}"\r\n\t\t\t\t    :style="(typeof rowStyle == \'function\') ? rowStyle(r) : rowStyle">\r\n\t\t\t\t\t<td class="sn" data-id="_sn"><span v-if="r.selected" class="ui-icon ui-icon-check"></span>{{$index + 1}}</td>\r\n\t\t\t\t\t<template v-for="c in columns">\r\n\t\t\t\t\t\t<td v-if="isGroupColumn(c)" v-for="d in c.children" class="cell text"\r\n\t\t\t\t\t\t    :class="(typeof d.rowCellClass == \'function\') ? d.rowCellClass(r[d.id], r, d) : d.rowCellClass"\r\n\t\t\t\t\t\t    :style="(typeof d.rowCellStyle == \'function\') ? d.rowCellStyle(r[d.id], r, d) : d.rowCellStyle"\r\n\t\t\t\t\t\t    @click.prevent="rowCellClick(r[d.id], r, d, $event)" :title="rowCellTitle(r[d.id], r, d)">\r\n\t\t\t\t\t\t\t<template v-if="d.escape !== false">{{rowCellFilter(r[d.id], r, d)}}</template>\r\n\t\t\t\t\t\t\t<template v-if="d.escape === false">{{{rowCellFilter(r[d.id], r, d)}}}</template>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td v-if="!isGroupColumn(c)" class="cell text"\r\n\t\t\t\t\t\t    :class="(typeof c.rowCellClass == \'function\') ? c.rowCellClass(r[c.id], r, c) : c.rowCellClass"\r\n\t\t\t\t\t\t    :style="(typeof c.rowCellStyle == \'function\') ? c.rowCellStyle(r[c.id], r, c) : c.rowCellStyle"\r\n\t\t\t\t\t\t    @click.prevent="rowCellClick(r[c.id], r, c, $event)" :title="rowCellTitle(r[c.id], r, c)">\r\n\t\t\t\t\t\t\t<template v-if="c.escape !== false">{{rowCellFilter(r[c.id], r, c)}}</template>\r\n\t\t\t\t\t\t\t<template v-if="c.escape === false">{{{rowCellFilter(r[c.id], r, c)}}}</template>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</template>\r\n\t\t\t\t\t<td class="empty" data-id="_empty"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</tbody>\r\n\t\t</table>\r\n\t</div>\r\n\r\n\t<!-- 分页条 -->\r\n\t<bc-page-bar v-if="showPageBar" style="border-width: 1px 0 0 0" :pageable="pageable" :page-no.sync="pageNo" \r\n\t\t:page-size.sync="pageSize" :page-sizes.sync="pageSizes" :count.sync="count" :refreshable="refreshable"\r\n\t\t:exportable="exportable" :importable="importable" @change="reload">\r\n\t\t<!-- 分页条扩展按钮 -->\r\n\t\t<slot name="page-bar-button"></slot>\r\n\t</bc-page-bar>\r\n\r\n\t<!-- 加载器 -->\r\n\t<bc-loading v-ref:loading v-if="v.loading"></bc-loading>\r\n\r\n\t<!-- 底部扩展区 -->\r\n\t<slot name="bottom"></slot>\r\n</div>';});


define('css!bc/vue/grid',[],function(){});
/**
 * grid 组件
 */
define('bc/vue/grid',[
	'vue', 'bc/vue/table-col', 'bc/vue/page-bar', 
	'text!bc/vue/grid.html', 'css!bc/vue/grid', 'bc/vue/loading'
], function (Vue, tableCol, pageBar, template) {
	"use strict";
	var exportForm;
	var DEFAULT_PAGE_SIZES = [25, 50, 100];

	return Vue.component("bc-grid", {
		template: template,
		replace: true,
		props: {
			singleChoice: { type: Boolean, required: false, default: false },	// 单选|多选
			columns: { type: Array, required: false, default: function () { return [] } },
			rows: { type: Array, required: false, default: function () { return [] } },
			url: { type: String, required: false },
			rowStyle: { type: Function, required: false },  // 数据行的样式渲染，第 1 个参数为行数据对象

			// 附加的查询条件
			query: { required: false },
			queryKey: { type: String, required: false, default: "query" },   // get 请求时的参数名称

			// 请求方法：默认为 'GET'
			method: { type: [String, Function], required: false },
			// 重新加载数据前允许用户预处理请求参数和取消请求的处理函数，返回 false 则取消重新加载数据
			beforeReload: { type: Function, required: false },

			// 分页条的参数
			showPageBar: { type: Boolean, required: false, default: true },  // 是否显示分页条
			pageable: { type: Boolean, required: false, default: false },    // 可分页
			pageNo: { type: Number, required: false },           // 当前页码
			pageSize: { type: Number, required: false },  // 当前页容量
			pageSizes: { type: Array, required: false, default: function () { return DEFAULT_PAGE_SIZES } },     // 可选页容量
			count: { type: Number, required: false, default: 0 },            // 总条目数

			refreshable: { type: Boolean, required: false, default: true },  // 刷新
			exportable: { type: Boolean, required: false, default: false },  // 导出
			importable: { type: Boolean, required: false, default: false },  // 导入

			cellFilter: { type: Function, required: false },  // 单元格值的过滤函数，用于格式化单元格的值
			autoLoad: { type: Boolean, required: false, default: true }   // 是否自动加载 url
		},
		computed: {
			selection: function () {
				if (this.singleChoice) {     // 单选
					for (var i = 0; i < this.rows.length; i++) {
						if (this.rows[i].selected) return this.rows[i];
					}
				} else {                     // 多选
					var ss = [];
					for (var i = 0; i < this.rows.length; i++) {
						if (this.rows[i].selected) ss.push(this.rows[i]);
					}
					return ss;
				}
			},
			headRowspan: function () {
				return this.$refs.cols ? this.$refs.cols.rowspan : 1;
			},
			// 判断 url 是否是跨域请求
			isCorsUrl: function () {
				var url = this.url.toLowerCase();
				if(url.indexOf("http://") === 0 || url.indexOf("https://") === 0 || url.indexOf("//") === 0){
					var link = document.createElement('a');
					link.setAttribute('href', url);
					if (link.host !== location.host) return true;
				}
				return false;
			}
		},
		data: function () {
			return { v: { scrollLeft: 0, loading: false, selectAll: false } };
		},
		watch: {
			"v.selectAll": function (value, old) {
				var vm = this;
				this.rows.forEach(function (row, index) {
					if (row.hasOwnProperty("selected")) {
						row.selected = value;
					} else {
						vm.$set("rows[" + index + "].selected", value);
					}
				});
			}
		},
		ready: function () {
			// 监听行事件
			var $el = $(this.$el);
			var vm = this;
			var delaying, timer, cancelClick;
			$el.on({
				"mouseover": function () {
					$(this).addClass("ui-state-hover");
				},
				"mouseout": function () {
					$(this).removeClass("ui-state-hover");
				},
				"click": function () {
					if (delaying) {
						clearTimeout(timer);
					}
					delaying = true;
					var rowIndex = this.rowIndex;
					timer = setTimeout(function () {
						delaying = false;
						if (cancelClick) {
							cancelClick = false;
							return;
						}

						// 单选模式需要将其它选中的行进行反选
						if (vm.singleChoice) {
							for (var i = 0; i < vm.rows.length; i++) {
								if (i != rowIndex && vm.rows[i].selected) vm.rows[i].selected = false;
							}
						}

						// 切换行的选中状态
						var row = vm.rows[rowIndex];
						if (row.hasOwnProperty("selected")) {
							vm.rows[rowIndex].selected = !vm.rows[rowIndex].selected;
						} else {
							vm.$set("rows[" + rowIndex + "].selected", true);
						}
						delaying = false;

						// 发布单击行事件
						//vm.$dispatch("click-row", vm.rows[rowIndex], rowIndex);
					}, 200);
				},
				"dblclick": function () {
					cancelClick = true;

					// 发布双击行事件
					vm.$dispatch("dblclick-row", vm.rows[this.rowIndex], this.rowIndex);
				}
			}, "tr.row");

			// 异步加载数据
			if (this.autoLoad) this.reload();
		},
		methods: {
			// 分页条变更页码时间
			changePageBar: function (type, pageNo, pageSize) {
				this.reload();
			},
			// 重新加载数据
			reload: function () {
				if (!this.url) return;

				// 重置动画加载器
				this.v.loading = true;

				var params = {};
				if (this.pageable) {
					if(this.pageNo) params.pageNo = this.pageNo;
					if(this.pageSize) params.pageSize = this.pageSize;
				}

				// 附加搜索条件
				if (this.query) {
					if (Array.isArray(this.query)) {               // 数组
						params[this.queryKey] = JSON.stringify(this.query);
					} else if (typeof this.query == "object") {    // json 对象
						var q = this.query;
						Object.keys(q).forEach(function (key) {
							var v = q[key], t = typeof (v);
							if (v !== null && v !== "" && t !== "undefined")
								params[key] = v;
						});
					} else if (typeof this.query == "string") {    // 字符
						params[this.queryKey] = this.query;
					}
				}

				//console.log("[grid] reload url=%s, params=%s", this.url, JSON.stringify(params));
				var vm = this;
				var url = this.url;
				var settings = {
					method: typeof (this.method) == "function" ? this.method() : (this.method || "GET")
				};

				// 处理请求提交的参数
				if (settings.method == "POST") {
					settings.headers = { "Content-Type": "application/json;charset=utf-8" }; // 默认UTF-8
					settings.body = JSON.stringify(params); // post json
				} else if (settings.method == "GET") {
					// 将参数附加到url后面
					var s = [];
					Object.keys(params).forEach(function (key) {
						s.push(key + "=" + params[key]);
					});
					if (s.length) url += "?" + s.join("&");
				}

				// 处理 CORS 跨域请求: 有 localStorage.authorization 且 isCorsUrl = true 才当作跨域
				if(window && window.localStorage && window.localStorage.authorization && this.isCorsUrl){
					if (!settings.headers) settings.headers = {};
					settings.headers["Authorization"] = window.localStorage.authorization;
				} else { // 非 CORS 跨域请求退回使用 cookies
					settings.credentials = 'include'  // include cookies
				}

				// 重新加载前允许用户预处理请求参数和取消请求
				if (this.beforeReload && this.beforeReload(settings) === false) {
					vm.v.loading = false;
					return;
				}

				// 开始重新加载
				fetch(url, settings).then(function (res) {
					return res.ok ? res.json() : res.text().then(function (msg) { throw new Error(msg) });
				}).then(function (j) {
					if(Array.isArray(j)) { // 非分页且直接返回 rows 值的情况
						vm.$set('rows', j);
					} else {
						j.columns && vm.$set('columns', j.columns);
						j.rows && vm.$set('rows', j.rows);
						if (vm.pageable) { // 分页时
							j.pageNo && vm.$set('pageNo', j.pageNo);
							j.pageSize && vm.$set('pageSize', j.pageSize);
							j.pageSizes && vm.$set('pageSizes', j.pageSizes);
							j.count && vm.$set('count', j.count);
						}
						if (vm.showPageBar) {
							j.hasOwnProperty("refreshable") && vm.$set('refreshable', j.refreshable);
							j.hasOwnProperty("exportable") && vm.$set('exportable', j.exportable);
							j.hasOwnProperty("importable") && vm.$set('importable', j.importable);
						}
						j.hasOwnProperty("singleChoice") && vm.$set('singleChoice', j.singleChoice);
					}

					// 触发数据加载完毕事件
					vm.$dispatch('after-reload', j);

					// 隐藏动画加载器
					vm.v.loading = false;
				}).catch(function (error) {
					console.log("[grid] reload error: url=%s, error=%o", vm.url, error);
					var msg = error.message || "[grid] 数据加载失败！";
					if (window['bc'] && bc.msg) bc.msg.alert(msg);
					else alert(msg);

					// 隐藏动画加载器
					vm.v.loading = false;
				});
			},
			isGroupColumn: function (column) {
				return !!(column.children && column.children.length);
			},
			/** 单元格值的格式化 */
			rowCellFilter: function (value, row, column) {
				//console.log("value=%s, column=%s", value, column.id);
				if (!column.filter) return value;
				else if (typeof column.filter == "string") { // vue 过滤器
					var cfg = column.filter.split(" ");
					var filter = Vue.filter(cfg[0]); 	// 过滤器ID
					if (!filter) console.error("filter '%s' not found (column=%s)", cfg[0], column.id);
					var args = cfg.slice(1);
					args.unshift(value); 					// 过滤器参数
					//console.log("column=%s, filter=%s, args=%o", column.id, cfg[0], args);
					return filter.apply(this, args);
				} else if (typeof column.filter == "function") { // 自定义的渲染函数
					return column.filter.apply(this, [value, row, column]);
				}
			},
			/** 单元格的鼠标提示信息 */
			rowCellTitle: function (value, row, column) {
				if (!column.title) return;
				if (typeof column.title == "function") { // 自定义函数
					return column.title(value, row, column);
				} else return value;
			},
			/** 单元格点击函数 */
			rowCellClick: function (value, row, column, e) {
				if(column.rowCellClick) column.rowCellClick.apply(this, [value, row, column, e]);
			},
			// 获取用于导出报表的 form (如果没有会自动创建一个)
			getExportForm: function () {
				if (!exportForm)
					exportForm = $('<form name="bc-vue-grid-exporter" method="get" style="display:none"></form>')[0];
				return exportForm;
			}
		}
	});
});

define('text!bc/vue/tree.html',[],function () { return '<div class="bc-vue-tree ui-widget-content">\r\n\t<div class="self" :class="{\'ui-state-hover\': hover, \'ui-state-focus\': selected}"\r\n\t\t@mouseenter="hover = true" @mouseleave="hover = false" @click="clickMe">\r\n\t\t<span class="indent" :style="{width: (depth * 16) + \'px\'}"></span>\r\n\t\t<span @click.stop="toggle" class="toggle ui-icon"\r\n\t\t\t:class="collapsed ? \'ui-icon-triangle-1-e\' : \'ui-icon-triangle-1-se\'"\r\n\t\t\t:style="{visibility: leaf ? \'hidden\' : \'visible\'}">\r\n\t\t</span>\r\n\t\t<span class="icon ui-icon {{iconClass}}"></span>\r\n\t\t<span class="label">{{label || id}}</span>\r\n\t</div>\r\n\t<div v-if="!leaf && !collapsed" class="children">\r\n\t\t<bc-tree v-for="item in items" :cfg_="item"/>\r\n\t</div>\r\n</div>';});


define('css!bc/vue/tree',[],function(){});
/**
 * 树组件
 * <pre>
 *   UI 使用：
 *   <bc-tree children="..." :collapsed="false"/>
 * 
 *   参数说明：
 *   <ul>
 *     <li>
 *       1) id {Number, String}: 节点 ID，没有指定时默认为 null，一般只是根节点不指定，子节点必须指定，否则无法判断节点的唯一性。
 *       2) label {String}：节点显示的文字，不指定时默认取 ID 的字符值代替。
 *       3) collapsed {Boolean}：节点的折叠状态，true 为折叠、false 为展开；默认为 true。
 *       4) leaf {Boolean}：是否是叶子节点，默认为 false，代表节点是可展开的。
 *       5) selected {Boolean}：节点是否处于选中状态，默认为 false。
 *       6) paramKey {String}：附加到 url 后的参数名称，默认为 pid。
 *       7) children {Array, String}：子节点列表或获取子节点列表的 URL。
 *         当为 String 时是指定获取子节点数据的 URL（这时也可使用 url 参数名代替 children 进行配置），
 *         当为 Array 时是指定静态的子节点数据列表。
 *           数据格式统一为：[node1, node2, ..., nodeN]
 *             nodeN: {id, label, collapsed, children: [node1, node2, ..., nodeN]} 或单个 ID 值。
 *             如：[2017, 2016, {id: 2015, leaf: false, months: [12, 11, ..., 1]]
 *         当没有配置 children 但 leaf 为 false 时，如果配置了 url 的值，
 *         则每当展开子节点时，都使用 url?pid=:id 的方式远程加载子节点的数据。
 *       8) icon {String} 节点的 jq-ui 图标样式名，非叶子节点默认为文件夹图标、叶子节点默认为文档图标。
 *     </li>
 *   </ul>
 * 
 *   根节点事件说明：
 *   <ul>
 *     <li>
 *       1) clickNode 用户用鼠标点击节点后触发，第 1 个参数为用户点击的节点。
 *       2) change 用户改变节点的选择后触发，第 1 个参数为选择的节点，第 2 个参数为之前选择的节点（无则为 null）。
 *       3) initialized 首次加载完毕后触发，第 1 个参数为当前选择的节点（无则为 null）。
 *     </li>
 *   </ul>
 * </pre>
 */
define('bc/vue/tree',[
	'jquery', 'vue', 'bc/vue/cors', 'text!bc/vue/tree.html', 'css!bc/vue/tree', 'bc/vue/loading'
], function ($, Vue, CORS, template) {
	'use strict';
	const INDENT = 16;

	// 递归计算节点的深度：顶层节点的深度为 0
	function caculateDepth(node) {
		if (node.$parent && node.$parent.isNode)
			return 1 + caculateDepth(node.$parent);
		else return 0;
	}

	// 获取节点所在树的根节点
	function getRootNode(node) {
		let p = node.$parent;
		if (p && p.isNode) return getRootNode(p);
		else return node;
	}

	// 获取最接近的祖先节点的 url 配置，没有则返回 null
	function getClosestUrl(node) {
		if (!node) return null;
		let s = typeof (node.children) === 'string';
		if (node.isRootNode || s) return s ? node.children : null;
		else return getClosestUrl(node.$parent);
	}

	// 获取最接近的祖先节点的 paramKey 配置，没有则返回 'pid'
	function getClosestParamKey(node) {
		if (!node) return 'pid';
		else return node.paramKey ? node.paramKey : getClosestParamKey(node.$parent);
	}

	// 获取最接近的祖先节点的 converter 配置，没有则返回 null
	function getClosestConverter(node) {
		if (!node) return null;
		else return node.converter ? node.converter : getClosestConverter(node.$parent);
	}

	return Vue.component('bc-tree', {
		name: 'bc-tree',
		template: template,
		replace: true,
		props: {
			id: { type: [String, Number], required: false, default: null },
			label: { type: String, required: false, default: null },
			collapsed: { type: Boolean, required: false, default: true },
			selected: { type: Boolean, required: false, default: false },
			icon: { type: String, required: false, default: null },
			leaf: { type: Boolean, required: false, default: false },
			children: { type: [Array, String], required: false, default: null },

			url: { type: String, required: false, default: null }, // children 为 string 的特殊情况
			paramKey: { type: String, required: false, default: null },
			// 节点值转换器，不配置默认使用父节点的 converter
			converter: { type: Function, required: false, default: null },

			// 上述所有配置的综合：尽在组件内部使用
			cfg_: { type: [Object, String, Number], required: false, default: undefined }
		},
		data: function () {
			return {
				isRootNode: false,
				isNode: true,
				loading: false,  // 远程数据是否正在加载中
				hover: false,     // 节点是否处于鼠标悬停状态
				items: []         // 子节点数据列表
			}
		},
		computed: {
			// 节点所在的深度：顶层节点的深度为 0
			depth: function () {
				return caculateDepth(this);
			},
			// 节点图标
			iconClass: function () {
				if (this.icon) return this.icon;
				else return this.leaf ? "ui-icon-document" :
					(this.collapsed === false ? "ui-icon-folder-open" : "ui-icon-folder-collapsed");
			}
		},
		ready: function () {
			// 如果使用了综合配置，则拆分到相应的属性中
			if (typeof (this.cfg_) !== 'undefined') {
				let convertedCfg = this.convert(this.cfg_);
				if (typeof (convertedCfg) !== 'object') this.id = convertedCfg;
				else {
					for (let k in convertedCfg) Vue.set(this, k, convertedCfg[k]);
				}
			}

			// 标记自身是否是根节点
			this.isRootNode = !this.$parent || (this.$parent && !this.$parent.isNode);
			//console.log("isRootNode=%s", this.isRootNode);

			// 如果设置了 url，则将其转换为 children 配置
			if (this.url) this.children = this.url;

			// 如果设置为选中，则在树根上记录此节点
			let rootNode = getRootNode(this);
			if (this.selected) Vue.set(rootNode, 'selectedNode', this);

			// 根据数据加载方式，再数据加载完毕后触发 initialized 事件
			if (Array.isArray(this.children)) {   // 静态数据
				this.items = this.children;
				if (this.isRootNode) Vue.nextTick(() => {
					this.$dispatch("initialized", rootNode.selectedNode, 'local');
					if (rootNode.selectedNode) this.$dispatch("change", rootNode.selectedNode, null);
				});
			} else {                              // 远程数据
				if (!this.collapsed) {
					this.load().then(() => {
						if (this.isRootNode) Vue.nextTick(() => this.$dispatch("initialized", rootNode.selectedNode, 'remote'));
					});
				} else {
					if (this.isRootNode) Vue.nextTick(() => this.$dispatch("initialized", rootNode.selectedNode, false));
				}
			}
		},
		methods: {
			convert: function (cfg) {
				let t = typeof (cfg) === 'object';
				let converter = (t && cfg.converter) ? cfg.converter : getClosestConverter(this);
				return converter ? converter.call(this, cfg) : cfg;
			},
			// 加载子节点列表数据
			load: function () {
				// 避免重复请求
				if (this.loading) {
					console.log("[tree] loading...");
					return;
				}

				let url = getClosestUrl(this);
				if (!url) return;
				if (this.id) {
					let params = {};
					params[getClosestParamKey(this)] = this.id;
					url = CORS.appendUrlParams(url, params);
				}
				return CORS.get(url)
					.then(array => {
						this.loading = false;
						this.items = array;
					}).catch(error => {
						this.loading = false;
						console.log("[tree] load error: url=%s, error=%o", url, error);
						var msg = error.message || "[tree] 数据加载失败！";
						if (window['bc'] && bc.msg) bc.msg.alert(msg);
						else alert(msg);
					});
			},
			// 折叠展开节点
			toggle: function () {
				this.collapsed = !this.collapsed;
				if (this.collapsed) return;

				// 远程加载数据
				if (!Array.isArray(this.children)) {
					let url = getClosestUrl(this);
					if (url) this.load();
				}
			},
			// 用户点击节点的处理：选中节点并触发 click-node、change 事件
			clickMe: function () {
				// 触发 click-node 事件
				this.$dispatch("click-node", this);

				if (this.selected) return; // 避免重复触发 change 事件
				this.selected = true;

				// 解除前一选中节点的选择
				let treeRoot = getRootNode(this);
				let preSelectedNode = treeRoot.selectedNode;
				if (preSelectedNode) preSelectedNode.selected = false;

				// 记录当前结点为新的选择节点
				treeRoot.selectedNode = this;

				// 触发 change 事件
				this.$dispatch("change", this, preSelectedNode);
			}
		}
	});
});
/*! BC 平台的 vue 组件
 * @author dragon <rongjihuang@gmail.com>
 * @version v0.10.2 2017-12-03
 * @license Apache License 2.0
 * @components bc-theme
 *             bc-button
 *             bc-button-set
 *             bc-search
 *             bc-toolbar
 *             bc-table-col
 *             bc-loading
 *             bc-box-pointer
 *             bc-page-bar
 *             bc-page-bar-importer
 *             bc-grid
 *             bc-tree
 */
define('bc/vue/components',["bc/vue/theme", "bc/vue/button", "bc/vue/button-set", "bc/vue/search"
	, "bc/vue/toolbar" , "bc/vue/box-pointer", "bc/vue/loading"
	, "bc/vue/table-col", "bc/vue/page-bar", "bc/vue/cors"
	, "bc/vue/grid", "bc/vue/tree"
], function () {
	return 0;
});

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('.bc-vue-search{position:relative;display:inline-block;}.bc-vue-search > .fuzzy > div{display:inline-block;position:relative;}.bc-vue-search > .fuzzy .search{position:absolute;top:50%;margin-top:-8px;left:2px;cursor:pointer;}.bc-vue-search > .fuzzy input.fuzzy{box-sizing:border-box;padding:.34em 18px;width:12em;font-family:inherit;font-size:1em;}.bc-vue-search > .fuzzy .add{position:absolute;top:50%;margin-top:-8px;right:2px;cursor:pointer;}.bc-vue-search > .advance{position:relative;margin-top:-2px;background-image:none;z-index:90;overflow:auto;display:flex;flex-direction:column;}.bc-vue-search > .advance > .conditions{border-collapse:collapse;margin:0;padding:0;list-style:none;overflow:auto;flex-grow:1;min-width:20em;}.bc-vue-search .operate{padding:0.4em;border-width:1px 0 0 0;}.bc-vue-search .condition{margin:0.4em;}.bc-vue-search .condition .label{font-weight:bold;}.bc-vue-search .condition .value{position:relative;display:flex;flex-direction:row;}.bc-vue-search .condition .value > div{display:inline-block;}.bc-vue-search .condition .value > div.left,.bc-vue-search .condition .value > div.right{flex-grow:1;background-color:gray;}.bc-vue-search .condition .value input,.bc-vue-search .condition .value select{box-sizing:border-box;min-width:9em;width:100%;padding:.34em 0 .34em .34em;font-family:inherit;font-size:1em;}.bc-vue-search .condition .value input{padding-left:calc(0.34em + 4px);}.bc-vue-search .condition .value .left,.bc-vue-search .condition .value .right{position:relative;}.bc-vue-search .operate button{font-family:inherit;}.bc-vue-toolbar{position:relative;padding:0;min-height:2.2em;word-spacing:-0.4em;font-weight:normal;}.bc-vue-toolbar > *{word-spacing:normal;font-family:inherit;font-size:1em;margin:0.2em;}.bc-vue-toolbar > .bc-vue-search{position:absolute;top:0.05em;right:0.06em;}.bc-vue-toolbar > .bc-vue-search:first-child{position:relative;margin-left:0.3em;}.bc-box-pointer{position:absolute;z-index:9999;left:0;top:0;border:none;}.bc-box-pointer > .pointer-border{position:absolute;display:block;height:0;width:0;border-width:10px;background:none;}.bc-box-pointer.left-top > .pointer-border{left:0;bottom:-12px;border-color:rgb(252,239,161) transparent transparent transparent;}.bc-box-pointer > .pointer-back{position:absolute;display:block;border:none;height:20px;width:20px;transform:translateY(-24px) rotateZ(45deg);transform-origin:50% 50% 0;}.bc-box-pointer > .box{_height:40px;position:absolute;min-width:6em;min-height:2em;bottom:5px;left:-2px;}.bc-box-pointer > .box > .content{margin:0.25em;cursor:default;}.bc-box-pointer > .box > .close{position:absolute;top:-8px;right:-8px;cursor:pointer;}.bc-vue-loading-container{position:absolute;top:0;left:0;width:100%;height:100%;}.bc-vue-loading-container > .counter,.bc-vue-loading-container > .actor{position:absolute;box-sizing:border-box;top:50%;left:50%;}.bc-vue-loading-container > .counter{width:6em;height:2em;line-height:2em;text-align:center;margin:-1em auto auto -3em;border:none;background:none;}.bc-vue-loading-container > .actor{opacity:0.8;width:3.5em;height:3.5em;margin:-1.75em auto auto -1.75em;border-width:0.5em;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:bc-vue-loading-spin 1000ms infinite linear;}.bc-vue-loading-container > .actor.transparent{background:none;}@keyframes bc-vue-loading-spin{100%{transform:rotate(360deg);transform:rotate(360deg);}}.bc-page-bar{clear:both;display:block;margin:0;padding:0;}.bc-page-bar > li{list-style:none;cursor:default;position:relative;margin:0.2em;padding:4px 0;float:left;}.bc-page-bar .icon{cursor:pointer;}.bc-page-bar > li > span.ui-icon{float:left;margin:0 4px;}.bc-page-bar > .icons{padding:2px 2px;}.bc-page-bar > .icons > a.icon{margin:0;border:0;}.bc-page-bar > .icons span.ui-icon{margin:2px;}.bc-page-bar > li span.pageNo,.bc-page-bar > li span.pageSize{float:left;height:16px;font-size:12px;}.bc-page-bar > li span.pageNo{margin:2px 4px;cursor:default;}.bc-page-bar > li span.pageSize{margin:2px 4px;}.bc-page-bar > li > a{float:left;display:block;}.bc-page-bar-importer{position:relative;}.bc-page-bar-importer .info{width:14em;font-weight:normal;padding:5px;border:1px dashed #ccc;}.bc-page-bar-importer .buttons{position:relative;text-align:right;padding:0 4px;}.bc-page-bar-importer .buttons > .button{text-decoration:underline;cursor:pointer;position:relative;margin:auto .25em;}.bc-page-bar-importer .processing{position:absolute;left:0.25em;top:0.25em;right:0.25em;bottom:0.25em;text-align:center;border-style:dashed;line-height:1.5em;display:flex;align-items:center;padding:0.25em;}.bc-page-bar-importer .processing .show-result-detail{text-decoration:underline;cursor:pointer;margin-top:1em;}.bc-page-bar-exporter{position:relative;}.bc-page-bar-exporter .info{width:14em;font-weight:normal;padding:5px;border:1px dashed #ccc;min-height:4.5em;display:flex;align-items:center;}.bc-page-bar-exporter .buttons{position:relative;text-align:right;padding:0 4px;}.bc-page-bar-exporter .buttons > .button{text-decoration:underline;cursor:pointer;position:relative;margin:auto .25em;}.bc-page > .bc-vue-grid,.bc-vue-grid.fillup{position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;}.bc-page > .bc-vue-grid,.bc-vue-grid.noborder{border-width:0;}.bc-vue-grid.border{border-width:1px;}.bc-vue-grid > .bc-vue-toolbar{border-width:0 0 1px 0;}.bc-vue-grid{display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box;position:relative;font-weight:normal;}.bc-vue-grid > *{flex:none;}.bc-vue-grid > div.rows{flex:1 1 0%;}.bc-vue-grid table.head,.bc-vue-grid table.rows{table-layout:fixed;border-collapse:collapse;}.bc-vue-grid table.rows{margin-bottom:-1px;}.bc-vue-grid tr.head > th{font-weight:inherit;}.bc-vue-grid tr.head,.bc-vue-grid tr.row{height:2em;}.bc-vue-grid td.cell{text-align:left;white-space:normal;word-wrap:break-word;word-break:break-all;}.bc-vue-grid td.sn{text-align:center;cursor:default;}.bc-vue-grid td.sn > .ui-icon-check{display:inline-block;}.bc-vue-grid tr.main.head,.bc-vue-grid tr.row{border-width:1px 0 1px 0;}.bc-vue-grid tr.main.head:first-child,.bc-vue-grid tr.row:first-child,.bc-vue-grid tr.main.head:first-child > th,.bc-vue-grid tr.row:first-child > td{border-top:none;}.bc-vue-grid tr.main.head >:first-child,.bc-vue-grid tr.row >:first-child{border-left:none;}.bc-vue-grid tr.main.head >:last-child,.bc-vue-grid tr.row >:last-child{border-right:none;}.bc-vue-grid tr.head > *,.bc-vue-grid tr.row > *{padding:0;border-width:1px;border-color:inherit;border-style:inherit;}.bc-vue-grid td.cell.text,.bc-vue-grid th.cell.text{padding:0 0.4em;}.bc-vue-grid td.cell.text.ellipsis,.bc-vue-grid th.cell.text.ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bc-vue-tree .bc-vue-tree.ui-widget-content{border-width:0;}.bc-vue-tree > div.self{position:relative;display:flex;flex-direction:row;border-width:0;cursor:default;line-height:1.8em;}.bc-vue-tree > .self > span{display:inline-block;flex:none;}.bc-vue-tree > .self > span:last-child{flex:1 1 0%;padding-right:0.25em;}.bc-vue-tree > .self > span.ui-icon{margin:calc((1.8em - 16px) / 2) 0;}.bc-page > .bc-vue-tree-view > .bc-vue-toolbar{border-width:0 0 1px 0;}.bc-page > .bc-vue-tree-view > .panel > .bc-vue-tree{border-width:0 1px 0 0;}.bc-page > .bc-vue-tree-view > .panel > .bc-vue-grid{border-width:0;}.bc-page > .bc-vue-tree-view.border > .bc-vue-toolbar{border-width:1px 1px 1px 1px;}.bc-page > .bc-vue-tree-view.border > .panel > .bc-vue-tree{border-width:0 1px 1px 1px;}.bc-page > .bc-vue-tree-view.border > .panel > .bc-vue-grid{border-width:0 1px 1px 0;}.bc-vue-tree-view{display:flex;flex-direction:column;width:100%;height:100%;border:none;font-weight:normal;}.bc-vue-tree-view > .bc-vue-toolbar{flex:none;}.bc-vue-tree-view > .panel{flex:1 1 0%;display:flex;flex-direction:row;}.bc-vue-tree-view > .panel > .bc-vue-tree{flex:none;overflow:auto;min-width:8em;border-top-width:0;}.bc-vue-tree-view > .panel > .bc-vue-grid{flex:1 1 0%;border-top-width:0;border-left-width:0;}');
