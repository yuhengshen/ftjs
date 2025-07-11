import { unref } from "vue";
import { RecordPath, Unrefs } from "./type-helper";
import { FtFormColumnBase } from "./form/columns";

export const isBrowser = typeof window !== "undefined";

export const getField = <T extends Record<string, any>>(
  column: FtFormColumnBase<T>,
) => {
  return (column.fields?.[0] ?? column.field) as RecordPath<T>;
};

export const isEmptyStrOrNull = (val: any) => {
  return val === "" || val == null;
};

/**
 * 深拷贝(简化版)
 */
export const cloneDeep = <T>(obj: T) => {
  if (typeof obj === "object" && obj !== null) {
    return JSON.parse(JSON.stringify(obj)) as T;
  }
  return obj;
};

export const get = (obj: any, path: string) => {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    if (result == null || typeof result !== "object") {
      return undefined;
    }
    if (Reflect.has(result, key)) {
      result = Reflect.get(result, key);
    } else {
      return undefined;
    }
  }
  return result;
};

export const set = (target: any, path: string, value: any) => {
  if (path === "") return;

  const keys = path.split(".");
  let obj: any = target;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (typeof obj !== "object" || obj == null) {
      throw new Error("set 赋值错误, target", obj);
    }

    // 当前位置为空需要创建新对象
    if (obj[key] == null) {
      // 判断下一个键是否为有效的数组索引
      obj[key] = /^\d+$/.test(nextKey) ? [] : {};
    }

    obj = obj[key];
  }

  const lastKey = keys[keys.length - 1];
  obj[lastKey] = value;
};

export const has = (obj: any, path: string) => {
  const keys = path.split(".");
  for (const key of keys) {
    if (!Reflect.has(obj, key)) {
      return false;
    }
    obj = Reflect.get(obj, key);
  }
  return true;
};

/**
 * 浅层的将对象的属性值(可能是响应式)转换为普通值，不转化getter
 * @param obj
 * @returns
 */
export const unrefs = <T>(obj: T) => {
  if (!obj || typeof obj !== "object") {
    return obj as Unrefs<T>;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, unref(value)]),
  ) as Unrefs<T>;
};

/**
 * 获取缓存
 * @param key 缓存 key
 * @param cache 缓存名称
 * @returns
 */
export const getStorage = (key: string, cache?: string) => {
  let value = {};
  if (cache && isBrowser) {
    try {
      const storageStr = localStorage.getItem(key);
      if (storageStr) {
        const storageV = JSON.parse(storageStr);
        if (storageV[cache]) {
          value = storageV[cache];
        }
      }
    } catch (error) {
      console.error(error);
      value = {};
    }
  }
  return value;
};

/**
 * 设置缓存
 * @param key 缓存 key
 * @param cache 缓存名称
 */
export const setStorage = (key: string, value: any, cache?: string) => {
  if (cache && isBrowser) {
    let obj = {};
    const storageStr = localStorage.getItem(key);
    if (storageStr) {
      try {
        obj = JSON.parse(storageStr) ?? {};
      } catch (error) {
        console.error(error);
      }
    }
    obj[cache] = value;
    localStorage.setItem(key, JSON.stringify(obj));
  }
};

/**
 * 简单判断两个值是否相等
 *
 * 不考虑循环引用
 */
export const isEqual = (a: any, b: any) => {
  if (a === b) {
    return true;
  }

  if (a == null || b == null) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  // 非对象类型直接比较
  if (typeof a !== "object") {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((item, index) => isEqual(item, b[index]))
    );
  }

  // 一个是数组一个不是
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof Date || b instanceof Date) {
    return false;
  }

  // 对象比较 - 先比较键的数量
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // 比较每个键值对
  return keysA.every(
    key =>
      Object.prototype.hasOwnProperty.call(b, key) && isEqual(a[key], b[key]),
  );
};
