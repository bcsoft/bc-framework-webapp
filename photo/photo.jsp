<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="photo.title"/>' data-type='form' class="bc-page"
	data-js='<s:url value="/bc/photo/photo.js" />'
	data-initMethod='bc.photo.init'
	data-option='<s:property value="pageOption"/>' style="overflow:hidden;">
<div class="hlayout" style="width: 100%; height: 100%;font-weight:normal">
    <div id="displayContainer" class="flex vlayout"
        style="position:relative;overflow:hidden;background-color:#2B2B2B;">
        <img id="imgDisplayer" style="width:0;" src="bc/photo/asset/A4-手写.jpg"/>
    </div>
    <div class="ui-widget-content" style="width: 180px;border-color:#27292A;border-width:0 0 0 1px;background-image:none;background-color:#3C3F41;">TODO</div>
</div>
<div style="display:none;"><img id="imgProxy"/></div>
</div>