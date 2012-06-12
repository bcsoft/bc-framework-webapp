<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="questionary.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/questionary/save" />'
	data-js='js:bc_identity,<s:url value="/bc/questionary/form.js"/>'
	data-initMethod='bc.questionaryForm.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="questionaryForm" theme="simple">
		<div id="div1">
			<table class="formFields" cellspacing="2" cellpadding="0">
				<tbody>
					<tr class="widthMarker">
						<td style="width: 100px;">&nbsp;</td>
						<td >&nbsp;</td>
					</tr>
					<tr>
		               	<td class="label"><s:text name="questionary.subject"/>:</td>
						<td class="value"><s:textfield name="e.subject" cssClass="ui-widget-content"/></td>
					</tr>
					<tr>
		               	<td class="label"><s:text name="questionary.Deadline"/>:</td>
						<td class="value">
							<div style="position : relative; display: inline-block">
								&nbsp;从<input type="text" name="e.startDate"  data-validate='{"type":"date","required":true}' 
									value='<s:date format="yyyy-MM-dd" name="e.startDate" />' 
									style="width: 7em;" class="bc-date ui-widget-content" />
									<ul class="inputIcons" style="right : 0px;">
										<li class="selectCalendar inputIcon ui-icon ui-icon-calendar" data-cfg='e.startDate' ></li>
									</ul>
							</div>
							<div style="position : relative; display: inline-block">
								&nbsp;到<input type="text" name="e.endDate" data-validate='{"type":"date","required":true}'
									value='<s:date format="yyyy-MM-dd" name="e.endDate" />'
									style="width: 7em;" class="bc-date ui-widget-content" />
									<ul class="inputIcons" style="right : 0px;">
										<li class="selectCalendar inputIcon ui-icon ui-icon-calendar" data-cfg='e.endDate' ></li>
									</ul>
							</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					       <s:checkbox name="e.permitted" cssStyle="width:1em;" />
					       <s:text name="questionary.permitted"/>
						</td>
					</tr>
					<!-- 限制参与人为-->
					<tr>
						<td class="topLabel"><s:text name="questionary.actors"/>:</td>
						<td class="value relative" >
							<div id="assignUsers" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;font-weight: normal;width: 98%;" class="ui-widget-content" 
								data-removeTitle='<s:text name="title.click2remove"/>'>
								<ul class="inputIcons" style="top:10px">
									 	<li class="inputIcon ui-icon ui-icon-person" title='<s:text name="group.title.click2addUsers"/>' id="addUsers">
									 	<li class="inputIcon ui-icon ui-icon-contact" title='<s:text name="actor.title.click2addGroups"/>' id="addGroups">
									 	<li class="inputIcon ui-icon ui-icon-home" title='<s:text name="reportTemplate.title.addUnitOrDepartment"/>' id="addUnitOrDepartments">
								</ul>
								<s:if test="%{ownedUsers != null && !ownedUsers.isEmpty()}">
									<ul class="horizontal reportUserUl" style="padding: 0 50px 0 0;">
									<s:iterator value="ownedUsers">
									<li class="horizontal reportUserLi" style="position: relative;margin:0 2px;float: left;padding: 0;"
										data-id=<s:property value="['id']"/>>
									<span class="text" ><s:property value="['name']" /></span>
									<s:if test="!isReadonly()">
										<span class="click2remove verticalMiddle ui-icon ui-icon-close" style="margin: -8px -2px;" title='<s:text name="title.click2remove"/>'></span>
									</s:if>
									</li>
									</s:iterator>
									</ul>
								</s:if>	
							</div>					
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div id="div2">
			<table class="formFields" cellspacing="2" cellpadding="0">
				<tbody>
					<tr class="widthMarker">
						<td style="width: 100px;">&nbsp;</td>
						<td >&nbsp;</td>
					</tr>
					<s:if test="%{e.isNew()}">
					<tr>
		               	<td class="label">题型:</td>
						<td class="value"><s:radio name="type" value="type" list="#{'0':'单选','1':'多选','2':'填空','3':'简答'}" cssStyle="width:auto;"/>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选项布局：<s:radio name="config" value="config" list="#{'vertical':'垂直','horizontal':'水平'}" cssStyle="width:auto;"/></td>
					</tr>
					<tr>
						<td class="label">题目:</td>
						<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;"><s:textfield name="e.subject" cssClass="ui-widget-content"/>
							<ul class="inputIcons" style="top:12px;right: 19px;">
							 	<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title='<s:text name="group.title.click2addUsers"/>' id="addUsers">
							 	<li class="inputIcon ui-icon ui-icon-circle-plus" title='<s:text name="actor.title.click2addGroups"/>' id="addGroups">
							 	<li class="inputIcon ui-icon ui-icon-circle-close" title='<s:text name="reportTemplate.title.addUnitOrDepartment"/>' id="addUnitOrDepartments">
							</ul>
						</td>
					</tr>
					<tr>
						<td class="label">选项:</td>
						<td class="value" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;">
						    <s:checkbox name="" cssStyle="width:1em;"/>
							<s:textfield name="e.subject" cssClass="ui-widget-content" cssStyle="width:496px;"/>
							<ul class="inputIcons" style="top:12px;right: 19px;">
							 	<li class="inputIcon ui-icon ui-icon-circle-arrow-s" title='<s:text name="group.title.click2addUsers"/>' id="addUsers">
							 	<li class="inputIcon ui-icon ui-icon-circle-plus" title='<s:text name="actor.title.click2addGroups"/>' id="addGroups">
							 	<li class="inputIcon ui-icon ui-icon-circle-close" title='<s:text name="reportTemplate.title.addUnitOrDepartment"/>' id="addUnitOrDepartments">
							</ul>
						</td>
					</tr>
					</s:if><s:else>
						<s:iterator var="b" value="">
						</s:iterator>
					</s:else>
				</tbody>
			</table>
			<div class="formTopInfo">
				状态：<s:property value="%{statusesValue[e.status]}" />&nbsp;&nbsp;&nbsp;&nbsp;登记：<s:property value="e.author.name" />(<s:date name="e.fileDate" format="yyyy-MM-dd HH:mm:ss"/>)
				<s:if test="%{e.modifier != null}">
				，最后修改：<s:property value="e.modifier.name" />(<s:date name="e.modifiedDate" format="yyyy-MM-dd HH:mm:ss"/>)
				</s:if>
			</div>
		</div>
		<s:hidden name="e.id" />
		<s:hidden name="e.author.id" />
		<s:hidden name="e.type" />
		<s:hidden name="e.way" />
		<s:hidden name="e.ptype" />
		<s:hidden name="e.pid" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
		
	</s:form>
</div>