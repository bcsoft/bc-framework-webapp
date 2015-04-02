bc.selectResource = {
	init : function() {
		var $page = $(this);
		//绑定双击事件
		$page.find("select").dblclick(function(){
			bc.selectResource.clickOk.call($page[0]);
		});
	},
	clickOk : function() {
		var $page = $(this);
		var select = $page.find("select")[0];
		if(select.selectedIndex == -1){
			alert("必须先选择资源信息！");
			return false;
		}
		var item;
		if(select.multiple){
			item=[];
			// 循环选定的每一个项目，将该项添加到列表中
			for (var i = 0; i < select.length; i++){
				if (select.options[i].selected){
					var value = select.options[i].value.split(",");
					item.push({id: value[0],name: value[2],fname: select.options[i].text});
				}
			}
		}else{
			var value = select.value.split(",");
			item={id: value[0],name: value[2],fname: select.options[select.selectedIndex].text};
		}
		$page.data("data-status",item);
		$page.dialog("close");
	}
};
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

