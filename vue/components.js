/*! BC 平台的 vue 组件
 * @author dragon <rongjihuang@gmail.com>
 * @version 0.1.0 2016-07-08
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
    return Vue.component("bc-theme", {
        template: '<div class="ui-widget-content" style="margin:0.2em;padding:0.2em;font-size:16px;position:absolute;right:1em;top:0">字体大小：<input type="number" min="{{min}}" max="{{max}}" step="{{step}}" v-model="size"  style="width:3em"/><label><input type="radio" value="em" v-model="unit">em</label><label><input type="radio" value="px" v-model="unit">px</label></div>',
        replace: !0,
        props: {
            size: {
                type: Number,
                required: !1,
                "default": 1,
                twoWay: !0
            },
            unit: {
                type: String,
                required: !1,
                "default": "em",
                twoWay: !0
            }
        },
        created: function() {},
        data: function() {
            return {
                size: 16,
                unit: "px",
                min: 4,
                max: 24,
                step: 1
            };
        },
        watch: {
            unit: function(value, old) {
                "em" == value ? (this.size = 1, this.min = .2, this.max = 2, this.step = .1) : (this.size = 16, 
                this.min = 4, this.max = 24, this.step = 1);
            },
            size: function(value, old) {
                this.change();
            }
        },
        ready: function() {
            "em" == this.unit ? (this.min = .2, this.max = 2, this.step = .1) : (this.min = 1, 
            this.max = 32, this.step = 1), this.change();
        },
        methods: {
            change: function() {
                console.log("[theme] change font-size=%s%s", this.size, this.unit), document.body.style.fontSize = this.size + this.unit, 
                this.$dispatch("change", this.size, this.unit);
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
                "default": "　",
                twoWay: !0
            },
            iconClass: {
                type: String,
                required: !1,
                twoWay: !0
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
        template: '<div class="bc-vue-button-set ui-buttonset" style="display:inline-block"><div v-for="i in items" data-id="{{i.hasOwnProperty(\'id\') ? i.id : $index}}" class="ui-button ui-widget ui-state-default ui-button-text-only" style="font-family:inherit"' + " :class=\"{'ui-corner-left': $index == 0, 'ui-corner-right': $index == items.length - 1, 'ui-state-active': isActive(i)}\" :style=\"{'margin-right': '-1px', 'z-index': value == i.id ? items.length : 0}\"><span class=\"ui-button-text\" @click=\"clickItem(i, $index)\">{{i.label || i}}</span></div></div>",
        replace: !0,
        props: {
            items: {
                type: Array,
                required: !0,
                twoWay: !0
            },
            value: {
                required: !1,
                "default": null,
                twoWay: !0
            }
        },
        created: function() {
            if (null === this.value) for (var i = 0; i < this.items.length; i++) if (this.items[i].active) {
                this.value = this.items[i].id;
                break;
            }
            console.log("[button-set] created value=%s", this.value);
        },
        watch: {
            value: function(value, old) {
                console.log("[button-set] change new=%s, old=%s", value, old), this.$dispatch("change", value, old);
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
}), define("bc/vue/search", [ "vue" ], function(Vue) {
    "use strict";
    return Vue.component("bc-search", {
        template: '<div class="bc-vue-search" style="position:relative;display:inline-block"><span @click="search" class="ui-icon ui-icon-search" title="点击执行查询" style="position:absolute;top:50%;margin-top:-8px;left:2px;cursor:pointer"></span><input debounce="200" @keyup.enter="search" type="text" v-model="value" class="ui-widget-content" style="padding:.4em 18px;width:12em;min-height:1em;font-family:inherit;font-size:1.1em" :placeholder="placeholder"><span v-if="advanced" @click="showAdvanced" class="ui-icon ui-icon-triangle-1-s" title="点击显示更多查询条件" style="position:absolute;top:50%;margin-top:-8px;right:2px;cursor:pointer"></span></div>',
        replace: !0,
        props: {
            placeholder: {
                type: String,
                required: !1,
                twoWay: !0
            },
            value: {
                type: String,
                required: !1,
                twoWay: !0
            },
            advanced: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            },
            quickSearch: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            }
        },
        watch: {
            value: function(value, old) {
                this.$dispatch("change", value, old), this.quickSearch && this.$dispatch("search", value);
            }
        },
        methods: {
            search: function() {
                this.$dispatch("search", this.value);
            },
            showAdvanced: function() {
                console.log("[search] showAdvanced");
            }
        }
    });
}), define("css!bc/vue/toolbar", [], function() {}), define("bc/vue/toolbar", [ "vue", "css!bc/vue/toolbar" ], function(Vue) {
    "use strict";
    return Vue.component("bc-toolbar", {
        template: '<div class="bc-vue-toolbar ui-widget-content" style=""><slot></slot></div>',
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
                required: !0,
                twoWay: !0
            },
            addSn: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !1
            },
            addEmpty: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !1
            }
        },
        created: function() {},
        computed: {
            rowspan: function() {
                for (var rowspan = 1, i = 0; i < this.columns.length; i++) if (this.columns[i].children && this.columns[i].children.length) {
                    rowspan = 2;
                    break;
                }
                return rowspan;
            }
        },
        ready: function() {}
    });
}), define("text!bc/vue/page-bar.html", [], function() {
    return '<ul class="bc-page-bar ui-widget-content ui-widget ui-helper-clearfix">\r\n	<li v-if="refreshable" class="icon ui-state-default ui-corner-all" title="刷新" @click="this.$dispatch(\'change\', \'clickRefresh\', this.pageNo, this.pageSize)">\r\n		<span class="ui-icon ui-icon-refresh"></span>\r\n	</li>\r\n	<template v-if="pageable">\r\n		<li class="icons ui-state-default ui-corner-all">\r\n			<a href="#" class="icon ui-state-default ui-corner-all" @click="toPage(1)">\r\n				<span class="ui-icon ui-icon-seek-first" title="首页"></span>\r\n			</a>\r\n			<a href="#" class="icon ui-state-default ui-corner-all" @click="toPage(Math.max(this.pageNo - 1, 1))">\r\n				<span class="ui-icon ui-icon-seek-prev" title="上一页"></span>\r\n			</a>\r\n			<span class="pageNo">\r\n				<span>{{pageNo}}</span>/<span>{{pageCount}}</span>(<span>{{count}}</span>)\r\n			</span>\r\n			<a href="#" class="icon ui-state-default ui-corner-all" @click="toPage(Math.min(this.pageNo + 1, this.pageCount))">\r\n				<span class="ui-icon ui-icon-seek-next" title="下一页"></span>\r\n			</a>\r\n			<a href="#" class="icon ui-state-default ui-corner-all" @click="toPage(this.pageCount)">\r\n				<span class="ui-icon ui-icon-seek-end" title="尾页"></span>\r\n			</a>\r\n		</li>\r\n		<li class="icons ui-state-default ui-corner-all" title="每页显示的数量">\r\n			<a href="#" v-for="s in pageSizes" class="icon ui-state-default ui-corner-all" :class="{\'ui-state-active\': pageSize == s}" @click="changePageSize(s)">\r\n				<span class="pageSize">{{s}}</span>\r\n			</a>\r\n		</li>\r\n	</template>\r\n	<li v-if="exportable" class="icon ui-state-default ui-corner-all" title="导出" @click="this.$dispatch(\'export\', -1)">\r\n		<span class="ui-icon ui-icon-arrowthickstop-1-s"></span>\r\n	</li>\r\n	<li v-if="importable" class="icon ui-state-default ui-corner-all" title="导入" @click="this.$dispatch(\'import\')">\r\n		<span class="ui-icon ui-icon-arrowthickstop-1-n"></span>\r\n	</li>\r\n</ul>';
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
                "default": !1,
                twoWay: !0
            },
            pageNo: {
                type: Number,
                required: !1,
                "default": 1,
                twoWay: !0
            },
            pageSize: {
                type: Number,
                required: !1,
                "default": DEFAULT_PAGE_SIZES[0],
                twoWay: !0
            },
            pageSizes: {
                type: Array,
                required: !1,
                "default": DEFAULT_PAGE_SIZES,
                twoWay: !0
            },
            count: {
                type: Number,
                required: !1,
                "default": 0,
                twoWay: !0
            },
            refreshable: {
                type: Boolean,
                required: !1,
                "default": !0,
                twoWay: !0
            },
            exportable: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            },
            importable: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            }
        },
        data: function() {
            return {
                pageCount: Math.ceil(this.count / this.pageSize)
            };
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
                this.pageCount = Math.ceil(val / this.pageSize);
            }
        },
        methods: {
            toPage: function(pageNo) {
                pageNo = Math.max(1, pageNo), pageNo != this.pageNo && (console.log("[PageBar] toPage: new=%s, old=%s", pageNo, this.pageNo), 
                this.pageNo = pageNo, this.$dispatch("change", "changePageNo", this.pageNo, this.pageSize));
            },
            changePageSize: function(pageSize) {
                pageSize != this.pageSize && (console.log("[PageBar] changePageSize: new=%s, old=%s", pageSize, this.pageSize), 
                this.pageNo = this.pageNo < 2 ? this.pageNo : Math.floor((this.pageNo - 1) * this.pageSize / pageSize + 1), 
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
                "default": "4.5em",
                twoWay: !0
            },
            speed: {
                type: String,
                required: !1,
                "default": "1s",
                twoWay: !0
            },
            maskable: {
                type: Boolean,
                required: !1,
                "default": !0,
                twoWay: !0
            },
            countable: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            },
            transparent: {
                type: Boolean,
                required: !1,
                "default": !0,
                twoWay: !0
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
    return '<div class="bc-vue-grid ui-widget-content" data-rowspan="{{$refs.cols.rowspan}}">\r\n	<!-- 顶部扩展区 -->\r\n	<slot name="top"></slot>\r\n\r\n	<!-- 表头 -->\r\n	<table class="head" :style="{width:\'100%\',position:\'relative\',\'user-select\':\'initial\',left:v.scrollLeft + \'px\'}">\r\n		<colgroup v-ref:cols is="bc-table-col" :columns="columns" :add-sn="true" :add-empty="true">\r\n		</colgroup>\r\n		<thead>\r\n			<tr class="main head ui-widget-content">\r\n				<th rowspan="{{$refs.cols.rowspan}}" data-id="_sn" class="sn"><input type="checkbox" v-if="!singleChoice" v-model="v.selectAll" title="{{v.selectAll ? \'点击全部不选择\' : \'点击选择全部\'}}"></th>\r\n				<th v-for="c in columns" class="cell text" :class="c.headCellClass" :style="c.headCellStyle" data-id="{{c.id}}" colspan="{{c.children && c.children.length > 0 ? c.children.length : 1}}" rowspan="{{c.children && c.children.length > 0 ? 1 : $refs.cols.rowspan}}">{{c.label}}</th>\r\n				<th rowspan="{{$refs.cols.rowspan}}" data-id="_empty" class="empty"></th>\r\n			</tr>\r\n			<!-- 分组的表头 -->\r\n			<tr class="sub head ui-widget-content" v-if="$refs.cols.rowspan > 1">\r\n				<template v-for="c in columns | filterBy isGroupColumn">\r\n					<th v-for="d in c.children" class="cell text" data-id="{{d.id}}">{{d.label}}</th>\r\n				</template>\r\n			</tr>\r\n		</thead>\r\n	</table>\r\n\r\n	<!-- 数据 -->\r\n	<div class="rows" :style="{overflow:\'auto\',\'user-select\':\'initial\'}" @scroll="v.scrollLeft = -1 * $event.target.scrollLeft">\r\n		<table class="rows" style="width:100%">\r\n			<colgroup is="bc-table-col" :columns="columns" :add-sn="true" :add-empty="true"></colgroup>\r\n			<tbody>\r\n				<tr class="row" v-for="r in rows" data-id="{{r.id}}" class="{{r.class}}" :class="{\'ui-state-highlight\': r.selected, \'ui-widget-content\': true}" style="{{r.style}}">\r\n					<td class="sn" data-id="_sn"><span v-if="r.selected" class="ui-icon ui-icon-check"></span>{{$index + 1}}</td>\r\n					<template v-for="c in columns">\r\n						<td v-if="isGroupColumn(c)" v-for="d in c.children" class="cell text" :class="d.rowCellClass" :style="d.rowCellStyle" data-id="{{d.id}}">{{r[d.id]}}</td>\r\n						<td v-if="!isGroupColumn(c)" class="cell text" :class="c.rowCellClass" :style="c.rowCellStyle" data-id="{{c.id}}">{{r[c.id]}}</td>\r\n					</template>\r\n					<td class="empty" data-id="_empty"></td>\r\n				</tr>\r\n			</tbody>\r\n		</table>\r\n	</div>\r\n\r\n	<!-- 分页条 -->\r\n	<bc-page-bar v-if="showPageBar" style="border-width: 1px 0 0 0" :pageable="pageable" :page-no.sync="pageNo" :page-size.sync="pageSize" :page-sizes.sync="pageSizes" :count.sync="count" :refreshable="refreshable" :exportable="exportable" :importable="importable" @change="reload">\r\n	</bc-page-bar>\r\n\r\n	<!-- 加载器 -->\r\n	<bc-loading v-ref:loading v-if="v.loading"></bc-loading>\r\n\r\n	<!-- 底部扩展区 -->\r\n	<slot name="bottom"></slot>\r\n</div>';
}), define("css!bc/vue/grid", [], function() {}), define("bc/vue/grid", [ "jquery", "vue", "bc/vue/table-col", "bc/vue/page-bar", "text!bc/vue/grid.html", "css!bc/vue/grid", "bc/vue/loading" ], function($, Vue, tableCol, pageBar, template) {
    "use strict";
    var DEFAULT_PAGE_SIZES = [ 25, 50, 100 ];
    return Vue.component("bc-grid", {
        template: template,
        replace: !0,
        components: {},
        props: {
            singleChoice: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            },
            columns: {
                type: Array,
                required: !1,
                twoWay: !0
            },
            rows: {
                type: Array,
                required: !1,
                twoWay: !0
            },
            url: {
                type: String,
                required: !1,
                twoWay: !0
            },
            condition: {
                required: !1,
                twoWay: !0
            },
            showPageBar: {
                type: Boolean,
                required: !1,
                "default": !0,
                twoWay: !0
            },
            pageable: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            },
            pageNo: {
                type: Number,
                required: !1,
                "default": 1,
                twoWay: !0
            },
            pageSize: {
                type: Number,
                required: !1,
                "default": DEFAULT_PAGE_SIZES[0],
                twoWay: !0
            },
            pageSizes: {
                type: Array,
                required: !1,
                "default": DEFAULT_PAGE_SIZES,
                twoWay: !0
            },
            count: {
                type: Number,
                required: !1,
                "default": 0,
                twoWay: !0
            },
            refreshable: {
                type: Boolean,
                required: !1,
                "default": !0,
                twoWay: !0
            },
            exportable: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            },
            importable: {
                type: Boolean,
                required: !1,
                "default": !1,
                twoWay: !0
            },
            autoLoad: {
                type: Boolean,
                required: !1,
                "default": !0,
                twoWay: !0
            }
        },
        computed: {
            selection: function() {
                if (!this.singleChoice) {
                    for (var ss = [], i = 0; i < this.rows.length; i++) this.rows[i].selected && ss.push(this.rows[i]);
                    return ss;
                }
                for (var i = 0; i < this.rows.length; i++) if (this.rows[i].selected) return this.rows[i];
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
                    cancelClick = !0, vm.$dispatch("dblclick-row", vm.rows[this.rowIndex], this.rowIndex), 
                    stopPrope();
                }
            }, "tr.row"), this.autoLoad && this.reload();
        },
        methods: {
            changePageBar: function(type, pageNo, pageSize) {
                console.log("[grid] changePageBar: type=%s, pageNo=%d, pageSize=%d", type, pageNo, pageSize), 
                this.reload();
            },
            reload: function() {
                if (this.url) {
                    this.v.loading = !0;
                    var params = {
                        pageNo: this.pageNo,
                        pageSize: this.pageSize
                    };
                    this.condition && ("object" == typeof this.condition ? Object.assign(params, this.condition) : "string" == typeof this.condition && (params.condition = this.condition)), 
                    console.log("[grid] reload url=%s, params=%o", this.url, params);
                    var vm = this;
                    $.getJSON(this.url, params).then(function(j) {
                        j.columns && vm.$set("columns", j.columns), j.rows && vm.$set("rows", j.rows), vm.pageable && (j.pageNo && vm.$set("pageNo", j.pageNo), 
                        j.pageSize && vm.$set("pageSize", j.pageSize), j.pageSizes && vm.$set("pageSizes", j.pageSizes), 
                        j.count && vm.$set("count", j.count)), vm.showPageBar && (j.hasOwnProperty("refreshable") && vm.$set("refreshable", j.refreshable), 
                        j.hasOwnProperty("exportable") && vm.$set("exportable", j.exportable), j.hasOwnProperty("importable") && vm.$set("importable", j.importable)), 
                        j.hasOwnProperty("singleChoice") && vm.$set("singleChoice", j.singleChoice);
                    }, function(error) {
                        console.log("[grid] reload error: url=%s, error=%o", vm.url, error), alert("[grid] 数据加载失败！");
                    }).always(function() {
                        vm.v.loading = !1;
                    });
                }
            },
            isGroupColumn: function(column) {
                return !(!column.children || !column.children.length);
            }
        },
        watch: {
            "v.selectAll": function(value, old) {
                var vm = this;
                this.rows.forEach(function(row, index) {
                    row.hasOwnProperty("selected") ? row.selected = value : vm.$set("rows[" + index + "].selected", value);
                });
            }
        }
    });
}), define("bc/vue/components", [ "bc/vue/theme", "bc/vue/button", "bc/vue/button-set", "bc/vue/search", "bc/vue/toolbar", "bc/vue/table-col", "bc/vue/page-bar", "bc/vue/loading", "bc/vue/grid" ], function() {
    return 0;
}), function(c) {
    var d = document, a = "appendChild", i = "styleSheet", s = d.createElement("style");
    s.type = "text/css", d.getElementsByTagName("head")[0][a](s), s[i] ? s[i].cssText = c : s[a](d.createTextNode(c));
}(".bc-vue-toolbar{position:relative;padding:0;min-height:2em;word-spacing:-0.4em;font-weight:normal;}.bc-vue-toolbar > *{word-spacing:normal;font-family:inherit;margin:0.2em;}.bc-vue-toolbar > .bc-vue-search{float:right}.bc-page-bar{clear:both;display:block;margin:0;padding:0;}.bc-page-bar li{list-style:none;cursor:default;position:relative;margin:0.2em;padding:4px 0;float:left;}.bc-page-bar .icon{cursor:pointer;}.bc-page-bar li span.ui-icon{float:left;margin:0 4px;}.bc-page-bar .icons{padding:2px 2px;}.bc-page-bar .icons a.icon{margin:0;border:0;}.bc-page-bar .icons span.ui-icon{margin:2px;}.bc-page-bar li span.pageNo,.bc-page-bar li span.pageSize{float:left;height:16px;font-size:12px;}.bc-page-bar li span.pageNo{margin:2px 4px;cursor:default;}.bc-page-bar li span.pageSize{margin:2px 4px;}.bc-page-bar li a{float:left;display:block;}.bc-vue-loading-container{position:absolute;top:0;left:0;width:100%;height:100%;}.bc-vue-loading-container > .counter,.bc-vue-loading-container > .actor{position:absolute;box-sizing:border-box;top:50%;left:50%;}.bc-vue-loading-container > .counter{width:6em;height:2em;line-height:2em;text-align:center;margin:-1em auto auto -3em;border:none;background:none;}.bc-vue-loading-container > .actor{opacity:0.8;width:3.5em;height:3.5em;margin:-1.75em auto auto -1.75em;border-width:0.5em;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:bc-vue-loading-spin 1000ms infinite linear;}.bc-vue-loading-container > .actor.transparent{background:none;}@keyframes bc-vue-loading-spin{100%{transform:rotate(360deg);transform:rotate(360deg);}}.bc-page > .bc-vue-grid,.bc-vue-grid.fillup{position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;}.bc-page > .bc-vue-grid,.bc-vue-grid.noborder{border-width:0;}.bc-vue-grid.border{border-width:1px;}.bc-vue-grid > .bc-vue-toolbar{border-width:0 0 1px 0;}.bc-vue-grid{display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box;position:relative;font-weight:normal;}.bc-vue-grid > *{flex:none;}.bc-vue-grid > div.rows{flex:1 1 0%;}.bc-vue-grid table.head,.bc-vue-grid table.rows{table-layout:fixed;border-collapse:collapse;}.bc-vue-grid table.rows{margin-bottom:-1px;}.bc-vue-grid tr.head > th{font-weight:inherit;}.bc-vue-grid tr.head,.bc-vue-grid tr.row{height:2em;}.bc-vue-grid td.cell{text-align:left;white-space:normal;word-wrap:break-word;word-break:break-all;}.bc-vue-grid td.sn{text-align:center;cursor:default;}.bc-vue-grid td.sn > .ui-icon-check{display:inline-block;}.bc-vue-grid tr.main.head,.bc-vue-grid tr.row{border-width:1px 0 1px 0;}.bc-vue-grid tr.main.head:first-child,.bc-vue-grid tr.row:first-child,.bc-vue-grid tr.main.head:first-child > th,.bc-vue-grid tr.row:first-child > td{border-top:none;}.bc-vue-grid tr.main.head >:first-child,.bc-vue-grid tr.row >:first-child{border-left:none;}.bc-vue-grid tr.main.head >:last-child,.bc-vue-grid tr.row >:last-child{border-right:none;}.bc-vue-grid tr.head > *,.bc-vue-grid tr.row > *{padding:0;border-width:1px;border-color:inherit;border-style:inherit;}.bc-vue-grid td.cell.text,.bc-vue-grid th.cell.text{padding:0 0.4em;}");