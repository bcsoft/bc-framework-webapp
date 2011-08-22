/**
 * 图像处理
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-08-22
 */
bc.image = {
	/** 
	 * 打开图像的裁剪上传对话框
	 * @param [Object] option
	 * @option [String] puid 所关联文档的UID
	 * @option [String] ptype 所关联文档的分类
	 * @option [Function] onOk 点击确认按钮后的回调函数，参数为图片处理后的数据
	 * @option [Number] ratio 限制图片裁剪的长宽比例，不设置则不限制
	 * @option [Number] width 处理后图片的宽度
	 * @option [Number] height 处理后图片的高度
	 */
	crop : function(option) {
		logger.debug("bc.image.crop");
		
		//将相关参数转换到data参数
		option.data = jQuery.extend({},option.data || {});
		if(option.puid)
			option.data.puid = option.puid;
		if(option.ptype)
			option.data.ptype = option.ptype;
		
		bc.page.newWin(jQuery.extend({
			url: bc.root + "/bc/image/crop",
			name: "图片处理",
			mid: "cropImage",
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		},option));
	}
};