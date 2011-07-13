bc.optionItemForm = {
	init : function() {
		var $form = $(this);
		//绑定选择所属分组的事件
		$form.find(":input[name='e.optionGroup.value']").click(function(){
			var data = {};
			var selected = $form.find(":input[name='e.optionGroup.id']").val();
			if(selected && selected.length > 0)
				data.selected = selected;
			
			var option = jQuery.extend({
				url: bc.root + "/bc/selectOptionGroup",
				name: "选择所属分组信息",
				mid: "selectOptionGroup",
				afterClose: function(status){
					if(status){
						$form.find(":input[name='e.optionGroup.id']").val(status.id);
						$form.find(":input[name='e.optionGroup.value']").val(status.name);
					}
				}
			},option);
			
			bc.page.newWin(option);
		});
	}
};