/**
 * Grid 分页条
 * <pre>
 *     使用范例：
 *     <bc-grid-page-bar :page-no="pageNo" :total-count="totalCount" @change="pageBarChanged" @reload="reload" @export="export"/>
 *     其中：
 *     <ul>
 *         <li>page-no {Number} 页码，有数据时默认为 1，无数据时默认为 0</li>
 *         <li>total-count {Number} 总条目数，默认为 0</li>
 *         <li>change {Event} 分页参数变动时触发的事件</li>
 *         <li>reload {Event} 点击分页条刷新按钮触发的事件</li>
 *         <li>export {Event} 点击分页条导出按钮触发的事件</li>
 *     </ul>
 * </pre>
 */
define(['bc', 'vue', 'text!bc/components/vue/grid-page-bar.html'], function (bc, Vue, template) {
	'use strict';
	// 注册为全局组件
	var id = 'bc-grid-page-bar';
	Vue.component(id, {
		template: template,
		props: {
			pageNo: {type: Number, default: 0},
			totalCount: {type: Number, default: 0}
		},
		data: function () {
			return {pageSize: 25, pageCount: 0}
		},
		created: function () {
			console.log("pageBar:created");
			this.pageCount = Math.ceil(this.totalCount / this.pageSize);
		},
		watch: {
			totalCount: function (val, oldVal) {
				console.log('totalCount: new=%s, old=%s', val, oldVal);
				this.pageCount = Math.ceil(val / this.pageSize);
			},
			pageNo: function (val, oldVal) {
				console.log('pageNo: new=%s, old=%s', val, oldVal);
				this.$dispatch('change', this.pageNo, this.pageSize, this.pageCount);
			},
			pageSize: function (val, oldVal) {
				console.log('pageSize: new=%s, old=%s', val, oldVal);
				this.$dispatch('change', this.pageNo, this.pageSize, this.pageCount);
			}
		},
		methods: {
			export: function () {
				console.log("TODO export");
			}
		}
	});

	return Vue.component(id);
});