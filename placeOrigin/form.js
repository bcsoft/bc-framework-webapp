bc.placeOriginForm = {
	init : function() {
		var $form = $(this);

		// 获得带pid的籍贯的上级名称
		var pid = $form.find(":input[name='e.pid']").val();
		if (pid != "") {
			var url = bc.root + "/bc/placeOrigin/findPlaceOriginPname?pid="
					+ pid;
			$.ajax({
				url : url,
				dataType : "json",
				success : function(json) {
					$form.find(":input[name='pname']").val(json.pname);
					$form.find(":input[name='pfullname']").val(json.pname);
				}
			});
		}

		// 点击选择上级小按钮弹出选择视图
		$form.find("#selectPname").click(function() {
					var selectType = $form.find("input:[name='e.type']:radio:[checked]").val();
					// 如果为省级，则无上级可选
					if (selectType == 1) {
						bc.msg.info("你好，此类型没有上级可以选择！");
					} else if (selectType == 2 || selectType == 3) {
						var url = bc.root + "/bc/selectSuperiorPlace/paging";
						if (selectType == 2) {// 地级 应选省级
							selectType = 1;
						} else {// 县级 应选地级
							selectType = '1,2';
						}

						// 构建默认参数
						var option = jQuery.extend({
							mid : 'selectSuperiorPlace',
							paging : true,
							title : '选择上级信息',
							types : selectType
						}, option);

						// 将一些配置参数放到data参数内(这些参数是提交到服务器的参数)
						option.data = jQuery.extend({
							status : '0',
							multiple : false
						}, option.data);
						if (option.types)
							option.data.types = option.types;
						if (option.title)
							option.data.title = option.title;
						if (option.selecteds)
							option.data.selecteds = option.selecteds;
						if (option.multiple === true)
							option.data.multiple = true;

						// 弹出选择对话框
						bc.page.newWin(jQuery.extend({
							url : url,
							name : option.title,
							mid : option.mid,
							afterClose : function(superiorPlace) {
								if (superiorPlace) {
									$form.find(":input[name='e.pid']").val(superiorPlace.id);
									$form.find(":input[name='pname']").val(superiorPlace.name);
									if($form.find(":input[name='e.code']").val()==''){
										if(superiorPlace.level=='省级'){
											var $val=superiorPlace.core.substring(0,2);
											$form.find(":input[name='e.code']").val($val)
											var zero = "000000000";
											$form.find(":input[name='e.fullcode']").val(
													$val + zero);
										}else{
											var $val=superiorPlace.core.substring(0,4);
											$form.find(":input[name='e.code']").val($val)
											var zero = "000000000";
											$form.find(":input[name='e.fullcode']").val(
													$val + zero);
										}
									}
									
									
									if(superiorPlace.fullname){
										$form.find(":input[name='e.fullname']").val(superiorPlace.fullname+
												$form.find(":input[name='e.name']").val());
										$form.find(":input[name='pfullname']").val(superiorPlace.fullname);
									}
								}
							}
						}, option));
					}
				});
		
		//点击清除上级按钮事件
		$form.find("#clearPname").click(function() {
			$form.find(":input[name='e.fullname']").val($form.find(":input[name='e.name']").val());
				});
		
		// 丢失名称焦点时触发事件
		$form.find(":input[name='e.name']").blur(function() {
			$form.find(":input[name='e.fullname']").val(
					$form.find(":input[name='pfullname']").val()+$form.find(":input[name='e.name']").val());
				});
		
		// 输入编码时 自动生成全编码
		$form.find(":input[name='e.code']").blur(
				function() {
					var $val = $(this).val();
					var length = $val.length;
					var typeR = $form.find(
							"input:[name='e.type']:radio:[checked]").val();
					logger.info(length);

					if (length == 0) {
						$form.find(":input[name='e.fullcode']").val('');
					}
					// 长度为不超过6位
					else if (length <= 6) {
						// 选中性省级，低级，县级
						if ((typeR == 1 || typeR == 2) || typeR == 3) {
							var zero = "000000000";
							$form.find(":input[name='e.fullcode']").val(
									$val + zero);
						}
					}
				});
	}
};