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
			});
		//下载
		}else if(option.value == "xiazai"){

			var $page = $(this);
			// 确定选中的行
			var $trs = $page.find(">.bc-grid>.data>.right tr.ui-state-highlight");
			if($trs.length == 0){
				bc.msg.slide("请先选择需要下载的文件！");
				return;
			}else if($trs.length == 1){
				var $tr = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
				var $hidden = $tr.data("hidden");
				var n = $tr.find(">td:eq(2)").attr("data-value");// 获取文件名
				var f = "netdisk/" + $hidden.path;// 获取附件相对路径
				// 预览文件
				var option = {f: f, n: n,ptype:"Netdisk"};
				var ext = f.substr(f.lastIndexOf("."));
				if(ext=='.xls' || ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
					option.from="docx";
				}
				bc.file.download(option);
			}else{
				bc.msg.alert("每次只能下载一个文件！");
			}
		
		}
	},
	//整理
	clearUp : function(){
		var $page = $(this);
		// 确定选中的行
		var $trs = $page.find(">.bc-grid>.data>.right tr.ui-state-highlight");
		if($trs.length == 0){
			bc.msg.slide("请先选择需要整理的文件！");
			return;
		}else if($trs.length == 1){
			var data = {};
			var $leftTr = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
			var $rightTr = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var $hidden = $rightTr.data("hidden");
			data.id = $leftTr.attr("data-id");
			data.title = $rightTr.find(">td:eq(0)").attr("data-value");
			data.order = $rightTr.find(">td:eq(4)").attr("data-value");
			data.folder = $rightTr.find(">td:eq(1)").attr("data-value");
			data.pid = $hidden.pid;
			data.dialogType="zhengliwenjian";
			bc.page.newWin({
				mid: "zhengliwenjian",
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
		bc.page.newWin({
			mid: "gongxiang",
			name: "共享",
			url: bc.root + "/bc/netdiskFile/share",
		});
		
	},
	//预览
	preview : function(){
		var $page = $(this);
		// 确定选中的行
		var $trs = $page.find(">.bc-grid>.data>.right tr.ui-state-highlight");
		if($trs.length == 0){
			bc.msg.slide("请先选择需要预览的文件！");
			return;
		}else if($trs.length == 1){
			var $tr = $page.find(".bc-grid>.data>.right tr.ui-state-highlight");
			var $hidden = $tr.data("hidden");
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
			bc.msg.alert("每次只能预览一个文件！");
		}
	},
	//双击预览
	dblclick : function(){
		var $page = $(this);
		var $grid = $page.find(".bc-grid");
		var $tr = $grid.find(">.data>.right tr.ui-state-highlight");
		var $hidden = $tr.data("hidden");
		var n = $tr.find(">td:eq(2)").attr("data-value");// 获取文件名
		var f = "netdisk/" + $hidden.path;// 获取附件相对路径
		// 预览文件
		var option = {f: f, n: n,ptype:"Netdisk"};
		var ext = f.substr(f.lastIndexOf("."));
		if(ext=='.xls' || ext==".xml"){// Microsoft Word 2003 XML格式特殊处理
			option.from="docx";
		}
		bc.file.inline(option);
	}
};