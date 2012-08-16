/**
 * 列表视图插件：导出为Excel
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-06-01
 * @depend list.js
 */
(function($) {

/**
 * 显示导出视图数据的配置界面-->用户选择-->导出excel
 * @param $grid 表格的jquery对象
 * @param el 导出按钮对应的dom元素
 */
bc.grid.export2Excel = function($grid,el) {
	//获取要导出的列名
	
	var html=[];
	html.push('<form class="bc-export" name="exporter" method="post">');
	
	//分页时添加“确认导出范围”
	var paging = $grid.find("li.pagerIconGroup.seek").size() > 0;
	if(paging){//分页
		html.push('<div class="rangeTitle">确认导出范围</div>'
			+'<ul class="rangeUl"><li>'
			+'<label for="exportScope1"><input type="radio" id="exportScope1" name="exportScope" value="1" checked><span>当前页</span></label>'
			+'<label for="exportScope2"><input type="radio" id="exportScope2" name="exportScope" value="2"><span>全部</span></label>'
			+'</li></ul>');
	}
	
	//添加剩余的模板内容
	html.push('<div class="headersTitle">选择导出字段</div>'
		+'<table class="headersTable" cellspacing="2" cellpadding="0"><tbody><tr>{0}</tr></tbody></table>'
		+'<div class="buttons">'
		+'<a id="continue" style="text-decoration:underline;cursor:pointer;">继续</a>&nbsp;&nbsp;'
		+'<a id="cancel" style="text-decoration:underline;cursor:pointer;">取消</a></div>'
		+'<input type="hidden" name="search">'
		+'<input type="hidden" name="exportKeys">'
		+'</form>');
	
	//获取列的定义信息
	var headerIds=[],headerNames=[];
	var fields = []
	var columns = $grid.find("div.header>div.right>table.table td");
	var maxh = 12;											// 控制1列最多输出的条目数
	var totalCount = columns.size();						// 总条目数
	var splitCount,headerCount;
	if(headerCount <= maxh ){
		splitCount = 1;
		headerCount = totalCount;
	}else{
		splitCount = Math.ceil(totalCount / maxh);			// 判断要分开为几大列
		headerCount = Math.ceil(totalCount / splitCount);	// 每列实际的条目数：尽量平均分配
	}
	
	if(logger.debugEnabled){
		logger.debug("splitCount=" + splitCount);
		logger.debug("headerCount=" + headerCount);
		logger.debug("totalCount=" + totalCount);
	}
	var allHeaders  = [];
	var _ul,index,$column;
	for(var i=0;i<splitCount;i++){
		_ul = [];
		_ul.push('<td class="headersTd"><ul>');
		for(var j=0;j<headerCount;j++){
			index = j + i * headerCount;
			if(index >= totalCount){
				break;
			}else{
				$column = $(columns[index]);
				_ul.push('<li>'
					+'<label>'
					+'<input type="checkbox" name="field" value="'+$column.attr("data-id")+'" checked>'
					+'<span>'+$column.attr("data-label")+'</span></label></li>');
			}
		}
		_ul.push('</ul></td>');
		allHeaders.push(_ul.join(""));
	}
	html = html.join("").format(allHeaders.join(""));
	
	//显示“确认导出”窗口
	var boxPointer = bc.boxPointer.show({
		of:el,dir:"top",close:"click",
		offset:"-8 -4",
		iconClass:null,
		appendTo: $grid.closest(".ui-dialog"),
		content:html
	});
	
	//取消按钮
	boxPointer.find("#cancel").click(function(){
		boxPointer.remove();
		return false;
	});
	
	//继续按钮
	boxPointer.find("#continue").click(function(){
		var $page = $grid.parents(".bc-page");
		var url=$page.attr("data-namespace") + "/export";
		logger.info("export grid data by url=" + url);
		var data = {};
		
		//导出格式
		data.exporting=true;
		data.exportFormat="xls";
		
		//导出范围
		var exportScope = boxPointer.find(":radio:checked[name='exportScope']").val();
		if(exportScope) data.exportScope=exportScope;
		
		//分页参数
		var $pager_seek = $page.find("ul.pager>li.seek");
		if(paging && data.exportScope != "2"){//视图为分页视图，并且用户没有选择导出范围为"全部"
			data["page.pageNo"] = $pager_seek.find("#pageNo").text();
			data["page.pageSize"] = $pager_seek.parent().find("li.size>a.ui-state-active>span.pageSize").text();
		}
		
		//附加页面的data-extras参数
		//  从page取
		var extras = $page.data("extras");
		logger.debug("page extras=" + $.toJSON(extras));
		if(extras){
			data = $.extend(data, extras);
		}else{
			//  从grid取
			extras = $page.find(".bc-grid").data("extras");
			logger.debug("grid extras=" + $.toJSON(extras));
			if(extras){
				data = $.extend(data, extras);
			}
		}
		
		//附加排序参数
		var $sortColumn = $page.find(".bc-grid .header .table td.sortable.asc,.bc-grid .header .table td.sortable.desc");
		if($sortColumn.size()){
			var sort = "";
			var $t;
			$sortColumn.each(function(i){
				$t = $(this);
				sort += (i == 0 ? "" : ",") + $t.attr("data-id") + ($t.hasClass("asc") ? " asc" : " desc");
			});
			data["sort"] = sort;
		}
		
		//将简单的参数附加到url后
		url += "?" + $.param(data);
		
		//附加要导出的列参数到隐藏域
		var $fields = boxPointer.find(":checkbox:checked[name='field']");
		if($fields.size() != columns.size()){//用户去除了部分的列没选择
			var t="";
			$fields.each(function(i){
				t+= (i == 0 ? "" : ",") + this.value;
			});
			boxPointer.find(":hidden[name='exportKeys']").val(t);
		}
		
		//附加搜索条件的参数到隐藏域(避免中文乱码) TODO 高级搜索
		var $search = $page.find(".bc-toolbar #searchText");
		if($search.size()){
			var searchText = $search.val();
			if(searchText && searchText.length > 0)
				boxPointer.find(":hidden[name='search']").val(searchText);
		}
		
		//提交表单
		var _form = boxPointer.find("form")[0];
		_form.action = url;
		_form.target = "blank";//这个需要在主页中配置一个名称为blank的iframe来支持
		_form.submit();
		
		//删除弹出的窗口
		boxPointer.remove();
		return false;
	});
};

})(jQuery);