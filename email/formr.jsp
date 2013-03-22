<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div data-type='form' class="bc-page"
	data-js='<s:url value="/bc/email/form.js" />,js:redactor_css'
	data-option='<s:property value="formPageOption"/>' style="overflow-y:auto;cursor: default;">
	<s:form name="emailFormr" theme="simple" >
		<div class="email-subject" style='text-align:left;font-size:20px;outline:0;color:black;' tabIndex="0">
			<s:property value="e.subject" escapeHtml="false"/>
		</div>
		<!-- 发件人 -->
		<div class="email-history" style="text-align:left;font-weight:normal;">
			<s:text name="email.sender"/>：<s:property value="e.sender.name" /> 
		</div>
		
		<s:set name="email_sender" value="" />
		<s:set name="email_cc" value="" />
		<s:set name="email_bcc" value="" />
		
		<s:iterator var="t" value="e.to">
			<s:if test="%{t.type==0}">
				<s:if test="%{email_sender.length() > 0}">
					<s:set name="email_sender" value="email_sender+'、'+t.receiver.name" />
				</s:if><s:else>
					<s:set name="email_sender" value="t.receiver.name" />
				</s:else>
			</s:if><s:elseif test="%{t.type==1}">
				<s:if test="%{email_cc.length() > 0}">
				
				</s:if><s:else>
				
				</s:else>
			</s:elseif><s:else>
				<s:if test="%{email_cc.length() > 0}">
				
				</s:if><s:else>
				
				</s:else>
			</s:else>
		
		
		</s:iterator>
		
		<s:iterator var="a" value="e.to">
			<!-- 收件人  -->
			<div class="email-history" style="text-align:left;font-weight:normal;">
				<s:text name="email.sender"/>：<s:property value="e.sender.name" /> 
			</div>
			<!-- 抄送  -->
			<div class="email-history" style="text-align:left;font-weight:normal;">
				<s:text name="email.cc"/>：<s:property value="e.sender.name" /> 
			</div>
			<!-- 密送 -->
			<div class="email-history" style="text-align:left;font-weight:normal;">
				<s:text name="email.bcc"/>：<s:property value="e.sender.name" /> 
			</div>
		</s:iterator>
		
		
		<!-- 日期 -->
		<div class="email-history" style="text-align:left;font-weight:normal;">
			<s:text name="email.date"/>：<s:date format="yyyy-MM-dd HH:SS" name="e.sendDate" />(<s:property value="@cn.bc.core.util.DateUtils@getWeekCN(e.sendDate)" />)
		</div>
		
		<div class="email-history" style="text-align:center;font-weight:normal;"><s:property value="typeDesc" /> <s:date 
			format="yyyy年MM月dd日" name="e.sendDate" /> <s:property value="e.source"/><s:if test="%{e.status != 0}"> [<s:property value="statusDesc"/>]</s:if></div>
		
		<s:if test="%{e.content.length() > 0}">
			<div class="ui-widget-content" style="border-width: 0 0 1px 0;height:1px;"></div>
			<div class="email-content redactor_editor unselectable" unselectable="on" style='font-weight: normal;'>
				<s:property value="e.content" escapeHtml="false"/>
			</div>
		</s:if>
		
		<div class="ui-widget-content " style="border-width: 0 0 1px 0;height:1px;"></div>
		<s:property value="attachsUI" escapeHtml="false"/>	
	</s:form>
</div>