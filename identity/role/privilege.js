bc.privilege = {
	init : function(option,readonly) {
		if(readonly) return;
		
		
	},
	
	addUser : function() {
		$page = $(this);
		roleId = $('#edit_e_id').val();
		bc.identity.selectUser({
			onOk : function(user) {
				jQuery.ajax({
					url : bc.root + "/bc/privilege/addUser",
					data : {
						roleId:roleId,
						userId:user.id
					},
					dataType : "json",
					success : function(json) {
						bc.grid.reloadData($page);
					}
				});
			}
		})
	},
	
	
	addGroup : function() {
		$page = $(this);
		roleId = $('#edit_e_id').val();
		bc.identity.selectGroup({
			onOk : function(group) {
				jQuery.ajax({
					url : bc.root + "/bc/privilege/addGroup",
					data : {
						roleId:roleId,
						groupId:group.id
					},
					dataType : "json",
					success : function(json) {
						bc.grid.reloadData($page);
					}
				});
			}
		});
	},
	
	addUnitOrDep : function() {
		$page = $(this);
		roleId = $('#edit_e_id').val();
		bc.identity.selectUnitOrDepartment({
			onOk : function(unitOrDepId) {
				jQuery.ajax({
					url : bc.root + "/bc/privilege/addUnitOrDep",
					data : {
						roleId:roleId,
						unitOrDepId:unitOrDepId.id
					},
					dataType : "json",
					success : function(json) {
						bc.grid.reloadData($page);
					}
				});
			}
		});
	},
	
	deleteActor : function() {
		$page = $(this);
		roleId = $('#edit_e_id').val();
		actorId = null;
		 var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
	        if($tds.length == 0){
	        	bc.msg.info("请先选择！");
	            return false;
	        }
        // 获取选中的数据
        var data;
        var $grid = $page.find(".bc-grid");
        if($grid.hasClass("singleSelect")){//单选
            data = {};
            data.id = $tds.attr("data-id");
        }else{//多选
            data = [];
            var $trs = $grid.find(">.data>.right tr.ui-state-highlight");
            $tds.each(function(i){
                data.push($(this).attr("data-id"));
            });
        }
       
        if(data instanceof Array) {
        	actorId = data.join(",");
        } else {
        	actorId = data.id;
        }
        jQuery.ajax({
			url : bc.root + "/bc/privilege/deleteActor",
			data : {
				roleId:roleId,
				actorId:actorId
			},
			dataType : "json",
			success : function(json) {
				bc.grid.reloadData($page);
			}
		});
	},
	
	addResource : function() {
		$page = $(this);
		roleId = $('#edit_e_id').val();
		bc.identity.selectResource({
			onOk : function(resourceId) {
				jQuery.ajax({
					url : bc.root + "/bc/privilege/addResource",
					data : {
						roleId:roleId,
						resourceId:resourceId.id
					},
					dataType : "json",
					success : function(json) {
						bc.grid.reloadData($page);
					}
				});
			}
		});
	},
	
	deleteResource : function() {
		$page = $(this);
		roleId = $('#edit_e_id').val();
		resourceId = null;
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
	        if($tds.length == 0){
	        	bc.msg.info("请先选择！");
	            return false;
	        }
        // 获取选中的数据
        var data;
        var $grid = $page.find(".bc-grid");
        if($grid.hasClass("singleSelect")){//单选
            data = {};
            data.id = $tds.attr("data-id");
        }else{//多选
            data = [];
            var $trs = $grid.find(">.data>.right tr.ui-state-highlight");
            $tds.each(function(i){
                data.push($(this).attr("data-id"));
            });
        }
       
        if(data instanceof Array) {
        	resourceId = data.join(",");
        } else {
        	resourceId = data.id;
        }
        jQuery.ajax({
			url : bc.root + "/bc/privilege/deleteResource",
			data : {
				roleId:roleId,
				resourceId:resourceId
			},
			dataType : "json",
			success : function(json) {
				bc.grid.reloadData($page);
			}
		});
	},
	
	LookActor : function() {
		$page = $(this);
		var $tds = $page.find(".bc-grid>.data>.left tr.ui-state-highlight>td.id");
		var id = $tds.attr("data-id");
		var $grid = $page.find(".bc-grid");
		var $trs = $grid.find(">.data>.right tr.ui-state-highlight");
		var type = $trs.find("td:eq(0)").attr("data-value");
		var name = $trs.find("td:eq(1)").attr("data-value");
		var url = null;
		if(type==1) {//1单位2部门3岗位4用户
			url = bc.root + "/bc/unit/edit";
		} else if(type==2) {
			url = bc.root + "/bc/department/edit";
		} else if(type==3) {
			url = bc.root + "/bc/group/edit";
		} else if(type==4) {
			url = bc.root + "/bc/user/edit";
		} else {
			url=null;
		}
		if(url==null) return;
		bc.page.newWin({
			url: url,
			name : name,
			mid : url,
			data : {
				id : id
			},
			afterClose: function(status){
				if(status && typeof(option.onOk) == "function"){
					option.onOk(status);
				}
			}
		});
	}
	
};