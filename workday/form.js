bc.namespace("bc.workday");
bc.workday = {
	init:function(){
		/*var $form = $(this);
		
		var preId = $form.find("input[name='e.id']").val();
		var rootId = $form.find("input[name='rootId']").val();
		//点击所属分类
		$form.find("#selectCategoryType").click(function(){
			var option = {
					//data:{preCode: preCode,preId: preId},
					data: {preRoleId: rootId,preId: preId},
					onOk : function(status){
						if(status!=null){
							var value = status[0].name;
							var ids = status[0].id;	
							if(preId == ids){
								bc.msg.slide("不能添加自己为父类，请重新选择！");
							}else{
								$form.find("input[name='e.pid']").val(ids);
								$form.find("input[name='ptype']").val(value);
							}
							
						}
					},
					paging: "paging"};
			bc.category.selectCategory(option);
		});
		//清除所属分类
		$form.find("#clearSelectCategoryType").click(function(){
			$form.find("input[name='ptype']").val("");
			$form.find("input[name='e.pid']").val("");
		});*/
	},
	save:function(){
		var $page = $(this);
		var $form = $("form", $page);
		if (!bc.validator.validate($form)) { //如果验证失败
			return false;		
		}

		//调用标准的方法执行保存
		bc.page.save.call(this,{callback: function(json){
			if(json.success){
				bc.msg.alert(json.msg);
			}else{
				bc.msg.slide(json.msg);
			}
			
		}});
	},
	checkToDate: function(el, $form){
		var $form = $(el).closest("form");
		var from_date = $form.find(":input[name='e.fromDate']").val();
		var to_date = $form.find(":input[name='e.toDate']").val();
		if (to_date == null)  return false;
		if (new Date(to_date) < new Date(from_date)) return false;
		
		return true;
	},
	
}