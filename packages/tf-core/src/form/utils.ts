export const isEmptyStrOrNull = (val: any) => {
  return val === "" || val == null;
};

export const cloneDeep = <T>(obj: T) => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

/**
 * 对比两个字符串数组是否相同，忽略顺序
 */
export const isEqualStrArr = (a: string[], b: string[]) => {
  return a.length === b.length && a.every(item => b.includes(item));
};

export const get = (obj: any, path: string) => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (Reflect.has(result, key)) {
      result = Reflect.get(result, key);
    } else {
      return undefined;
    }
  }
  return result;
};

export const set = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
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
  const keys = path.split('.');
  for (const key of keys) {
    if (!Reflect.has(obj, key)) {
      return false;
    }
    obj = Reflect.get(obj, key);
  }
  return true;
};
