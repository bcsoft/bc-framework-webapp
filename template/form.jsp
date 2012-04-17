<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="template.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/template/save" />'
	data-js='<s:url value="/bc/template/form.js" />'
	data-initMethod='bc.templateForm.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="templateForm" theme="simple" >
		<table  cellspacing="2" cellpadding="0" style="width:545px;"  >
			<tbody>
				<tr class="widthMarker">
					<td style="width: 80px;"></td>
					<td style="width: 180px;"></td>
					<td style="width: 80px;"></td>
					<td >&nbsp;</td>
				</tr>
				<!-- 类型 -->
				<tr>
					<td class="label">*<s:text name="template.type"/>:</td>
					<td  colspan="3" >
						<s:radio name='e.type' list="#{'1':'Excel','2':'Word','3':'文本文件','4':'Html文件','5':'其它文件'}"
							   cssStyle="width:auto;"/>
					</td>
				</tr>
				<!-- 编码   排序号-->
				<tr>
					<td class="label">*<s:text name="template.code"/>:</td>
					<td class="value"><s:textfield name="e.code" cssClass="ui-widget-content" data-validate="required" readonly="true"/></td>
					<td class="label">*<s:text name="template.order"/>:</td>
					<td class="value"><s:textfield name="e.order" cssClass="ui-widget-content" data-validate="required"/></td>
				</tr>
				<!-- 名称 -->
				<tr>
					<td class="label">*<s:text name="template.name"/>:</td>
					<td class="value" colspan="3"><s:textfield name="e.name" data-validate="required" cssClass="ui-widget-content"/></td>
				</tr>
				<!-- 模板内容 -->
				<tr id="idTplContent">
					<td class="topLabel"><s:text name="template.content"/>:</td>
					<td class="value" colspan="3">
						<s:textarea rows="5" name="e.content"  cssClass="ui-widget-content noresize" />
					</td>
				</tr>
				<!-- 模板文件  -->
				<tr id="idTplFile">
					<td class="label">*<s:text name="template.tfpath"/>:</td>
					<td class="value" colspan="3" >
						<div class="relative">
							<s:textfield name="e.templateFileName" cssClass="ui-widget-content" readonly="true"/>
							<ul class="inputIcons" style="padding-right:8px">
								<li id="upLoadFileId" class="inputIcon ui-icon ui-icon-circle-arrow-n" style="position: relative;">
									<input type="file" class="auto uploadFile" id="uploadFile" name="uploadFile" title="点击上传文件"
										data-cfg='{"callback":"bc.templateForm.afterUploadfile","infoField":":input[name=\"e.templateFileName\"]","subdir":"template"}'
										style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;filter: alpha(opacity = 10);opacity: 0;cursor: pointer;">
								</li>
								<li class="clearSelect inputIcon ui-icon ui-icon-circle-close" title='<s:text name="title.click2clear"/>'></li>
							</ul>
							<!--  <input id="upfile" type="file" style="visibility:hidden;width:0px" />-->
						</div>
					</td>
				</tr>
				<tr>
					<td class="label" colspan="4">
						<div class="formTopInfo">
							登记：<s:property value="e.author.name" />(<s:date name="e.fileDate" format="yyyy-MM-dd HH:mm:ss"/>)
							<s:if test="%{e.modifier != null}">
							最后修改：<s:property value="e.modifier.name" />(<s:date name="e.modifiedDate" format="yyyy-MM-dd HH:mm:ss"/>)
							</s:if>
						</div>
					</td>
				</tr>		
			</tbody>
		</table>
		<s:hidden name="e.id" />
		<s:hidden name="e.inner" />
		<s:hidden name="e.author.id" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
	</s:form>
</div>