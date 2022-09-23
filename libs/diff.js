/**
 * 对象差异对比。
 */
define([], function () {
"use strict";

  /**
   * 对象差异对比。
   *
   * 返回的对象包含：
   * 1. newObj 相对 oldObj 多出的键值对。
   * 2. newObj 与 oldObj 相同键的值：
   * 2.1. 若值为非数组类型时，如果值不相等，使用 newObj 的键值。
   * 2.2. 若值为数组类型时，使用 diffArray 函数的非空对比结果作为新值。
   *
   * @param oldObj {Object} 旧数据
   * @param newObj {Object} 新数据
   * @return {Object} newObj 相对于 oldObj 的变化
   */
  function diffObj(oldObj, newObj) {
    const result = {};
    Object.keys(newObj).forEach((key) => {
      const oldHasKey = Object.hasOwn(oldObj, key);
      if (!oldHasKey) result[key] = newObj[key]; // 1
      else {
        if (Array.isArray(newObj[key])) { // 数组值的对比
          if (!Array.isArray(oldObj[key])) result[key] = newObj[key]; // 类型变了直接使用新的
          else {
            const diff = diffArray(oldObj[key], newObj[key]);
            if (diff.length !== 0) result[key] = diffArray(oldObj[key], newObj[key]); // 2.2
          }
        } else { // 非数组值的对比
          if (oldObj[key] !== newObj[key]) result[key] = newObj[key]; // 2.1
        }
      }
    });

    return result;
  }

  /**
   * 数组差异对比。
   *
   * 1. 若 oldArray 中的元素没有 id 属性，抛出异常。
   * 2. 若 oldArray 与 newArray 恒等，返回 []。
   * 3. 否则对比两个数组的内部各个元素，返回包含如下顺序元素的新数组：
   * 3.1. (删除) oldArray 在 newArray 中按 id 键值判断缺失的元素，仅此 id 键值构成的元素。
   * 3.2. (更新) newArray 与 oldArray 中相同 id 值元素的其它不同键值构成的元素（含 id 键值）。
   * 3.3. (新加) newArray 中没有 id 键的元素。
   *
   * @param idKey {String} 数组元素中标识数据唯一性的键名，默认为 "id"
   * @param oldArray {Object[]} 旧数据
   * @param newArray {Object[]} 新数据
   * @return {Object[]}  newObj 相对于 oldObj 的变化
   */
  function diffArray(oldArray, newArray, idKey) {
    // 默认主键的 key 为 "id"
    if (!idKey) idKey = "id";

    // 参数验证
    if (!Array.isArray(oldArray) || !Array.isArray(newArray)) {
      throw Error("oldArray 或 newArray 其中一个参数不是数组类型！");
    }
    if (oldArray.some((a) => !Object.hasOwn(a, idKey))) {
      throw Error(`oldArray 数组参数内的元素缺少 ${idKey} 属性！`);
    }
    if (oldArray === newArray) return [];
    if (oldArray.length === 0) {
      // 无旧有新，新的元素不能有 id 属性
      if (newArray.some((a) => Object.hasOwn(a, idKey))) {
        throw Error(`oldArray 为空时 newArray 数组的元素不能包含 ${idKey} 属性！`);
      }
      // 新的全部当 "新加" 处理
      return newArray;
    }

    const result = [];

    // 3.1. (删除) oldArray 在 newArray 中按 id 键值判断缺失的元素，仅此 id 键值构成的元素
    const newArrayIds = newArray.filter((a) => Object.hasOwn(a, idKey)).map((a) => a[idKey]);
    oldArray.forEach((a) => {
      if (!newArrayIds.includes(a[idKey])) {
        const item = {};
        item[idKey] = a[idKey];
        result.push(item);
      }
    });

    // 3.2. (更新) newArray 与 oldArray 中相同 id 值元素的其它不同键值构成的元素（含 id 键值）。
    oldArray.forEach((source) => {
      const target = newArray.find((a) => source[idKey] === a[idKey]);
      if (target) {
        const diff = diffObj(source, target);
        if (!isEmpty(diff)) {
          diff[idKey] = source[idKey];
          result.push(diff);
        }
      }
    });

    // 3.3. (新加) newArray 中没有 id 键的元素。
    Array.prototype.push.apply(result, newArray.filter((a) => !Object.hasOwn(a, idKey)));

    return result;
  }

  /**
   * 判断对象是否为空。
   * 判断原则为：
   * 1. 无效参数 arguments.length === 0 || instance === undefined。
   * 2. 值代表空的基础类型 null、0、""、false。
   * 3. instance 为空的数组。
   * 4. instance 为 json 对象类型，但没有任何自定义键。
   * @param {Object|Array} instance
   */
  function isEmpty(instance) {
    return (arguments.length === 0 || typeof instance === "undefined") || // 无效参数
      (instance === null || instance === 0 || instance === "" || instance === false) || // 值代表空的基础类型
      (typeof instance === "object" && Object.keys(instance).length === 0) || // 空对象
      (Array.isArray(instance) && instance.length === 0);
  }

return { diffArray, diffObj, isEmpty };
});