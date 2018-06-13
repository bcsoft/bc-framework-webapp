bc.reloginFrom = {
  /** 初始化 */
  init: function () {
    var $page = $(this);

    // 自动填写当前登录过的帐号
    $page.find("input[name='name']").val(userCode);
  },

  /** 重新登录 */
  doRelogin: function () {
    var $page = $(this);
    logger.info("doRelogin");
    var $name = $page.find("input[name='name']");
    var $password = $page.find("input[name='password']");
    var name = $name.val();
    var password = $password.val();

    // 验证参数
    if (!name || name.length == 0) {
      bc.msg.slide("帐号不能为空！");
      $name.focus();
      return false;
    }
    if (!password || password.length == 0) {
      bc.msg.slide("密码不能为空！");
      $password.focus();
      return false;
    }

    // 执行登录
    bc.msg.slide("正在重新登录...");
    bc.ajax({
      url: bc.root + "/doLogin",
      data: {
        name: name,
        password: hex_md5(password),//使用md5加密避免密码明文传输
        sid: bc.sid,
        relogin: true
      },
      type: "POST",
      dataType: "json",
      success: function (json) {
        if (json.success) {
          logger.info("new sid=" + json.sid);
          bc.msg.slide("重新登录成功！");
          bc.sid = json.sid;

          // 关闭对话框
          $page.data("data-status", json);
          $page.dialog("close");
        } else {
          bc.msg.slide(json.msg);
        }
      },
      error: function (json) {
        bc.msg.alert("连接失败！");
      }
    });
    return false;
  }
};