<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="deviceEvent.title"/>' data-type='form'
	class="bc-page bc-autoScroll"
	data-option='<s:property value="%{formPageOption}"/>'
	style="overflow: hidden;">
	<s:form name="deviceEventForm" theme="simple">
		<div class="formFields ui-widget-content">
			<table class="formFields" cellspacing="2" cellpadding="0">
				<tbody>
					<tr>
						<td class="label" style="width: 6em">*<s:text name="device.code" />:
						</td>
						<td class="value"><s:textfield name="e.device.code"
								data-validate="required" cssClass="ui-widget-content"/></td>
					</tr>
					<tr>
						<td class="label">*<s:text
								name="deviceEvent.triggerTime" />:
						</td>
						<td class="value">
							<input type="text" name="triggerTime"
							data-validate='{"type":"date","required":true}'
							value='<s:date name="e.triggerTime" format="yyyy-MM-dd HH:mm:ss"/>'
							class="ui-widget-content" /></td>
					</tr>
					<tr>
						<td class="label">*<s:text name="deviceEvent.type" />:
						</td>
						<td class="value"><s:textfield name="e.type"
								data-validate="required" cssClass="ui-widget-content"/></td>
					</tr>
					<tr>
						<td class="label">*<s:text name="deviceEvent.name" />:
						</td>
						<td class="value"><s:textfield name="e.device.name"
								data-validate="required" cssClass="ui-widget-content"/></td>
					</tr>
					<tr>
						<td class="label">*<s:text name="deviceEvent.purpose" />:
						</td>
						<td class="value"><s:textfield name="e.device.purpose"
								data-validate="required" cssClass="ui-widget-content"/></td>
					</tr>
					<tr>
						<td class="label"><s:text name="deviceEvent.appid" />:
						</td>
						<td class="value"><s:textfield name="e.appId"
								data-validate="required" cssClass="ui-widget-content"/></td>
					</tr>
					<tr>
						<td class="topLabel"><s:text name="deviceEvent.data" />:</td>
						<td class="value"><s:textarea name="e.data" rows="5"
								cssClass="ui-widget-content noresize" /></td>
					</tr>
				</tbody>
			</table>
		<s:hidden name="e.id" />
		<s:hidden name="e.device.id" />
		<input type="hidden" name="e.triggerTime" 
			value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.triggerTime" />' />
	</s:form>
</div>