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
		
		var $page = $(this).closest(".ui-dialog").children(".bc-page");
		var title = $page.dialog("option", "title")
		
		// 显示导入进度对话框
		var doing = true;
		var $processDlg = '<div data-type="custom" class="bc-page">';
		$processDlg += '<div class="info">正在导入数据，请耐心等候！</div>';
		$processDlg += '<div class="time" style="text-align:center;font-size:200%">00:00:00</div>';
		$processDlg += '</div>';
		$processDlg = $($processDlg);
		$processDlg.dialog({title:"导入" + title, modal: true});
		
		// 定时更新耗时值
		var time = new Date(1976,0,1,0,0,0);
		var timeEl = $processDlg.children(".time").get(0);
		var timeId = window.setInterval(function(){
			time.setSeconds(time.getSeconds()+1);
			timeEl.innerText = bc.formatTime(time.getHours(),time.getMinutes(),time.getSeconds());
		}, 1000);
		$processDlg.bind("dialogclose",function(event,ui){
			// 删除定时器
			window.clearInterval(timeId);

			// 关闭导入窗口
			boxPointer.remove();
			
			// 刷新视图
			if($processDlg.data("refresh"))
				bc.grid.reloadData($grid.closest(".bc-page"));
			
			// 彻底删除所有相关的dom元素
			$processDlg.dialog("destroy").remove();
		}).bind("dialogbeforeclose",function(event,ui){
			if(doing) return false;// 请求未完成不允许关闭窗口
		});

		// 调用action导入数据
		var data = {file: json.file};
		if(cfg.headerRowIndex) data.headerRowIndex = cfg.headerRowIndex;
		$.ajax({
			dataType: "json",
			data: data,
			url: bc.root + "/" + cfg.importAction,
			complete: function(){
				doing = false;
				window.clearInterval(timeId);// 删除定时器
			},
			success: function(json){
				var msg = json.msg;
				var detailID = "detail-"+new Date().getTime();
				if(json.detail){
					msg += '&nbsp;<a href="#" id="'+detailID+'">点击查看详情</a>';
				}
				if(!json.success){
					msg = "出错了！可能是数据格式有误或其它未知的原因，请修正上传数据的格式或联系管理员！";
					msg += "<div style='color:red;font-weight:bold'>["+json.msg+"]</div>";
				}
				$processDlg.children(".info").html(msg);
				if(json.success) $processDlg.data("refresh",true);
				if(json.detail){
					$processDlg.find("#"+detailID).click(function(){
						//打开查看详情的窗口
						var errorWin=window.open('', 'showImportDetail');
						var errorDoc = errorWin.document;
						errorDoc.open();
						var html = [];
						html.push('<!DOCTYPE html>');
						html.push('<html>');
						html.push('<head>');
						html.push('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');
						// 获取视图的标题
						html.push('<title>'+title+' - 数据导入异常列表</title>');
						html.push('<style type="text/css">');
						html.push('body>div{color:red;font-weight:bold;font-size:150%}');
						html.push('table{border:none;border-collapse:collapse}');
						html.push('thead{font-weight:bold;}');
						html.push('td{border:1px solid gray;padding:2px;}');
						html.push('td:nth-child(1),td:nth-child(2){color:red;font-weight:bold;}');
						html.push('td:nth-child(2){max-width:600px;}');
						html.push('</style>');
						html.push('</head>');
						html.push('<body>');
						
						html.push('<div>'+title+' - 数据导入异常列表</div>');
						html.push('<table>');
						
						// 获取列名
						var d = json.detail;
						var columnNames = json.columnNames;
						//alert(columnNames);
						
						// 构建列头行
						html.push('<thead><tr>');
						html.push('<td>行号</td><td>异常信息</td>');
						for(var i=0;i<columnNames.length;i++){
							html.push('<td>'+columnNames[i]+'</td>');
						}
						html.push('</tr></thead>');
						
						// 构建数据行
						html.push('<tbody>');
						var hri = cfg.headerRowIndex + 2;
						for(var i=0;i<d.length;i++){
							html.push('<tr>');
							html.push('<td>'+(hri+parseInt(d[i].index))+'</td>');
							html.push('<td>'+d[i].msg+'</td>');
							var v;
							for(var j=0;j<columnNames.length;j++){
								v = d[i][columnNames[j]];
								html.push('<td>'+(v?v:"")+'</td>');
							}
							html.push('</tr>');
						}
						html.push('</tbody></table>');
						
						html.push('</body>');
						html.push('</html>');
						errorDoc.write(html.join(""));
						errorDoc.close();
						errorWin.focus();
						return false;
					});
				}
			}
		});
	};
	$file.change(function(e){
		logger.info("localfile=" + this.value);
		bc.file.upload.call(this,e.target.files,fileOption);
	});
};

/** 显示导入处理的详细信息 */
function showImportDetail(){
	
}

})(jQuery);