/**
 * 列表视图插件：从Excel导入数据
 * 
 * @author rongjihuang@gmail.com
 * @date 2012-09-18
 * @depend grid.js
 */
(function($) {

/**
 * 显示导出视图数据的配置界面-->用户选择-->导出excel
 * @param $grid 表格的jquery对象
 * @param el 导出按钮对应的dom元素
 */
bc.grid.import = function($grid,el) {
	var cfg = $(el).data("cfg") || {};// 配置信息
	var html=[];
	html.push('<form class="bc-import" name="importer" method="post">');
	html.push('<div class="info" style="width:14em;font-weight:normal;padding:5px;border:1px dashed #ccc;">导入数据前请确保数据文件符合模板格式，可以通过下载模板获知格式的详细要求！</div>'
		+'<div class="buttons" style="text-align: right;padding: 0 4px;">');
	
	// 上传数据按钮
	html.push('<a id="upload" style="text-decoration:underline;cursor:pointer;position: relative;">上传数据'
		+'<input type="file" class="uploadFile" id="uploadFile" name="uploadFile" title="点击上传文件"'
		+' data-cfg=\'{"subdir":"import","ptype":"import.option","puid":"import.option"}\''
		+' style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;filter: alpha(opacity = 10);opacity: 0;cursor: pointer;"/>'
		+'</a>&nbsp;&nbsp;');
	
	// 下载模板、取消 按钮
	html.push('<a id="download" style="text-decoration:underline;cursor:pointer;">下载模板</a>&nbsp;&nbsp;'
		+'<a id="cancel" style="text-decoration:underline;cursor:pointer;">取消</a></div>'
		+'</form>');
	html = html.join("");
	
	//显示窗口
	var boxPointer = bc.boxPointer.show({
		of:el,dir:"top",close:"click",
		offset:"-8 -4",
		iconClass:null,
		appendTo: $grid.closest(".ui-dialog"),
		content:html
	});
	
	//取消按钮
	boxPointer.find("#cancel").click(function(){
		boxPointer.remove();
		return false;
	});
	
	//下载按钮
	boxPointer.find("#download").click(function(){
		if(!cfg.tplCode){
			alert("没有定义所要下载模板的编码值，无法下载！");
			return;
		}
		
		// 下载模板
		var url = bc.root + "/bc/templatefile/download?code=" + cfg.tplCode;
		window.open(url, "blank");
		
		return false;
	});
	
	// 上传按钮
	var $file = boxPointer.find("#uploadFile");
	var fileOption = $file.data("cfg");
	// 上传文件完成后的回调函数,上下文为file控件，参数为文件上传后服务器返回的json信息
	fileOption.callback = function(json){
		//alert("import_upload_callback: " + json.file);
		if(!cfg.importAction){
			alert("没有定义导入数据的Action");
			return;
		}
		
		// 调用action导入数据
		var data =  {file: json.file};
		if(cfg.headerRowIndex) data.headerRowIndex = cfg.headerRowIndex;
		$.ajax({
			dataType: "json",
			data: data,
			url: bc.root + "/" + cfg.importAction,
			success: function(json){
				if(json.success){// 成功
					bc.msg.info(json.msg, null, function(){
						// 关闭导入窗口
						boxPointer.remove();
						
						// 刷新视图
						bc.grid.reloadData($grid.closest(".bc-page"));
					});
				}else{// 失败
					bc.msg.info(json.msg);
				}
			}
		});
	};
	$file.change(function(e){
		logger.info("localfile=" + this.value);
		bc.file.upload.call(this,e.target.files,fileOption);
	});
};

})(jQuery);