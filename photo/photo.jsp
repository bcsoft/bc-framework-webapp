<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="photo.title"/>' data-type='form' class="bc-page"
	data-js='<s:url value="/bc/photo/photo.js" />'
	data-initMethod='bc.photo.init'
	data-option='<s:property value="pageOption"/>' style="overflow:hidden;">
<div class="hlayout" style="width: 100%; height: 100%;font-weight:normal;position:relative;">
    <div class="container flex vlayout"
        style="position:relative;overflow:hidden;background-color:#2B2B2B;">
        <img style="width:0;"/>
        <span class="indicator" style="display:none;font-size:48px;color:#000;text-align:center;">
            <div>请将图片</div>
            <div>拖放到这里</div>
            <a href="#" style="font-size:24px;color:blue;">取消</a>
        </span>
    </div>
    <div class="ui-widget-content" style="width: 180px;border-color:#27292A;border-width:0 0 0 1px;background-image:none;background-color:#3C3F41;">TODO</div>
</div>
<div class="hiddenContainer" style="display:none;"><img class="proxy"/></div>
</div>