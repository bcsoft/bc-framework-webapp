<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page import="cn.bc.web.ui.html.toolbar.*"%>
<form class="bc-conditionsForm draggable ui-widget-content ui-state-highlight">
	<ul class="conditions" style="min-width:15.3em;">
		<li class="condition">
			<div class="label">模板类型</div>
			<div class="value checkboxes" data-condition='{"type":"int","key":"t.type_"}' >
			<div class="value">
				<div>
					<div style="width:60px;display:inline-block;">
						<label><input type="checkbox" name="checkboxField1" value="1"><span>Excel</span></label>
					</div><div style="width:30px;display:inline-block;"></div><div style="width:80px;display:inline-block;">
						<label><input type="checkbox" name="checkboxField1" value="3"><span>文本文件</span></label>
					</div>
				</div>
				<div>
					<div style="width:60px;display:inline-block;">
						<label><input type="checkbox" name="checkboxField1" value="2"><span>Word</span></label>
					</div><div style="width:30px;display:inline-block;"></div><div style="width:80px;display:inline-block;">
						<label><input type="checkbox" name="checkboxField1" value="4"><span>Html文件</span></label>
					</div>
				</div>
				<div>
					<label><input type="checkbox" name="checkboxField1" value="5"><span>其它文件</span></label>
				</div>
			</div>
			</div>
		</li>
	</ul>
</form>