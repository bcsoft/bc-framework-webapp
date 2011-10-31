<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="role.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/role/save" />'
	data-js='<s:url value="/bc/identity/identity.js" />,<s:url value="/bc/identity/role/form.js" />'
	data-initMethod='bc.roleForm.init'
	data-option='<s:property value="%{formPageOption}"/>' style="overflow:auto;">
	<s:form name="roleForm" theme="simple">
		<table class="formTable2 ui-widget-content" cellspacing="2" cellpadding="0">
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
					<td class="value" colspan="3"><s:textfield name="e.orderNo" data-validate="required" cssClass="ui-widget-content"/></td>
				</tr>
			</tbody>
		</table>
		<!-- 已分配的角色信息 -->
		<div id="assignResources" class="formTable2 ui-widget-content" 
			data-removeTitle='<s:text name="title.click2remove"/>'>
			<div class="ui-state-active title" style="position:relative;">
				<span class="text"><s:text name="role.headerLabel.assignResources"/>：
					<s:if test="%{e.resources == null || e.resources.isEmpty()}"><s:text name="label.empty"/></s:if>
				</span>
				<span id="addResources" class="verticalMiddle ui-icon ui-icon-circle-plus" title='<s:text name="role.title.click2addResources"/>'></span>
			</div>
			<s:if test="%{e.resources != null && !e.resources.isEmpty()}">
			<ul class="horizontal">
			<s:iterator value="e.resources">
				<li class="horizontal ui-widget-content ui-corner-all" data-id='<s:property value="id" />'>
					<span class="text"><s:property value="name" /></span>
					<span class="click2remove verticalMiddle ui-icon ui-icon-close" title='<s:text name="title.click2remove"/>'></span>
				</li>
			</s:iterator>
			</ul>
			</s:if>	
		</div>
		<s:hidden name="e.status" />
		<s:hidden name="e.inner" />
		<s:hidden name="e.uid" />
		<s:hidden name="e.id" />
		<s:hidden name="e.type" />
		<s:hidden name="assignResourceIds" />
		<p class="formComment"><s:text name="role.form.comment"/></p>
	</s:form>
</div>