/**
 * 列表视图的全局处理
 *
 * @author rongjihuang@gmail.com
 * @date 2011-05-25
 * @depend jquery-ui-1.8,bc.core
 */
(function ($) {
  bc.grid = {
    /**
     * 选中行的样式
     */
    selectedClass: 'ui-state-highlight',//旧版为 'ui-state-default ui-state-focus'
    /**
     * 是否允许表格的鼠标悬停行样式切换
     */
    enabledHoverToggle: true,
    /**
     * 表格型页面的初始化
     * @param container 对话框内容的jquery对象
     */
    init: function (container) {
      var $grid = container.find(".bc-grid");
      //滚动条处理
      var $dataRight = $grid.find(".data .right");
      var $dataLeft = container.find(".data .left");
      var $headerRight = container.find(".header .right");
      $dataRight.scroll(function (e) {
        var $this = $(this);
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
        //logger.debug("scroll");
        $headerRight.scrollLeft($this.scrollLeft());
        $dataLeft.scrollTop($this.scrollTop());
      });

      //记录表格的原始宽度
      //var $data_table = $grid.find(".data .right .table");
      //var originWidth = parseInt($data_table.attr("originWidth"));
      //$data_table.data("originWidth", originWidth);
      //logger.debug("originWidth:" + originWidth);

      //绑定并触发一下对话框的resize事件
      //container.trigger("dialogresize");
      bc.grid.resizeGridPage(container);
      container.bind("dialogresize", function (event, ui) {
        bc.grid.resizeGridPage(container);
      });

      //禁止选择文字
      $grid.disableSelection();
    },
    /**
     * 表格型页面改变对话框大小时的处理
     * @param container 对话框内容的jquery对象
     */
    resizeGridPage: function (container) {
      var $grid = container.find(".bc-grid");
      container = $grid.parent();
      if ($grid.size()) {
        var $data_right = $grid.find(".data .right");
        var $data_left = $grid.find(".data .left");
        var $header_right = $grid.find(".header .right");

        //边框加补白的值
        var sw = 0, sh = 0;
        if ($.support.boxModel) {
          sw = $grid.outerWidth() - $grid.width() + ($data_left.outerWidth() - $data_left.width());
          sh = $grid.outerHeight() - $grid.height();
        }
        logger.debug("grid's sh:" + sh);
        logger.debug("grid's sw:" + sw);
        logger.debug("--" + container.width() + "," + $data_left.width());

        //设置右容器的宽度
        $data_right.width(container.width() - $data_left.width() - sw);
        $header_right.width($data_right[0].clientWidth);//当缩小宽度时，因float，会换行导致高度增高，故在设置高度前必须设置一下

        //设置右table的宽度
        var $data_table = $data_right.find(".table");
        var $header_table = $header_right.find(".table");
        var originWidth = parseInt($data_table.attr("originWidth"));//$data_table.data("originWidth");//原始宽度
        var clientWidth = $data_right[0].clientWidth;
        var newTableWidth = Math.max(originWidth, clientWidth);
        $data_table.width(newTableWidth);
        $header_table.width(newTableWidth);
        logger.debug("originWidth=" + originWidth);
        logger.debug("newTableWidth=" + newTableWidth);

        //累计表格兄弟的高度
        var otherHeight = 0;
        $grid.siblings(":visible:not('.bc-conditionsForm,.boxPointer,.bc-tree')").each(function (i) {
          otherHeight += $(this).outerHeight(true);
          logger.debug("grid's sibling" + i + ".outerHeight:" + $(this).outerHeight(true));
        });
        logger.debug("grid's siblings.outerHeight:" + otherHeight);

        //重设表格的高度
        $grid.height(container.height() - otherHeight - sh);

        //再累计表格头和分页条的高度
        $data_right.parent().siblings().each(function (i) {
          otherHeight += $(this).outerHeight(true);
        });
        logger.debug("grid's data.otherHeight:" + otherHeight);

        //data右容器高度
        $data_right.height(container.height() - otherHeight - sh);

        //如果设置data右容器高度后导致垂直滚动条切换显示了，须额外处理一下
        var _clientWidth = $data_right[0].clientWidth;
        if (_clientWidth != clientWidth) {//从无垂直滚动条到出现滚动条的处理
          //logger.debug("clientWidth");
          //$data_table.width(_clientWidth);
          //newTableWidth = _clientWidth;
          $header_right.width($data_right[0].clientWidth);
        }

        //header宽度(要减去data区的垂直滚动条宽度)
        //$header_right.width($data_right[0].clientWidth);
        //$header_right.find(".table").width(newTableWidth);

        //data左容器高度(要考虑data右容器水平滚动条高度)
        //logger.debug("grid's data.clientHeight:" + $data_right[0].clientHeight);
        $grid.find(".data .left").height($data_right[0].clientHeight);

        //logger.debug(":::" + $grid.find(".header").outerHeight(true)  + "," + $grid.find(".header")[0].clientHeight);
        //logger.debug("width2:" + $data_table.width());
      }
    },
    /**
     * 对指定table的tbody的行数据进行排序
     * @param $tbody table的tbody对应的jquery对象
     * @param tdIndex 要进行排序的单元格在行中的索引号
     * @param dir 排序的方向：1--正向，-1--反向
     */
    sortTable: function ($tbody, tdIndex, dir) {
      if (!$tbody.size()) return;
      var tbody = $tbody[0];
      var rows = tbody.rows;
      var trs = new Array(rows.length);
      for (var i = 0; i < trs.length; i++) {
        trs[i] = rows[i];//rows(i)
        trs[i].setAttribute("prevIndex", i);//记录未排序前的顺序
      }
      //数组排序
      trs.sort(function (tr1, tr2) {
        var v1 = tr1.cells[tdIndex].innerHTML;
        var v2 = tr2.cells[tdIndex].innerHTML;
        //英文永远在中文前面，子chrome11测试不通过
        return dir * v1.localeCompare(v2);
      });
      //交换表格的行到新的顺序
      var t = [];
      var notFirefox = !$.browser.mozilla;
      for (var i = 0; i < trs.length; i++) {
        //firefox不支持outerHTML;
        t.push(notFirefox ? trs[i].outerHTML : document.createElement("div").appendChild(trs[i].cloneNode(true)).parentNode.innerHTML);
      }
      $tbody.html(t.join(""));
      //tbody.innerHTML = t.join("");//ie中不支持，tbody的innerHTML为只读

      return trs;//返回排好序的tr列表
    },
    /**重新加载表格的数据部分
     * @param $page 页面dom的jquery对象
     * @param option 特殊配置参数
     * @option url 加载数据的url
     * @option data 请求将附加的数据
     * @option callback 请求数据完毕后的处理函数
     */
    reloadData: function ($page, option) {
      var fromMID = $page.attr("data-from");
      logger.info("grid.reloadData:fromMID=" + fromMID);
      if (fromMID) {
        if ($page.is("[data-fromType='tab']")) {// $page来源于页签内的视图
          $page = $(".bc-ui-dialog>.bc-page .bc-page[data-mid='" + fromMID + "']");
          if ($page.size() == 0) {
            logger.info("找不到相应的原始页签，忽略不作处理！fromMID=" + fromMID);
            return;
          }
        } else {// $page来源于对话框视图
          $page = $(".bc-ui-dialog>.bc-page[data-mid='" + fromMID + "']");
          if ($page.size() == 0) {
            logger.info("找不到相应的原始对话框，忽略不作处理！fromMID=" + fromMID);
            return;
          }
        }
      }

      var ts = "grid.reloadData." + $page.attr("data-mid");
      logger.profile(ts);
      // 显示加载动画
      var $win = $page.parent();
      var $loader = $win.append('<div id="bc-grid-loader"></div>').find("#bc-grid-loader");
      $loader.css({
        top: ($win.height() - $loader.height()) / 2,
        left: ($win.width() - $loader.width()) / 2
      });

      option = option || {};
      var url = option.url || $page.attr("data-namespace") + "/data";
      logger.debug("reloadWin:loading grid data from url=" + url);

      var data = option.data || {};

      //==附加的额外的请求参数
      //  从page取
      var extras = $page.data("extras");
      logger.debug("page extras=" + $.toJSON(extras));
      if (extras) {
        data = $.extend(data, extras);
      } else {
        //  从grid取
        extras = $page.find(".bc-grid").data("extras");
        logger.debug("grid extras=" + $.toJSON(extras));
        if (extras) {
          data = $.extend(data, extras);
        }
      }

      //附加排序参数
      var $sortColumn = $page.find(".bc-grid .header .table td.sortable.asc,.bc-grid .header .table td.sortable.desc");
      if ($sortColumn.size()) {
        var sort = "";
        var $t;
        $sortColumn.each(function (i) {
          $t = $(this);
          sort += (i == 0 ? "" : ",") + $t.attr("data-id") + ($t.hasClass("asc") ? " asc" : " desc");
        });
        data["sort"] = sort;
        if (extras) extras.sort = sort;
      }

      //附加分页参数
      var $pager_seek = $page.find("ul.pager>li.seek");
      if ($pager_seek.size()) {
        data["page.pageNo"] = $pager_seek.find("#pageNo").text();
        data["page.pageSize"] = $pager_seek.parent().find("li.size>a.ui-state-active>span.pageSize").text();
      }

      //附加搜索条件的参数  TODO 高级搜索
      var $search = $page.find(".bc-toolbar #searchText");
      if ($search.size()) {
        var searchText = $search.val();
        if (searchText && searchText.length > 0) {
          data.search = searchText;
          if (extras) extras.search = searchText;
        } else {
          delete data.search;
          if (extras) delete extras.search;
        }
      }

      //记住原来的水平滚动参数
      var oldScrollLeft = $page.find(".data .right").scrollLeft();

      //重新加载数据
      bc.ajax({
        url: url, data: data,
        dataType: "html",
        type: "POST",
        success: function (html) {
          var $data = $page.find(".bc-grid .data");
          $data.empty().replaceWith(html);//整个data更换
          $data = $page.find(".bc-grid .data");//重新获取data对象
          bc.grid.init($page);

          //恢复水平滚动参数
          if (oldScrollLeft > 0) {
            logger.info("scroll4Left...");
            $data.find(".right").scrollLeft(oldScrollLeft);
          }

          //如果总页数变了，就更新一下
          var newPageCount = $data.attr("data-pageCount");
          logger.debug("grid's newPageCount=" + newPageCount);
          if (newPageCount) {
            var $pageCount = $page.find("#pageCount");
            if ($pageCount.text() != newPageCount)
              $pageCount.text(newPageCount);
          }
          var newTotalCount = $data.attr("data-totalCount");
          logger.debug("grid's newTotalCount=" + newTotalCount);
          if (newTotalCount) {
            var $totalCount = $page.find("#totalCount");
            if ($totalCount.text() != newTotalCount)
              $totalCount.text(newTotalCount);
          }

          //删除加载动画
          $loader.remove();
          logger.profile(ts);

          //调用回调函数
          if (typeof option.callback == "function")
            option.callback.call($page[0]);
        }
      });
    },
    /** 获取grid中选中行的id信息
     * @param $grid grid的jquery对象
     * @param all 是否返回所有数据，默认只返回id值
     * @return {Array|Object} 选中行的值，单选返回对象、多选返回数组
     */
    getSelected: function ($grid, all) {
      var isMultipleSelect = $grid.is(".multipleSelect");
      var $tds = $grid.find(">.data>.left tr.ui-state-highlight>td.id");
      if ($tds.length < 1) return isMultipleSelect ? [] : null;// 无选中

      if (isMultipleSelect) {// 多选
        if (all) {
          var rows = [];
          // 获取id列的数据
          $tds.each(function () {
            rows.push({"id": $(this).attr("data-id"), "rowLabel": $(this).attr("data-name")});
          });

          var hiddenData;
          $grid.find(">.data>.right tr.ui-state-highlight").each(function (index) {
            var $this = $(this);
            // 获取可见列的数据
            $this.children("td").each(function () {
              var $td = $(this);
              rows[index][$td.attr("data-column")] = $td.attr("data-value");
            });

            // 获取隐藏列的数据
            hiddenData = $this.data("hidden");
            if (typeof hiddenData == "object") {
              $.each(hiddenData, function (key, value) {
                rows[index][key] = value;
              });
            }
          });

          return rows;
        } else {
          var ids = [];
          $tds.each(function (i) {
            ids.push($(this).attr("data-id"));
          });
          return ids;
        }
      } else {//单选
        if (all) {
          // 获取id列的数据
          var row = {"id": $tds.attr("data-id"), "rowLabel": $tds.attr("data-name")};

          var $tr = $grid.find(">.data>.right tr.ui-state-highlight");
          // 获取可见列的数据
          $tr.children("td").each(function () {
            var $td = $(this);
            row[$td.attr("data-column")] = $td.attr("data-value");
          });

          // 获取隐藏列的数据
          var hiddenData = $tr.data("hidden");
          if (typeof hiddenData == "object") {
            $.each(hiddenData, function (key, value) {
              row[key] = value;
            });
          }

          return row;
        } else {
          return $tds.attr("data-id");
        }
      }
    },
    /** 获取grid中选中行的隐藏列信息
     * @param $grid grid的jquery对象
     */
    getSelectedRowHiddenData: function ($grid) {
      var r = [];
      $grid.find(">.data>.right tr.ui-state-highlight").each(function () {
        r.push($(this).data("hidden"));
      });
      return r;
    }
  };

  // support requirejs
  //if (typeof define === "function" && define.amd) {
  //	define("BCGrid", [], function () {
  //		return bc.grid;
  //	});
  //}

  var $document = $(document);

  //表格分页条按钮控制
  $document.on({
    "mouseover": function () {
      $(this).addClass("ui-state-hover");
    },
    "mouseout": function () {
      $(this).removeClass("ui-state-hover");
    }
  }, "ul .pagerIcon");

  //点击扩展按钮
  $document.on("click", "ul li.pagerIcon", function () {
    var $this = $(this);
    var action = $this.attr("data-action");//内定的操作
    var callback = $this.attr("data-callback");//回调函数
    callback = callback ? bc.getNested(callback) : undefined;//转换为函数
    var $page = $this.closest(".bc-page");
    switch (action) {
      case "refresh"://刷新视图
        //重新加载列表数据
        bc.grid.reloadData($page);
        break;
      case "changeSortType"://切换本地排序和远程排序
        $this.toggleClass("ui-state-active");
        if ($this.hasClass("ui-state-active")) {
          $this.attr("title", $this.attr("title4clickToLocalSort"));
          $this.closest(".bc-grid").attr("remoteSort", "true");
        } else {
          $this.attr("title", $this.attr("title4clickToRemoteSort"));
          $this.closest(".bc-grid").attr("remoteSort", "false");
        }
        break;
      case "print"://打印视图
        window.print();
        break;
      case "export"://导出视图
        if (bc.grid.export2Excel)
          bc.grid.export2Excel($page.find(".bc-grid"), this);
        else
          alert("'bc.grid.export2Excel'未定义");
        break;
      case "import"://导入数据
        if (bc.grid.import)
          bc.grid.import($page.find(".bc-grid"), this);
        else
          alert("'bc.grid.import'未定义");
        break;
      default ://调用自定义的函数
        var click = $this.attr("data-click");
        if (typeof click == "string")
          click = bc.getNested(click);//将函数名称转换为函数
        if (typeof click == "function")
          click.call(pageEl, callback);
        break;
    }

    return false;
  });
  //点击分页按钮
  $document.on("click", "ul li.pagerIconGroup.seek>.pagerIcon", function () {
    var $this = $(this);
    var $seek = $this.parent();
    var $pageNo = $seek.find("#pageNo");
    var curPageNo = parseInt($pageNo.text());
    var curPageCount = parseInt($seek.find("#pageCount").text());

    var reload = false;
    switch (this.id) {
      case "toFirstPage"://首页
        if (curPageNo > 1) {
          $pageNo.text(1);
          reload = true;
        }
        break;
      case "toPrevPage"://上一页
        if (curPageNo > 1) {
          $pageNo.text(curPageNo - 1);
          reload = true;
        }
        break;
      case "toNextPage"://下一页
        if (curPageNo < curPageCount) {
          $pageNo.text(curPageNo + 1);
          reload = true;
        }
        break;
      case "toLastPage"://尾页
        if (curPageNo < curPageCount) {
          $pageNo.text(curPageCount);
          reload = true;
        }
        break;
      default :
      //do nothing
    }
    logger.debug("reload=" + reload + ",id=" + this.id + ",curPageNo=" + curPageNo + ",curPageCount=" + curPageCount);

    //重新加载列表数据
    if (reload) bc.grid.reloadData($seek.closest(".bc-page"));

    return false;
  });
  //点击pageSize按钮
  $document.on("click", "ul li.pagerIconGroup.size>.pagerIcon", function () {
    var $this = $(this);
    if ($this.hasClass("ui-state-active")) return;//不处理重复的点击

    $this.addClass("ui-state-active").siblings().removeClass("ui-state-active");

    //重设置为第一页
    $this.closest("ul.pager").find("#pageNo").text(1);

    //重新加载列表数据
    bc.grid.reloadData($this.closest(".bc-page"));

    return false;
  });

  //单击行、双击行、鼠标悬停及离开行
  var _bc_grig_tr_live = "click dblclick";
  if (bc.grid.enabledHoverToggle) _bc_grig_tr_live += " mouseover mouseout";
  $document.on(_bc_grig_tr_live, ".bc-grid>.data tr.row", function (event) {
    //处理选中行的样式
    var $this = $(this);
    var index = $this.index();
    var $row = $this.closest(".right,.left").siblings().find("tr.row:eq(" + index + ")");
    if (event.type == 'click') {				// 单击行
      logger.info("event.type=" + event.type);
      $row.add(this).toggleClass(bc.grid.selectedClass)
        .find("td.id>span.ui-icon").toggleClass("ui-icon-check");

      var $grid = $this.closest(".bc-grid");
      if ($grid.hasClass("singleSelect")) {//处理单选：其他已选中行样式的恢复
        $row.add(this).siblings("." + bc.grid.selectedClass).removeClass(bc.grid.selectedClass)
          .find("td.id>span.ui-icon").removeClass("ui-icon-check");
      }
    } else if (event.type == 'dblclick') {		// 双击行
      logger.info("event.type=" + event.type);
      $row.add(this).toggleClass(bc.grid.selectedClass, true)
        .find("td.id>span.ui-icon").toggleClass("ui-icon-check", true);

      $row.add(this).siblings("." + bc.grid.selectedClass).removeClass(bc.grid.selectedClass)
        .find("td.id>span.ui-icon").removeClass("ui-icon-check");

      var $page = $this.closest(".bc-page");
      var $grid = $this.closest(".bc-grid");

      var fnName = $grid.attr("data-dblclickrow");// 双击行的回调函数
      if (fnName && fnName.length >= 0) {
        var scope = $page.data("scope");
        var fnIsInScope = scope && scope[fnName];
        var fn = scope ? scope[fnName] : null; // 先从上下文取
        if (!fn) fn = bc.getNested(fnName);		// 无,再从全局区
        if (typeof fn == "function") {
          // 上线文为页面DOM或页面实例
          fn.call(fnIsInScope && $page.data("scopeType") === "instance" ? scope : $page[0], this, $grid, event);
        } else {
          alert("回调函数没有定义：" + fnName);
        }
      }
    } else if (event.type == 'mouseover' || event.type == 'mouseout') {	// 鼠标悬停及离开行
      $row.add(this).toggleClass("ui-state-hover");
    }
  });

  //超链接的点击处理
  $document.on("click", ".bc-grid>.data>.right tr.row .bc-link", function (event) {
    var $this = $(this);
    var url = $this.attr("href");
    //var mtype = $this.attr("data-mtype");
    if (url && url.length >= 0) {
      bc.page.newWin({
        url: bc.addMetaKeyStateToUrl(url, event),
        mid: $this.attr("data-mid") || url,
        name: $this.attr("data-title") || $this.text() || "未定义"
      });
    } else {
      alert("超链接的 href 为空！");
    }

    event.preventDefault();
    return false;
  });

  //全选与反选
  $document.on("click", ".bc-grid>.header td.id>span.ui-icon", function () {
    var $this = $(this);
    var $grid = $this.closest(".bc-grid");
    if ($grid.hasClass("singleSelect")) {
      //单选就不作处理
      return;
    }

    $this.toggleClass("ui-icon-notice ui-icon-check");
    var check = $this.hasClass("ui-icon-check");
    $this.closest(".header").next().find("tr.row")
      .toggleClass("ui-state-highlight", check)
      .find("td.id>span.ui-icon").toggleClass("ui-icon-check", check);
  });

  //列表的排序
  $document.on("click", ".bc-grid>.header>.right tr.row>td.sortable", function () {
    logger.debug("sortable");
    //标记当前列处于排序状态
    var $this = $(this).toggleClass("current", true);

    //将其他列的排序去除
    $this.siblings(".current").removeClass("current asc desc")
      .find("span.ui-icon").addClass("hide").removeClass("ui-icon-triangle-1-n ui-icon-triangle-1-s");

    var $icon = $this.find("span.ui-icon");
    //切换排序图标
    var dir = 0;
    if ($this.hasClass("asc")) {//正序变逆序
      $this.removeClass("asc").addClass("desc");
      $icon.removeClass("hide ui-icon-triangle-1-n").addClass("ui-icon-triangle-1-s");
      dir = -1;
    } else if ($this.hasClass("desc")) {//逆序变正序
      $this.removeClass("desc").addClass("asc");
      $icon.removeClass("hide ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-n");
      dir = 1;
    } else {//无序变正序
      $this.addClass("asc");
      $icon.removeClass("hide").addClass("ui-icon-triangle-1-n");
      dir = 1;
    }

    //排序列表中的行
    var $grid = $this.closest(".bc-grid");
    var tdIndex = this.cellIndex;//要排序的列索引
    var remoteSort = $grid.attr("remoteSort") === "true";//是否远程排序，默认本地排序
    if (remoteSort) {//远程排序
      logger.profile("do remote sort:");
      bc.grid.reloadData($grid.closest(".bc-page"), {
        callback: function () {
          logger.profile("do remote sort:");
        }
      });
    } else {//本地排序
      logger.profile("do local sort:");
      //对数据所在table和id所在table进行排序
      var rightTrs = bc.grid.sortTable($grid.find(">.data>.right>table.table>tbody"), tdIndex, dir);

      //根据上述排序结果对id所在table进行排序
      var $tbody = $grid.find(">.data>.left>table.table>tbody");
      if (!$tbody.size()) return;
      var rows = $tbody[0].rows;
      var trs = new Array(rows.length);
      for (var i = 0; i < trs.length; i++) {
        trs[i] = rows[parseInt(rightTrs[i].getAttribute("prevIndex"))];//rows(i)
      }
      //交换表格的行到新的顺序
      var t = [];
      var notFirefox = !$.browser.mozilla;
      for (var i = 0; i < trs.length; i++) {
        //firefox不支持outerHTML;
        t.push(notFirefox ? trs[i].outerHTML : document.createElement("div").appendChild(trs[i].cloneNode(true)).parentNode.innerHTML);
      }
      $tbody.html(t.join(""));

      logger.profile("do local sort:");
    }
  });
})(jQuery);