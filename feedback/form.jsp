<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div title='<s:text name="feedback.title"/>' data-type='form' class="bc-page"
	data-saveUrl='<s:url value="/bc/feedback/save" />'
	data-js='js:editor,<s:url value="/bc/feedback/form.js" />'
	data-initMethod='bc.feedbackForm.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;">
	<s:form name="feedbackForm" theme="simple">
		<div class="formTopInfo">
			<s:property value="e.author.name" /> 创建于  <s:date name="e.fileDate" format="yyyy-MM-dd HH:mm:ss"/>
		</div>
		<div class="formFields">
			<s:textfield name="e.subject" data-validate="required" style="width:99%" cssClass="ui-widget-content"/>
		</div>
		<div class="formEditor">
			<textarea style="height:200px;" name="e.content" class="bc-editor" data-validate="required"
				 data-ptype="feedback.editor" data-puid='${e.uid}' 
				 data-readonly='${e.id != null}' data-tools='simple'>${e.content}</textarea>
		</div>
		<s:property value="attachsUI" escapeHtml="false"/>
		<s:hidden name="e.uid" />
		<s:hidden name="e.id" />
		<s:hidden name="e.author.id" />
		<input type="hidden" name="e.fileDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.fileDate" />'/>
		<s:hidden name="e.modifier.id" />
		<input type="hidden" name="e.modifiedDate" value='<s:date format="yyyy-MM-dd HH:mm:ss" name="e.modifiedDate" />'/>
		
		<s:if test="!e.isNew()">
		<div class="formFields">
			<s:iterator value="e.replies" var="r">
			<div class="reply" style="border-bottom:1px solid blue;">
				<div class="replyHeader">
					<s:date format="yyyy-MM-dd HH:mm:ss" name="fileDate" /> <s:property value="author.name"/>
				</div>
				<div class="replySubject">
					<s:property value="subject"/>
				</div>
			</div>
			</s:iterator>
		</div>
		</s:if>
	</s:form>
</div>