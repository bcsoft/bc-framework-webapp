bc.online = {
	init : function() {
		var $page = $(this);
		//事件处理
		$page.find("li.item").bind("mouseover", function() {
			$(this).addClass("ui-state-hover");
		}).bind("mouseout", function() {
			$(this).removeClass("ui-state-hover");
		}).bind("dblclick", function() {
			alert($(this).data("user").fullName);
		});
	}
};