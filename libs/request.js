/**
 * BC 网络请求组件
 */
define(["bc.core"], function (bc) {
  'use strict';

  const showError = e => bc.msg.info(e.message);

  /** 获取 BC 系统的登录认证信息 */
  function getAuthorizationHeaders() {
    return {"Authorization": localStorage.authorization};
  }

  /**
   * 跨域访问方法封装。
   *
   * 1. 内部使用 fetch 发出请求。
   * 2. 自动附加 jwt 需要的验证头 "Authorization"。
   * 3. 自动按照响应头 'Content-Type' 的值解析为文本或 json 对象。
   * 4. 非 2xx 的响应码自动解析响应体的 body 为异常信息，
   *    如果没有设置 throwError=true，默认使用平台的 bc.msg.info 显示异常信息，
   *    否则需由使用者通过 Promise.catch(e) 的方式来获取相关异常并自行处理。
   *
   * @param options 选项参数，支持的键值为 {url, method, body, contentType, throwError}
   * @param [可选] quiet 对于非 2xx 响应，是否安静的处理掉，默认 false：
   *                      false-异常由使用者通过 catch 自行处理，非 2xx 响应返回的 Promise 为 rejected 状态
   *                      true-使用 bc.msg.info 显示异常信息，非 2xx 响应返回的 Promise 为 resolved 状态
   */
  function request(options) { // url, method, body, contentType, quiet
    let fetchOptions = {headers: getAuthorizationHeaders()};
    if (options.method) fetchOptions.method = options.method;
    if (options.body) fetchOptions.body = options.body;
    if (options.contentType) fetchOptions.headers["Content-Type"] = options.contentType;
    return fetch(options.url, fetchOptions).then(res => {
      if (res.status === 204) return null;
      else if (res.ok) {
        let ct = res.headers.get('Content-Type').toLowerCase();
        if (ct.indexOf('application/json') !== -1) return res.json() // json
        else if (ct.startsWith('text/')) return res.text()           // text/plain、text/html
        else return res.json() // 默认 json
      } else {
        return res.text().then(msg => {
          if (options.quiet) bc.msg.info(msg);
          else throw new Error(msg)
        });
      }
    });
  }

  /**
   * 按 URL 标准方式附加查询参数。
   *
   * @param url 原始的URL
   * @param params {JSON} 要附加的查询参数，key 为参数名，value 为未经URI编码的值（仅支持 String、Number、Boolean 和 Array 类型）。
   *                       如果 value 为数组类型，将以 "key=arrayItem1&key=arrayItem2" 的方式附加到 url 后。
   *                       所有 value 都会先用 encodeURIComponent 编码后再附加到 URL 后面
   * @returns 新的已附加查询参数的 Url
   */
  function appendUrlParams(url, params) {
    if (!params) return url;

    let kv = [];
    for (let key in params) {
      if (["string", "number", "boolean"].indexOf(typeof params[key]) > -1) //基础类新
        kv.push(key + '=' + encodeURIComponent(params[key]));
      else if (params[key] instanceof Array) { // 数组类型
        kv = kv.concat(params[key].map(p => `${key}=${encodeURIComponent(p)}`));
      }
    }
    if (kv.length) url += (url.indexOf('?') !== -1 ? '&' : '?') + kv.join('&');
    return url;
  }

  return {
    appendUrlParams: appendUrlParams,
    showError: showError,
    request: request,
    // Create a module CRUD requester
    forModule(modulePath, globalQuiet) {
      if (typeof globalQuiet === 'undefined') globalQuiet = true;
      return {
        create(data, quiet) {
          return request({
            method: "POST",
            url: modulePath,
            body: data ? JSON.stringify(data) : null,
            contentType: "application/json;charset=UTF-8",
            quiet: typeof quiet === 'undefined' ? globalQuiet : quiet
          });
        },
        update(id, data, quiet) {
          return request({
            method: "PATCH",
            url: `$modulePath/$id`,
            body: data ? JSON.stringify(data) : null,
            contentType: "application/json;charset=UTF-8",
            quiet: typeof quiet === 'undefined' ? globalQuiet : quiet
          });
        },
        delete_(id, quiet) {
          return request({
            method: "DELETE",
            url: `$modulePath/$id`,
            quiet: typeof quiet === 'undefined' ? globalQuiet : quiet
          });
        },
        /**
         * 查特定 ID 的实体。
         * @param id 主键
         * @returns {Promise<Json>}
         */
        get(id, quiet) {
          return request({
            method: "GET",
            url: `$modulePath/$id`,
            quiet: typeof quiet === 'undefined' ? globalQuiet : quiet
          });
        },
        /**
         * 视图查询。
         * @param condition 附加的查询参数，使用 json 格式，如 {status: 0, type: 1}，注意参数值不需要 uri 编码
         * @returns {Promise<String|Json>}
         */
        find(condition, quiet) {
          let url = modulePath;
          // 附加条件参数到 URL 后
          if (condition) url = appendUrlParams(url, condition);
          return request({
            method: "GET",
            url: url,
            quiet: typeof quiet === 'undefined' ? globalQuiet : quiet
          });
        },
        /**
         * 导出 Excel。
         * @param condition 附加的查询参数，使用 json 格式，如 {status: 0,type: 1}，注意参数值不需要 uri 编码
         * @param filename [可选] 下载为的文件名，没有指定则使用 'Content-Disposition' 头内的 filename 属性值
         * @returns {Promise<unknown>}
         */
        export(condition, filename) {
          let url = `${modulePath}/export`;
          // 附加条件参数到 URL 后
          if (condition) url = appendUrlParams(url, condition);
          return fetch(url, {
            headers: getAuthorizationHeaders(),
            method: "GET"
          }).then(res => {
            if (!filename) {
              // 从响应头中获取服务端指定的文件名
              let h = res.headers.get('Content-Disposition');
              if (h && h.includes('filename=')) {
                filename = h.substring(h.indexOf('filename=') + 9);
                if (filename.startsWith('"')) filename = filename.substring(1, filename.length - 1);
                filename = decodeURIComponent(filename);
              } else {
                h = res.headers.get('filename');
                filename = h ? decodeURIComponent(h) : null;
              }
            }
            return res.ok ? res.blob() : res.text().then(msg => {
              throw new Error(msg)
            });
          }).then(blob => {
            // 100mb test ok
            const data = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = data;
            a.download = filename || "NONAME"; // 浏览器保存下载的文件时使用的文件名
            a.click();
          }, error => bc.msg.info(error.message));
        }
      }
    }
  };
});