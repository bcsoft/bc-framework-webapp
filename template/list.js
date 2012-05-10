bc.templateList = {
	/** 在线预览 */
	inline: function(){
		var $view=$(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			//获取选中的行
			var $tr = $view.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var type= $tr.find(">td:eq(3)").attr("data-value");//类型
			if(type==5){
				var tid=$tds.attr("data-id"); 
				var url =bc.root+"/bc/template/inline?tid=" + tid
				var win = window.open(url, "_blank");
				return win;
			}else{
				var n = $tr.find(">td:eq(4)").attr("data-value");// 获取文件名
				var f = "template/" + $tr.find(">td:eq(7)").attr("data-value");// 获取附件相对路径
				
				// 预览文件
				var option = {f: f, n: n};
				var ext = f.substr(f.lastIndexOf("."));
				if(type==2 && ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
					option.from="docx";
				}
				bc.file.inline(option);
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
			//获取选中的行
			var $tr = $view.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var type= $tr.find(">td:eq(3)").attr("data-value");//类型
			if(type==5){
				var tid=$tds.attr("data-id");
				var url =bc.root+"/bc/template/download?tid=" + tid
				var win = window.open(url, "blank");
				return win;
			}else{
				var n = $tr.find(">td:eq(4)").attr("data-value");// 获取文件名
				var f = "template/" + $tr.find(">td:eq(7)").attr("data-value");// 获取附件相对路径			
				// 下载文件
				bc.file.download({f: f, n: n});
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
            if(inner=='true'){
            	bc.msg.alert("内置模板不能删除！");
    			return;
            }
            
            bc.page.delete_.call($view);
		}else if($tds.length > 1){
			bc.msg.slide("一次只可以删除一个模板，请确认您只选择了一个模板！");
			return;
		}else{
			bc.msg.slide("请先选择要删除的模板！");
			return;
		}
	}
};