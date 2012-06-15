bc.templateList = {
	/** 在线查看 */
	inline: function(){
		var $view=$(this);
		var $tds = $view.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		if($tds.length == 1){
			//获取选中的行
			var $tr = $view.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var $hidden = $tr.data("hidden");
			var type=$hidden.typeCode;
			if(type=='custom'){
				var tid=$tds.attr("data-id"); 
				bc.ajax({
					url:bc.root+"/bc/template/isContent",
					data:{tid:tid},
					dataType:"json",
					success:function(json){
						if(!json.result){
							var url =bc.root+"/bc/template/inline?tid=" + tid;
							url += "&ptype=Template";
							url += "&puid=" + $hidden.uid;
							var win = window.open(url, "_blank");
							return win;
						}else{
							bc.msg.slide("模板内容为空！")
						}
					}
				});
			}else{
				var n = $tr.find(">td:eq(4)").attr("data-value");// 获取文件名
				var f = "template/" + $tr.find(">td:eq(7)").attr("data-value");// 获取附件相对路径
				
				// 预览文件
				var option = {f: f, n: n,ptype:"Template",puid:$hidden.uid};
				var ext = f.substr(f.lastIndexOf("."));
				if(type=='xls' && ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
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
			var $hidden = $tr.data("hidden");
			var type=$hidden.typeCode;//类型
			if(type=='custom'){
				var tid=$tds.attr("data-id");
				bc.ajax({
					url:bc.root+"/bc/template/isContent",
					data:{tid:tid},
					dataType:"json",
					success:function(json){
						if(!json.result){
							var url =bc.root+"/bc/template/download?tid=" + tid;
							url += "&ptype=Template";
							url += "&puid=" + $hidden.uid;
							var win = window.open(url, "blank");
							return win;
						}else{
							bc.msg.slide("模板内容为空！")
						}
					}
				});
			}else{
				var n = $tr.find(">td:eq(4)").attr("data-value");// 获取文件名
				var f = "template/" + $tr.find(">td:eq(7)").attr("data-value");// 获取附件相对路径			
				// 下载文件
				bc.file.download({f: f, n: n,ptype:"Template",puid:$hidden.uid});
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
		if($tds.length > 0){
			//取内置列data-value的值
			var $inner = $view.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var flag=false;
			$inner.each(function(index){	
				if($(this).find("td:eq(11)").attr("data-value")=='true'){
					flag=true;
				}	
			});
			//内置
           if(flag){
            	bc.msg.alert("内置模板不能删除！");
    			return;
            }
			bc.page.delete_.call($view);
		}else{
			bc.msg.slide("请先选择要删除的模板！");
			return;
		}
	},
	/** 配置模板类型 **/
	configType : function(){
		bc.page.newWin({
			url : bc.root+"/bc/templateTypes/list",
			name: "模板类型配置管理",
			mid : "templateTypeViews"		
		});
	}
	
};