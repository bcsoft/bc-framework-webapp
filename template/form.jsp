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
					<td class="label">*<s:text name="template.type"/>:</td>
					<td >
						<s:select name="e.templateType.id" list="typeList" listKey="key" listValue="value" data-validate="required" 
								cssClass="ui-widget-content "></s:select>
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
							<s:textfield name="e.path" cssClass="ui-widget-content" readonly="true" data-validate="required"/>
							<ul class="inputIcons" style="padding-right:8px">
								<li id="upLoadFileId" class="inputIcon ui-icon ui-icon-circle-arrow-n" style="position: relative;">
									<input type="file" class="auto uploadFile" id="uploadFile" name="uploadFile" title="点击上传文件"
										data-cfg='{"callback":"bc.templateForm.afterUploadfile","subdir":"template","source":":input[name=\"e.subject\"]","to":":input[name=\"e.path\"]","ptype":"Template","puid":"<s:property value="e.uid"/>"}'
										style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;filter: alpha(opacity = 10);opacity: 0;cursor: pointer;">
								</li>
								<li class="downLoadFileId inputIcon ui-icon ui-icon-circle-arrow-s" title='<s:text name="template.download"/>' >
								<li id="cleanFileId" class="clearSelect inputIcon ui-icon ui-icon-circle-close" title='<s:text name="title.click2clear"/>'></li>				 
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
									<li class="downLoadFileId inputIcon ui-icon ui-icon-circle-arrow-s" title='<s:text name="template.download"/>' >
								</ul>	
							</div>
					</td>
					<td class="value">
						<s:textarea rows="5" name="e.content"  cssClass="ui-widget-content noresize" />
					</td>
				</tr>
				<!-- 模板参数 -->
				<tr id="idTplParam">
					<td class="topLabel">
								<s:text name="template.param"/>:</td>
					<td class="value">
						<div id="templateParams" style="position:relative;margin: 0;padding: 1px 0;min-height:19px;margin: 0;font-weight: normal;width: 98%;" class="ui-widget-content" 
							data-removeTitle='<s:text name="title.click2remove"/>'>
							<ul class="inputIcons" style="top:10px">
								 	<li class="inputIcon ui-icon ui-icon-circle-plus" title='<s:text name="点击添加参数"/>' id="addParam">
							</ul>
							<s:if test="%{templateParams != null && !templateParams.isEmpty()}">
								<ul class="horizontal templateParamUl" style="padding: 0 50px 0 0;">
								<s:iterator value="templateParams">
								<li class="horizontal templateParamLi" style="position: relative;margin:0 2px;float: left;padding: 0;"
									data-id=<s:property value="['id']"/>>
								<span class="text" ><s:property value="['name']" /></span>
								<s:if test="!isReadonly()">
									<span class="click2remove verticalMiddle ui-icon ui-icon-close" style="margin: -8px -2px;" title='<s:text name="title.click2remove"/>'></span>
								</s:if>
								</li>
								</s:iterator>
								</ul>
							</s:if>	
						</div>	
					</td>
				</tr>
				<tr>
					<td class="label" colspan="2" style="padding-right:8px"><s:text name="template.file.formatted"/>:<s:radio name="e.formatted" list="#{'true':'是','false':'否'}" cssStyle="width:auto;"/></td>
				</tr>
				<tr>
					<td class="label" colspan="2" style="padding-right:8px"><s:text name="template.status"/>:<s:radio name="e.status" list="#{'0':'正常','1':'禁用'}" cssStyle="width:auto;"/></td>
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
		<s:hidden name="e.uid" />
		<s:hidden name="e.inner" />
		<s:hidden name="e.author.id" />
		<s:hidden name="templateParamIds" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
		<input type="hidden" id="templateTypeCode" value='<s:property value="e.templateType.code" />'/>
		<input type="hidden" id="templateTypeExt" value='<s:property value="e.templateType.extension" />'/>
	</s:form>
</div>