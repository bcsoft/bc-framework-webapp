<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="share.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/assetType/save" />'
	data-js='<s:url value="/bc/assetType/form.js" />,<s:url value="/bc/assetType/selectFolder.js" />,<s:url value="/bc/identity/identity.js" />'
	data-initMethod="bc.assetTypeForm.init"
	data-option='{"buttons":[{"text":"<s:text name="label.ok"/>","click":"bc.folderSelectDialog.clickOk"}],
		"width":330,"height":340,"minWidth":320,"minHeight":200,"modal":false,minimizable:false,maximizable:false}'
	style="overflow-y:auto;">
	<s:property value="%{tree4SelectFolder}" escapeHtml="false"/>
</div>