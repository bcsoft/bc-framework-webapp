/**
 * 对$.ajax的通用封装:全局ajax设置
 *
 * @author rongjihuang@gmail.com
 * @date 2011-04-24
 */
jQuery(function ($) {
  var defaultAjaxOption = {
    type: "POST",
    error: function (request, textStatus, errorThrown) {
      if (bc.page.showError) {
        logger.error("bc.ajax error!");
        //显示漂亮的错误提示窗口
        bc.page.showError({url: this.url, more: request.responseText || request.responseHTML, from: "bc.ajax.error"});
      } else {
        var msg = "bc.ajax: textStatus=" + textStatus + ";errorThrown=" + errorThrown;
        alert(request.responseText || request.responseHTML);
      }
    }
  };

  // 添加 JWT 认证头
  var headers;
  if (localStorage) {
    var authorization = localStorage.getItem("authorization");
    if (authorization) headers = {"Authorization": authorization};
  }
  if (headers) defaultAjaxOption.headers = headers;

  //$.ajaxSetup(defaultAjaxOption);
  bc.ajax = function (option) {
    option = $.extend({}, defaultAjaxOption, option);
    return jQuery.ajax(option);
  };
});