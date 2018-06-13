define(["angular"], function (angular) {
  var sidebar = angular.module('sidebar', []);
  sidebar.controller('SidebarCtrl', ['$scope', '$http', '$interval', '$window', function ($scope, $http, $interval, $window) {
    $scope.press = bc.kv.get("sidebar:press") === 'true'; // false-按邮件、待办分组, true-按流程名称分组
    $scope.query = '';
    $scope.types = {
      email: {
        mid: "myEmails",
        title: "邮件",
        url: "bc/emailTos/paging",
        itemUrl: "bc/email/open",
        itemData: "openType=2&id={0}",
        iconClass: "ui-icon-mail-closed",
        itemIconClass: "ui-icon-mail-closed",
        order: 1
      },
      todo: {
        mid: "workspace",
        title: "个人待办",
        url: "bc-workflow/todo/personals/list",			// 视图url
        itemUrl: "bc-workflow/workspace/open",	// 表单url
        itemData: "id={0}",
        iconClass: "ui-icon-calendar",
        itemIconClass: "ui-icon-check",
        order: 2
      },
      groupTodo: {
        mid: "workspace",
        title: "岗位待办",
        url: "bc-workflow/todo/personals/list",
        itemUrl: "bc-workflow/workspace/open",
        itemData: "id={0}",
        iconClass: "ui-icon-calendar",
        itemIconClass: "ui-icon-person",
        order: 3
      }
    };

    // 打开单条信息
    $scope.openItem = function (item) {
      //console.log("openItem", item);
      var type = $scope.types[item.type];
      if (item.type == 'email') {	//邮件
        bc.page.newWin({
          name: item.title || "(无)",
          mid: item.type + item.dbid,
          url: type.itemUrl,
          data: type.itemData.format(item.dbid)
        });
      } else {						// 待办
        bc.flow.openWorkspace({
          name: item.title || "(无)",
          id: item.dbid
        });
      }
    };

    // 打开各区域的视图
    $scope.openType = function (group) {
      //console.log("openType", group.type);
      bc.page.newWin({
        name: group.type.title,
        mid: group.type.mid,
        url: group.type.url
      });
    };

    // 折叠|展开所有区域
    $scope.toggleAll = function () {
      angular.forEach($scope.groups, function (group) {
        group.collapse = !group.collapse;
      });
    };

    // 切换分组方式
    $scope.toggleGroupWay = function () {
      //console.log("sidebar: toggleGroupWay");
      $scope.press = !$scope.press;
      bc.kv.set({"sidebar:press": $scope.press});	// 记住用户设置的分组方式
      $scope.buildGroups();
    };

    // 重新加载数据
    $scope.refresh = function () {
      //console.log("sidebar: refresh", new Date());
      $scope.refreshing = true;
      $http.get('sidebar').success(function (data) {
        $scope.items = data;
        $scope.refreshing = false;

        // 更新相对时间
        $scope.time4moment();

        // 分组处理
        $scope.buildGroups();
      });
    };

    // 分组处理
    $scope.buildGroups = function () {
      $scope.groups = [];
      var type, group, title;
      angular.forEach($scope.items, function (item) {
        type = $scope.types[item.type];
        if (!type) return;		// 不支持的类型
        title = $scope.press ? item.type2 : type.title;
        group = $scope.getGroup(title);
        if (!group) {
          group = {
            title: title,
            type: type,
            count: 0,
            items: [],
            order: type.title == '邮件' ? 0 : 1	// 保证邮件排在最前
          };
          $scope.groups.push(group);
        }
        group.count += 1;
        group.items.push(item);
      });
      // 计算flex
      angular.forEach($scope.groups, function (g) {
        if ($scope.items.length == 0) {
          g.flex = 'none';
        } else {
          g.flex = g.items.length || 'none';
        }
      });
      //console.log("groups=%o", $scope.groups);
    };
    $scope.getGroup = function (title) {
      for (var i = 0; i < $scope.groups.length; i++) {
        if ($scope.groups[i].title == title)
          return $scope.groups[i];
      }
      return null;
    };

    // 更新相对时间
    $scope.time4moment = function () {
      //console.log("sidebar: update time4moment", new Date());
      angular.forEach($scope.items, function (item) {
        item.time4moment = moment(item.time, "YYYY-MM-DD HH:mm:ss").fromNow();
      });
    };

    // 每间隔一段时间更新相对时间
    $interval(function () {
      if ($scope.refreshing) return;
      $scope.time4moment();
    }, 60000);

    // 每间隔一段时间重新获取数据
    $interval(function () {
      $scope.refresh();
    }, 300000);

    // 旧方法的兼容处理:循环检测是否存在外部调用刷新方法
    var outsideRefresh = 0;
    $interval(function () {
      if (outsideRefresh != $window.outsideRefresh) {
        //console.log("do outsideRefresh");
        outsideRefresh = $window.outsideRefresh;
        $scope.refresh();
      }
    }, 1000);

    // 初始化一次数据
    $scope.refresh();
  }]);
  angular.bootstrap(document.getElementById("right"), ['sidebar']);

  window.outsideRefresh = 0;
  bc.namespace("bc.sidebar");
  bc.sidebar.refresh = function () {
    //console.log("call bc.sidebar.refresh");
    window.outsideRefresh += 1;
  };

  return sidebar;
});