var sidebarApp = angular.module('sidebarApp', []);

sidebarApp.controller('SidebarCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
	$scope.orderProp = '-time';
	$scope.query = '';
	$scope.groups = [
		{	mid: "myEmails",
			type: "email",
			title: "邮件",
			url: "bc/emailTos/paging",
			itemUrl: "bc/email/open",
			itemData: "openType=2&id={0}",
			iconClass: "ui-icon-mail-closed",
			itemIconClass: "ui-icon-mail-closed",
			count: 0,
			order: 1},
		{	mid: "workspace",
			type: "todo",
			title: "个人待办",
			url: "bc-workflow/todo/personals/list",			// 视图url
			itemUrl: "bc-workflow/workspace/open",	// 表单url
			itemData: "id={0}",
			iconClass: "ui-icon-calendar",
			itemIconClass: "ui-icon-check",
			count: 0,
			order: 2},
		{	mid: "workspace",
			type: "groupTodo",
			title: "岗位待办",
			url: "bc-workflow/todo/personals/list",
			itemUrl: "bc-workflow/workspace/open",
			itemData: "id={0}",
			iconClass: "ui-icon-calendar",
			itemIconClass: "ui-icon-person",
			count: 0,
			order: 3}
	];
	$scope.typeIndex = {};
	angular.forEach($scope.groups, function(group, index) {
		$scope.typeIndex[group.type] = index;
	});
	console.log("sidebar: typeIndex", $scope.typeIndex);

	// 打开单条信息
	$scope.openItem = function(item){
		console.log("openItem", item);
		var g = $scope.groups[$scope.typeIndex[item.type]];
		if(item.type == 'email'){	//邮件
			bc.page.newWin({
				name: item.title || "(无)",
				mid: item.type + item.dbid,
				url: g.itemUrl,
				data: g.itemData.format(item.dbid)
			});
		}else{						// 待办
			bc.flow.openWorkspace({
				name : item.title || "(无)",
				id : item.dbid
			});
		}
	};

	// 打开各区域的视图
	$scope.openGroup = function(group){
		console.log("openGroup", group);
		bc.page.newWin({
			name: group.title,
			mid: group.mid,
			url: group.url
		});
	};

	// 折叠|展开所有区域
	$scope.toggleAll = function(){
		angular.forEach($scope.groups, function(group, index) {
			group.collapse = !group.collapse;
		});
	};

	// 重新加载数据
	$scope.refresh = function(){
		console.log("sidebar: refresh", new Date());
		$scope.refreshing = true;
		$http.get('/sidebar').success(function(data) {
			$scope.items = data;
			$scope.refreshing = false;

			// 更新相对时间
			$scope.time4moment();

			// 汇总各分组的数量
			angular.forEach($scope.groups, function(group) {
				group.count = 0;
			});
			var type;
			angular.forEach($scope.items, function(item) {
				type = $scope.groups[$scope.typeIndex[item.type]];
				type && (type.count += 1);
			});
		});
	};

	// 更新相对时间
	$scope.time4moment = function(){
		console.log("sidebar: update time4moment", new Date());
		angular.forEach($scope.items, function(item) {
			item.time4moment = moment(item.time, "YYYY-MM-DD HH:mm:ss").fromNow();
		});
	};

	// 每间隔一段时间更新相对时间
	$interval(function() {
		if($scope.refreshing) return;
		$scope.time4moment(); 
	}, 60000);

	// 每间隔一段时间重新获取数据
	$interval(function(){
		$scope.refresh();
	}, 300000);


	// 初始化一次数据
	$scope.refresh();
}]);

//angular.bootstrap(document, ['sidebarApp']);