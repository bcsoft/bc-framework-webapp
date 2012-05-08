<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="reportTask.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/reportTask/save" />'
	data-js='<s:url value="/bc/report/task/form.js" />'
	data-initMethod='bc.reportTaskForm.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="reportTaskForm" theme="simple" >
		<table  cellspacing="2" cellpadding="0" style="width:645px;"  >
			<tbody>
				<tr class="widthMarker">
					<td style="width: 80px;"></td>
					<td style="width: 230px;"></td>
					<td style="width: 80px;"></td>
					<td >&nbsp;</td>
				</tr>
				<tr>
					<td class="label">*<s:text name="reportTask.name"/>:</td>
					<td class="value" colspan="3" ><s:textfield name="e.name" cssClass="ui-widget-content" data-validate="required" /></td>
				</tr>
				<tr>
					<td class="label">*<s:text name="report.category"/>:</td>
					<td class="value" colspan="3" >
						<div style="position: relative;display:block;" >
							<s:textfield name="category"  value="%{e.template.category+'/'+e.template.name}"  readonly="true" 
								cssClass="ui-widget-content" data-validate="required" />
							<ul class="inputIcons" style="padding-right:6px;">
								 	<li class="inputIcon ui-icon ui-icon-circle-plus" title='<s:text name="title.click2select"/>' id="selectReportTemplate">
							</ul>
						</div>
				    </td>
				</tr>
				<tr>
					<td class="label"><s:text name="reportTask.cron"/>:</td>
					<td class="value"><s:textfield name="e.cron" cssClass="ui-widget-content"/></td>
					<td class="label"><s:text name="reportTemplate.order"/>:</td>
					<td class="value"><s:textfield name="e.orderNo" cssClass="ui-widget-content" /></td>
				</tr>
				<!-- 备注-->
				<tr>
					<td class="topLabel">备注:</td>
					<td class="value" colspan="3">
						<s:textarea rows="3" name="e.desc"  cssClass="ui-widget-content noresize" />
					</td>
				</tr>
				<tr>
					<td class="label" colspan="4"><s:text name="reportTemplate.status"/>:<s:radio name="e.status" list="#{'0':'启用','1':'禁用'}" cssStyle="width:auto;"/></td>
				</tr>
				<!-- 详细配置-->
				<tr>
					<td class="topLabel"><s:text name="reportTemplate.config"/></td>
					<td class="value" colspan="3">
						<s:textarea rows="5" name="e.config"  cssClass="ui-widget-content noresize" />
					</td>
				</tr>
				<tr>
					<td class="label" colspan="4">
						<div class="formTopInfo">
							创建：<s:property value="e.author.name" />(<s:date name="e.fileDate" format="yyyy-MM-dd HH:mm:ss"/>)
							<s:if test="%{e.modifier != null}">
							最后修改：<s:property value="e.modifier.name" />(<s:date name="e.modifiedDate" format="yyyy-MM-dd HH:mm:ss"/>)
							</s:if>
						</div>
					</td>
				</tr>		
			</tbody>
		</table>
		<s:hidden name="e.id" />
		<s:hidden name="e.template.id" />
		<s:hidden name="e.author.id" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
	</s:form>
</div>