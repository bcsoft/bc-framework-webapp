bc.templateList = {
	/** 在线预览 */
	inline: function(){
		var $view=$(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			//取类型列data-value的值
			var type= $view.find(".bc-grid>.data>.right tr.ui-state-highlight>td:eq(2)").attr("data-value");
			if(type==3||type==4){
				bc.msg.slide("文本文件或html文件，请直接双击表格查看！");
			}else{
				//在新窗口中打开文件
				window.open(bc.root + "/bc/template/inline?to=pdf&id=" + $tds.attr("data-id"), "_blank");
			}
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以预览一个模板，请确认您只选择了一个模板！");
			return;
		}else{
			bc.msg.slide("请先选择要预览的模板！");
			return;
		}

	},
	/** 下载选择的*/
	download: function(){
		var $view=$(this);
		var $tds = $(this).find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			//取类型列data-value的值
			var type= $view.find(".bc-grid>.data>.right tr.ui-state-highlight>td:eq(2)").attr("data-value");
			if(type==3||type==4){
				bc.msg.slide("文本文件或html文件，请直接双击表格查看！");
			}else{
				window.open(bc.root + "/bc/template/download?id=" + $tds.attr("data-id"), "blank");
			}
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以下载一个模板，请确认您只选择了一个模板！");
			return;
		}else{
			bc.msg.slide("请先选择要下载的模板！");
			return;
		}
	},
	/** 删除选择的*/
	deleteone: function(){
		var $view=$(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			//取内置列data-value的值
			var inner= $view.find(".bc-grid>.data>.right tr.ui-state-highlight>td:eq(5)").attr("data-value");
			//内置
            if(inner=='0'){
            	bc.msg.alert("内置模板不能删除！");
    			return;
            }else{
            	bc.page.delete_.call($view);
            }
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以删除一个模板，请确认您只选择了一个模板！");
			return;
		}else{
			bc.msg.slide("请先选择要删除的模板！");
			return;
		}
		
		
	}
};