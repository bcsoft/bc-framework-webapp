/**
 * 打印组件
 */
define(["bc.core"], function (bc) {
  'use strict';
  const TS = bc.ts;
  // 超时时间
  const TIMEOUT_LOADED = 5000;   // 等待加载回信的超时时间：5 秒
  const TIMEOUT_PRINTED = 30000; // 等待打印回信的超时时间：5 分钟
  // 判断指定的 url 与当前页面之间是否跨域的函数
  const isCrossDomain = bc.isCrossDomain;
  // 向指定的 url 路径末端添加参数
  const addParamToUrl = bc.addParamToUrl;
  // 默认的 iframe 配置
  const DEFAULE_IFRAME = {
    name: "print",
    style: "width:0;height:0;visibility:hidden;border:none"
  };

  /**
   * 打印指定 url 地址的页面。
   * 
   * 此组件对跨域同域均通过 postMessage 方式与打印页面进行通信。
   * 
   * @param option {Object} 配置参数
   * @option url {String} 打印页面的 url 地址
   * @option data {Object} [可选] 要传输的数据
   * @option autoPrint {Boolean} [可选] 是否自动开始打印，默认 true
   * @option win {Object|Boolean} [可选] 使用 window.open 方式加载 url 的相关配置 {name, features}
   *         See <https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open>
   * @option iframe {Object|Boolean} [可选] 使用 iframe 方式加载 url 的相关配置，此为默认使用的方式
   * @return {Promise} 
   *         1. then 处理打印完毕，参数值为 true 代表打印成功，false 代表打印失败或用户取消打印
   *         2. catch 处理其它未知异常。
   */
  return function (option) {
    return new Promise(function (resolve, reject) {
      if (!option) return reject(new Error("缺少打印配置的 option 参数！"));
      if (!option.url) return reject(new Error("缺少打印配置的 url 参数！"));

      var startTime = new Date().getTime(); // 开始时间（毫秒）
      var targetOrigin = new URL(option.url).origin;              // 目标窗口的 origin
      if (TS) option.url = addParamToUrl(option.url, `ts=${TS}`); // 添加系统时间戳
      var winLoaded = false;                // 标识打印窗口是否加载完毕
      var printed = false;                  // 标识打印窗口是否已完成打印

      // 增加额外的内部标记符
      option.data = Object.assign({}, option.data, {
        "$type": "print",
        "$origin": location.origin
      });

      // 将 win 参数的简易配置转换为标准配置
      if (option.win === true) {
        option.win = {
          name: "_blank" // 默认在新窗口中打开
        };
      }

      // 将 iframe 参数的简易配置转换为标准配置
      if (!option.win) {
        if (typeof (option.iframe) === "undefined" || option.iframe === true) {
          option.iframe = DEFAULE_IFRAME;
        }
      }
      // 监听打印窗口的反馈
      window.addEventListener("message", function feedback(event) {
        // 不处理非打印窗口传来的消息
        if (event.origin !== targetOrigin) return;

        console.log("main:print received data=%o, origin=%s", event.data, event.origin);
        if (event.data === "loaded")  winLoaded = true;  // 打印窗口加载完毕
        if (event.data === "printed") {
          printed = true;   // 打印窗口已完成打印操作

          // 取消监听
          window.removeEventListener("message", feedback);
        }
      });

      // 加载打印窗口
      let targetWin;
      if (option.win) { // window.open 方式
        // 调用 window.open(strUrl, strWindowName, [strWindowFeatures]) 方法
        targetWin = window.open(option.url, option.win.name, option.win.features);
      } else {          // iframe 方式
        // 获取打印用的 iframe
        let iframe;
        if (option.iframe.id) iframe = document.querySelector(`iframe#${option.iframe.name}`);
        else iframe = document.querySelector(`iframe[name='${option.iframe.name}']`);

        // 没有就创建一个
        if (!iframe) {
          console.log("create new iframe for print");
          iframe = document.createElement("iframe");
          for (let key in option.iframe) iframe.setAttribute(key, option.iframe[key]);
          document.body.appendChild(iframe);
        }

        // 设置 src 属性
        iframe.setAttribute("src", option.url);

        // 获取 iframe 页面的窗口引用
        targetWin = iframe.contentWindow;
      }

      // 打印窗口不会被立即载入，载入过程是异步的，故需要重复发送信息给打印窗口，
      // 由打印窗口负责回信确认加载完毕和打印完毕两个信号。
      let repeater = setInterval(() => {
        if (!winLoaded) { // 等待打印页面加载完毕的回信
          console.log("main:print: waiting loaded signal...");
          // 发送数据
          targetWin.postMessage(option.data, targetOrigin);

          // 超过处理，避免持续下去
          if (new Date().getTime() - startTime > TIMEOUT_LOADED) {
            const msg = `已超过 ${TIMEOUT_LOADED / 1000} 秒没有收到打印页面的加载回信，可能是打印页面配置错误！`;
            console.error(msg);
            clearInterval(repeater); // 不再重试
            alert(msg);
            reject(new Error(msg));
          }
        } else {         // 等待打印完毕的回信
          console.log("main:print: waiting printed signal...");
          if (!printed) { // 等待打印页面加载完毕的回信
            // 超过处理，避免持续下去
            if (new Date().getTime() - startTime > TIMEOUT_PRINTED) {
              const msg = `已超过 ${TIMEOUT_PRINTED / 1000} 秒没有收到打印页面的打印结果，请重新打印！`;
              console.error(msg);
              clearInterval(repeater); // 不再等待
              alert(msg);
              reject(new Error(msg));
            }
          } else {
            console.log("main:print received printed signal");
            clearInterval(repeater); // 取消打印等待
            resolve(true);
          }
        }
      }, 300);
    })
  };
});