if(!window['bc'])window['bc']={};
bc.assetTypeForm = {
	init : function() {
		var $form = $(this);
		// 选择所属类别
		$form.find("#selectAssetType").click(function(){
			var data = {};
			var selected = $form.find(":input[name='e.parent.id']").val();
			if(selected && selected.length > 0)
				data.selected = selected;
			
			var option = {
				url: bc.root + "/bc/assetType/select",
				name: "选择所属资产类别信息",
				mid: "selectAssetType",
				afterClose: function(status){
					if(status){
						$form.find(":input[name='e.parent.id']").val(status.id);
						$form.find(":input[name='e.parent.name']").val(status.name);
					}
				}
			};
			bc.page.newWin(option);
		});
	}
};