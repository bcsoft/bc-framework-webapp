/**
 * desktop
 *
 * @author rongjihuang@gmail.com
 * @date 2011-09-29
 */
(function ($, undefined) {
  // webkit特殊处理
  if (jQuery.browser.safari) {
    $("body").addClass("webkit");
  }

  $.widget("ui.bcdesktop", {
    version: "1.0",
    options: {
      loadingText: "正在加载 ......"
    },

    _create: function () {
      var self = this;

      // 初始化顶部的系统菜单
      var $top = this.element.find(">#top");
      var $sysmenu = $top.find(">#sysmenu");
      $sysmenu.show().menubar({
        position: {
          within: $(window)
        },
        select: function (event, ui) {
          //避免a的链接跳转必须执行这句
          event.preventDefault();

          $li = ui.item;
          $a = $li.children("a");
          if (logger.infoEnabled)
            logger.info("click:name=" + $li.text() + ";href=" + $a.attr("href"));
          var option = {};
          option.mid = $li.attr("data-mid");
          option.title = option.name = $a.text();
          option.type = $li.attr("data-type");
          option.url = $a.attr("href");
          option.standalone = $li.attr("data-standalone") == "true";

          // 是否为url节点
          var isLeaf = option.url && option.url.length > 0 && option.url.indexOf("#") != 0;
          if (isLeaf) {
            var pre = $li.find("pre");
            if (pre.size() > 0) {// 前置js执行的处理
              option.cfg = pre.html();
              //alert(option.cfg);
              var js = bc.formatTpl(option.cfg, option);
              //alert(js);
              eval("(" + js + ")");// 执行js脚本处理
            } else {
              bc.page.newWin(option);
            }
          }

          return false;
        }
      });

      var $middle = this.element.find(">#middle");
      var $center = $middle.find(">#center");
      var $shortcuts = $center.find(">a.shortcut");

      //对ie，所有没有定义href属性的a，自动设置该属性为"#"，避免css中的:hover等没有效果
      if ($.browser.msie) {
        this.element.find("a[href=''],a:not([href])").each(function () {
          this.setAttribute("href", "#");
        });
      }

      $.support.touch = 'ontouchend' in document;
      //alert("$.support.touch=" + $.support.touch);
      // 双击打开桌面快捷方式
      this.element.delegate("a.shortcut", "dblclick" + ($.support.touch ? " touchend" : ""), this.openModule);

      // 禁用桌面快捷方式的默认链接打开功能
      this.element.delegate("a.shortcut", "click", function () {
        return false;
      });

      // 允许拖动桌面快捷方式
      var draggableOption = {
        containment: '#center', distance: 20, revert: function (droped) {
          if (droped) {
            var my = this.attr('data-aid') == userId;
            return !my;
          }
        }
      };
      $shortcuts.draggable(draggableOption);
      //$shortcuts.draggable({containment: '#desktop',grid: [20, 20]});
      //$("#shortcuts" ).selectable();

      // 允许拖动菜单项到桌面添加快捷方式的处理
      $sysmenu.find('li.ui-menu-item[data-type!=1]').draggable({
        containment: '#center',
        distance: 20,
        cursor: "move",
        helper: function () {
          var $this = $(this);
          var tpl = '<a class="shortcut ui-state-highlight"';
          tpl += ' data-mid="' + $this.attr("data-mid") + '"';
          tpl += ' data-aid="' + userId + '"';
          tpl += ' data-type="' + $this.attr("data-type") + '"';
          tpl += ' data-standalone="' + $this.attr("data-standalone") + '"';
          tpl += ' data-order="' + $this.attr("data-order") + '"';
          tpl += ' data-iconClass="' + $this.attr("data-iconClass") + '"';
          tpl += ' data-name="' + $this.attr("data-name") + '"';
          tpl += ' data-url="' + $this.attr("data-url") + '"';
          tpl += ' data-cfg="' + $this.attr("data-cfg") + '"';
          //if($this.attr("data-option"))tpl += ' data-option="' + $this.attr("data-option") + '"';
          tpl += '><span class="icon ' + $this.attr("data-iconClass") + '">';
          tpl += '</span><span class="text">' + $this.attr("data-name") + '</span>';
          var pre = $this.find("pre");
          if (pre.size() > 0)
            tpl += '<pre style="display:none">' + pre.html() + '</pre>';
          tpl += '</a>';
          return $(tpl).appendTo("#top");
        }
      });
      $center.droppable({
        accept: 'li.ui-menu-item[data-type!=1]',
        activeClass: "ui-state-highlight",
        drop: function (event, ui) {
          //$(this).addClass( "ui-state-highlight" );
          var $cur = $center.find("a.shortcut[data-mid='" + ui.helper.attr('data-mid') + "']");
          logger.info("$cur.size()=" + $cur.size());
          if ($cur.size() == 0) {
            var $shortcut = ui.helper.clone().css("top", (ui.helper.position().top - $middle.position().top) + "px")
              .removeClass("ui-state-highlight").hide().appendTo($center)
              .fadeIn().draggable(draggableOption);

            //通过ajax保存该快捷方式
            bc.ajax({
              url: bc.root + "/bc/shortcut/save4drag",
              data: {mid: $shortcut.attr("data-mid")},
              dataType: "json",
              success: function (json) {
                logger.info("data-id=" + json.id);
                $shortcut.attr("data-id", json.id);
                bc.msg.slide(json.msg);
              }
            });
          } else {
            //以动画显示已经存在的快捷方式
            $cur.addClass("hoverShortcut").fadeOut(function () {
              $cur.fadeIn(function () {
                $cur.removeClass("hoverShortcut");
              });
            });
          }
        }
      });

      $recyle = $center.children("a.recycle").droppable({
        accept: 'a.shortcut',
        hoverClass: "ui-state-highlight",
        activeClass: "ui-state-active",
        drop: function (event, ui) {
          //通过ajax删除该快捷方式:只能删除自己的快捷方式
          if (ui.draggable.attr('data-aid') == userId) {
            var id = ui.draggable.attr('data-id');
            bc.ajax({
              url: bc.root + "/bc/shortcut/delete?id=" + id,
              dataType: "json",
              success: function (json) {
                //修改回收站的图标
                $recyle.attr("data-iconClass", "i0505").children("span.icon").addClass("i0505");

                //删除dom元素
                ui.draggable.remove();
                //显示提示信息
                bc.msg.slide("快捷方式“" + ui.draggable.attr('data-name') + "”已删除！");
              }
            });
          } else {
            bc.msg.slide("此为系统级通用快捷方式，不允许删除！");
          }
        }
      });

      // 快速工具条中条目的鼠标控制
      var $bottom = this.element.find(">#bottom");
      $bottom.delegate(".quickButton", "mouseover", function () {
        $(this).addClass("ui-state-hover");
      });
      $bottom.delegate(".quickButton", "mouseout", function () {
        $(this).removeClass("ui-state-hover");
      });
      $bottom.delegate(".quickButton", "click", function () {
        $this = $(this);
        var mid = $this.attr("data-mid");
        var $dialogContainer = $middle.find(">.ui-dialog>.ui-dialog-content[data-mid='" + mid + "']").parent();
        if ($this.hasClass("ui-state-active")) {
          $this.removeClass("ui-state-active")
            .find(">span.ui-icon").removeClass("ui-icon-folder-open").addClass("ui-icon-folder-collapsed");
          $dialogContainer.hide();
        } else {
          $this.addClass("ui-state-active")
            .find(">span.ui-icon").removeClass("ui-icon-folder-collapsed").addClass("ui-icon-folder-open")
            .end().siblings().toggleClass("ui-state-active", false);
          $dialogContainer.show().end().dialog("moveToTop");
        }
        $this.removeClass("ui-state-highlight");
        return false;
      });

      // 显示隐藏桌面的控制
      $bottom.find("#quickShowHide").click(function () {
        var $this = $(this);
        var $dialogContainer = $middle.find(">.ui-dialog");
        if ($this.attr("data-hide") == "true") {
          $this.attr("data-hide", "false");
          $dialogContainer.show();
        } else {
          $this.attr("data-hide", "true");
          $dialogContainer.hide();
        }
        return false;
      });

      // 注销的控制
      $top.find("#quickLogout").click(function () {
        bc.chat.destroy();

        //删除cookie
        var expiresOption = {expires: 14, path: '/'};// 这个必须要与login.js中的保持一致
        $.removeCookie(bc.syskey + '_name', expiresOption);
        $.removeCookie(bc.syskey + '_password', expiresOption);

        window.open(bc.root + "/logout", "_self");
        return false;
      });

      // 帮助
      var clWin = [];
      $top.find("#bchelp,#bcmail").click(function () {
        var $helpDlg = bc.msg.info('<a href="#" id="clClick_help">查看帮助</a>&nbsp;&nbsp;<a href="#" id="clClick_changelog">查看更新日志</a>', bc.title);

        // 帮助
        $helpDlg.find("#clClick_help").click(function showHelp() {
          try {
            //打开查看更新日志的窗口
            if (!clWin["help"] || clWin["help"].closed) {
              clWin["help"] = window.open(bc.root
                + "/help/index.htm#xitongzhuye", "_blank");
            } else {
              //clWin["help"].document.location.reload(true);
              clWin["help"].focus();
            }

            //关闭对话框
            $helpDlg.dialog("close");
          } catch (e) {
            clWin["help"] = null;
            showHelp();
          }
          return false;
        });

        // 日志
        $helpDlg.find("#clClick_changelog").click(function showChangelog() {
          try {
            //打开查看更新日志的窗口
            if (!clWin["changelog"] || clWin["changelog"].closed) {
              clWin["changelog"] = window.open(bc.root
                + "/changelog/changelog.html?ts=" + bc.ts, "_blank");
            } else {
              clWin["changelog"].document.location.reload(true);
              clWin["changelog"].focus();
            }

            //关闭对话框
            $helpDlg.dialog("close");
          } catch (e) {
            clWin["changelog"] = null;
            showChangelog();
          }
          return false;
        });
        return false;
      });

      // 聊天
      var $bcq = $top.find("#bcq");
      if ($bcq.size() > 0) {
        $bcq.click(function () {
          // ie的提示：微软计划ie10才开始支持websocket
          if (jQuery.browser.msie && jQuery.browser.version < 10) {
            alert("当前浏览器不支持WebSocket技术，无法使用在线聊天工具！");
            return false;
          }

          bc.page.newWin({
            name: "BQ2012",
            mid: "bq",
            url: bc.root + "/bc/websocket/online"
          });
          return false;
        });

        //开启WebSocket
        bc.chat.init();
      }

      // 桌面日历
//			var $right = this.element.find(">#middle>#right");
//			$right.find("#indexCalendar").datepicker({
//				showWeek: true,
//				//showButtonPanel: true,//显示今天按钮
//				firstDay: 7,
//				showOtherMonths: true,
//				selectOtherMonths: true
//			});

      $center.show();
    },

    _destroy: function () {
      this.element.undelegate().unbind();
    },

    /**双击打开桌面快捷方式*/
    openModule: function (e) {
      //alert(e.type);
      $this = $(this);
      logger.debug("openModule:" + $this.attr("class"));
      var option = $this.attr("data-option");
      if (!option || option.length == 0) option = "{}";
      option = eval("(" + option + ")");
      option.mid = $this.attr("data-mid");
      option.iconClass = $this.attr("data-iconClass");
      option.title = option.name = $this.attr("data-name");
      option.order = $this.attr("data-order");
      option.url = $this.attr("data-url");
      option.standalone = $this.attr("data-standalone") == "true";
      var pre = $this.find("pre");
      if (pre.size() > 0) {// 前置js执行的处理
        option.cfg = pre.html();
        //alert(option.cfg);
        var js = bc.formatTpl(option.cfg, option);
        //alert(js);
        eval("(" + js + ")");// 执行js脚本处理
      } else {
        bc.page.newWin(option);
      }
    }
  });

})(jQuery);