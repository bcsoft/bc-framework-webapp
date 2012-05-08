<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="reportHistory.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/reportHistory/save" />'
	data-js='<s:url value="/bc/report/history/form.js" />'
	data-initMethod='bc.reportHistoryForm.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="reportHistoryForm" theme="simple" >
		<table  cellspacing="2" cellpadding="0" style="width:645px;"  >
			<tbody>
				<tr class="widthMarker">
					<td style="width: 80px;"></td>
					<td style="width: 230px;"></td>
					<td style="width: 80px;"></td>
					<td >&nbsp;</td>
				</tr>
				<tr>
					<td class="label"><s:text name="report.category"/>:</td>
					<td class="value" colspan="3" ><s:textfield name="e.category" cssClass="ui-widget-content" readonly="true" /></td>
				</tr>
				<tr>
					<td class="label"><s:text name="reportHistory.subject"/>:</td>
					<td class="value" colspan="3" ><s:textfield name="e.subject" cssClass="ui-widget-content" readonly="true" /></td>
				</tr>
				<tr>
					<td class="label"><s:text name="reportHistory.path"/>:</td>
					<td class="value" colspan="3" >
						<div style="position: relative;display:block;" >
							<s:textfield name="e.path"  readonly="true" cssClass="ui-widget-content" />
							<ul class="inputIcons" style="padding-right:6px;">
								<li class="inputIcon ui-icon ui-icon-arrowthickstop-1-s" title='<s:text name="reportHistory.download"/>' id="reportHistoryDownLoad">
								<li class="inputIcon ui-icon ui-icon-lightbulb" title='<s:text name="reportHistory.inline"/>' id="reportHistoryInline">
							</ul>
						</div>
				    </td>
				</tr>
				<tr>
					<td class="label"><s:text name="report.fileDate"/>:</td>
					<td class="value">
						<input type="text" name="e.fileDate" readonly="readonly" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'
							class="ui-widget-content" />
					</td>
					<td class="label"><s:text name="report.author"/>:</td>
					<td class="value">
						<s:textfield name="e.author.name" cssClass="ui-widget-content" readonly="true" />
					</td>
				</tr>
				<tr>
					<td class="label"><s:text name="report.status"/>:</td>
					<td class="value">
						<s:if test="%{e.success}">
							<s:text name="reportHistory.status.success"/>
						</s:if><s:else>
							<div style="position: relative;display:block;" >
								<s:text name="reportHistory.status.lost"/>
								<ul class="inputIcons" style="padding-right:185px;">
									<li class="inputIcon ui-icon ui-icon-triangle-1-s" title='<s:text name="reportHistory.title.error"/>' id="showReportMsgError">
								</ul>
							</div>
						</s:else>
					</td>
				</tr>
				<tr id="idReportMsgError">
					<td class="topLabel"><s:text name="reportHistory.msg.error"/></td>
					<td class="value" colspan="3">
						<s:textarea rows="5" name="e.msg" readonly="true" cssClass="ui-widget-content noresize" />
					</td>
				</tr>
			</tbody>
		</table>
		<s:hidden name="e.id" />
		<s:hidden name="e.author.id" />
	</s:form>
</div>