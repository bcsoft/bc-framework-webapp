bc.identity = {
	/**
	 * 选择单位信息
	 * @param {Object} option 配置参数
	 * @option {String} selecteds 当前应选中的项的值，多个值用逗号连接
	 * @option {String} excludes 要排除显示的项的值，多个值用逗号连接
	 * @option {Function} onOk 选择完毕后的回调函数，函数第一个参数为选中的单位信息
	 */
	selectUnit : function(option) {
		option.data = jQuery.extend({
			multiple: false,
			history: false
		},option.data);
		if(option.selecteds)
			option.data.selecteds = option.selecteds;
		if(option.excludes)
			option.data.excludes = option.excludes;
		if(option.history === true)
			option.data.history = true;
		if(option.multiple === true)
			option.data.multiple = true;
		
		option = jQuery.extend({
			url: bc.root + "/bc/selectUnit",
			name: "选择单位信息",
			mid: "selectUnit",
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		},option);
		
		bc.page.newWin(option);
	},
	
	/**
	 * 选择单位或部门信息
	 * @param {Object} option 配置参数
	 * @option {String} selecteds 当前应选中的项的值，多个值用逗号连接
	 * @option {String} excludes 要排除显示的项的值，多个值用逗号连接
	 * @option {Function} onOk 选择完毕后的回调函数，函数第一个参数为选中的单位信息
	 */
	selectUnitOrDepartment : function(option) {
		option.data = jQuery.extend({
			multiple: false,
			history: false
		},option.data);
		if(option.selecteds)
			option.data.selecteds = option.selecteds;
		if(option.excludes)
			option.data.excludes = option.excludes;
		if(option.history === true)
			option.data.history = true;
		if(option.multiple === true)
			option.data.multiple = true;
		
		option = jQuery.extend({
			url: bc.root + "/bc/selectUnitOrDepartment",
			name: "选择单位或部门信息",
			mid: "selectUnitOrDepartment",
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		},option);
		
		bc.page.newWin(option);
	},
	
	/**
	 * 选择岗位信息
	 * @param {Object} option 配置参数
	 * @option {String} actorId 用户的id
	 * @option {String} assignedGroupIds 已分派岗位的id列表，多个值用逗号连接
	 * @option {Boolean} multiple 是否允许多选，默认false
	 * @option {Function} onOk 选择完毕后的回调函数，函数第一个参数为选中的岗位信息(数组)
	 */
	selectGroup : function(option) {
		option.data = jQuery.extend({
			multiple: false,
			history: false
		},option.data);
		if(option.selecteds)
			option.data.selecteds = option.selecteds;
		if(option.excludes)
			option.data.excludes = option.excludes;
		if(option.history === true)
			option.data.history = true;
		if(option.multiple === true)
			option.data.multiple = true;
		
		option = jQuery.extend({
			url: bc.root + "/bc/selectGroup",
			name: "选择岗位信息",
			mid: "selectGroup",
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		},option);
		
		bc.page.newWin(option);
	},
	
	/**
	 * 给指定的actor(单位、部门、岗位或用户)分配角色
	 * @param {Object} option 配置参数
	 * @option {String} selecteds 已选择的id列表，多个值用逗号连接
	 * @option {String} excludes 要排除显示的项的值，多个值用逗号连接
	 * @option {Boolean} multiple 是否允许多选，默认false
	 * @option {Function} onOk 选择完毕后的回调函数，函数第一个参数为选中的角色信息(数组)
	 */
	selectRole : function(option) {
		option.data = jQuery.extend({
			multiple: false
		},option.data);
		if(option.selecteds)
			option.data.selecteds = option.selecteds;
		if(option.excludes)
			option.data.excludes = option.excludes;
		if(option.multiple === true)
			option.data.multiple = true;

		option = jQuery.extend({
			url: bc.root + "/bc/selectRole",
			name: "选择角色信息",
			mid: "selectRole",
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		},option);
		
		bc.page.newWin(option);
	},
	
	/**
	 * 选择模块信息
	 * @param {Object} option 配置参数
	 * @option {String} selecteds 已选择的id列表，多个值用逗号连接
	 * @option {String} excludes 要排除显示的项的值，多个值用逗号连接
	 * @option {Boolean} multiple 是否允许多选，默认false
	 * @option {String} types 选择的资源类型，多个值用逗号连接，为空代表选择所有类型
	 * @option {Function} onOk 选择完毕后的回调函数，函数第一个参数为选中的角色信息(数组)
	 */
	selectResource : function(option) {
		option.data = jQuery.extend({
			multiple: false
		},option.data);
		if(option.selecteds)
			option.data.selecteds = option.selecteds;
		if(option.excludes)
			option.data.excludes = option.excludes;
		if(option.multiple === true)
			option.data.multiple = true;
		if(option.types)
			option.data.types = option.types;
		
		option = jQuery.extend({
			url: bc.root + "/bc/selectResource",
			name: "选择资源信息",
			mid: "selectResource",
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		},option);
		
		bc.page.newWin(option);
	},
	
	/**
	 * 选择用户信息
	 * @param {Object} option 配置参数
	 * @option {String} selecteds 已选择用户的id列表，多个值用逗号连接
	 * @option {String} excludes 要排除显示的项的值，多个值用逗号连接
	 * @option {Boolean} multiple 是否允许多选，默认false
	 * @option {Boolean} history 是否选择ActorHistory信息，默认true，设为false选择Actor信息
	 * @option {Function} onOk 选择完毕后的回调函数，函数第一个参数为选中的用户信息(多选时数组，单选时时对象)
	 */
	selectUser : function(option) {
		option.data = jQuery.extend({
			multiple: false,
			history: true
		},option.data);
		if(option.selecteds)
			option.data.selecteds = option.selecteds;
		if(option.excludes)
			option.data.excludes = option.excludes;
		if(option.history === false)
			option.data.history = false;
		if(option.multiple === true)
			option.data.multiple = true;
		
		option = jQuery.extend({
			url: bc.root + "/bc/selectUser",
			name: "选择用户信息",
			mid: "selectUser",
			history: true,
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		},option);
		
		bc.page.newWin(option);
	}
};