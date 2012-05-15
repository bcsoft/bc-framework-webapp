/**
 * 选择区域信息
 * @param {Object} option 配置参数
 * @option {String} types [可选]地域的类型，0-国家,1-省级,2-地级,3-县级,4-乡级,5-村级，默认为null
 * 						选择多地域类型用逗号相连，如省级，地级 则为 1,2						
 * @option {Boolean} multiple [可选]是否允许多选，默认false
 * @option {Boolean} paging [可选]是否分页，默认true
 * @option {String} status [可选]车辆保单险种的状态，默认在案，设为空则代表所有状态
 * @option {Function} onOk 选择完毕后的回调函数，函数第一个参数为选中的车辆保单险种信息，
 * 							如果为多选则返回的是数组，每个车辆的格式为{id:[id],name:[name]}
 * @option {String} selecteds [可选]已选中车辆保单险种的id值，多个值用逗号连接
 */
bc.selectPlaceOrigin = function(option) {
	// 构建默认参数
	option = jQuery.extend({
		mid: 'selectPlaceOrigin',
		paging: true,
		title: '选择区域信息'
	},option);
	
	// 将一些配置参数放到data参数内(这些参数是提交到服务器的参数)
	option.data = jQuery.extend({
		status: '0',
		multiple: false,
		types:option.types||''
	},option.data);
	if(option.selecteds)
		option.data.selecteds = option.selecteds;
	if(option.multiple === true)
		option.data.multiple = true;
	
	//弹出选择对话框
	bc.page.newWin(jQuery.extend({
		url: bc.root + "/bc/selectSuperiorPlace/paging",
		name: option.title,
		mid: option.mid,
		afterClose: function(status){
			if(status && typeof(option.onOk) == "function"){
				option.onOk(status);
			}
		}
	},option));
}
