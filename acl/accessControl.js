/**
 * 添加访问监控配置
 * @param {Object} option 配置参数
 * @option {String} docId [必填] 文档标识
 * @option {String} docType [必填] 文档类型				
 * @option {String} docName [必填] 文档名称				
 * @option {String} title [可选]	监控配置窗口标题			
 * @option {String} name [可选]	监控配置窗口名称			
 * @option {String} mid [可选] 监控配置窗口标识			
 */
bc.addAccessControl = function(option) {
	if(option.docId==null){
		bc.msg.alert("未配置文档标识");
		return;
	}
	
	if(option.docType==null){
		bc.msg.alert("未配置文档类型");
		return;
	}
	
	if(option.docName==null){
		bc.msg.alert("未配置文档名称");
		return;
	}

	//弹出选择对话框
	bc.page.newWin({
			url:bc.root+"/bc/accessControl/configureFromDoc",	
			data:{	docId:option.docId,
					docType:option.docType,
					docName:option.docName,
					isFromDoc:true},
			mid:option.mid ? option.mid : "configureFromDoc."+option.docId+"."+option.docType,
			name:option.name ? option.name : "["+option.docName+"]监控配置",
			title:option.title ? option.title : "["+option.docName+"]监控配置",
		});
}
