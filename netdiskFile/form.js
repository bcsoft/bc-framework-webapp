if(!window['bc'])window['bc']={};
bc.netdiskFileForm = {
	init : function() {
		var $form = $(this);
		//选择文件夹
		$form.find("#selectFolder").click(function() {
			bc.selectFolder({
				onOk : function(folder) {
					$form.find(":input[name='folder']").val(folder.name);
					$form.find(":input[name='pid']").val(folder.id);
				}
			});
		});
		
		//绑定添加访问者的按钮事件处理
		$form.find("#addVisitor").click(function(){
			bc.identity.selectUser({
				multiple: true,//可多选
				history: false,
				onOk: function(users){
					$.each(users,function(i,user){
//						if($lis.filter("[data-id='" + user.id + "']").size() > 0){//已存在
//							logger.info("duplicate select: id=" + user.id + ",name=" + user.name);
//						}else{//新添加的
//							if(!$ul.size()){//先创建ul元素
//								$ul = $(ulTpl).appendTo($form.find("#assignUsers"));
//							}
//							$(liTpl.format(user.id,user.name,title))
//							.appendTo($ul).find("span.click2remove")
//							.click(function(){
//								$(this).parent().remove();
//						});
//						}
					});
				}
			});
			});
		
	},
	/** 文件上传完毕后 */
	afterUploadfile : function(json){
		var $form = $(this).closest(".bc-page");
		logger.info("--"+$.toJSON(json));
		//文件信息
		var fileInfo = {};
		var fileInfos = [];
		if(json.success){
			fileInfo = {
					name : json.source,
					size : json.size,
					path : json.to
				};
			if(fileInfo)
				fileInfos.push(fileInfo);
				//上传文件
				bc.ajax({
					url: bc.root + "/bc/netdiskFile/uploadfile",
					dataType: "json",
					data: {fileInfo:$.toJSON(fileInfos)},
					success: function(json){
						logger.info("doLogout result=" + $.toJSON(json));
						//完成后提示用户
						bc.msg.slide(json.msg);
						if(json.success) bc.grid.reloadData($form);
						return false;
					}
				});
		}else
			bc.msg.alert(json.msg);
	},
	/** 文件夹上传完毕后 */
	afterUploadfolder : function(json){
		var $form = $(this).closest(".bc-page");
		logger.info("--"+$.toJSON(json));
		//文件信息
		var fileInfo = {};
		var fileInfos = [];
		if(json.success){
			fileInfo = {
					name : json.source,
					size : json.size,
					path : json.to,
					relativePath:json.relativePath,
					isDir:json.isDir,
					batchNo:json.batchNo
				};
			if(fileInfo)
				fileInfos.push(fileInfo);
				//上传文件
				bc.ajax({
					url: bc.root + "/bc/netdiskFile/uploadfolder",
					dataType: "json",
					data: {fileInfo:$.toJSON(fileInfos)},
					success: function(json){
						logger.info("doLogout result=" + $.toJSON(json));
						//完成后提示用户
						bc.msg.slide(json.msg);
						if(json.success) bc.grid.reloadData($form);
						return false;
					}
				});
		}else
			bc.msg.alert(json.msg);
	},
	//整理确定后的处理函数
	clickOk4clearUp : function(){
		var $form = $(this);
		var data = {};
		data.id=$form.find(":input[name='id']").val();
		data.pid=$form.find(":input[name='pid']").val();
		data.order=$form.find(":input[name='order']").val();
		data.title=$form.find(":input[name='title']").val();
		bc.ajax({
			url: bc.root + "/bc/netdiskFile/clearUp",
			dataType: "json",
			data: data,
			success: function(json){
				logger.info("doLogout result=" + $.toJSON(json));
				//完成后提示用户
				bc.msg.slide(json.msg);
				$form.data("data-status","saved");
				$form.dialog("close");
//				if(json.success) bc.grid.reloadData($form);
				return false;
			}
		});
	},
	//共享确定后的处理函数
	clickOk4Share : function(){
		
	}

};