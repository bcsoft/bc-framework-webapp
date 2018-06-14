bc.namespace("bc.kv");
/**
 * 键值获取设置工具类
 * @ref http://api.jquery.com/category/deferred-object
 * @ref http://api.jquery.com/jQuery.when
 * @ref http://www.ruanyifeng.com/blog/2011/08/a_detailed_explanation_of_jquery_deferred_object.html
 * @ref http://www.oschina.net/translate/whats-so-great-about-javascript-promises
 */
bc.kv = {
  TYPE: 1, // 1-使用本地存储、2-使用远程存储
  _TYPE_LOCAL: 1, // 本地存储
  _TYPE_REMOTE: 2, // 远程存储
  /**
   * 获取键值
   * @key {String|Array} 单个键或多个键组成的数组
   * @return {Deferred Object}
   *  1. 当 key 为单个键时，返回此键对应的值，如果值不存在则返回 null，如 kv.get("myKey")
   *  2. 当 key 为键数组时，返回一个json对象，包含各键值对，如果值不存在则设为 null，如 kv.get(["key1","key2"])
   * @description 使用方法举例
   *   $.when(bc.kv.get("key")).done(function(value){...});
   *   $.when(bc.kv.get(["k1", "k2"]))
   *   .done(function(json){
	 *       console.log("get: result=%o", json);
	 *   })
   *   .fail(function(){
	 *       console.log("get: fail=%o", arguments);
	 *   });
   */
  get: function (key) {
    if (bc.kv.TYPE == bc.kv._TYPE_LOCAL) {// 本地存储
      if (jQuery.isArray(key)) {
        var json = {};
        for (var i = 0; i < key.length; i++) {
          json[key[i]] = localStorage.getItem(key[i]);
        }
        return json;
      } else {
        return localStorage.getItem(key);
      }
    } else {// 远程存储
      return jQuery.ajax({
        type: "GET", dataType: "json",
        url: bc.root + "/bc/kv",
        data: jQuery.param({k: key}, true)
      });
    }
  },

  /**
   * 设置键值对
   * @kv {Object} 键值对json对象
   * @return {Deferred Object}
   * @description 使用方法举例
   *   $.when(bc.kv.set({k1: "v1", k2: "v2"})).done(function(json){
	 *       console.log("success=%s, msg=%s", json.success, json.msg);
	 *   });
   */
  set: function (kv) {
    // 单个键值对的设置的简易使用方式：.set(key, value)
    if (typeof(kv) == "string") {
      var key = arguments[0];
      kv = {};
      kv[key] = arguments[1];
    }

    if (bc.kv.TYPE == bc.kv._TYPE_LOCAL) {// 本地存储
      for (var key in kv) {
        try {
          localStorage.setItem(key, kv[key]);
        } catch (e) {
          if (e.name == 'QuotaExceededError') {
            console.log('已经超出本地存储限定大小，自动清空再保存！key=%s, kv=%o', key, kv);
            localStorage.clear();
            localStorage.setItem(key, kv[key]);
          }
        }
      }
      return {success: true, msg: "设置成功。"};
    } else { // 远程存储
      return jQuery.ajax({
        type: "POST", dataType: "json",
        url: bc.root + "/bc/kv",
        data: {kv: JSON.stringify(kv)}
      });
    }
  },

  /**
   * 删除键值对
   * @key {String|Array} 单个键或多个键组成的数组
   * @return {Deferred Object}
   * @description 使用方法举例
   *   $.when(bc.kv.remove("key")).done(function(json){...});
   *   $.when(bc.kv.remove(["k1", "k2"])).done(function(json){
	 *       console.log("get: result=%o", json);
	 *   });
   */
  remove: function (key) {
    if (bc.kv.TYPE == bc.kv._TYPE_LOCAL) {// 本地存储
      if (jQuery.isArray(key)) {
        for (var i = 0; i < key.length; i++) {
          localStorage.removeItem(key[i]);
        }
      } else {
        localStorage.removeItem(key);
      }
      return {success: true, msg: "删除成功。"};
    } else {// 远程存储
      return jQuery.ajax({
        type: "DELETE", dataType: "json",
        url: bc.root + "/bc/kv",
        data: jQuery.param({k: key}, true)
      });
    }
  },

  /**
   * 清空存储
   * @keyPrefix {String} [可选参数]键前缀，如果指定此参数，将只清空键前缀为此值的所有键值对
   * @return {Deferred Object}
   * @description 使用方法举例
   *   $.when(bc.kv.clear()).done(function(json){
	 *       console.log("clear: result=%o", json);
	 *   });
   */
  clear: function (keyPrefix) {
    if (bc.kv.TYPE == bc.kv._TYPE_LOCAL) {// 本地存储
      if (keyPrefix) {
        var key;
        for (var i = 0; i < localStorage.length; i++) {
          key = localStorage.key(i);
          if (key.indexOf(keyPrefix) == 0) {
            localStorage.removeItem(key);
            --i;// 防止 localStorage.removeItem(key) 执行后长度减1 不完全遍历
          }
        }
        ;
      } else {
        localStorage.clear();
      }
      return {success: true, msg: "清空成功。"};
    } else {// 远程存储
      var data = {clear: true};
      if (keyPrefix) data.kp = keyPrefix;
      return jQuery.ajax({
        type: "DELETE", dataType: "json",
        url: bc.root + "/bc/kv",
        data: jQuery.param(data, true)
      });
    }
  }
};