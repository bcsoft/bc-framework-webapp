<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="photo.title"/>' data-type='form' class="bc-page "
	data-js='js:jcrop_css,js:jcrop,<s:url value="/bc/photo/photo.js" />'
	data-initMethod='bc.photo.init'
	data-option='<s:property value="pageOption"/>' style="overflow:hidden;">
<div class="hlayout" style="width: 100%; height: 100%;font-weight:normal;position:relative;">
    <div class="container flex vlayout unselectable" unselectable="on"
        style="position:relative;overflow:hidden;background-color:#2B2B2B;cursor:default;">
        <img style="width:0;"/>
        <div class="helper" style="width: 100%; height: 100%;position:absolute;left:0;top:0;">
            <div class="indicator vlayout" style="width: 100%; height: 100%;position:absolute;left:0;top:0;display:none;font-size:48px;color:#000;text-align:center;">
                <pre style="margin:0" class="msg">请将图片<br>拖放到这里</pre>
                <a href="#" style="font-size:24px;color:blue;">取消</a>
            </div>
            <video autoplay style="display:none;width: 100%; height: 100%;position:absolute;left:0;top:0;background-color:#000" title="双击截图"></video>
        </div>
    </div>
    <div class="ui-widget-content" style="width: 180px;border-color:#27292A;border-width:0 0 0 1px;background-image:none;background-color:#3C3F41;">
        <button class="crop">裁剪</button>
        <button class="destroy" disabled>完成裁剪</button>
        <div class="statusBar"></div>
    </div>
</div>
<div class="hiddenContainer" style="display:none;">
    <img class="proxy"/>
    <canvas class="proxy"/>
</div>
</div>