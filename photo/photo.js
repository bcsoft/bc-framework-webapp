bc.namespace("bc.photo");
/**
 * 图片处理：上传、摄像头截图、图片裁剪等
 * @param {Object} option 配置参数
 * @option {String} id [可选]标准Attach附件ID(attach:ID)或流程附件ID(wf:ID)，带特殊的标记前缀
 * @option {String} dir [可选]图片存放的相对于"/bdata"目录下的子路径
 * @option {String} path [可选]图片相对dir下的物理路径
 * @option {String} fname [可选]图片显示的名称(前缀f用于避免与bc.page.newWin函数的name参数冲突)
 * @option {Function} onOk 处理完毕后的回调函数，函数第一个参数为处理结果的json信息描述，格式为：
 *      success {Boolean} 处理是否成功
 *      msg {String} 处理结果的文字描述信息，如异常信息
 *      id {String} 传入参数中的id
 *      dir {String} 传入参数中的fdir或新建图片附件存放的相对于"/bdata"目录下的子路径
 *      path {String} 传入参数中的fpath或新建图片附件相对dir下的物理路径
 *      fname {String} 图片名称
 *      size {String} 图片的大小(字节单位)
 *      format {String} 图片的格式，即图片文件的扩展名，如png、jpg
 * @option {String} -others- [可选]bc.page.newWin函数的其它参数均有效
 *
 *  @author rongjihuang@gmail.com
 *  @date 2013-11-08
 */
bc.photo.handle = function (option) {
	// 合并请求参数到data属性
	if (!option) option = {};
	if (!option.data) option.data = {};
	if (option.id) option.data.id = option.id;
	if (option.dir) option.data.dir = option.dir;
	if (option.path) option.data.path = option.path;
	if (option.fname) option.data.fname = option.fname;

	option = $.extend({
		method: 'post',
		mid: 'bc.photo.handle',
		name: '图片处理器',
		url: bc.root + '/bc/photo/main'
	}, option);
	bc.page.newWin(option);
};