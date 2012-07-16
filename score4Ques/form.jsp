<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="score4Ques.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/score4Ques/save" />'
	data-js='js:bc_identity,<s:url value="/bc/score4Ques/form.js"/>'
	data-initMethod='bc.score4QuesForm.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="score4QuesForm" theme="simple" cssStyle="width:630px;">
		<table class="formFields" cellspacing="2" cellpadding="0">
			<tbody>
				<tr class="widthMarker">
					<td style="width:40%;">&nbsp;</td>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td class="label"><s:text name="score4Ques.testPaper"/>:</td>
					<td class="value"><s:textfield name="e.houseType" readonly="true" cssClass="ui-widget-content"/></td>
				</tr>
				<tr>
					<td class="label"><s:text name="score4Ques.testQuestions"/>:</td>
					<td class="value"><s:textfield name="e.houseType" readonly="true" cssClass="ui-widget-content"/></td>
				</tr>
				<tr>
					<td class="label"><s:text name="score4Ques.answersPeople"/>:</td>
					<td class="value"><s:textfield name="e.houseType" readonly="true" cssClass="ui-widget-content"/></td>
				</tr>
				<tr>
					<td class="label"><s:text name="score4Ques.assessScore"/>:</td>
					<td class="value"><s:textfield name="e.houseType" readonly="true" cssClass="ui-widget-content"/></td>
				</tr>
				<tr>
					<td class="label"><s:text name="score4Ques.answer"/>:</td>
					<td class="value">&nbsp;</td>
				</tr>
				<tr>
					<td>
						<s:textarea name="subject" value="%{items.iterator().next().subject}" rows="3" cssClass="ui-widget-content noresize"/>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="formTopInfo">
			状态：<s:property value="%{statusesValue[e.status]}" />&nbsp;&nbsp;&nbsp;&nbsp;登记：<s:property value="e.author.name" />(<s:date name="e.fileDate" format="yyyy-MM-dd HH:mm:ss"/>)
			<s:if test="%{e.modifier != null}">
			，最后修改：<s:property value="e.modifier.name" />(<s:date name="e.modifiedDate" format="yyyy-MM-dd HH:mm:ss"/>)<br/>
			</s:if>
			<s:if test="%{e.status==0}">
			发布人：<s:property value="e.issuer.name" />(<s:date name="e.issueDate" format="yyyy-MM-dd HH:mm:ss"/>)
			</s:if>
		</div>
		<s:hidden name="e.id" />
		<s:hidden name="e.status"/>
		<s:hidden name="e.author.id" />
		<s:hidden name="e.type" />
		<s:hidden name="topics" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
		
	</s:form>
</div>