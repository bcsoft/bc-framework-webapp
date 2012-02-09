bc.placeOriginForm = {
	init : function() {
		var $form = $(this);
		
		//获得带pid的籍贯的上级名称
		var pid=$form.find(":input[name='e.pid']").val();	
		if(pid!=""){
			var url=bc.root+"/bc/placeOrigin/findPlaceOriginPname?pid="+pid;
			$.ajax({
				url:url,
				dataType:"json",
				success:function(json){
					$form.find(":input[name='pname']").val(json.pname);
				}
			});
		}
		
		//点击选择上级小按钮弹出选择视图
		$form.find("#selectPname").click(function(){
			var selectType=$form.find("input:[name='e.type']:radio").val();
			var url=bc.root+"/bc/SelectPlaceOrigin?type="+selectType;
			bc.page.newWin({
				url:url,
				name:"选择上级名称",
				afterClose: function(placeorigin){
					
					/*logger.info("iconClass=" + iconClass);
					if(iconClass){
						$form.find(":input[name='e.iconClass']").val(iconClass);
					}*/
				}
			});
		});
	}
};