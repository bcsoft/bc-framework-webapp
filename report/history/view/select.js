bc.viewExcuteReportTaskRecodeList = {
	/** 在线预览 */
	inline: function(){
		var $view=$(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			//获取选中的行
			var $tr = $view.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var n = $tr.find(">td:eq(3)").attr("data-value");// 获取文件名
			var f = "report/history/" + $tr.find(">td:eq(4)").attr("data-value");// 获取附件相对路径
			
			// 预览文件
			var option = {f: f, n: n};
			var ext = f.substr(f.lastIndexOf("."));
			if(ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
				option.from="docx";
			}
			bc.file.inline(option);
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以预览一个，请确认您只选择了一个！");
			return;
		}else{
			bc.msg.slide("请先选择要预览的历史报表！");
			return;
		}
	},
	/** 下载选择的*/
	download: function(){
		var $view=$(this);
		var $tds = $(this).find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			//获取选中的行
			var $tr = $view.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var n = $tr.find(">td:eq(3)").attr("data-value");// 获取文件名
			var f = "report/history/" + $tr.find(">td:eq(4)").attr("data-value");// 获取附件相对路径			
			// 下载文件
			bc.file.download({f: f, n: n});
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以下载一个，请确认您只选择了一个！");
			return;
		}else{
			bc.msg.slide("请先选择要下载的历史报表！");
			return;
		}
	},	
	/** 点击确认按钮后的处理函数 */
	clickOk : function() {
		var $page = $(this);
		
		// 获取选中的行的id单元格
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 0){
			bc.msg.alert("请先选择！");
			return false;
		}else if($tds.length > 1){
			bc.msg.slide("只能选择一个报表模板！");
			return false;
		}

		// 获取选中的数据
		var $grid = $page.find(".bc-grid");
		if($grid.hasClass("singleSelect")){//单选
			var $tr = $grid.find(">.data>.right tr.ui-state-highlight");
			var id = $tds.attr("data-id");
			var success=$tr.find("td:eq(0)").attr("data-value");
			var name=$tr.find("td:eq(3)").attr("data-value");
			
			var url=bc.root + "/bc/reportHistory/edit?id="+id+"&success="+success;
			bc.page.newWin({
				url: url,
				name: name,	
				title:name,
				mid:name+id
			});
		}
	}
};