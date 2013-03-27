<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div data-type='form' class="bc-page"
	data-js='<s:url value="/bc/email/formr.js" />,js:redactor_css'
	data-initMethod='bc.emailFormr.init'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;cursor: default;">
	<s:form name="emailFormr" theme="simple" style="margin:10px;" >
		<div class="email-subject" style='text-align:left;font-size:20px;outline:0;color:black;margin-bottom:8px;position:relative;' tabIndex="0">
			<s:property value="e.subject" escapeHtml="false"/>
			<ul class="inputIcons email-open">
				<s:if test="%{openType == 2}">
				 	<li class="emailFormr-reply inputIcon ui-icon ui-icon-arrowreturnthick-1-w"  title='点击回复邮件'/>
			 	</s:if>
				<s:if test="%{openType == 1 || openType == 2}">
				 	<li class="emailFormr-forward inputIcon ui-icon ui-icon ui-icon-arrowthick-1-e" title='点击转发邮件'/>
			 	</s:if>
			</ul>
		</div>
		<!-- 发件人 -->
		<div class="email-history" style="text-align:left;font-weight:normal;">
			<s:text name="email.sender"/>：<s:property value="e.sender.name" /> 
		</div>
		
		<!-- 收件人、抄送、密送的显示  -->
		<s:set name="email_sender" value='""' />
		<s:set name="email_cc" value='""' />
		<s:set name="email_bcc" value='""' />
		<s:iterator var="t" value="e.to">		
			<s:if test="%{type==0}">
				<s:if test="%{#email_sender.length() > 0}">
					<s:set name="email_sender" value="%{#email_sender+'、'+receiver.name}" />
				</s:if><s:else>
					<s:set name="email_sender" value="receiver.name" />
				</s:else>		
			</s:if><s:elseif test="%{type==1}">
				<s:if test="%{#email_cc.length() > 0}">
					<s:set name="email_cc" value="%{#email_cc+'、'+receiver.name}" />
				</s:if><s:else>
					<s:set name="email_cc" value="receiver.name" />
				</s:else>
			</s:elseif><s:else>
				<s:if test="%{#email_bcc.length() > 0}">
					<s:set name="email_bcc" value="%{#email_bcc+'、'+receiver.name}" />
				</s:if><s:else>
					<s:set name="email_bcc" value="receiver.name" />
				</s:else>
			</s:else>
		</s:iterator>	
		
		<s:if test="%{#email_sender.length() > 0}">
			<div class="email-history" style="text-align:left;font-weight:normal;">
				<s:text name="email.receiver"/>：<s:property value="email_sender" />
			</div>
		</s:if>
		<s:if test="%{#email_cc.length() > 0}">
			<div class="email-history" style="text-align:left;font-weight:normal;">
				<s:text name="email.cc"/>：<s:property value="email_cc" />
			</div>
		</s:if>
		<s:if test="%{openType == 1 && #email_bcc.length() > 0}">
			<div class="email-history" style="text-align:left;font-weight:normal;">
				<s:text name="email.bcc"/>：<s:property value="email_bcc" />
			</div>
		</s:if>
		
		<!-- 日期 -->
		<div class="email-history" style="text-align:left;font-weight:normal;margin-bottom:10px;">
			<s:text name="email.date"/>：<s:date format="yyyy-MM-dd HH:mm" name="e.sendDate" />&nbsp;&nbsp;(<s:property value="week4cn" />)
		</div>
		
		<s:if test="%{e.content.length() > 0}">
			<div class="ui-widget-content" style="border-width: 0 0 1px 0;height:1px;"></div>
			<div class="email-content redactor_editor unselectable" unselectable="on" style='font-weight: normal;'>
				<s:property value="e.content" escapeHtml="false"/>
			</div>
		</s:if>
		
		<div class="ui-widget-content " style="border-width: 0 0 1px 0;height:1px;"></div>
		<s:property value="attachsUI" escapeHtml="false"/>
		
		<s:hidden name="e.id" />	
	</s:form>
</div>