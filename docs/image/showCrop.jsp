<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="cropImage.title"/>' data-type='form'
	class="bc-page" data-js='<s:url value="/ui-libs/jcrop/0.9.9/themes/default/jquery.Jcrop.css?ts=0" />,<s:url value="/ui-libs/jcrop/0.9.9/jquery.Jcrop.min.js?ts=0" />,<s:url value="/bc/docs/image/showCrop.js" />'
	data-initMethod='bc.cropImage.init'
	data-option='<s:property value="pageOption" escapeHtml="false"/>'
	style="overflow-y: auto;">
	<s:form name="cropImageForm" theme="simple">
		<table class="table" cellspacing="0" cellpadding="0">
			<tr>
				<td rowspan="2" style="text-align: center; vertical-align: middle;width:400px;height: 350px; overflow:hidden;border-right: 1px solid #ccc;padding:8px;">
					<div style="margin: auto;display: inline-block;">
						<s:if test="%{id != null}">
							<img src='<s:url value="/bc/image/download?id="><s:param name='ts' value='%{getText("app.ts")}'/></s:url>' id="source" />
						</s:if>
						<s:else>
							<img src='<s:url value="/bc/image/download?id=1"><s:param name='ts' value='%{new Date().getTime()}'/></s:url>' id="source" />
						</s:else>
					</div>
				</td>
				<td style="text-align: center; vertical-align: top;padding:8px;">
					<div>预览：(<s:property value="preWidth"/>x<s:property value="preHeight"/>)</div>
					<div style='width: <s:property value="preWidth"/>px; height: <s:property value="preHeight"/>px; overflow: hidden;border: 1px solid #ccc;margin:0px;'>
						<s:if test="%{id != null}">
							<img src='<s:url value="/bc/docs/image/test.jpg"/>' id="preview" />
						</s:if>
						<s:else>
							<img src='<s:url value="/bc/image/download?id=1"/>' id="preview" />
						</s:else>
					</div>
				</td>
			</tr>
			<tr>
				<td style="text-align: center; vertical-align: bottom;padding:8px;">
					<input type="button" id="uploadImg" value="上传图片" style="height:80px;width:90px;">
					<div style="text-align: left;">在左边的图片上通过用鼠标框选的方式来裁剪图片</div>
				</td>
			</tr>
		</table>
		<s:hidden name="id" value="1"/>
		<s:hidden name="empty"/>
		<s:hidden name="preWidth"/>
		<s:hidden name="preHeight"/>
		<s:hidden id="ignore" value="true"/>
	</s:form>
</div>