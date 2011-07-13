/**
 * 对$.ajax的通用封装
 * 
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 */
bc.ajax = function(option){
	option = $.extend({
		type: "POST",
		error: function(request, textStatus, errorThrown) {
			if(bc.page.showError){
				//显示漂亮的错误提示窗口
				bc.page.showError({url:option.url, more:request.responseText || request.responseHTML,from:"bc.ajax.error"});
			}else{
				var msg = "bc.ajax: textStatus=" + textStatus + ";errorThrown=" + errorThrown;
				alert(request.responseText || request.responseHTML);
			}
		}
	},option);
	jQuery.ajax(option);
};