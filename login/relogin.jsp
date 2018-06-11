<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='重新登录系统' 
  class="bc-page"
  data-type='form'
  data-initMethod='bc.reloginFrom.init'
  data-js='<s:url value="/ui-libs/jshash/2.2/md5-min.js?ts=0" />,<s:url value="/bc/login/relogin.js" />'
  data-option='{"modal":true,"width":300,"minWidth":200,"minHeight":100,"buttons":[{"text":"登录","id":"bcrelogindlgbutton","click":"bc.reloginFrom.doRelogin"}]}'>
  <s:form name="reloginFrom" theme="simple">
    <table class="formFields ui-widget-content" cellspacing="2" cellpadding="0">
      <tr>
        <td class="label">帐号：</td>
        <td class="value"><s:textfield name="name" data-validate="required" readonly="true" disabled="true"/></td>
      </tr>
      <tr>
        <td class="label">密码：</td>
        <td class="value"><s:password name="password" data-validate="required"/></td>
      </tr>
    </table>
    <p class="formComment">系统登录已经超时，需要您输入密码重新登录！</p>
  </s:form>
</div>