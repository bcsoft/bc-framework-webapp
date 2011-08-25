/**
 * 图像上传、裁剪处理
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
	 * @option [String] extensions 图片扩展名的限制，用逗号连接多个，为空则使用系统app.attachs.images的配置
	 * @option [String] empty 空白图片的路径
	 * @option [Function] onOk 点击确认按钮后的回调函数，参数为图片处理后的数据
	 * @option [Number] ratio 限制图片裁剪的长宽比例，不设置则不限制
	 * @option [Number] width 处理后图片的宽度
	 * @option [Number] height 处理后图片的高度
	 */
	edit: function(option) {
		logger.debug("bc.image.crop");
		
		//将相关参数转换到data参数
		option.data = jQuery.extend({},option.data || {});
		if(option.puid)
			option.data.puid = option.puid;
		if(option.ptype)
			option.data.ptype = option.ptype;
		if(option.empty)
			option.data.empty = option.empty;
		if(option.preWidth)
			option.data.preWidth = option.preWidth;
		if(option.preHeight)
			option.data.preHeight = option.preHeight;
		
		bc.page.newWin(jQuery.extend({
			url: bc.root + "/bc/image/showCrop",
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

(function($){

// 自动绑定图片处理
$(".bc-imageEditor").live("click",function(e){
	var $this = $(this);
	
	//参数检验及处理
	var dataCfg = $this.attr("data-cfg");
	if(!dataCfg){
		alert("必须配置data-cfg属性的值");
		return false;
	}
	
	dataCfg = eval("(" + dataCfg + ")");
	if(!dataCfg.puid || dataCfg.puid.length == 0){
		alert("data-cfg属性中没有配置puid");
		return false;
	}
	var callback;
	if(dataCfg.onOk && dataCfg.onOk.length > 0){
		callback = bc.getNested(dataCfg.onOk);
		if(typeof callback != "function"){
			alert("data-cfg属性中配置的onOk值“" + dataCfg.onOk + "”对应的函数没有定义");
			return false;
		}
		dataCfg.onOk = callback;
	}else{
		alert("data-cfg属性中没有配置onOk");
		return false;
	}
	
	//打开图片编辑器
	bc.image.edit(dataCfg);
});

})(jQuery);