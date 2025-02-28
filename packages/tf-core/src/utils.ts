import { PropType, unref } from "vue";
import { RecordPath, Unrefs } from "./type-helper";
import { TfFormColumnBase } from "./form/columns";

export const getField = <T extends Record<string, any>>(
  column: TfFormColumnBase<T>,
) => {
  return (column.field ?? column.fields?.[0]) as RecordPath<T>;
};

export const isEmptyStrOrNull = (val: any) => {
  return val === "" || val == null;
};

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

export const set = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!Reflect.has(obj, key)) {
      Reflect.set(obj, key, {});
    }
    obj = Reflect.get(obj, key);
  }
  Reflect.set(obj, keys[keys.length - 1], value);
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
  if (cache) {
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
  if (cache) {
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

export type RuntimeProps<T extends readonly any[] = []> =
  | T[number]
  | [
      T[number],
      {
        type?: PropType<any> | true | null;
        required?: boolean;
        default?: any;
        validator?(value: unknown, props: any): boolean;
      },
    ];

export const transferVueArrayPropsToObject = (arr: RuntimeProps[]) => {
  // any 避免与 泛型推断冲突
  const props: any = {};

  arr.forEach(item => {
    if (typeof item === "string") {
      props[item] = {};
    } else {
      props[item[0]] = item[1] || {};
    }
  });

  return props;
};

export const getPropsKeys = (arr: RuntimeProps<any>[]) => {
  return arr.map(item => {
    if (typeof item === "string") {
      return item;
    } else {
      return item[0];
    }
  });
};
