<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="placeOrigin.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/placeOrigin/save" />'
	data-js='js:editor,<s:url value="/bc/placeOrigin/form.js" />'
	data-initMethod='bc.placeOriginForm.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="placeOriginForm" theme="simple">
		
	</s:form>
</div>