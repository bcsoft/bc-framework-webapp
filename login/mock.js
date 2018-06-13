jQuery(function ($) {

  $("#name").focus();

  function mock() {
    var name = $("#name").val();

    // 验证参数
    if (!name || name.length == 0) {
      showMsg("帐号不能为空！");
      $("#name").focus();
      return;
    }

    showMsg("正在登录...");

    $.ajax({
      url: bc.root + "/doLogin",
      data: {mock: true, name: name},
      type: "POST",
      dataType: "json",
      success: function (json) {
        if (json.success) {
          showMsg("登录验证成功，正在进入系统&hellip;");
          //登录成功跳转到主页
          window.open(bc.root + "/index", "_self");
        } else {
          showMsg(json.msg);
        }
      },
      error: function (json) {
        alert("异常！");
      }
    });
    return false;
  }

  $("#mock").click(mock);
  $("#name").keyup(function (e) {
    if (e.which == 13) {//按下回车键
      mock();
    }
  });

  function showMsg(msg) {
    $("#msg").html(msg);
  }

});