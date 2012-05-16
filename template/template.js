/**
 * 选择模板信息
 * @param {Object} option 配置参数
 * @option {String} category [可选]分类可选	默认为null，例如'经济合同',逗号连接多个分类 如'经济合同,劳动合同'					
 * @option {Boolean} multiple [可选]是否允许多选，默认false
 * @option {Boolean} paging [可选]是否分页，默认true
 * @option {String} status [可选]车辆保单险种的状态，默认在案，设为空则代表所有状态
 * @option {Function} onOk 选择完毕后的回调函数，函数第一个参数为选中的车辆保单险种信息，
 * 							如果为多选则返回的是数组，每个车辆的格式为{id:[id],name:[name]}
 * @option {String} selecteds [可选]已选中车辆保单险种的id值，多个值用逗号连接
 */
bc.selectTemplate = function(option) {
	// 构建默认参数
	option = jQuery.extend({
		mid: 'selectTemplate',
		paging: false,
		title: '选择模板信息'
	},option);
	
	// 将一些配置参数放到data参数内(这些参数是提交到服务器的参数)
	option.data = jQuery.extend({
		status: '0',
		multiple: false,
		category:option.category||''
	},option.data);
	if(option.selecteds)
		option.data.selecteds = option.selecteds;
	if(option.multiple === true)
		option.data.multiple = true;
	
	//弹出选择对话框
	bc.page.newWin(jQuery.extend({
		url: bc.root + "/bc/selectTemplate/list",
		name: option.title,
		mid: option.mid,
		afterClose: function(status){
			if(status && typeof(option.onOk) == "function"){
				option.onOk(status);
			}
		}
	},option));
}