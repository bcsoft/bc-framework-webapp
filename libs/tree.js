/**
 * 树
 * 
 * @author rongjihuang@gmail.com
 * @date 2012-11-13
 * @depend jquery-ui-1.8,bc.core
 */
(function($) {
bc.tree = {
	/**
	 * 默认配置
	 */
	option: {
		/* 样式 */
		class_container: "bc-tree",	/* 容器样式 */
		class_node_selected: "ui-state-focus",	/* 节点被选中样式 */
		class_node_hover: "ui-state-hover"	/* 节点鼠标悬停样式 */
	},
	
	/**
	 * 初始化
	 * @param container 对话框内容的jquery对象
	 */
	init: function(container) {
		//alert(container);
		// 添加树的全局样式
		var $tree = $(container);
		$tree.toggleClass(bc.tree.option.class_container,true);
		
		//禁止选择文字
		if($tree.disableSelection) $tree.disableSelection();
	},
	/** 选择节点 */
	selectNode: function($node){
		$node.closest("." + bc.tree.option.class_container).find(".item." + bc.tree.option.class_node_selected)
		.toggleClass(bc.tree.option.class_node_selected,false).toggleClass("ui-state-normal",true);
		
		$node.children(".item").toggleClass(bc.tree.option.class_node_selected,true).toggleClass("ui-state-normal",false);
	},
	/** 展开折叠节点 */
	toggleNode: function($node){
		// 检测是否需要远程加载下级节点的数据
		var needLoadRemoteData = ($node.is(".collapsed") && $node.has(">table.nodes").size() == 0);
		
		// 切换样式
		$node.toggleClass("open collapsed");
		$node.find(">.item>.nav-icon").toggleClass("ui-icon ui-icon-triangle-1-se ui-icon ui-icon-triangle-1-e");
		$node.find(">.item>.type-icon").toggleClass("ui-icon-folder-open ui-icon-folder-collapsed");
		
		// 远程加载下级节点数据
		logger.info("needLoadRemoteData=" + needLoadRemoteData);
		if(needLoadRemoteData){
			var $tree = $node.closest(".bc-tree");
			var nodeId = bc.tree.getNodeId($node);
			bc.tree.reload($tree,nodeId,function(nodeId,html){
				
			});
		}
	},
	/** 获取选中的节点信息
	 * @param $tree 
	 * @param returnJson true|false {id:..., name:...,el:...}
	 */
	getSelected: function($tree,returnJson){
		var $items = $tree.find("div.item." + bc.tree.option.class_node_selected);
		if($items.length == 1){
			if(returnJson){
				return {
					id: $items.attr("data-id"),
					name: $items.children(".text").text(),
					el: $items.get(0)
				};
			}else{
				return $items.attr("data-id");
			}
		}else if($items.length > 1){
			var r = [];
			$items.each(function(i){
				var $t = $(this);
				if(returnJson){
					r.push({
						id: $t.attr("data-id"),
						name: $t.children(".text").text(),
						el: $t.get(0)
					});
				}else{
					r.push($t.attr("data-id"));
				}
			});
			return r;
		}else{
			return null;
		}
	},
	/** 获取选中的节点
	 * @param $tree 
	 * @param nodeId 节点ID
	 */
	getNode: function($tree,nodeId){
		return bc.tree.getNodeItem($tree,nodeId).parent();
	},
	/** 获取选中的节点对象
	 * @param $tree 
	 * @param nodeId 节点ID
	 */
	getNodeItem: function($tree,nodeId){
		var $items = $tree.find("div.item[data-id='" + nodeId + "']");
		if($items.length == 1){
			return $($items.get(0));
		}else if($items.length > 1){
			return $items;
		}else{
			return null;
		}
	},
	/** 获取指定节点的ID
	 * @param $node 节点
	 */
	getNodeId: function($node){
		return $node.children("div.item").attr("data-id");
	},
	/** 获取指定节点的父节点ID
	 * @param $node 节点
	 */
	getParentNodeId: function($node){
		return $node.parent().closest(".treeNode").children("div.item").attr("data-id");
	},
	/** 重新加载
	 * @param $tree 
	 * @param nodeId 要更新的节点，没有配置就更新整棵树
	 * @param callback 加载完毕后的回调函数
	 */
	reload: function($tree,nodeId,callback) {
		var ts = "tree.reload." + new Date().getTime();
		logger.profile(ts);
		
		var $page = $tree.closest(".bc-page");
		// 显示加载动画
		var $loader = $('<div class="loader"></div>').appendTo($tree);
		$loader.css({
			top: ($tree.height() - $loader.height())/2,
			left: ($tree.width() - $loader.width())/2
		});

		// 获取树的配置参数
		var url = $tree.attr("data-url");
		var cfg = $tree.data("cfg") || {};

		//==附加额外的请求参数
		var data = {};
		//  从page取
		var extras = $page.data("extras");
		if(extras){
			data = $.extend(data, extras);
		}
		
		//  从tree取
		extras = $tree.data("extras");
		if(extras){
			data = $.extend(data, extras);
		}
		
		// 附加节点参数
		if(nodeId) data.pid = nodeId;
		
		// Ajax请求获取信息
		bc.ajax({
			url : url, data: data,
			dataType : "json",
			type: "POST",
			success : function(json) {
				// json格式：{success:true|false, subNodesCount: [子节点数量], msg: [success=false时的异常信息]}
				// 加载失败的提示
				if(!json.success){
					bc.msg.info("加载节点数据失败：" + json.msg);
					return;
				}
				
				// 更新节点的html
				var $updateNode;
				if(nodeId){			// 更新节点
					$updateNode = bc.tree.getNode($tree,nodeId);
				}else{				// 更新整棵树
					$updateNode = $tree;
				}
				$updateNode.children("table.nodes").remove();
				if(json.subNodesCount > 0){
					var $html = $(json.html);
					$html.find(">tbody>tr>td.treeNode").attr("data-level",parseInt($updateNode.attr("data-level"))+1);
					$html.appendTo($updateNode);
				}
				
				// 更新子节点的level
				
				//删除加载动画
				$loader.remove();
				logger.profile(ts);
				
				//调用回调函数
				if(typeof callback == "function"){
					// 上下文为树，第一个参数为传入的节点ID值
					callback.call($tree.get(0),nodeId,json);
				}
				if(cfg.afterLoad){
					var _fn = cfg.afterLoad;
					if(typeof cfg.afterLoad == "string"){
						cfg.afterLoad = bc.getNested(cfg.afterLoad);
					}
					if(typeof cfg.afterLoad == "function"){
						// 上下文为树，第一个参数为传入的节点ID值
						cfg.afterLoad.call($tree.get(0),nodeId,json);
					}else{
						alert("回调函数没有定义：" + _fn);
					}
				}
			}
		});
	}
};

// 节点的事件监听
$(document).on("mouseover mouseout click dblclick", ".treeNode > .item",function(e){
	e.stopPropagation();
	var $nodeItem = $(this);
	var $node = $nodeItem.parent();
	if (e.type == 'click') {										// 单击节点
		bc.tree.selectNode($node);
		if ($(e.target).is(".nav-icon:visible")){
			bc.tree.toggleNode($node);
			return;
		}
		//console.log(bc.tree.getSelected($node.closest("." + bc.tree.option.class_container),true));
		
		// 调用回调函数
		var $tree = $node.closest("." + bc.tree.option.class_container);
		var cfg = $tree.data("cfg");
		if(cfg && cfg.clickNode){// 点击节点调用的函数
			var fn = cfg.clickNode;
			if(typeof cfg.clickNode == "string"){
				var $page = $tree.closest(".bc-page");
				if ($page.size() > 0 && $page.data("scope")) {
					fn = $page.data("scope")[cfg.clickNode];
				} else {
					fn = bc.getNested(cfg.clickNode);
				}
			}
			if(typeof fn == "function"){
				// 上下文为树，第一个参数为选中的节点值，格式为：{id:..., name:...,el:...}
				fn.call($tree.get(0),{
					id: $nodeItem.attr("data-id"),
					name: $nodeItem.children(".text").text(),
					el: $nodeItem.get(0)
				});
			}else{
				alert("回调函数没有定义：" + cfg.clickNode);
			}
		}
	}else if (e.type == 'dblclick') {								// 双击节点
		console.log("dblclick:todo");
	}else if (e.type == 'mouseover') {	// 鼠标悬停及离开行
		$nodeItem.toggleClass(bc.tree.option.class_node_hover,true).toggleClass("ui-state-normal",false);
	}else if (e.type == 'mouseout') {	// 鼠标悬停及离开行
		$nodeItem.toggleClass(bc.tree.option.class_node_hover,false).filter(":not(." + bc.tree.option.class_node_selected + ")").toggleClass("ui-state-normal",true);
	}
});

// 节点右侧操作按钮的事件监听 TODO
$(document).on("mouseover mouseout click", ".treeNode>.item>ul.buttons>li", function(e){
	e.stopPropagation();
	var $button = $(this);
	var $node = $button.closest(".node");
	if (e.type == 'click') {										// 单击
		console.log("click nodeButton");
		// TODO
	}else if (e.type == 'mouseover' || e.type == 'mouseout') {		// 鼠标悬停及离开行
		$button.toggleClass("ui-state-hover ui-corner-all");
	}
});

})(jQuery);