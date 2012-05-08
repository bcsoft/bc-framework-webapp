bc.selectReportTemplate = {
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
		var data;
		var $grid = $page.find(".bc-grid");
		if($grid.hasClass("singleSelect")){//单选
			data = {};
			data.id = $tds.attr("data-id");
			var $tr = $grid.find(">.data>.right tr.ui-state-highlight");
			data.category = $tr.find("td:eq(1)").text();
			data.name = $tr.find("td:eq(2)").text();
		}
		
		// 返回
		$page.data("data-status", data);
		$page.dialog("close");
	}
};