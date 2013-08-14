if(!window['bc'])window['bc']={};
bc.assetTypeForm = {
	init : function() {
		var $form = $(this);
		//选择文件夹
		$form.find("#selectFolder").click(function() {
			bc.selectFolder({
				folderId:$form.find(":input[name='e.id']").val(),
				onOk : function(folder) {
					$form.find(":input[name='folder']").val(folder.name);
					$form.find(":input[name='e.pid']").val(folder.id);
				}
			});
		});
}


/*bc.assetType = {
	init : function() {
		var $form = $(this);
		//绑定选择所属分组的事件
		$form.find("#selectOptionType").click(function(){
			var data = {};
			var selected = $form.find(":input[name='e.parent.id']").val();
			if(selected && selected.length > 0)
				data.selected = selected;
			
			var option = jQuery.extend({
				url: bc.root + "/bc/selectOptionType",
				name: "选择所属资产类别信息",
				mid: "selectOptionType",
				afterClose: function(status){
					if(status){
						$form.find(":input[name='e.parent.id']").val(status.id);
						$form.find(":input[name='e.parent.name']").val(status.name);
					}
				}
			},option);
			
			bc.page.newWin(option);
		});
		
	}
};*/