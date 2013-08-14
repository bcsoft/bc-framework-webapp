/*bc.selectOptionGroup = {
	init : function() {
		var $page = $(this);
		//绑定双击事件
		$page.find("select").dblclick(function(){
			bc.selectOptionGroup.clickOk.call($page[0]);
		});
	},
	clickOk : function() {
		var $page = $(this);
		var select = $page.find("select")[0];
		if(select.selectedIndex == -1){
			bc.msg.slide("必须先选择所属资产类别信息！");
			return false;
		}
		var item;
		if(select.multiple){//多选
			item=[];
			// 循环选定的每一个项目，将该项添加到列表中
			for (var i = 0; i < select.length; i++){
				if (select.options[i].selected){
					item.push({id: select.options[i].value,name: select.options[i].text});
				}
			}
		}else{//单选
			item={id: select.value,name: select.options[select.selectedIndex].text};
		}
		$page.data("data-status",item);
		$page.dialog("close");
	}
}*/
if(!window['bc'])window['bc']={};
bc.assetSelectDialog = {
	/** 点击确认按钮后的处理函数 */
	clickOk : function() {
		var $page = $(this);
		
		// 获取选中文件夹的信息
		var node =bc.tree.getSelected($page,true);
		var data={};
		if(node==null){
			//没有选中的文件夹提示
			bc.msg.alert("请先选择文件夹！");
			return false;
		}else{
			//不能将文件管理到分享给我的文件的根目录下
			if(node.id==-3){
				bc.msg.alert("不能将文件管理到分享给我的文件的根目录下！");
				return false;
			}
			//不能将文件管理到公共硬盘的根目录下
//			if(node.id==-2){
//				bc.msg.alert("不能将文件管理到公共硬盘的根目录下！");
//				return false;
//			}
			//组装文件夹数据
			if(node.id==-1 || node.id==-2){
			}else{
				data.id=node.id;
			}
			data.name=node.name;

		}
		
		// 返回
		$page.data("data-status", data);
		$page.dialog("close");
	}
};