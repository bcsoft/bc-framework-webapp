bc.superiorPlaceSelectDialog = {
	/** 点击确认按钮后的处理函数 */
	clickOk : function() {
		var $page = $(this);

		// 获取选中的行的id单元格
		var $tds = $page
				.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if ($tds.length == 0) {
			alert("请先选择！");
			return false;
		}

		// 获取选中的数据
		var data;
		var $grid = $page.find(".bc-grid");
		if ($grid.hasClass("singleSelect")) {// 单选
			data = {};
			data.id = $tds.attr("data-id");
			var $tr = $grid.find(">.data>.right tr.ui-state-highlight");
			data.type= $tr.find("td:eq(0)").text();
			data.code= $tr.find("td:eq(1)").text();
			data.name = $tr.find("td:eq(2)").text();
			data.fullname = $tr.find("td:eq(3)").text();
		}else{
			data=[];
			var $right = $($tds[0]).closest(".left").siblings();
			$tds.each(function(i){
				var $this = $(this);
				var index = $this.parent().index();
				var $row = $right.find("tr.row:eq("+index+")");
				var id=$this.attr("data-id");
				var	type = $row.find("td:eq(0)").text();
				var code = $row.find("td:eq(1)").text();
				var name = $row.find("td:eq(2)").text();
				var fullname = $row.find("td:eq(3)").text();
				data.push({
					id: id,
					type:type,
					code:code,
					name:name,
					fullname:fullname
				});
			});	
		}
		logger.info($.toJSON(data));

		// 返回
	    $page.data("data-status", data);
		$page.dialog("close");
	}
};