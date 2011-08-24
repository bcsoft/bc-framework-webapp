<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="cropImage.title"/>' data-type='form'
	class="bc-page" data-js='<s:url value="bc/libs/file.js" />,<s:url value="/ui-libs/jcrop/0.9.9/themes/default/jquery.Jcrop.css?ts=0" />,<s:url value="/ui-libs/jcrop/0.9.9/jquery.Jcrop.min.js?ts=0" />,<s:url value="/bc/docs/image/showCrop.js" />'
	data-initMethod='bc.cropImage.init'
	data-option='<s:property value="pageOption" escapeHtml="false"/>'
	style="overflow-y: auto;">
	<s:form name="cropImageForm" theme="simple">
		<table class="table" cellspacing="0" cellpadding="0">
			<tr>
				<td style="text-align: left; vertical-align: middle;width:400px;overflow:hidden;border-right: 1px solid #ccc;padding:8px 8px 0 8px;">
				</td>
				<td style="text-align: center; vertical-align: top;padding:8px 8px 0 8px;">
					<div>预览(<s:property value="preWidth"/>x<s:property value="preHeight"/>)：</div>
				</td>
			</tr>
			<tr>
				<td rowspan="2" style="text-align: center; vertical-align: middle;width:400px;height: 350px; overflow:hidden;border-right: 1px solid #ccc;padding:8px;">
					<div style="margin: auto;display: inline-block;">
						<s:if test="%{id != null}">
							<img src='<s:url value="/bc/image/download">
								<s:param name='id' value='id'/>
								<s:param name='ts' value='ts'/>
							</s:url>' id="source" />
						</s:if>
						<s:else>
							<img src='<s:url value="%{empty}">
								<s:param name='ts' value='ts'/>
							</s:url>' id="source" />
						</s:else>
					</div>
				</td>
				<td style="text-align: center; vertical-align: top;padding:8px;">
					<div style='width: <s:property value="preWidth"/>px; height: <s:property value="preHeight"/>px; overflow: hidden;border: 1px solid #ccc;margin:0px;'>
						<s:if test="%{id != null}">
							<img src='<s:url value="/bc/image/download">
								<s:param name='id' value='id'/>
								<s:param name='ts' value='ts'/>
							</s:url>' id="preview" />
						</s:if>
						<s:else>
							<img src='<s:url value="%{empty}">
								<s:param name='ts' value='ts'/>
							</s:url>' id="preview" />
						</s:else>
					</div>
				</td>
			</tr>
			<tr>
				<td style="text-align: center; vertical-align: bottom;padding:8px;">
					<div class="bcfile uploadFile ui-widget ui-state-default ui-corner-all"  
						data-puid='<s:property value="puid"/>' data-ptype='<s:property value="ptype"/>' data-callback='bc.cropImage.finishUpload' 
						style="position: relative;color: #2A5DB0;line-height:40px;height:40px;width:5em;font-size: 22px;margin-bottom:16px;">上传图片<input 
						type="file" class="uploadFile" id="uploadFile" name="uploadFile" 
						style="position: absolute;left: 0;top: 0;width: 4.5em;height: 1.5em;filter: alpha(opacity = 10);opacity: 0;cursor: pointer;">
					</div>
					<div class=""></div>
					<div style="text-align: left;font-size: 18px;">在左边的图片上通过用鼠标框选的方式来裁剪图片</div>
					<div style="margin-top:16px;font-size: 12px;">(原图<span id="zoomInfo"></span>)</div>
				</td>
			</tr>
		</table>
		<s:hidden name="id"/>
		<s:hidden name="empty"/>
		<s:hidden name="preWidth"/>
		<s:hidden name="preHeight"/>
		<s:hidden name="puid"/>
		<s:hidden name="ptype"/>
		<s:hidden id="ignore" value="true"/>
	</s:form>
</div>