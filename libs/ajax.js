/**
 * 对$.ajax的通用封装:全局ajax设置
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 */
jQuery(function($){
	var defaultAjaxOption = {
		type: "POST",
		error: function(request, textStatus, errorThrown) {
			if(bc.page.showError){
				//显示漂亮的错误提示窗口
				bc.page.showError({url:this.url, more:request.responseText || request.responseHTML,from:"bc.ajax.error"});
			}else{
				var msg = "bc.ajax: textStatus=" + textStatus + ";errorThrown=" + errorThrown;
				alert(request.responseText || request.responseHTML);
			}
		}
	};
	$.ajaxSetup(defaultAjaxOption);
	bc.ajax = function(option){
		option = $.extend(defaultAjaxOption,option);
		jQuery.ajax(option);
	};
});