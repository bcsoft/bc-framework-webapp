bc.templateShowDialog = {
	/** 点击确认按钮后的处理函数 */
	clickOk : function() {	
		option ={};
		var $page = $(this);
		
		var tid='';
		var $extra = tid=eval ("("+ $page.attr("data-extras") +")");
		if($extra.tid)
			tid=$extra.tid;
		
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if(tid!=''&&$tds.attr("data-id")==tid){
			bc.msg.slide("已打开本条信息！");
			return;
		}
		
		var url = $page.attr("data-editUrl");
		if(!url || url.length == 0){
			url=$page.attr("data-namespace");
			if(!url || url.length == 0){
				alert("Error:页面没有定义data-editUrl或data-namespace属性的值");
				return;
			}else{
				url += "/edit";
			}
		}
		
		if($tds.length == 1){
			var data = {id: $tds.attr("data-id")};
			
			//附加固定的额外参数
			var extras = option.extras || $page.data("extras");
			if(extras){
				data = $.extend(data, extras);
			}
			
			var fromMID = $page.attr("data-mid");
			bc.page.newWin({
				url:url, data: data || null,
				from: fromMID,
				fromType: $page.is("[data-isTabContent='true']") ? "tab" : null,
				mid: fromMID + "." + $tds.attr("data-id"),
				name: $tds.attr("data-name") || "未定义",
				title: $tds.attr("data-name"),
				afterClose: function(status){
					if(status)
						bc.grid.reloadData($page);
				},
				afterOpen: option.callback
			});
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以查看一条信息，请确认您只选择了一条信息！");
			return;
		}else{
			bc.msg.slide("请先选择要查看的信息！");
			return;
		}
	}
};