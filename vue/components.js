/*! BC 平台的 vue 组件
 * @author dragon <rongjihuang@gmail.com>
 * @version v0.5.0 2016-12-13
 * @license Apache License 2.0
 * @components bc-theme
 *             bc-button
 *             bc-button-set
 *             bc-search
 *             bc-toolbar
 *             bc-table-col
 *             bc-page-bar
 *             bc-loading
 *             bc-grid
 */

define("bc/vue/theme", [ "jquery", "vue" ], function($, Vue) {
    "use strict";
    var DEFAULT = {
        UNIT_EM: {
            UNIT: "em",
            SIZE: 1,
            STEP: .1,
            MIN: .1,
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
    return Vue.component("bc-theme", {
        template: '<div class="ui-widget-content" style="margin:0.2em;padding:0.2em;font-size:16px;position:absolute;right:1em;top:0">字体大小：<input type="number" min="{{min}}" max="{{max}}" step="{{step}}" v-model="size"  style="width:3em"/><label><input type="radio" value="em" v-model="unit">em</label><label><input type="radio" value="px" v-model="unit">px</label></div>',
        replace: !0,
        props: {
            size: {
                type: Number,
                required: !1,
                default: DEFAULT.UNIT_EM.SIZE
            },
            unit: {
                type: String,
                required: !1,
                default: DEFAULT.UNIT_EM.UNIT
            }
        },
        created: function() {
            this.initByUnit(this.unit), this.fontSize != DEFAULT.UNIT_EM.SIZE + DEFAULT.UNIT_EM.UNIT && this.change();
        },
        data: function() {
            return {
                min: DEFAULT.UNIT_EM.MIN,
                max: DEFAULT.UNIT_EM.MAX,
                step: DEFAULT.UNIT_EM.STEP
            };
        },
        computed: {
            fontSize: function() {
                return this.size + this.unit;
            }
        },
        watch: {
            unit: function(value, old) {
                this.initByUnit(value, old);
            },
            fontSize: function(value, old) {
                this.change();
            }
        },
        methods: {
            initByUnit: function(unit, old) {
                "em" == unit ? (this.min = DEFAULT.UNIT_EM.MIN, this.max = DEFAULT.UNIT_EM.MAX, 
                this.step = DEFAULT.UNIT_EM.STEP, old && (this.size = this.size / 16)) : (this.min = DEFAULT.UNIT_PX.MIN, 
                this.max = DEFAULT.UNIT_PX.MAX, this.step = DEFAULT.UNIT_PX.STEP, old && (this.size = 16 * this.size));
            },
            change: function() {
                document.body.style.fontSize = this.size + this.unit, this.$nextTick(function() {
                    this.$dispatch("change-font-size", this.size, this.unit);
                });
            }
        }
    });
}), define("bc/vue/button", [ "jquery", "vue" ], function($, Vue) {
    "use strict";
    return Vue.component("bc-button", {
        template: '<button class="bc-vue-button ui-button ui-widget ui-state-default ui-corner-all" style="font-family:inherit" type="button" :class="btnClass"><span class="ui-button-icon-primary ui-icon" v-if="iconClass" :class="iconClass"></span><span class="ui-button-text">{{text}}<slot></slot></span></button>',
        replace: !0,
        props: {
            text: {
                type: String,
                required: !1,
                default: "　"
            },
            iconClass: {
                type: String,
                required: !1
            }
        },
        computed: {
            btnClass: function() {
                var c, hasText = this.text && "　" != this.text;
                return c = hasText && this.iconClass ? "ui-button-text-icon-primary" : !hasText && this.iconClass ? "ui-button-icon-only" : (hasText && !this.iconClass, 
                "ui-button-text-only");
            }
        },
        ready: function() {
            var $el = $(this.$el);
            $el.on({
                mouseover: function() {
                    $(this).addClass("ui-state-hover");
                },
                mouseout: function() {
                    $(this).removeClass("ui-state-hover");
                }
            });
        },
        beforeDestroy: function() {
            $(this.$el).off();
        },
        methods: {}
    });
}), define("bc/vue/button-set", [ "jquery", "vue" ], function($, Vue) {
    "use strict";
    return Vue.component("bc-button-set", {
        template: '<div class="bc-vue-button-set ui-buttonset" style="display:inline-block"><div v-for="i in items" data-id="{{i.hasOwnProperty(\'id\') ? i.id : $index}}" class="ui-button ui-widget ui-state-default ui-button-text-only" style="font-family:inherit;font-size:1em" :class="{\'ui-corner-left\': $index == 0, \'ui-corner-right\': $index == items.length - 1, \'ui-state-active\': isActive(i)}" :style="{\'margin-right\': \'-1px\', \'z-index\': value == i.id ? items.length : 0}"><span style="font-size: 1em" class="ui-button-text" @click="clickItem(i, $index)">{{i.label || i}}</span></div></div>',
        replace: !0,
        props: {
            items: {
                type: Array,
                required: !0
            },
            value: {
                required: !1,
                default: null
            }
        },
        created: function() {
            if (null === this.value) for (var i = 0; i < this.items.length; i++) if (this.items[i].active) {
                this.value = this.items[i].id;
                break;
            }
        },
        watch: {
            value: function(value, old) {
                this.$dispatch("change", value, old);
            }
        },
        methods: {
            clickItem: function(item, index) {
                this.value = "object" == typeof item ? item.id : item;
            },
            isActive: function(item) {
                return "object" == typeof item ? this.value == item.id : this.value == item;
            }
        }
    });
}), define("text!bc/vue/search.html", [], function() {
    return '<div class="bc-vue-search">\r\n\t<div class="fuzzy" :style="{\'text-align\': align}">\r\n\t\t<div>\r\n\t\t\t<span @click.stop="search" class="search ui-icon ui-icon-search" title="执行查询"></span>\r\n\t\t\t<input debounce="200" @keyup.enter.stop="search" type="text" v-model="value" class="fuzzy ui-widget-content" :placeholder="placeholder" @change.stop>\r\n\t\t\t<span v-if="advanceConfig" @click.stop="toggleAdvance" class="add ui-icon ui-icon-triangle-1-{{showAdvance ? \'n\' : \'s\'}}" title="{{showAdvance ? \'隐藏高级搜索\' : \'显示高级搜索\'}}"></span>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class="advance ui-widget-content" v-if="showAdvance" :style="advanceStyle">\r\n\t\t<ul class="conditions">\r\n\t\t\t<li class="condition" v-for="c in displayConditions">\r\n\t\t\t\t<div class="label">{{c.label}}</div>\r\n\t\t\t\t<div class="value">\r\n\t\t\t\t\t<template v-if="!c.diadic">\r\n\t\t\t\t\t\t<input v-if="!c.tag || c.tag == \'input\'" debounce="200" type="{{getInputType(c)}}" class="value ui-widget-content" v-model="c.value"\r\n\t\t\t\t\t\t\t:step="c.step" :min="c.min" :max="c.max"\r\n\t\t\t\t\t\t\t@keyup.enter.stop="search"\r\n\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t<select v-if="c.tag == \'select\'" class="value ui-widget-content" v-model="c.value"\r\n\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t<option v-for="option in c.options" v-bind:value="option.hasOwnProperty(\'value\') ? option.value : option">\r\n\t\t\t\t\t\t\t\t{{ option.hasOwnProperty(\'value\') ? option.text : option }}\r\n\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</template>\r\n\t\t\t\t\t<template v-if="c.diadic">\r\n\t\t\t\t\t\t<div class="left">\r\n\t\t\t\t\t\t\t<input v-if="!c.tag || c.tag == \'input\'" debounce="200" type="{{getInputType(c)}}" class="value ui-widget-content" v-model="c.value[0]"\r\n\t\t\t\t\t\t\t\t:step="c.step" :min="c.min" :max="c.max"\r\n\t\t\t\t\t\t\t\t@keyup.enter.stop="search"\r\n\t\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t<select v-if="c.tag == \'select\'" class="value ui-widget-content" v-model="c.value[0]"\r\n\t\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t\t<option v-for="option in c.options" v-bind:value="option.hasOwnProperty(\'value\') ? option.value : option">\r\n\t\t\t\t\t\t\t\t\t{{ option.hasOwnProperty(\'value\') ? option.text : option }}\r\n\t\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class="center">～</div>\r\n\t\t\t\t\t\t<div class="right">\r\n\t\t\t\t\t\t\t<input v-if="!c.tag || c.tag == \'input\'" debounce="200" type="{{getInputType(c)}}" class="value ui-widget-content" v-model="c.value[1]"\r\n\t\t\t\t\t\t\t\t:step="c.step" :min="c.min" :max="c.max"\r\n\t\t\t\t\t\t\t\t@keyup.enter.stop="search"\r\n\t\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t<select v-if="c.tag == \'select\'" class="value ui-widget-content" v-model="c.value[1]"\r\n\t\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t\t<option v-for="option in c.options" v-bind:value="option.hasOwnProperty(\'value\') ? option.value : option">\r\n\t\t\t\t\t\t\t\t\t{{ option.hasOwnProperty(\'value\') ? option.text : option }}\r\n\t\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</template>\r\n\t\t\t\t</div>\r\n\t\t\t</li>\r\n\t\t</ul>\r\n\t\t<div class="operate ui-widget-content">\r\n\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="search">\r\n\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-search"></span>\r\n\t\t\t\t<span class="ui-button-text">查询</span>\r\n\t\t\t</button>\r\n\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="clearCondition">\r\n\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-minus"></span>\r\n\t\t\t\t<span class="ui-button-text">清空</span>\r\n\t\t\t</button>\r\n\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="showAdvance = false">\r\n\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span>\r\n\t\t\t\t<span class="ui-button-text">关闭</span>\r\n\t\t\t</button>\r\n\t\t</div>\r\n\t\t<table cellspacing="0" cellpadding="0" style="display:none">\r\n\t\t\t<tbody>\r\n\t\t\t\t<tr v-for="c in displayConditions" class="condition">\r\n\t\t\t\t\t<td class="ui-widget-content">\r\n\t\t\t\t\t\t<select class="id ui-widget-content" v-model="c.id" @change.stop="editCondition(\'id\', c)">\r\n\t\t\t\t\t\t\t<option v-for="cfg in advanceConfig.options" :value="cfg.id">{{cfg.label}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td class="ui-widget-content" style="max-width:7em">\r\n\t\t\t\t\t\t<select class="operator ui-widget-content" v-model="c.operator" @change.stop="editCondition(\'operator\', c)">\r\n\t\t\t\t\t\t\t<option v-for="o in operators(c.id)" :value="o.id">{{o.label}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td class="ui-widget-content">\r\n\t\t\t\t\t\t<input v-if="!c.tag || c.tag == \'input\'" debounce="200" type="{{getInputType(c)}}" class="value ui-widget-content" v-model="c.value"\r\n\t\t\t\t\t\t\t:step="c.step" :min="c.min" :max="c.max"\r\n\t\t\t\t\t\t\t@keyup.enter.stop="search"\r\n\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t<select v-if="c.tag == \'select\'" class="value ui-widget-content" v-model="c.value"\r\n\t\t\t\t\t\t\t@change.stop="editCondition(\'value\', c)">\r\n\t\t\t\t\t\t\t<option v-for="option in c.options" v-bind:value="option.hasOwnProperty(\'value\') ? option.value : option">\r\n\t\t\t\t\t\t\t\t{{ option.hasOwnProperty(\'value\') ? option.text : option }}\r\n\t\t\t\t\t\t\t</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td class="ui-widget-content">\r\n\t\t\t\t\t\t<span @click.stop="deleteCondition($index)" class="delete ui-icon ui-icon-minusthick" title="移除此条件"></span>\r\n\t\t\t\t\t\t<span @click.stop="c.value = \'\'" class="clear ui-icon ui-icon-cancel" title="清空条件值"></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr class="operate">\r\n\t\t\t\t\t<td class="ui-widget-content" colspan="4">\r\n\t\t\t\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="search">\r\n\t\t\t\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-search"></span>\r\n\t\t\t\t\t\t\t<span class="ui-button-text">查询</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="clearCondition">\r\n\t\t\t\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-minus"></span>\r\n\t\t\t\t\t\t\t<span class="ui-button-text">清空</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="addCondition">\r\n\t\t\t\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-plus"></span>\r\n\t\t\t\t\t\t\t<span class="ui-button-text">添加</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" @click.stop="showAdvance = false">\r\n\t\t\t\t\t\t\t<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span>\r\n\t\t\t\t\t\t\t<span class="ui-button-text">关闭</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t</tbody>\r\n\t\t</table>\r\n\t</div>\r\n</div>';
}), define("css!bc/vue/search", [], function() {}), define("bc/vue/search", [ "vue", "text!bc/vue/search.html", "css!bc/vue/search" ], function(Vue, template) {
    "use strict";
    function isDiadic(operator) {
        return /(^\[\]$)|(^\[\)$)|(^\(\]$)|(^\(\)$)/.test(operator);
    }
    function initAdvanceOptions(vm) {
        if (vm.advanceConfig && vm.advanceConfig.options) {
            vm.displayConditions.length = 0;
            var cp;
            vm.advanceConfig.options.forEach(function(option) {
                if (option.diadic = isDiadic(option.operator), option.value = option.diadic ? [] : null, 
                option.default !== !1) {
                    cp = {};
                    for (var key in option) cp[key] = option[key];
                    vm.displayConditions.push(cp);
                }
            });
        }
    }
    var DEFAULT_FUZZY_ID = "fuzzy";
    return Vue.component("bc-search", {
        template: template,
        replace: !0,
        props: {
            placeholder: {
                type: String,
                required: !1
            },
            align: {
                type: String,
                required: !1,
                default: "left"
            },
            quick: {
                type: Boolean,
                required: !1,
                default: !1
            },
            value: {
                type: String,
                required: !1,
                default: ""
            },
            advanceValue: {
                type: Array,
                required: !1
            },
            mixValue: {
                type: Array,
                required: !1
            },
            advanceConfig: {
                type: [ String, Array, Object ],
                required: !1,
                default: null
            }
        },
        data: function() {
            return {
                displayConditions: [],
                showAdvance: !1
            };
        },
        computed: {
            advanceStyle: function() {
                return this.advanceConfig ? {
                    maxHeight: this.advanceConfig.maxHeight,
                    height: this.advanceConfig.height,
                    width: this.advanceConfig.width,
                    maxWidth: this.advanceConfig.maxWidth
                } : null;
            },
            fuzzyValueObj: function() {
                return null !== this.value && "" !== this.value ? [ DEFAULT_FUZZY_ID, this.value ] : null;
            },
            advanceValue_: function() {
                if (!this.advanceConfig) return null;
                var one, value, all = [];
                return this.displayConditions.forEach(function(d) {
                    d.diadic ? (value = [], "" !== d.value[0] && null !== d.value[0] && void 0 !== d.value[0] && (value[0] = d.value[0]), 
                    "" !== d.value[1] && null !== d.value[1] && void 0 !== d.value[1] && (value[1] = d.value[1]), 
                    value.length || (value = null)) : value = "" !== d.value ? d.value : null, d.id && value && (one = [ d.id, value ], 
                    d.type && one.push(d.type), d.operator && (d.type || one.push(null), one.push(d.operator)), 
                    all.push(one));
                }), all.length ? all : null;
            },
            advanceValueStr: function() {
                return this.advanceValue_ ? JSON.stringify(this.advanceValue_) : this.advanceValue_;
            },
            mixValue_: function() {
                var v;
                return v = this.advanceValue_ ? this.fuzzyValueObj ? [].concat(this.advanceValue_, [ this.fuzzyValueObj ]) : [].concat(this.advanceValue_) : this.fuzzyValueObj ? [ this.fuzzyValueObj ] : null;
            }
        },
        created: function() {
            this.$watch("value", function(value, old) {
                this.change();
            }), "string" == typeof this.advanceConfig ? (this.advanceConfig = {
                url: this.advanceConfig
            }, this.hasAdvance = !0) : Array.isArray(this.advanceConfig) ? (this.advanceConfig = {
                options: this.advanceConfig
            }, this.hasAdvance = !0) : "[object Object]" === Object.prototype.toString.call(this.advanceConfig) ? this.hasAdvance = !0 : (this.advanceConfig = null, 
            this.hasAdvance = !1), initAdvanceOptions(this);
        },
        watch: {
            advanceValueStr: function(value, old) {
                this.change();
            }
        },
        ready: function() {
            $(this.$el).on({
                mouseover: function() {
                    $(this).addClass("ui-state-hover");
                },
                mouseout: function() {
                    $(this).removeClass("ui-state-hover");
                }
            }, ".operate button");
        },
        destroyed: function() {
            console.log("[search] destroyed"), $(this.$el).off();
        },
        methods: {
            toggleAdvance: function() {
                var vm = this;
                if (!this.advanceConfig.loading) return this.advanceConfig.options ? void (this.showAdvance = !this.showAdvance) : this.advanceConfig.url ? (vm.advanceConfig.loading = !0, 
                void fetch(this.advanceConfig.url, {
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    credentials: "include"
                }).then(function(res) {
                    return res.ok ? res.json() : res.text().then(function(msg) {
                        throw new Error(msg);
                    });
                }).then(function(options) {
                    Array.isArray(options) ? (vm.advanceConfig.options = options, initAdvanceOptions(vm), 
                    vm.showAdvance = !0) : alert("高级搜索异步返回值不是数组格式！options=%s" + JSON.stringify(options)), 
                    vm.advanceConfig.loading = !1;
                }).catch(function(error) {
                    console.log("[grid] reload error: url=%s, error=%o", vm.url, error);
                    var msg = error.message || "加载高级搜索配置失败！";
                    window.bc && bc.msg ? bc.msg.alert(msg) : alert(msg), vm.advanceConfig.loading = !1;
                })) : void alert("缺少高级搜索的 advanceConfig.url 属性配置");
            },
            change: function() {
                this.mixValue = this.mixValue_, this.advanceValue = this.advanceValue_, this.$dispatch("change", this.value, this.advanceValue, this.mixValue), 
                this.quick && this.$dispatch("search", this.value, this.advanceValue, this.mixValue);
            },
            search: function() {
                this.$dispatch("search", this.value, this.advanceValue_, this.mixValue_);
            },
            operators: function(id) {
                var operators = [ {
                    id: "=",
                    label: "等于"
                }, {
                    id: ">=",
                    label: "大于等于"
                }, {
                    id: "<=",
                    label: "小于等于"
                }, {
                    id: ">",
                    label: "大于"
                }, {
                    id: "<",
                    label: "小于"
                }, {
                    id: "!=",
                    label: "不等于"
                } ], cfg = this.getConditionConfig(id);
                return cfg && cfg.type && "string" != cfg.type || operators.push({
                    id: "@",
                    label: "包含"
                }), operators;
            },
            addCondition: function() {
                this.displayConditions.push({
                    id: null,
                    operator: "=",
                    value: null,
                    type: null
                });
            },
            deleteCondition: function(index) {
                this.displayConditions.splice(index, 1), this.displayConditions.length || (this.showAdvance = !1);
            },
            clearCondition: function() {
                this.displayConditions.forEach(function(c) {
                    c.value = c.diadic ? [] : null;
                });
            },
            getConditionConfig: function(id) {
                if (this.advanceConfig) for (var i = 0; i < this.advanceConfig.length; i++) if (this.advanceConfig[i].id == id) return this.advanceConfig[i];
                return null;
            },
            editCondition: function(type, condition) {
                if ("id" == type) {
                    condition.value = null;
                    var cfg = this.getConditionConfig(condition.id);
                    condition.type = cfg.type;
                }
            },
            getInputType: function(condition) {
                switch (condition.type) {
                  case "datetime":
                    return "datetime-local";

                  case "datetime-local":
                    return "datetime-local";

                  case "date":
                    return "date";

                  case "month":
                    return "month";

                  case "time":
                    return "time";

                  case "int":
                    return "number";

                  case "float":
                    return "number";

                  case "double":
                    return "number";

                  case "long":
                    return "long";

                  case "money":
                    return "number";

                  case "number":
                    return "number";

                  default:
                    return "text";
                }
            }
        }
    });
}), define("css!bc/vue/toolbar", [], function() {}), define("bc/vue/toolbar", [ "vue", "css!bc/vue/toolbar" ], function(Vue) {
    "use strict";
    return Vue.component("bc-toolbar", {
        template: '<div class="bc-vue-toolbar ui-widget-content"><slot></slot></div>',
        replace: !0,
        props: {}
    });
}), define("bc/vue/table-col", [ "vue" ], function(Vue) {
    "use strict";
    return Vue.component("bc-table-col", {
        template1: '<colgroup data-rowspan={{rowspan}}><col v-if="addSn" data-id="_sn" style="width:3em"><col v-for="c in columns" data-id="{{c.id}}" :style="{width:c.width}"><col v-if="addEmpty" data-id="_empty" style="width:auto;min-width:1em;"></colgroup>',
        template: '<colgroup v-if="addSn" data-id="_sn" style="width:3em"></colgroup><colgroup v-for="c in columns" data-id="{{c.id}}" :style="{width:c.width}" span="{{c.children ? c.children.length || 1 : 1}}"><col v-if="c.children" v-for="d in c.children" data-id="{{d.id}}" :style="{width:d.width}"></colgroup><colgroup v-if="addEmpty" data-id="_empty" style="width:auto;min-width:1em;"></colgroup>',
        replace: !0,
        props: {
            columns: {
                type: Array,
                required: !0
            },
            addSn: {
                type: Boolean,
                required: !1,
                default: !1
            },
            addEmpty: {
                type: Boolean,
                required: !1,
                default: !1
            }
        },
        computed: {
            rowspan: function() {
                for (var rowspan = 1, i = 0; i < this.columns.length; i++) if (this.columns[i].children && this.columns[i].children.length) {
                    rowspan = 2;
                    break;
                }
                return rowspan;
            }
        }
    });
}), define("text!bc/vue/page-bar.html", [], function() {
    return '<ul class="bc-page-bar ui-widget-content ui-widget ui-helper-clearfix">\r\n\t<li v-if="refreshable" class="icon ui-state-default ui-corner-all" title="刷新" @click="this.$dispatch(\'change\', \'clickRefresh\', this.pageNo, this.pageSize)">\r\n\t\t<span class="ui-icon ui-icon-refresh"></span>\r\n\t</li>\r\n\t<template v-if="pageable">\r\n\t\t<li class="icons ui-state-default ui-corner-all">\r\n\t\t\t<a href="#" class="icon ui-state-default ui-corner-all" @click.prevent.stop="toPage(1)">\r\n\t\t\t\t<span class="ui-icon ui-icon-seek-first" title="首页"></span>\r\n\t\t\t</a>\r\n\t\t\t<a href="#" class="icon ui-state-default ui-corner-all" @click.prevent.stop="toPage(Math.max((this.pageNo || 1) - 1, 1))">\r\n\t\t\t\t<span class="ui-icon ui-icon-seek-prev" title="上一页"></span>\r\n\t\t\t</a>\r\n\t\t\t<span class="pageNo">\r\n\t\t\t\t<span>{{pageNo || 1}}</span>/<span>{{pageCount}}</span>(<span>{{count}}</span>)\r\n\t\t\t</span>\r\n\t\t\t<a href="#" class="icon ui-state-default ui-corner-all" @click.prevent.stop="toPage(Math.min((this.pageNo || 1) + 1, this.pageCount))">\r\n\t\t\t\t<span class="ui-icon ui-icon-seek-next" title="下一页"></span>\r\n\t\t\t</a>\r\n\t\t\t<a href="#" class="icon ui-state-default ui-corner-all" @click.prevent.stop="toPage(this.pageCount)">\r\n\t\t\t\t<span class="ui-icon ui-icon-seek-end" title="尾页"></span>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li class="icons ui-state-default ui-corner-all" title="每页显示的数量">\r\n\t\t\t<a href="#" v-for="s in pageSizes" class="icon ui-state-default ui-corner-all" :class="{\'ui-state-active\': _pageSize == s}" @click.prevent.stop="changePageSize(s)">\r\n\t\t\t\t<span class="pageSize">{{s}}</span>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t</template>\r\n\t<li v-if="exportable" class="icon ui-state-default ui-corner-all" title="导出" @click="this.$dispatch(\'export\', -1)">\r\n\t\t<span class="ui-icon ui-icon-arrowthickstop-1-s"></span>\r\n\t</li>\r\n\t<li v-if="importable" class="icon ui-state-default ui-corner-all" title="导入" @click="this.$dispatch(\'import\')">\r\n\t\t<span class="ui-icon ui-icon-arrowthickstop-1-n"></span>\r\n\t</li>\r\n</ul>';
}), define("css!bc/vue/page-bar", [], function() {}), define("bc/vue/page-bar", [ "jquery", "vue", "text!bc/vue/page-bar.html", "css!bc/vue/page-bar" ], function($, Vue, template) {
    "use strict";
    var DEFAULT_PAGE_SIZES = [ 25, 50, 100 ];
    return Vue.component("bc-page-bar", {
        template: template,
        replace: !0,
        props: {
            pageable: {
                type: Boolean,
                required: !1,
                default: !1
            },
            pageNo: {
                type: Number,
                required: !1
            },
            pageSize: {
                type: Number,
                required: !1
            },
            pageSizes: {
                type: Array,
                required: !1,
                default: function() {
                    return DEFAULT_PAGE_SIZES;
                }
            },
            count: {
                type: Number,
                required: !1,
                default: 0
            },
            refreshable: {
                type: Boolean,
                required: !1,
                default: !0
            },
            exportable: {
                type: Boolean,
                required: !1,
                default: !1
            },
            importable: {
                type: Boolean,
                required: !1,
                default: !1
            }
        },
        data: function() {
            return {
                pageCount: Math.ceil(this.count / (this.pageSize || DEFAULT_PAGE_SIZES[0]))
            };
        },
        computed: {
            _pageNo: function() {
                return !this.pageNo || this.pageNo <= 0 ? 1 : this.pageNo;
            },
            _pageSize: function() {
                return this.pageSize || DEFAULT_PAGE_SIZES[0];
            }
        },
        ready: function() {
            var $el = $(this.$el);
            $el.on({
                mouseover: function() {
                    $(this).addClass("ui-state-hover");
                },
                mouseout: function() {
                    $(this).removeClass("ui-state-hover");
                }
            }, ".icon");
        },
        beforeDestroy: function() {
            $(this.$el).off();
        },
        watch: {
            count: function(val, oldVal) {
                this.pageCount = Math.ceil(val / (this.pageSize || DEFAULT_PAGE_SIZES[0]));
            }
        },
        methods: {
            toPage: function(pageNo) {
                pageNo = Math.max(1, pageNo) || 1, pageNo != this._pageNo && (this.pageNo = pageNo, 
                this.$dispatch("change", "changePageNo", this.pageNo, this.pageSize));
            },
            changePageSize: function(pageSize) {
                pageSize != this._pageSize && (this.pageNo = Math.floor((this._pageNo - 1) * this._pageSize / pageSize + 1), 
                this.pageSize = pageSize, this.pageCount = Math.ceil(this.count / this.pageSize), 
                this.$dispatch("change", "changePageSize", this.pageNo, this.pageSize));
            }
        }
    });
}), define("css!bc/vue/loading", [], function() {}), define("bc/vue/loading", [ "vue", "css!bc/vue/loading" ], function(Vue) {
    "use strict";
    return Vue.component("bc-loading", {
        template: '<div class="bc-vue-loading-container ui-overlay"><div v-if="maskable" class="mask ui-widget-overlay"></div><div class="actor ui-state-active"' + " :style=\"{'width': size, 'height': size, 'animation-duration': speed, 'margin-top': 'calc('+ size + ' / -2)', 'margin-left': 'calc('+ size + ' / -2)'}\" :class=\"{transparent: transparent}\"></div><div v-if=\"countable\" class=\"counter ui-state-disabled\">{{minutes_}} : {{seconds_}}</div></div>",
        replace: !0,
        props: {
            size: {
                type: String,
                required: !1,
                default: "4.5em"
            },
            speed: {
                type: String,
                required: !1,
                default: "1s"
            },
            maskable: {
                type: Boolean,
                required: !1,
                default: !0
            },
            countable: {
                type: Boolean,
                required: !1,
                default: !1
            },
            transparent: {
                type: Boolean,
                required: !1,
                default: !0
            }
        },
        data: function() {
            return {
                counter: 0,
                minutes: 0,
                seconds: 0
            };
        },
        computed: {
            minutes_: function() {
                return this.minutes < 10 ? "0" + this.minutes : "" + this.minutes;
            },
            seconds_: function() {
                return this.seconds < 10 ? "0" + this.seconds : "" + this.seconds;
            }
        },
        ready: function() {
            var self = this, max = 11;
            setInterval(function() {
                self.seconds++, self.seconds == max && (self.seconds = 0, self.minutes++, self.minutes == max && (self.minutes = 0));
            }, 1e3);
        },
        methods: {
            reset: function() {
                this.minutes = 0, this.seconds = 0;
            }
        }
    });
}), define("text!bc/vue/grid.html", [], function() {
    return '<div class="bc-vue-grid ui-widget-content">\r\n\t<!-- 顶部扩展区 -->\r\n\t<slot name="top"></slot>\r\n\r\n\t<!-- 表头 -->\r\n\t<table class="head" :style="{width:\'100%\',position:\'relative\',\'user-select\':\'initial\',left:v.scrollLeft + \'px\'}">\r\n\t\t<colgroup v-ref:cols is="bc-table-col" :columns="columns" :add-sn="true" :add-empty="true">\r\n\t\t</colgroup>\r\n\t\t<thead>\r\n\t\t\t<tr class="main head ui-widget-content">\r\n\t\t\t\t<th rowspan="{{headRowspan}}" data-id="_sn" class="sn"><input type="checkbox" v-if="!singleChoice" v-model="v.selectAll" title="{{v.selectAll ? \'点击全部不选择\' : \'点击选择全部\'}}" @change.stop></th>\r\n\t\t\t\t<th v-for="c in columns" class="cell text" :class="c.headCellClass" :style="c.headCellStyle" data-id="{{c.id}}" colspan="{{c.children && c.children.length > 0 ? c.children.length : 1}}" rowspan="{{c.children && c.children.length > 0 ? 1 : headRowspan}}">{{c.label}}</th>\r\n\t\t\t\t<th rowspan="{{headRowspan}}" data-id="_empty" class="empty"></th>\r\n\t\t\t</tr>\r\n\t\t\t<!-- 分组的表头 -->\r\n\t\t\t<tr class="sub head ui-widget-content" v-if="headRowspan > 1">\r\n\t\t\t\t<template v-for="c in columns | filterBy isGroupColumn">\r\n\t\t\t\t\t<th v-for="d in c.children" class="cell text" data-id="{{d.id}}">{{d.label}}</th>\r\n\t\t\t\t</template>\r\n\t\t\t</tr>\r\n\t\t</thead>\r\n\t</table>\r\n\r\n\t<!-- 数据 -->\r\n\t<div class="rows" :style="{overflow:\'auto\',\'user-select\':\'initial\'}" @scroll="v.scrollLeft = -1 * $event.target.scrollLeft">\r\n\t\t<table class="rows" style="width:100%">\r\n\t\t\t<colgroup is="bc-table-col" :columns="columns" :add-sn="true" :add-empty="true"></colgroup>\r\n\t\t\t<tbody>\r\n\t\t\t\t<tr class="row" v-for="r in rows" data-id="{{r.id}}" class="{{r.class}}" :class="{\'ui-state-highlight\': r.selected, \'ui-widget-content\': true}"\r\n\t\t\t\t    :style="(typeof rowStyle == \'function\') ? rowStyle(r) : rowStyle">\r\n\t\t\t\t\t<td class="sn" data-id="_sn"><span v-if="r.selected" class="ui-icon ui-icon-check"></span>{{$index + 1}}</td>\r\n\t\t\t\t\t<template v-for="c in columns">\r\n\t\t\t\t\t\t<td v-if="isGroupColumn(c)" v-for="d in c.children" class="cell text" :class="d.rowCellClass" :style="d.rowCellStyle"\r\n\t\t\t\t\t\t    @click.stop.prevent="rowCellClick(r[d.id], r, d)" :title="rowCellTitle(r[d.id], r, d)">\r\n\t\t\t\t\t\t\t<template v-if="d.escape !== false">{{rowCellFilter(r[d.id], r, d)}}</template>\r\n\t\t\t\t\t\t\t<template v-if="d.escape === false">{{{rowCellFilter(r[d.id], r, d)}}}</template>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td v-if="!isGroupColumn(c)" class="cell text" :class="c.rowCellClass" :style="c.rowCellStyle"\r\n\t\t\t\t\t\t    @click.stop.prevent="rowCellClick(r[c.id], r, c)" :title="rowCellTitle(r[c.id], r, c)">\r\n\t\t\t\t\t\t\t<template v-if="c.escape !== false">{{rowCellFilter(r[c.id], r, c)}}</template>\r\n\t\t\t\t\t\t\t<template v-if="c.escape === false">{{{rowCellFilter(r[c.id], r, c)}}}</template>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</template>\r\n\t\t\t\t\t<td class="empty" data-id="_empty"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</tbody>\r\n\t\t</table>\r\n\t</div>\r\n\r\n\t<!-- 分页条 -->\r\n\t<bc-page-bar v-if="showPageBar" style="border-width: 1px 0 0 0" :pageable="pageable" :page-no.sync="pageNo" :page-size.sync="pageSize" :page-sizes.sync="pageSizes" :count.sync="count" :refreshable="refreshable" :exportable="exportable" :importable="importable" @change="reload">\r\n\t</bc-page-bar>\r\n\r\n\t<!-- 加载器 -->\r\n\t<bc-loading v-ref:loading v-if="v.loading"></bc-loading>\r\n\r\n\t<!-- 底部扩展区 -->\r\n\t<slot name="bottom"></slot>\r\n</div>';
}), define("css!bc/vue/grid", [], function() {}), define("bc/vue/grid", [ "vue", "bc/vue/table-col", "bc/vue/page-bar", "text!bc/vue/grid.html", "css!bc/vue/grid", "bc/vue/loading" ], function(Vue, tableCol, pageBar, template) {
    "use strict";
    var exportForm, DEFAULT_PAGE_SIZES = [ 25, 50, 100 ];
    return Vue.component("bc-grid", {
        template: template,
        replace: !0,
        props: {
            singleChoice: {
                type: Boolean,
                required: !1,
                default: !1
            },
            columns: {
                type: Array,
                required: !1,
                default: function() {
                    return [];
                }
            },
            rows: {
                type: Array,
                required: !1,
                default: function() {
                    return [];
                }
            },
            url: {
                type: String,
                required: !1
            },
            rowStyle: {
                type: Function,
                required: !1
            },
            query: {
                required: !1
            },
            queryKey: {
                type: String,
                required: !1,
                default: "query"
            },
            method: {
                type: [ String, Function ],
                required: !1
            },
            beforeReload: {
                type: Function,
                required: !1
            },
            showPageBar: {
                type: Boolean,
                required: !1,
                default: !0
            },
            pageable: {
                type: Boolean,
                required: !1,
                default: !1
            },
            pageNo: {
                type: Number,
                required: !1
            },
            pageSize: {
                type: Number,
                required: !1
            },
            pageSizes: {
                type: Array,
                required: !1,
                default: function() {
                    return DEFAULT_PAGE_SIZES;
                }
            },
            count: {
                type: Number,
                required: !1,
                default: 0
            },
            refreshable: {
                type: Boolean,
                required: !1,
                default: !0
            },
            exportable: {
                type: Boolean,
                required: !1,
                default: !1
            },
            importable: {
                type: Boolean,
                required: !1,
                default: !1
            },
            cellFilter: {
                type: Function,
                required: !1
            },
            autoLoad: {
                type: Boolean,
                required: !1,
                default: !0
            }
        },
        computed: {
            selection: function() {
                if (!this.singleChoice) {
                    for (var ss = [], i = 0; i < this.rows.length; i++) this.rows[i].selected && ss.push(this.rows[i]);
                    return ss;
                }
                for (var i = 0; i < this.rows.length; i++) if (this.rows[i].selected) return this.rows[i];
            },
            headRowspan: function() {
                return this.$refs.cols ? this.$refs.cols.rowspan : 1;
            }
        },
        data: function() {
            return {
                v: {
                    scrollLeft: 0,
                    loading: !1,
                    selectAll: !1
                }
            };
        },
        watch: {
            "v.selectAll": function(value, old) {
                var vm = this;
                this.rows.forEach(function(row, index) {
                    row.hasOwnProperty("selected") ? row.selected = value : vm.$set("rows[" + index + "].selected", value);
                });
            }
        },
        ready: function() {
            var delaying, timer, cancelClick, $el = $(this.$el), vm = this;
            $el.on({
                mouseover: function() {
                    $(this).addClass("ui-state-hover");
                },
                mouseout: function() {
                    $(this).removeClass("ui-state-hover");
                },
                click: function() {
                    delaying && clearTimeout(timer), delaying = !0;
                    var rowIndex = this.rowIndex;
                    timer = setTimeout(function() {
                        if (delaying = !1, cancelClick) return void (cancelClick = !1);
                        if (vm.singleChoice) for (var i = 0; i < vm.rows.length; i++) i != rowIndex && vm.rows[i].selected && (vm.rows[i].selected = !1);
                        var row = vm.rows[rowIndex];
                        row.hasOwnProperty("selected") ? vm.rows[rowIndex].selected = !vm.rows[rowIndex].selected : vm.$set("rows[" + rowIndex + "].selected", !0), 
                        delaying = !1;
                    }, 200);
                },
                dblclick: function() {
                    cancelClick = !0, vm.$dispatch("dblclick-row", vm.rows[this.rowIndex], this.rowIndex);
                }
            }, "tr.row"), this.autoLoad && this.reload();
        },
        methods: {
            changePageBar: function(type, pageNo, pageSize) {
                this.reload();
            },
            reload: function() {
                if (this.url) {
                    this.v.loading = !0;
                    var params = {};
                    if (this.pageable && (this.pageNo && (params.pageNo = this.pageNo), this.pageSize && (params.pageSize = this.pageSize)), 
                    this.query) if (Array.isArray(this.query)) params[this.queryKey] = JSON.stringify(this.query); else if ("object" == typeof this.query) {
                        var q = this.query;
                        Object.keys(q).forEach(function(key) {
                            var v = q[key], t = typeof v;
                            null !== v && "" !== v && "undefined" !== t && (params[key] = v);
                        });
                    } else "string" == typeof this.query && (params[this.queryKey] = this.query);
                    var vm = this, url = this.url, settings = {
                        method: "function" == typeof this.method ? this.method() : this.method || "GET",
                        credentials: "include"
                    };
                    if ("POST" == settings.method) settings.headers = {
                        "Content-Type": "application/json;charset=utf-8"
                    }, settings.body = JSON.stringify(params); else if ("GET" == settings.method) {
                        var s = [];
                        Object.keys(params).forEach(function(key) {
                            s.push(key + "=" + params[key]);
                        }), s.length && (url += "?" + s.join("&"));
                    }
                    return this.beforeReload && this.beforeReload(settings) === !1 ? void (vm.v.loading = !1) : void fetch(url, settings).then(function(res) {
                        return res.ok ? res.json() : res.text().then(function(msg) {
                            throw new Error(msg);
                        });
                    }).then(function(j) {
                        j.columns && vm.$set("columns", j.columns), j.rows && vm.$set("rows", j.rows), vm.pageable && (j.pageNo && vm.$set("pageNo", j.pageNo), 
                        j.pageSize && vm.$set("pageSize", j.pageSize), j.pageSizes && vm.$set("pageSizes", j.pageSizes), 
                        j.count && vm.$set("count", j.count)), vm.showPageBar && (j.hasOwnProperty("refreshable") && vm.$set("refreshable", j.refreshable), 
                        j.hasOwnProperty("exportable") && vm.$set("exportable", j.exportable), j.hasOwnProperty("importable") && vm.$set("importable", j.importable)), 
                        j.hasOwnProperty("singleChoice") && vm.$set("singleChoice", j.singleChoice), vm.$dispatch("after-reload", j), 
                        vm.v.loading = !1;
                    }).catch(function(error) {
                        console.log("[grid] reload error: url=%s, error=%o", vm.url, error);
                        var msg = error.message || "[grid] 数据加载失败！";
                        bc.msg ? bc.msg.alert(msg) : alert(msg), vm.v.loading = !1;
                    });
                }
            },
            isGroupColumn: function(column) {
                return !(!column.children || !column.children.length);
            },
            rowCellFilter: function(value, row, column) {
                if (!column.filter) return value;
                if ("string" == typeof column.filter) {
                    var cfg = column.filter.split(" "), filter = Vue.filter(cfg[0]);
                    filter || console.error("filter '%s' not found (column=%s)", cfg[0], column.id);
                    var args = cfg.slice(1);
                    return args.unshift(value), filter.apply(this, args);
                }
                return "function" == typeof column.filter ? column.filter(value, row, column) : void 0;
            },
            rowCellTitle: function(value, row, column) {
                if (column.title) return "function" == typeof column.title ? column.title(value, row, column) : value;
            },
            rowCellClick: function(value, row, column) {
                column.rowCellClick && column.rowCellClick(value, row, column);
            },
            getExportForm: function() {
                return exportForm || (exportForm = $('<form name="bc-vue-grid-exporter" method="get" style="display:none"></form>')[0]), 
                exportForm;
            }
        }
    });
}), define("bc/vue/components", [ "bc/vue/theme", "bc/vue/button", "bc/vue/button-set", "bc/vue/search", "bc/vue/toolbar", "bc/vue/table-col", "bc/vue/page-bar", "bc/vue/loading", "bc/vue/grid" ], function() {
    return 0;
}), function(c) {
    var d = document, a = "appendChild", i = "styleSheet", s = d.createElement("style");
    s.type = "text/css", d.getElementsByTagName("head")[0][a](s), s[i] ? s[i].cssText = c : s[a](d.createTextNode(c));
}(".bc-vue-search{position:relative;display:inline-block;}.bc-vue-search > .fuzzy > div{display:inline-block;position:relative;}.bc-vue-search > .fuzzy .search{position:absolute;top:50%;margin-top:-8px;left:2px;cursor:pointer;}.bc-vue-search > .fuzzy input.fuzzy{box-sizing:border-box;padding:.34em 18px;width:12em;font-family:inherit;font-size:1em;}.bc-vue-search > .fuzzy .add{position:absolute;top:50%;margin-top:-8px;right:2px;cursor:pointer;}.bc-vue-search > .advance{position:relative;margin-top:-2px;background-image:none;z-index:90;overflow:auto;display:flex;flex-direction:column;}.bc-vue-search > .advance > .conditions{border-collapse:collapse;margin:0;padding:0;list-style:none;overflow:auto;flex-grow:1;min-width:20em;}.bc-vue-search .operate{padding:0.4em;border-width:1px 0 0 0;}.bc-vue-search .condition{margin:0.4em;}.bc-vue-search .condition .label{opacity:0.8;}.bc-vue-search .condition .value{position:relative;display:flex;flex-direction:row;}.bc-vue-search .condition .value > div{display:inline-block;}.bc-vue-search .condition .value > div.left,.bc-vue-search .condition .value > div.right{flex-grow:1;background-color:gray;}.bc-vue-search .condition .value input,.bc-vue-search .condition .value select{box-sizing:border-box;min-width:9em;width:100%;padding:.34em 0 .34em .34em;font-family:inherit;font-size:1em;}.bc-vue-search .condition .value input{padding-left:calc(0.34em + 4px);}.bc-vue-search .condition .value .left,.bc-vue-search .condition .value .right{position:relative;}.bc-vue-search .operate button{font-family:inherit;}.bc-vue-toolbar{position:relative;padding:0;min-height:2.2em;word-spacing:-0.4em;font-weight:normal;}.bc-vue-toolbar > *{word-spacing:normal;font-family:inherit;font-size:1em;margin:0.2em;}.bc-vue-toolbar > .bc-vue-search{position:absolute;top:0.05em;right:0.06em;}.bc-vue-toolbar > .bc-vue-search:first-child{position:relative;margin-left:0.3em;}.bc-page-bar{clear:both;display:block;margin:0;padding:0;}.bc-page-bar li{list-style:none;cursor:default;position:relative;margin:0.2em;padding:4px 0;float:left;}.bc-page-bar .icon{cursor:pointer;}.bc-page-bar li span.ui-icon{float:left;margin:0 4px;}.bc-page-bar .icons{padding:2px 2px;}.bc-page-bar .icons a.icon{margin:0;border:0;}.bc-page-bar .icons span.ui-icon{margin:2px;}.bc-page-bar li span.pageNo,.bc-page-bar li span.pageSize{float:left;height:16px;font-size:12px;}.bc-page-bar li span.pageNo{margin:2px 4px;cursor:default;}.bc-page-bar li span.pageSize{margin:2px 4px;}.bc-page-bar li a{float:left;display:block;}.bc-vue-loading-container{position:absolute;top:0;left:0;width:100%;height:100%;}.bc-vue-loading-container > .counter,.bc-vue-loading-container > .actor{position:absolute;box-sizing:border-box;top:50%;left:50%;}.bc-vue-loading-container > .counter{width:6em;height:2em;line-height:2em;text-align:center;margin:-1em auto auto -3em;border:none;background:none;}.bc-vue-loading-container > .actor{opacity:0.8;width:3.5em;height:3.5em;margin:-1.75em auto auto -1.75em;border-width:0.5em;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:bc-vue-loading-spin 1000ms infinite linear;}.bc-vue-loading-container > .actor.transparent{background:none;}@keyframes bc-vue-loading-spin{100%{transform:rotate(360deg);transform:rotate(360deg);}}.bc-page > .bc-vue-grid,.bc-vue-grid.fillup{position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;}.bc-page > .bc-vue-grid,.bc-vue-grid.noborder{border-width:0;}.bc-vue-grid.border{border-width:1px;}.bc-vue-grid > .bc-vue-toolbar{border-width:0 0 1px 0;}.bc-vue-grid{display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box;position:relative;font-weight:normal;}.bc-vue-grid > *{flex:none;}.bc-vue-grid > div.rows{flex:1 1 0%;}.bc-vue-grid table.head,.bc-vue-grid table.rows{table-layout:fixed;border-collapse:collapse;}.bc-vue-grid table.rows{margin-bottom:-1px;}.bc-vue-grid tr.head > th{font-weight:inherit;}.bc-vue-grid tr.head,.bc-vue-grid tr.row{height:2em;}.bc-vue-grid td.cell{text-align:left;white-space:normal;word-wrap:break-word;word-break:break-all;}.bc-vue-grid td.sn{text-align:center;cursor:default;}.bc-vue-grid td.sn > .ui-icon-check{display:inline-block;}.bc-vue-grid tr.main.head,.bc-vue-grid tr.row{border-width:1px 0 1px 0;}.bc-vue-grid tr.main.head:first-child,.bc-vue-grid tr.row:first-child,.bc-vue-grid tr.main.head:first-child > th,.bc-vue-grid tr.row:first-child > td{border-top:none;}.bc-vue-grid tr.main.head >:first-child,.bc-vue-grid tr.row >:first-child{border-left:none;}.bc-vue-grid tr.main.head >:last-child,.bc-vue-grid tr.row >:last-child{border-right:none;}.bc-vue-grid tr.head > *,.bc-vue-grid tr.row > *{padding:0;border-width:1px;border-color:inherit;border-style:inherit;}.bc-vue-grid td.cell.text,.bc-vue-grid th.cell.text{padding:0 0.4em;}");