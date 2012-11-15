if(!window['bc'])window['bc']={};
bc.netdiskFileView = {
	init : function() {
		var $form = $(this);
		//如果是火狐或苹果浏览器不支持上传文件夹
		if(!$.browser.webkit){
			$form.find(":input[name='uploadFolder']").remove();
		}
		
	},
		//操作按钮组
	selectMenuButtonItem : function(option) {
		var $page = $(this);
		//上传文件
		if (option.value == "shangchuanwenjian") {

		//上传文件夹
		}else if (option.value == "shangchuanwenjianjia") {
			//如果是火狐或苹果浏览器不支持上传文件夹
			if(!$.browser.webkit){
				bc.msg.alert("您的浏览器不支持上传整个文件夹。我们建议您使用 Google Chrome 网络浏览器，该浏览器支持文件夹上传。")
			}
			
		//新建文件夹
		}else if(option.value == "xinjianwenjianjia"){
			bc.page.newWin({
				mid: "xinjianwenjianjia",
				name: "新建文件夹",
				url: bc.root + "/bc/netdiskFile/create",
				afterClose: function(status){
					if(status)bc.grid.reloadData($page);
				}
			});
		//下载
		}else if(option.value == "xiazai"){

			var $page = $(this);
			// 确定选中的行
			var $trs = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
			if($trs.length == 0){
				bc.msg.slide("请先选择需要下载的文件！");
				return;
			}else if($trs.length == 1){
				var $tr = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
				var $hidden = $tr.data("hidden");
				//文件才支持下载，文件夹不支持
				if($hidden.type==1){
					var n = $tr.find(">td:eq(1)").attr("data-value");// 获取文件名
					var f = "netdisk/" + $hidden.path;// 获取附件相对路径
					// 预览文件
					var option = {f: f, n: n,ptype:"Netdisk"};
					var ext = f.substr(f.lastIndexOf("."));
					if(ext=='.xls' || ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
						option.from="docx";
					}
					bc.file.download(option);
				}else{
					bc.msg.alert("文件夹不支持直接下载！");
				}
					
			}else{
				bc.msg.alert("每次只能下载一个文件！");
			}
		
		}
	},
	//整理
	clearUp : function(){
		var $page = $(this);
		// 确定选中的行
		var $trs = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
		if($trs.length == 0){
			bc.msg.slide("请先选择需要整理的文件！");
			return;
		}else if($trs.length == 1){
			var data = {};
			var $leftTr = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
			var $rightTr = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var $hidden = $rightTr.data("hidden");
			data.id = $leftTr.attr("data-id");
//			data.title = $rightTr.find(">td:eq(1)").attr("data-value");
//			data.order = $rightTr.find(">td:eq(5)").attr("data-value");
			data.folder = $rightTr.find(">td:eq(0)").attr("data-value");
//			data.pid = $hidden.pid;
			data.dialogType="zhengliwenjian";
			bc.page.newWin({
				mid: "zhengliwenjian"+$leftTr.attr("data-id"),
				name: "整理文件夹/整理文件",
				data: data,
				url: bc.root + "/bc/netdiskFile/createDialog",
				afterClose: function(status){
					if(status)bc.grid.reloadData($page);
				}
			});
		}else{
			bc.msg.alert("每次只能整理一个文件！");
		}
		
	},
	//共享
	share : function(){
		var $page = $(this);
		// 确定选中的行
		var $trs = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
		var $leftTr = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");

		if($trs.length == 0){
			bc.msg.slide("请先选择需要共享的文件！");
			return;
		}else if($trs.length == 1){
			var data = {};
			data.id = $leftTr.attr("data-id");
			data.dialogType="gongxiang";
			bc.page.newWin({
				mid: "gongxiang",
				name: "共享",
				data: data,
				url: bc.root + "/bc/netdiskFile/createDialog",
				afterClose: function(status){
					if(status)bc.grid.reloadData($page);
				}
			});
		}else{
			bc.msg.alert("每次只能共享一个文件！");
		}
	},
	//预览
	preview : function(){
		var $page = $(this);
		// 确定选中的行
		var $trs = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
		if($trs.length == 0){
			bc.msg.slide("请先选择需要预览的文件！");
			return;
		}else if($trs.length == 1){
			var $tr = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var $hidden = $tr.data("hidden");
			//文件才支持在线预览，文件夹不支持
			if($hidden.type==1){
				var n = $tr.find(">td:eq(2)").attr("data-value");// 获取文件名
				var f = "netdisk/" + $hidden.path;// 获取附件相对路径
				// 预览文件
				var option = {f: f, n: n,ptype:"Netdisk"};
				var ext = f.substr(f.lastIndexOf("."));
				if(ext=='.xls' || ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
					option.from="docx";
				}
				bc.file.inline(option);
			}else{
				bc.msg.alert("文件夹不支持在线查看！");
			}

		}else{
			bc.msg.alert("每次只能预览一个文件！");
		}
	},
	//双击预览
	dblclick : function(){
		var $page = $(this);
		var $grid = $page.find(".bc-grid");
		var $tr = $grid.find(">.data>.right tr.ui-state-highlight");
		var $hidden = $tr.data("hidden");
		//文件才支持在线预览，文件夹不支持
		if($hidden.type==1){
			var n = $tr.find(">td:eq(2)").attr("data-value");// 获取文件名
			var f = "netdisk/" + $hidden.path;// 获取附件相对路径
			// 预览文件
			var option = {f: f, n: n,ptype:"Netdisk"};
			var ext = f.substr(f.lastIndexOf("."));
			if(ext=='.xls' || ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
				option.from="docx";
			}
			bc.file.inline(option);
		}else{
			bc.msg.alert("该文件的类型是文件夹不支持在线预览！");
		}
	},
	//删除
	remove : function(){
		var $page = $(this);
		var $leftTr = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		var id = $leftTr.attr("data-id");
		// 确定选中的行
		var $trs = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
		if($trs.length == 0){
			bc.msg.slide("请先选择需要删除的文件！");
			return;
		}else if($trs.length == 1){
			var $tr = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var $hidden = $tr.data("hidden");
				//删除一份文件
				if($hidden.type==1){
					bc.msg.confirm("是否确定要删除该文件吗?",function(){
						bc.ajax({
							url: bc.root + "/bc/netdiskFile/delete",
							dataType: "json",
							data: {id:id},
							success: function(json){
								bc.msg.slide(json.msg);
								if(json.success){
									$page.data("data-status","saved");
									bc.grid.reloadData($page);
								}
							}
						});
					});
				}else{
				//删除一份文件夹
				var div4Delete = bc.msg.confirm("是否确定要删除该文件夹吗?<br><input type=\"checkbox\" name=\"isRelevanceDelete\" style=\"width:1em;\">删除该文件夹下的子文件",function(){
					var $div = $(div4Delete);
					var isRelevanceDelete = $div.find(":input[name='isRelevanceDelete']")[0].checked;
					bc.ajax({
						url: bc.root + "/bc/netdiskFile/delete",
						dataType: "json",
						data: {id:id,isRelevanceDelete:isRelevanceDelete},
						success: function(json){
							if(json.success){
								bc.msg.slide(json.msg);
								$page.data("data-status","saved");
								bc.grid.reloadData($page);
							}else{
								bc.msg.alert(json.msg);
							}
						}
					});
				});
				}
			}else{//多选
				var ids = "";
				//是否存在文件夹
				var isFolder = false;
				var $trs = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
				var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
					$tds.each(function(i){
						if($($trs.get(i)).data("hidden").type==0){
							isFolder=true;
						}
						//组装id
						ids += $(this).attr("data-id") + (i == $tds.length-1 ? "" : ",");
				
					});
				//删除多份文件中含有文件夹的提示
				if(isFolder){
					var div4Delete = bc.msg.confirm("删除的多份文件中包含文件夹！是否删除文件夹下的子文件？<br><input type=\"checkbox\" name=\"isRelevanceDelete\" style=\"width:1em;\">删除文件夹下的子文件",function(){
						var $div = $(div4Delete);
						var isRelevanceDelete = $div.find(":input[name='isRelevanceDelete']")[0].checked;
						bc.ajax({
							url: bc.root + "/bc/netdiskFile/delete",
							dataType: "json",
							data:{ids:ids,isRelevanceDelete:isRelevanceDelete},
							success: function(json){
								if(json.success){
									bc.msg.slide(json.msg);
									$page.data("data-status","saved");
									bc.grid.reloadData($page);
								}else{
									bc.msg.alert(json.msg);
								}
							}
						});
					});
				}else{
					bc.msg.confirm("是否确定要删除多份文件吗?",function(){	
						bc.ajax({
							url: bc.root + "/bc/netdiskFile/delete",
							dataType: "json",
							data:{ids:ids},
							success: function(json){
								if(json.success){
									bc.msg.slide(json.msg);
									$page.data("data-status","saved");
									bc.grid.reloadData($page);
								}else{
									bc.msg.alert(json.msg);
								}
							}
						});
					});	
				}
			}
	}
};