if(!window['bc'])window['bc']={};
bc.netdiskFileView = {
		//操作按钮组
	selectMenuButtonItem : function(option) {
		var $page = $(this);
		//上传文件
		if (option.value == "shangchuanwenjian") {

			//alert("开发中！..........上传文件");
		//上传文件夹
		}else if (option.value == "shangchuanwenjianjia") {
			alert("开发中！..........上传文件夹");
		//新建文件夹
		}else if(option.value == "xinjianwenjianjia"){
			bc.page.newWin({
				mid: "xinjianwenjianjia",
				name: "新建文件夹",
				url: bc.root + "/bc/netdiskFile/create",
			});
		//下载
		}else if(option.value == "xiazai"){
			alert("开发中！..........下载");
		}
	},
	//整理
	clearUp : function(){
		bc.page.newWin({
			mid: "zhengliwenjian",
			name: "整理文件夹/整理文件",
			url: bc.root + "/bc/netdiskFile/clearUp",
		});
		
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
			//alert("开发中！..........预览");		
		}else{
			alert("每次只能预览一个文件！");
		}

		
	}
};