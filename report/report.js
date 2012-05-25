bc.namespace("bc");
bc.report = {
	/** 将报表运行结果存为历史 */
	save2history: function(){
		var $page=$(this);
		logger.info("save2history");
		
		bc.msg.confirm("确定要将当前报表结果存为历史报表吗？",function(){
			// 显示提示信息
			var win = bc.msg.info("<div style='font-size:20px;'>正在存为历史报表...</div><div>报表执行可能比较耗时，请耐心等候!<div>",null);
			
			// 获取条件信息
			var data = {};
			data.exporting = true;
			data.exportFormat = "xls";
			data = $.extend(data,$page.data("extras"));
			
			// 执行请求处理
			bc.ajax({
				url: bc.root + "/bc/report/save2history",
				data: data,
				success: function(json){
					if(win){
						try{
							win.dialog("destroy").remove();
						}catch(e){}
					}
					bc.msg.slide("存为历史报表成功！");
					logger.info("success");
				}
			});
		});
	}
};