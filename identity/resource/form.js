bc.resourceForm = {
	init : function(option,readonly) {
		if(readonly) return;
		
		var $form = $(this);
		//绑定选择所属分类的按钮事件处理
		$form.find("#selectBelong").click(function(){
			var selecteds = $form.find(":input[name='e.belong.id']").val();
			var excludes = $form.find(":input[name='e.id']").val();
			bc.identity.selectResource({
				types: '1',
				selecteds: selecteds,
				excludes: excludes,
				onOk: function(resource){
					if(excludes != resource.id){
						$form.find(":input[name='e.belong.name']").val(resource.name);
						$form.find(":input[name='e.belong.id']").val(resource.id);
					}else{
						alert("不能选择自己作为自己的所属分类！");
					}
				}
			});
		});
		
		var urlText = $form.find("#urlText").attr("data-text");
		//绑定类型选择变动事件
		$form.find(":radio").change(function(){
			var $this = $(this);
			var type = $this.val()
			logger.info("select:" + this.id + "," + type);
			if(type == "5"){//操作--无需相关配置
				$form.find("td[data-name='iconClass'],td[data-name='option'],td[data-name='url']").hide();
				$form.find(":input[name='e.url']").removeAttr("data-validate");
				$form.find("#urlText").text(urlText + "：");
			}else{//链接
				$form.find("td[data-name='iconClass'],td[data-name='option'],td[data-name='url']").show();
				
				//如果是链接了类型，强制链接为必填域
				if(type == "2" || type == "3"){
					$form.find(":input[name='e.url']").attr("data-validate","required");
					$form.find("#urlText").text("*" + urlText + "：");
				}else{
					$form.find(":input[name='e.url']").removeAttr("data-validate");
					$form.find("#urlText").text(urlText + "：");
				}
			}
		});
		//以当前选中的选项触发一下change事件对界面做一下处理
		$form.find(":radio:checked").trigger("change");
		$form.find(":input[name='e.name']").focus();
		
		//绑定选择图标样式的按钮事件处理
		$form.find("#selectIconClass").click(function(){
			bc.page.newWin({
				url: bc.root + "/bc/shortcut/selectIconClass",
				name: "选择图标样式",
				mid: "selectShortcutIconClass4Module",
				afterClose: function(iconClass){
					logger.info("iconClass=" + iconClass);
					if(iconClass){
						$form.find(":input[name='e.iconClass']").val(iconClass);
					}
				}
			});
		});
	}
};