/**
 * 简单的单文件上传
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-08-24
 * @depend file.css
 */
bc.file={
	uploadUrl: bc.root + "/upload/?a=1",
	
    /**判断浏览器是否可使用html5上传文件*/
	isHtml5Upload: function(){
		return $.browser.safari || $.browser.mozilla;//Chrome12、Safari5、Firefox4
	},
	
	/**
	 * 基于html5的文件上传处理
	 * <p>函数上下文为附件控件的容器dom</p>
	 * @param {Object} option 配置参数
	 * @option {Object} file 要上传的文件 
	 * @option {String} ptype 
	 * @option {String} puid 
	 * @option {String} extensions 扩展名限制，多个用逗号连接 
	 * @option {Function} callback 回调函数，第一个参数为服务器返回的json对象，上下文为页面对象
	 * @option {Element} progressbar 进度条对象
	 * @option {String} url 
	 */
	upload4html5:function(option){
		var _this = this;
	    //将参数附加到上传文件的url后
	    var url = option.url || bc.file.uploadUrl;
	    if(option.ptype) url+="&ptype=" + option.ptype;
	    if(option.puid) url+="&puid=" + option.puid;
	    
	    //检测文件类型的限制
	    var fileName = option.file.fileName;
	    if(option.extensions && option.extensions.length > 0){
	    	var extensions = option.extensions.toLowerCase();
    		if(_extensions.indexOf(fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase()) == -1){
	    		alert("只能上传扩展名为\"" + _extensions.replace(/,/g,"、") + "\"的文件！");
	    		
	    		//清空file控件:file.outerHTML=file.outerHTML; 
	    		
	    		return false;
    		}
	    }
		
    	var xhr = new XMLHttpRequest();
    	
    	//上传进度处理
    	if(option.progressbar){
    	    //初始化进度条
    	    var $progressbar = $(option.progressbar).show().progressbar();
			if($.browser.safari){//Chrome12、Safari5
				xhr.upload.onprogress=function(e){
					var progressbarValue = Math.round((e.loaded / e.total) * 100);
					logger.info(":upload.onprogress:" + progressbarValue + "%");
					$progressbar.progressbar("option","value",progressbarValue);
				};
			}else if($.browser.mozilla){//Firefox4
				xhr.onuploadprogress=function(e){
					var progressbarValue = Math.round((e.loaded / e.total) * 100);
					logger.info(i + ":upload.onprogress:" + progressbarValue + "%");
					$progressbar.progressbar("option","value",progressbarValue);
				};
			}
    	}
		
		//上传完毕的处理
		xhr.onreadystatechange=function(){
			if(xhr.readyState != 4){
				logger.error(":uploadError:readyState=" + xhr.readyState);
				return;
			}
			
			logger.info("responseText=" + xhr.responseText);
			var json = eval("(" + xhr.responseText + ")");
			
			//删除进度条钮（延时1秒后执行）
			if(option.progressbar){
				setTimeout(function(){
					$progressbar.hide();
				},1000);
			}
			
			//调用回调函数
			if(typeof option.callback == "function")
				option.callback.call(_this, json,xhr.responseText);
		};
		
		// 执行上传文件的操作
		xhr.open("POST", url);
		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		//对文件名进行URI编码避免后台中文乱码（后台需URI解码）
		xhr.setRequestHeader('Content-Disposition', 'attachment; name="filedata"; filename="'+encodeURIComponent(fileName)+'"');
		if(xhr.sendAsBinary)//Firefox4
			xhr.sendAsBinary(option.file.getAsBinary());
		else //Chrome12
			xhr.send(option.file);
	}
};

(function($){

//初始化文件控件的选择事件
$(".bcfile :file.uploadFile").live("change",function(e){
	var $bcfile = $(this).closest(".bcfile");
	
	var ptype = $bcfile.attr("data-ptype");
	var puid = $bcfile.attr("data-puid");
	var extensions = $bcfile.attr("data-extensions");
	var callback = $bcfile.attr("data-callback");
	
	if(bc.file.isHtml5Upload()){
		logger.info("uploadFile with html5");
		bc.file.upload4html5.call($bcfile.closest(".bc-page")[0],{
			file: e.target.files[0],
			ptype: ptype,
			puid: puid,
			extensions: extensions,
			callback: bc.getNested(callback)
		});
	}else{
		alert("todo:" + this.value);
	}
});

//上传按钮的鼠标样式控制
$(".bcfile").live("mouseover", function() {
	$(this).addClass("ui-state-hover");
}).live("mouseout", function() {
	$(this).removeClass("ui-state-hover");
})

})(jQuery);