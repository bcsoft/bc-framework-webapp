<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="clearUp.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/netdiskFile/save" />'
	data-js='<s:url value="/bc/netdiskFile/form.js" />,<s:url value="/bc/identity/identity.js" />,<s:url value="/bc/netdiskFile/folder.js" />'
	data-initMethod='bc.netdiskFileForm.init' 
	data-option='{<s:if test="isClearUp">
		"buttons":[{"text":"<s:text name="label.ok"/>","click":"bc.netdiskFileForm.clickOk4clearUp"}],
		</s:if>"width":300,"minWidth":320,"minHeight":150,"modal":false}' style="overflow-y:auto;">
	<s:form name="netdiskFileForm" theme="simple">
			<table class="formFields" cellspacing="2" cellpadding="0">
				<tbody>
					<tr class="widthMarker">
		                <td style="width: 80px;">&nbsp;</td>
		                <td >&nbsp;</td>
	                </tr>
					<tr>
						<td class="label" >*<s:text name="netdisk.folderName"/>:</td>
						<td class="value" >
							<s:textfield name="title" data-validate="required" cssClass="ui-widget-content" disabled="%{!isClearUp}"/>
						</td>
					</tr>
					<tr>
						<td class="label" ><s:text name="netdisk.SubordinateFolder"/>:</td>
						<td class="value" style="position:relative;display: block;"><s:textfield name="folder"
				    		 cssClass="ui-widget-content" readonly="true" />
				    		<s:if test="%{isClearUp}">
					    		<span id="selectFolder" style="position:absolute;top:50%;margin-top:-8px;width:16px;height:16px;right:22px;cursor:pointer;" 
					    			class="selectButton ui-icon ui-icon-circle-plus" title='<s:text name="title.click2select"/>'></span>
					    		<span id="clearFolder" style="position:absolute;top:50%;margin-top:-8px;width:16px;height:16px;right:8px;cursor:pointer;"
					    			class="selectButton verticalMiddle ui-icon ui-icon-circle-close" title='<s:text name="title.click2clear"/>'></span>
			    			</s:if>
				    	</td>
					</tr>
					<tr>
						<td class="label" ><s:text name="netdisk.order"/>:</td>
						<td class="value" >
							<s:textfield name="order" cssClass="ui-widget-content" disabled="%{!isClearUp}" />
						</td>
					</tr>
				</tbody>
			</table>
		<s:hidden name="id" />
		<s:hidden name="pid" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
	</s:form>
</div>