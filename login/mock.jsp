<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
  response.setHeader("Pragma", "No-cache");
  response.setHeader("Cache-Control", "no-cache");
  response.setDateHeader("Expires", 0);
%>
<html>
<head>
<title>模拟登陆</title>
</head>
<body>
<div>帐号：<input type="text" id="name" /></div>
<div><input type="button" value="登录" id="mock"/></div>
<div>特别注意：模拟登录功能只提供给超级管理员使用，并且每次模拟操作都会记录操作日志，如果不是非常特殊的情况请不要使用此功能。</div>
<div id="msg" style="font-size: 20px;font-weight: bold;padding: 10px;"></div>
<script type="text/javascript" src="<s:url value='/ui-libs/jquery/1.7.2/jquery.min.js'/>"></script>
<script type="text/javascript" src="<s:url value='/ui-libs/jshash/2.2/md5-min.js'/>"></script>
<script type="text/javascript">
  var bc={};
  bc.root = "<%=request.getContextPath()%>";
  bc.debug = <s:text name="app.debug" />;
  bc.ts = bc.debug ? new Date().getTime() : "<s:text name="app.ts" />";
</script>
<script type="text/javascript" src="<s:url value='/bc/login/mock.js' ><s:param name='ts' value='%{getText("app.ts")}'/></s:url>"></script>
</body>
</html>