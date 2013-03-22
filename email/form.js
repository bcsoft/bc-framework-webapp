bc.emailForm = {
	init : function(option,readonly) {
		var $form = $(this);
		
		// 初始化Redactor编辑器
		var buttons = ['html', '|', 'formatting', '|', 'bold', 'italic', 'underline', 'deleted', '|', 
	       'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
	       'image', 'video', 'file', 'table', 'link', '|',
	       'fontcolor', 'backcolor', '|', 'alignment', '|', 'horizontalrule'];
		var type = $form.find("input[name='e.type']").val();
		var uid = $form.find("input[name='e.uid']").val()
		$form.find(".bc-redactor").redactor({
			lang: 'zh_cn',
			fixed: true,
			focus: false,
			autoresize: false,
			plugins: ['fullscreen'],
			minHeight: 80,
			buttons: buttons,
			imageUpload: bc.root + "/upload/?a=1&type=img&sp=editor&fn=file&ptype=email." + type + ".editor&puid=" + uid
		});
		
		if(readonly)return;
		
		//声明li
		var liTpl = '<li class="horizontal  ui-widget-content ui-corner-all ui-state-highlight" data-id="{0}"'+
		" data-hidden='{1}'"+
		' style="position: relative;margin:0 2px;float: left;padding: 0;border-width: 0;">'+
		'<span class="text">{2}</span>'+
		'<span class="click2remove verticalMiddle ui-icon ui-icon-close" style="margin: -8px -2px;" title={3}></span></li>';
		
		$form.delegate(".selectReceiver","click",function(){
			var $div = $(this).closest("div");
			var $ul = $div.find("ul");
			var $lis = $ul.find("li");
			var selecteds="";
			$lis.each(function(i){
				selecteds+=(i > 0 ? "," : "") + ($(this).attr("data-id"));//
			});
			bc.identity.selectUser({
				multiple: true,//可多选
				history:false,
				status:'0',
				selecteds: selecteds,
				onOk: function(users){
					$.each(users,function(i,user){
						if($lis.filter("[data-id='" + user.id + "']").size() > 0){//已存在
							logger.info("duplicate select: id=" + user.id + ",name=" + user.name);
						}else{//新添加的
							var data={
								id:user.id,
								code:user.account,
								name:user.name
							}
							$(liTpl.format(user.id,$.toJSON(data),user.name,'点击移除'))
							.appendTo($ul).find("span.click2remove")
							.click(function(){
								$(this).parent().remove();
							});
						}
					});
				}
			});
		});
	},
	/**
	 * 保存
	 */
	save : function(){
		var $form = $(this);
		if(!bc.validator.validate($form)) return;
		
		var $uls=$form.find(".ulReceiver");
		var datas=[];
		var data;
		var $ul;
		var $lis;
		var toType;
		$uls.each(function(){
			$ul=$(this);
			$lis=$ul.find("li");
			toType=$ul.attr("data-type");
			$lis.each(function(){
				data={type:toType},
				data=$.extend(data,eval("("+$(this).attr("data-hidden")+")"));
				datas.push(data);
			});
		});
		
		if(datas.length==0){
			bc.msg.alert("请至少添加一位邮件的接收人！");
			return;
		}
		$form.find(":input[name='receivers']").val($.toJSON(datas));
		
		//设置状态为已发送
		$form.find(":input[name='e.status']").val(1);
		
		bc.msg.confirm("确认发送邮件",function(){
			bc.page.save.call($form,{callback:function(json){
				bc.msg.slide("发送成功");
				$form.dialog("close");
				return false;
			}});
			
		},function(){
			//不选择发送，将状态设为草稿
			$form.find(":input[name='e.status']").val(0);
		});
		
	},
	/**
	 * 预览
	 */
	preview : function(){
		var $form = $(this);
		var id = $form.find("input[name='e.id']").val();
		
		bc.page.newWin({
			name: $page.find("input[name='e.subject']").val(),
			mid: "info.preview."+id,
			url: bc.root+ "/bc-business/info/open?id="+id
		});
		
	}
};