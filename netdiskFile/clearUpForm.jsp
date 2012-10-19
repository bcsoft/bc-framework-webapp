<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="clearUp.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/netdiskFile/save" />'
	data-js='<s:url value="/bc/netdiskFile/form.js" />,<s:url value="/bc/identity/identity.js" />'
	data-initMethod='bc.netdiskFileForm.init'
	data-option='<s:property value="%{formPageOption}"/>' style="overflow-y:auto;">
	<s:form name="netdiskFileForm" theme="simple">
		<div class="formFields ui-widget-content" >
			<table class="formFields" cellspacing="2" cellpadding="0">
				<tbody>
					<tr class="widthMarker">
		                <td style="width: 80px;">&nbsp;</td>
		                <td >&nbsp;</td>
	                </tr>
					<tr>
						<td class="label" >*<s:text name="netdisk.folderName"/>:</td>
						<td class="value" >
							<s:textfield name="e.vin" data-validate="required" cssClass="ui-widget-content"/>
						</td>
					</tr>
					<tr>
						<td class="label" ><s:text name="netdisk.SubordinateFolder"/>:</td>
						<td class="value" >
							<s:textfield name="e.vin" data-validate="required" cssClass="ui-widget-content"/>
						</td>
					</tr>
					<tr>
						<td class="label" ><s:text name="netdisk.order"/>:</td>
						<td class="value" >
							<s:textfield name="e.vin" data-validate="required" cssClass="ui-widget-content"/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<s:hidden name="e.id" />
		<s:hidden name="e.car.id" />
		<s:hidden name="e.driver.id" />
		<s:hidden name="e.author.id" />
		<s:hidden name="e.startDate" />
		<s:hidden name="e.endDate" />
		<s:hidden name="e.pid" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
	</s:form>
</div>