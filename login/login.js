jQuery(function($){
	
$("#name").focus();
function login() {
	var name = $("#name").val();
	var password = $("#password").val();

	// 验证参数
	if (!name || name.length == 0) {
		showMsg("帐号不能为空！");
		$("#name").focus();
		return;
	}
	if (!password || password.length == 0) {
		showMsg("密码不能为空！");
		$("#password").focus();
		return;
	}else{
		$("#password").attr("data-p",password);
	}

	showMsg("正在登录...");
	
	$.ajax({
		url : bc.root + "/doLogin",
		data : {
			name : name,
			password : hex_md5(password)//使用md5加密避免密码明文传输
		},
		type : "POST",
		dataType: "json",
		success : function(json) {
			if(json.success){
				showMsg("登录验证成功，正在进入系统&hellip;");
				//登录成功跳转到主页
				window.open(bc.root + "/index" ,"_self");
			}else{
				showMsg(json.msg);
			}
		},
		error : function(json) {

		}
	});
	return false;
}

$("#loginBtn").click(login);
$(":input").keyup(function(e){
	if(e.which == 13){//按下回车键
		if(this.id=="name" && $("#password").val() == 0){
			$("#password").focus();
		}else{
			login();
		}
	}
});

function showMsg(msg) {
	// alert(msg);
	$("#msg").html(msg);
}

//for debug: 自动以管理员登录
if(bc.debug){
	$("#name").val("admin");
	$("#password").val("888888");
	//$("#loginBtn").trigger("click");
}

//在右下角显示浏览器的版本信息 http://www.google.com/chrome/eula.html?hl=zh-CN&standalone=1
var html = '<div style="position:absolute;bottom:5px;left:5px;color:#969696;text-overflow: ellipsis;white-space: nowrap;font-size:12px;">';
if($.browser.msie){
	if($.browser.version < 8){//用户浏览器版本太低的处理
		html += "<div>当前浏览器版本太低，无法正常使用本系统，建议您使用 Chrome 浏览器! <a href='" + bc.root + "/bc/attach/download?puid=chrome14.0.835.186'>内网下载</a>";
		html += "&nbsp;<a href='http://www.google.com/chrome'>外网下载</a><div>";
	}else if($.browser.version >=8 && $.browser.version < 9){//IE8升级建议
		html += "<div>当前浏览器不支持Html5，为了得到更好的用户体验和浏览速度，建议您使用 Chrome 浏览器! <a href='" + bc.root + "/bc/attach/download?puid=chrome14.0.835.186'>内网下载</a>";
		html += "&nbsp;<a href='http://www.google.com/chrome'>外网下载</a><div>";
	}
}
html += '<div title="';
html += window.navigator.userAgent;
html += '">当前浏览器版本信息：';
if($.browser.msie){
	html += 'IE ' +  $.browser.version + ', ';
}
html += window.navigator.userAgent;
html += '<div></div>';
$(html).appendTo("body");

if($.browser.msie && $.browser.version < 8){//用户浏览器版本太低的处理
	alert("浏览器版本太低，无法正常使用本系统，建议您使用 Chrome 浏览器， 试试左下角的“下载”按钮吧！如果您使用的是双核浏览器，请切换到高速模式使用！");
}

});