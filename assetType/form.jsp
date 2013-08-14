<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="assetType.title"/>' data-type='form' class="bc-page bc-autoScroll"
	data-saveUrl='<s:url value="/bc/assetType/save" />'
	data-js='<s:url value="/bc/assetType/form.js" />'
	data-initMethod='bc.assetType.init'
	data-option='{
		"buttons":[{"text":"<s:text name="label.save"/>","action":"save"}],
		"width":600,"minWidth":280,"minHeight":200,"modal":false
	}'>
	<s:form name="assetTypeForm" theme="simple">
		<div class="formFields ui-widget-content">
			<table class="formFields" cellspacing="2" cellpadding="0">
				<tbody>
					<tr>
						<td class="label">* <s:text name="asset.name"/>:</td>
						<td class="value"><s:textfield name="e.name" data-validate="required"/></td>
						<td class="label"> <s:text name="asset.parent"/>:</td>
						<td class="value relative"><s:textfield name="e.parent.name"
							readonly="true" title='%{getText("resource.title.click2selectIconClass")}' cssClass="ui-widget-content"/>
							<ul class="inputIcons">
								<li id="selectOptionType" class="inputIcon ui-icon ui-icon-circle-plus"
									title='<s:text name="title.click2select"/>'></li>
								<li class="clearSelect inputIcon ui-icon ui-icon-circle-close" 
									data-cfg='e.parent.id,e.parent.name'
									title='<s:text name="title.click2clear"/>'></li>
							</ul>
						</td>
					</tr>

					<tr>
						<td class="label">* <s:text name="asset.code"/>:</td>
						<td class="value"><s:textfield name="e.code" data-validate="required"/></td>
						<td class="label"> <s:text name="label.order"/>:</td>
						<td class="value"><s:textfield name="e.orderNo"/></td>
					</tr>
					<tr>
						<td colspan="2"></td>
						<td class="label"><s:text name="label.status"/>:</td>
						<td class="value"><s:radio name="e.status" list="#{'0':'启用','1':'禁用'}" 
								value="e.status" cssStyle="width:auto;"/></td>
					</tr>
					<tr>
							<td class="label" colspan="4">
								<div class="formTopInfo">
									创建：<s:property value="e.author.name" />(<s:date name="e.fileDate" format="yyyy-MM-dd HH:mm:ss"/>)
									<s:if test="%{e.modifier != null}">
									，最后修改：<s:property value="e.modifier.name" />(<s:date name="e.modifiedDate" format="yyyy-MM-dd HH:mm:ss"/>)
									</s:if>
								</div>
							</td>
					</tr>					
				</tbody>
			</table>
		</div>
		<s:hidden name="e.id"/>
		<s:hidden name="e.parent.id"/>
		<s:hidden name="e.author.id" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
		<s:hidden name="e.modifier.id"/>
		<input type="hidden" name="e.modifiedDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.modifiedDate" />'/>
		
	</s:form>
</div>