<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="role.title"/>' data-type='form'
	class="bc-page" data-saveUrl='<s:url value="/bc/role/save" />'
	data-js='<s:url value="/bc/identity/role/form.js" />,js:bc_identity'
	data-initMethod='bc.roleForm.init'
	data-option='<s:property value="formPageOption"/>'
	style="overflow: auto;">
	<s:form name="roleForm" theme="simple" cssClass="bc-form">
		<div id="formTabs" class="formTabs bc-tabs layout-top ui-widget ui-helper-reset"
			data-cfg="{height:400}" style="overflow: hidden;">
			<div class="tabsContainer">
				<div class="slideContainer">
					<ul class="tabs ui-helper-reset">
						<li class="tab ui-widget-content first active"><a href="#otherFormFields" class="ui-state-default ui-state-active">基本信息</a></li>
						<s:if test="!e.isNew()">
							<li class="tab ui-widget-content"><a href='<s:url value="/bc/privilege/resource/paging?roleId=%{e.id}"/>' class="ui-state-default">资源分配</a></li>
							<li class="tab ui-widget-content"><a href='<s:url value="/bc/privilege/actor/paging?roleId=%{e.id}"/>' class="ui-state-default">权限分配</a></li>
						</s:if>
					</ul>
				</div>
			</div>
			<div class="contentContainer ui-helper-reset ui-widget-content">
				<div id="otherFormFields" class="content active" >
				<div style="width:615px;">
				<table class="formFields" cellspacing="2" cellpadding="0">
					<tbody>
						<tr class="widthMarker">
							<td >&nbsp;</td>
							<td style="width: 200px;">&nbsp;</td>
							<td style="width: 80px;">&nbsp;</td>
							<td style="width: 200px;">&nbsp;</td>
						</tr>
						<tr>
							<td class="label">* <s:text name="label.name"/>:</td>
							<td class="value"><s:textfield name="e.name" data-validate="required" cssClass="ui-widget-content"/></td>
							<td class="label">* <s:text name="label.code"/>:</td>
							<td class="value"><s:textfield name="e.code" data-validate="required" cssClass="ui-widget-content"/></td>
						</tr>
						<tr>
							<td class="label">* <s:text name="label.order"/>:</td>
							<td class="value" ><s:textfield name="e.orderNo" data-validate="required" cssClass="ui-widget-content"/></td>
						</tr>
					</tbody>
				</table>
				<p class="formComment">
					<s:text name="role.form.comment" />
				</p>
				</div>
				</div>
			</div>
		</div>
		<s:hidden name="e.status" />
		<s:hidden name="e.inner" />
		<s:hidden name="e.uid" />
		<s:hidden name="e.id" />
		<s:hidden name="e.type" />
		<s:hidden name="assignResourceIds" />
		
	</s:form>
</div>