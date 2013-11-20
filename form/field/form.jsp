<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:property value="e.name" />' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/fieldManage/save" />'
	data-js='js:bc_identity'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="Formfield" theme="simple" style="width:720px">
		<div class="formFields ui-widget-content">
		<table class="formFields ui-widget-content" cellspacing="2" cellpadding="0">
			<tr class="widthMarker">
				<td >&nbsp;</td>
				<td style="width: 100px;">&nbsp;</td>
				<td style="width: 30px;">&nbsp;</td>
				<td style="width: 100px;">&nbsp;</td>
			</tr>
			<tr>
				<td class="label">字段名称:</td>
				<td class="value">
					<s:property value="e.name" />
				</td>
				<td class="label">字段类型:</td>
				<td class="value">
					<s:property value="e.type" />
				</td>
			</tr>
			<tr>
				<td class="label">所属表单id:</td>
				<td class="value">
					<s:property value="e.form.id" />
				</td>
				<td class="label">标签名称:</td>
				<td class="value">
					<s:property value="e.label" />
				</td>
			</tr>
		</table>
		<div class="formFields ui-widget-content">
			<div class="ui-widget-header title" style="position:relative;border-width:0!important;">
				<span class="text" >字段的值：</span>
				<span id="showGroups1" class="verticalMiddle ui-icon ui-icon-carat-1-n" title='<s:text name="runcase.title.click2HiddenGroups"/>'></span>
			</div>
			<div id="formEditorDiv" class="formEditor" style="min-width:590px;font-weight: normal;overflow: hidden;margin:0;border:none;">
				  <textarea style="height:300px;width:670px"class="bc-date ui-widget-content">
			       			<s:property value="e.value" />
			      </textarea>
			</div>
		</div>
		<s:hidden name="e.id" />
		<s:hidden name="e.form.id" />
		<s:hidden name="e.name" />
		<s:hidden name="e.type" />
		<s:hidden name="e.label" />
	</s:form>
</div>