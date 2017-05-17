/**
 * 系统上下文组件
 */
define(["bc"], function (bc) {
	'use strict';
	let roles = [];

	// export
	let context = {
		/**
		 * 判断当前用户是否是任一角色之一。函数的各个参数视作为角色编码。
		 *
		 * @return {Boolean} 是任一角色之一返回 true，否则返回 false。
		 */
		is: function () {
			if (arguments.length === 0) return false;
			for (let i = 0; i < arguments.length; i++) {
				if (context.roles.indexOf(arguments[i]) !== -1) return true;
			}
			return false;
		},
		/**
		 * 判断当前用户是否拥有指定的所有角色。函数的各个参数视作为角色编码。
		 *
		 * @return {Boolean} 拥有指定的所有角色返回 true，否则返回 false。
		 */
		isAll: function () {
			if (arguments.length === 0) return false;
			for (let i = 0; i < arguments.length; i++) {
				if (context.roles.indexOf(arguments[i]) === -1) return false;
			}
			return true;
		},
		/**
		 * 所有微服务配置，格式为 {"{ID}": {"name": "Demo 演示", "address": "http://127.0.0.1:9000"}, ...}。
		 *
		 * 通过 context.services.{ID}.name|address 获取相应的配置值。
		 * - name - 微服务名称
		 * - address - 微服务访问地址
		 */
		services: {}
	};

	// 异步获取系统上下文信息
	fetch(`${bc.root}/rest/context`, {
		credentials: "include",
		method: "GET"
	}).then(res => res.ok ? res.json() : res.text().then(msg => {
		throw new Error(msg);
	})).then(json => {
		Object.assign(context, json);
		//console.log("preload context=%s", JSON.stringify(context));
	}).catch(error => bc.msg.info(error.message));

	return context;
});