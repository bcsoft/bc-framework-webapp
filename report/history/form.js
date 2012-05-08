bc.reportHistoryForm = {
	init : function(option,readonly) {
		var $form = $(this);

		//隐藏信息
		$form.find("#idReportMsgError").hide();
		
		//绑定显示异常信息按钮事件
		$form.find("#showReportMsgError").click(function(){
			$form.find("#idReportMsgError").show();
		});
		
		//绑定下载按钮事件
		$form.find("#reportHistoryDownLoad").click(function(){
			var n = $form.find(":input[name='e.subject']").val();// 获取文件名
			var sub_path="report/history/";
			var path=$form.find(":input[name='e.path']").val()
			var f = sub_path+path;// 获取附件相对路径
			
			if(n==''||path==''){
				bc.msg.slied("附件路径错误，不能下载");
				return;
			}
			// 下载文件
			bc.file.download({f: f, n: n});
		});
		
		//绑定在线查看按钮事件
		$form.find("#reportHistoryInline").click(function(){
			var n = $form.find(":input[name='e.subject']").val();// 获取文件名
			var sub_path="report/history/";
			var path=$form.find(":input[name='e.path']").val()
			var f = sub_path+path;// 获取附件相对路径
			
			if(n==''||path==''){
				bc.msg.slied("附件路径错误，不能查看！");
				return;
			}
			// 预览文件
			var option = {f: f, n: n};
			var ext = f.substr(f.lastIndexOf("."));
			if(ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
				option.from="docx";
			}
			bc.file.inline(option);
		});
	}
};