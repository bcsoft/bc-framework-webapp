<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="email.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/email/save" />'
	data-js='<s:url value="/bc/email/form.js" />,js:bc_identity,js:redactor_css,js:redactor,js:redactor_cn,js:redactor_plugins_fullscreen'
	data-initMethod='bc.emailForm.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="emailForm" theme="simple" >
		<table class="formTable2" cellspacing="2" cellpadding="0" style="min-width:650px;">
			<tr class="widthMarker">
				<td style="width: 80px;">&nbsp;</td>
				<td >&nbsp;</td>
			</tr>
			<tr>
				<td class="label"><s:text name="email.receiver"/>：</td>
				<td class="value">
					<div class="ui-widget-content" style="position:relative;margin: 0;padding: 0;min-height:19px;margin: 0;font-weight: normal;" >
						<ul class="inputIcons">
						 	<li class="email-addUsers inputIcon ui-icon ui-icon-person" data-type="4" title='点击添加用户'>
						 	<li class="email-addGroups inputIcon ui-icon ui-icon-contact" title='点击添加岗位'>
						 	<li class="email-addUnitOrDepartments inputIcon ui-icon ui-icon-home" title='点击添加单位或部门'>
						</ul>
						<ul class="horizontal ulReceiver" style="padding: 0;overflow:hidden;" data-type="0"></ul>
					</div>
				</td>
			</tr>
			<tr>
				<td class="label"><s:text name="email.cc"/>：</td>
				<td class="value">
					<div class="ui-widget-content" style="position:relative;margin: 0;padding: 0;min-height:19px;margin: 0;font-weight: normal;" >
						<ul class="inputIcons">
						 	<li class="email-addUsers inputIcon ui-icon ui-icon-person" data-type="4" title='点击添加用户'>
						 	<li class="email-addGroups inputIcon ui-icon ui-icon-contact" title='点击添加岗位'>
						 	<li class="email-addUnitOrDepartments inputIcon ui-icon ui-icon-home" title='点击添加单位或部门'>
						</ul>
						<ul class="horizontal ulReceiver" style="padding: 0;overflow:hidden;" data-type="1"></ul>
					</div>
				</td>
			</tr>
			<tr>
				<td class="label"><s:text name="email.bcc"/>：</td>
				<td class="value">
					<div class="ui-widget-content" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;font-weight: normal;" >
						<ul class="inputIcons">
						 	<li class="email-addUsers inputIcon ui-icon ui-icon-person" data-type="4" title='点击添加用户'>
						 	<li class="email-addGroups inputIcon ui-icon ui-icon-contact" title='点击添加岗位'>
						 	<li class="email-addUnitOrDepartments inputIcon ui-icon ui-icon-home" title='点击添加单位或部门'>
						</ul>
						<ul class="horizontal ulReceiver" style="padding: 0;overflow:hidden;" data-type="2"></ul>
					</div>
				</td>
			</tr>
			<tr>
				<td class="label">*<s:text name="email.subject"/>：</td>
				<td class="value" ><s:textfield name="e.subject" data-validate="required" cssClass="ui-widget-content"/></td>
			</tr>
		</table>
		
		<div class="formEditor" style="min-width:650px;font-weight: normal;overflow: hidden;">
			<textarea name="e.content" class="bc-redactor"
				 data-ptype="companyFile.editor" data-puid='${e.uid}' 
				 style="height:150px;"
				 data-readonly='${readonly}' data-tools='simple'>${e.content}</textarea>
		</div>
		
		<!-- 附件  -->
		<s:property value="attachsUI" escapeHtml="false"/>
		
		<s:hidden name="e.id" />
		<s:hidden name="e.uid" />
		<s:hidden name="e.status" />
		<s:hidden name="e.type" />
		<s:hidden name="e.sender.id" />
		
		<s:hidden name="receivers" />

		<input type="hidden" name="e.sendDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.sendDate" />'/>	
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>	
	</s:form>
</div>