bc.privilege = {
	init : function(option,readonly) {
		if(readonly) return;
		
		
	},
	
	addUser : function() {
		$page = $(this);
		roleId = $('#edit_e_id').val();
		var userId = "";
		bc.identity.selectUser({
			multiple : true,
			onOk : function(userIds) {
				for(var i=0; i<userIds.length; i++) {
					if(i>0) userId+=",";
					userId += userIds[i].id;
				}
				jQuery.ajax({
					url : bc.root + "/bc/role/addUser",
					data : {
						roleId:roleId,
						userId:userId
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
		var groupId = "";
		bc.identity.selectGroup({
			multiple : true,
			onOk : function(groupIds) {
				for(var i=0; i<groupIds.length; i++) {
					if(i>0) groupId+=",";
					groupId += groupIds[i].id;
				}
				jQuery.ajax({
					url : bc.root + "/bc/role/addGroup",
					data : {
						roleId:roleId,
						groupId:groupId
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
		var unitOrDepId = "";
		bc.identity.selectUnitOrDepartment({
			multiple : true,
			onOk : function(unitOrDepIds) {
				for(var i=0; i<unitOrDepIds.length; i++) {
					if(i>0) unitOrDepId+=",";
					unitOrDepId += unitOrDepIds[i].id;
				}
				jQuery.ajax({
					url : bc.root + "/bc/role/addUnitOrDep",
					data : {
						roleId:roleId,
						unitOrDepId:unitOrDepId
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
	        	bc.msg.slide("请先选择要删除的条目！");
	            return false;
	        }
        // 获取选中的数据
	    bc.msg.confirm("确定要删除选定的"+$tds.length+"项吗？", function() {
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
				url : bc.root + "/bc/role/deleteActor",
				data : {
					roleId:roleId,
					actorId:actorId
				},
				dataType : "json",
				success : function(json) {
					bc.grid.reloadData($page);
				}
			});
	    });
	},
	
	addResource : function() {
		$page = $(this);
		roleId = $('#edit_e_id').val();
		var resourceId ="";
		bc.identity.selectResource({
			multiple : true,
			onOk : function(resourceIds) {
				for(var i=0; i<resourceIds.length; i++) {
					if(i>0) resourceId+=",";
					resourceId += resourceIds[i].id;
				}
				jQuery.ajax({
					url : bc.root + "/bc/role/addResource",
					data : {
						roleId:roleId,
						resourceId:resourceId
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
	        	bc.msg.slide("请先选择要删除的条目！");
	            return false;
	        }
	    
	    bc.msg.confirm("确定要删除选定的"+$tds.length+"项吗？", function() {
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
				url : bc.root + "/bc/role/deleteResource",
				data : {
					roleId:roleId,
					resourceId:resourceId
				},
				dataType : "json",
				success : function(json) {
					bc.grid.reloadData($page);
				}
			});
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
	},
	
	
};