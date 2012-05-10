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
					<td >&nbsp;</td>
				</tr>
				<!-- 类型 -->
				<tr>
					<td class="label"><s:text name="template.type"/>:</td>
					<td >
						<s:radio name='e.type' list="#{'1':'Excel模板','2':'Word模板','3':'纯文本模板','4':'其它附件','5':'自定义文本'}"
							   cssStyle="width:auto;"/>
					</td>
				</tr>
				<!-- 所属分类  排序号-->
				<tr>
					<td class="label">*<s:text name="template.category"/>:</td>
					<td class="value"><s:textfield name="e.category" cssClass="ui-widget-content" data-validate="required" /></td>
				</tr>
				<tr>
					<td class="label"><s:text name="template.order"/>:</td>
					<td class="value"><s:textfield name="e.orderNo" cssClass="ui-widget-content" /></td>
				</tr>
				<!-- 编码   版本号-->
				<tr>
					<td class="label">*<s:text name="template.code"/>:</td>
					<td class="value"><s:textfield name="e.code" cssClass="ui-widget-content" data-validate="required" /></td>
				</tr>
				<tr>
					<td class="label">*<s:text name="template.version"/>:</td>
					<td class="value"><s:textfield name="e.version" cssClass="ui-widget-content" data-validate="required" /></td>
				</tr>
				<!-- 标题  -->
				<tr>
					<td class="label">*<s:text name="template.tfsubject"/>:</td>
					<td class="value">
						<s:textfield name="e.subject" cssClass="ui-widget-content" data-validate="required"/>
					</td>
				</tr>
				<tr class="tplFile">
					<td class="label">*<s:text name="template.tfpath"/>:</td>
					<td class="value"  >
						<div class="relative">
							<s:textfield name="e.path" cssClass="ui-widget-content" readonly="true"/>
							<ul class="inputIcons" style="padding-right:8px">
								<li id="upLoadFileId" class="inputIcon ui-icon ui-icon-circle-arrow-n" style="position: relative;">
									<input type="file" class="auto uploadFile" id="uploadFile" name="uploadFile" title="点击上传文件"
										data-cfg='{"callback":"bc.templateForm.afterUploadfile","subdir":"template","source":":input[name=\"e.subject\"]","to":":input[name=\"e.path\"]"}'
										style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;filter: alpha(opacity = 10);opacity: 0;cursor: pointer;">
								</li>
								<li id="cleanFileId" class="clearSelect inputIcon ui-icon ui-icon-circle-close" title='<s:text name="title.click2clear"/>'></li>
								<li class="downLoadFileId inputIcon ui-icon ui-icon-arrowthickstop-1-s" title='<s:text name="template.download"/>' >					 
							</ul>
						</div>
					</td>
				</tr>
				<!-- 备注-->
				<tr>
					<td class="topLabel">备注:</td>
					<td class="value" >
						<s:textarea rows="3" name="e.desc"  cssClass="ui-widget-content noresize" />
					</td>
				</tr>
				<!-- 模板内容 -->
				<tr id="idTplContent">
					<td class="topLabel">
							<div>
								<s:text name="template.content"/>:
							</div>
							<div style="position : relative;">
								<ul class="inputIcons" style="top:5px;">
									<li class="downLoadFileId inputIcon ui-icon ui-icon-arrowthickstop-1-s" title='<s:text name="template.download"/>' >
								</ul>	
							</div>
					<td class="value">
						<s:textarea rows="5" name="e.content"  cssClass="ui-widget-content noresize" />
					</td>
				</tr>
				<tr>
					<td class="label" colspan="2"><s:text name="template.status"/>:<s:radio name="e.status" list="#{'0':'正常','1':'禁用'}" cssStyle="width:auto;"/></td>
				</tr>
				<tr>
					<td class="label" colspan="4">
						<div class="formTopInfo">
							创建：<s:property value="e.author.name" />(<s:date name="e.fileDate" format="yyyy-MM-dd HH:mm:ss"/>)
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