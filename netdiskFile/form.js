if(!window['bc'])window['bc']={};
bc.netdiskFileForm = {
	init : function() {
		var $form = $(this);
	},
	/** 文件上传完毕后 */
	afterUploadfile : function(json){
		var $form = $(this).closest(".bc-page");
		logger.info($.toJSON(json));
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
						bc.msg.info(json.msg);
						if(json.success) bc.grid.reloadData($form);
						return false;
					}
				});
		}else
			bc.msg.alert(json.msg);
	}
};