bc.resourceSelectDialog = {
	/** 点击确认按钮后的处理函数 */
	clickOK : function() {
		var $page = $(this);

		// 获取选中的行的id单元格
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 0){
			alert("请先选择！");
			return false;
		}

		// 获取选中的数据
		var data;
		var $grid = $page.find(".bc-grid");
		if($grid.hasClass("singleSelect")){//单选
			data = {};
			data.id = $tds.attr("data-id");
			var $trs = $grid.find(">.data>.right tr.ui-state-highlight");
			data.name = $trs.find("td:eq(1)").attr("data-value");
			$.extend(data,$trs.data("hidden"));
		}else{//多选
			data = [];
			var $trs = $grid.find(">.data>.right tr.ui-state-highlight");
			$tds.each(function(i){
				data.push($.extend({
					id: $(this).attr("data-id"),
					name:$($trs.get(i)).find("td:eq(1)").attr("data-value")
				},$($trs.get(i)).data("hidden")));
			});
		}
		logger.info($.toJSON(data));
		
		// 返回
		$page.data("data-status", data);
		$page.dialog("close");
	}
};