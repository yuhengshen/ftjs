import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cloneDeep,
  get,
  set,
  has,
  isEmptyStrOrNull,
  isBrowser,
  getField,
  unrefs,
  getStorage,
  setStorage,
  transferVueArrayPropsToObject,
  getPropsKeys,
} from "./utils";
import { ref } from "vue";

// 从 utils.ts 导入类型定义
import type { RuntimeProps } from "./utils";

/**
 * 创建模拟localStorage的辅助函数
 */
const setupLocalStorageMock = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  };

  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    // 确保isBrowser为true，这样测试中会执行localStorage相关的代码
    vi.stubGlobal("window", {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
  });

  return localStorageMock;
};

describe("utils", () => {
  describe("cloneDeep", () => {
    it("应该深度复制对象", () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = cloneDeep(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it("应该处理非对象值", () => {
      expect(cloneDeep(123)).toBe(123);
      expect(cloneDeep("string")).toBe("string");
      expect(cloneDeep(null)).toBe(null);
      expect(cloneDeep(undefined)).toBe(undefined);
    });
  });

  describe("get", () => {
    it("应该获取嵌套对象的属性值", () => {
      const obj = { a: { b: { c: 123 } } };

      expect(get(obj, "a.b.c")).toBe(123);
      expect(get(obj, "a.b")).toEqual({ c: 123 });
      expect(get(obj, "a")).toEqual({ b: { c: 123 } });
    });

    it("当路径不存在时应该返回undefined", () => {
      const obj = { a: { b: { c: 123 } } };

      expect(get(obj, "a.b.d")).toBe(undefined);
      expect(get(obj, "a.c")).toBe(undefined);
      expect(get(obj, "b")).toBe(undefined);
    });

    it("当中间路径不是对象时应该返回undefined", () => {
      const obj = { a: 123 };

      expect(get(obj, "a.b")).toBe(undefined);
    });
  });

  describe("set", () => {
    it("应该设置嵌套对象的属性值", () => {
      const obj = { a: { b: {} } };
      set(obj, "a.b.c", 123);

      expect(obj.a.b).toHaveProperty("c", 123);
    });

    it("应该自动创建缺失的中间路径", () => {
      const obj = {};
      set(obj, "a.b.c", 123);

      expect(obj).toEqual({ a: { b: { c: 123 } } });
    });
  });

  describe("has", () => {
    it("应该检查嵌套对象是否拥有属性", () => {
      const obj = { a: { b: { c: 123 } } };

      expect(has(obj, "a.b.c")).toBe(true);
      expect(has(obj, "a.b")).toBe(true);
      expect(has(obj, "a")).toBe(true);
    });

    it("当路径不存在时应该返回false", () => {
      const obj = { a: { b: { c: 123 } } };

      expect(has(obj, "a.b.d")).toBe(false);
      expect(has(obj, "a.c")).toBe(false);
      expect(has(obj, "b")).toBe(false);
    });
  });

  describe("isEmptyStrOrNull", () => {
    it("应该判断空字符串或null或undefined", () => {
      expect(isEmptyStrOrNull("")).toBe(true);
      expect(isEmptyStrOrNull(null)).toBe(true);
      expect(isEmptyStrOrNull(undefined)).toBe(true);

      expect(isEmptyStrOrNull(0)).toBe(false);
      expect(isEmptyStrOrNull(false)).toBe(false);
      expect(isEmptyStrOrNull("abc")).toBe(false);
    });
  });

  describe("isBrowser", () => {
    it("应该是一个布尔值", () => {
      expect(typeof isBrowser).toBe("boolean");
    });
  });

  describe("getField", () => {
    it("应该优先获取字段field", () => {
      const column = {
        field: "field1",
        fields: ["field2", "field3"],
      };
      expect(getField(column)).toBe("field1");
    });

    it("应该获取字段fields的第一个元素", () => {
      const column = {
        fields: ["field2", "field3"],
      };
      expect(getField(column)).toBe("field2");
    });
  });

  describe("unrefs", () => {
    it("嵌套ref应该被浅层去ref", () => {
      const refs = {
        a: ref(1),
        b: ref({ c: 2 }),
        d: {
          e: ref(3),
        },
      };
      const unrefed = unrefs(refs);
      expect(unrefed).toEqual({
        a: 1,
        b: { c: 2 },
        d: {
          e: ref(3),
        },
      });
    });
  });

  describe("getStorage", () => {
    const localStorageMock = setupLocalStorageMock();

    it("应该获取缓存", () => {
      const key = "test";
      const cache = "test";
      const value = { a: 1, b: 2 };

      // 模拟localStorage.getItem返回值
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({ [cache]: value }),
      );

      // 测试函数
      const result = getStorage(key, cache);

      // 验证结果
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it("当缓存不存在时应该返回空对象", () => {
      const key = "test";
      const cache = "test";

      // 模拟localStorage.getItem返回null（键不存在）
      localStorageMock.getItem.mockReturnValueOnce(null);

      const result = getStorage(key, cache);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(result).toEqual({});
    });

    it("当cache参数不存在时应该返回空对象", () => {
      const key = "test";

      const result = getStorage(key);

      // 没有cache参数时，不应该调用localStorage
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe("setStorage", () => {
    const localStorageMock = setupLocalStorageMock();

    it("应该设置缓存", () => {
      const key = "test";
      const cache = "test";
      const value = { a: 1, b: 2 };

      // 模拟localStorage.getItem返回null（键不存在）
      localStorageMock.getItem.mockReturnValueOnce(null);

      // 调用函数
      setStorage(key, value, cache);

      // 验证结果
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify({ [cache]: value }),
      );
    });

    it("应该更新已存在的缓存", () => {
      const key = "test";
      const cache = "test";
      const existingValue = { c: 3, d: 4 };
      const newValue = { a: 1, b: 2 };

      // 模拟localStorage.getItem返回已存在的数据
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({ [cache]: existingValue, otherCache: { x: 1 } }),
      );

      // 调用函数
      setStorage(key, newValue, cache);

      // 验证结果
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify({ [cache]: newValue, otherCache: { x: 1 } }),
      );
    });

    it("当JSON解析出错时应该创建新对象", () => {
      const key = "test";
      const cache = "test";
      const value = { a: 1, b: 2 };

      // 模拟localStorage.getItem返回无效的JSON
      localStorageMock.getItem.mockReturnValueOnce("invalid json");

      // 模拟console.error不输出到控制台
      const consoleErrorMock = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // 调用函数
      setStorage(key, value, cache);

      // 验证结果
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(consoleErrorMock).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify({ [cache]: value }),
      );

      consoleErrorMock.mockRestore();
    });

    it("当cache参数不存在时不应该调用localStorage", () => {
      const key = "test";
      const value = { a: 1, b: 2 };

      // 调用函数
      setStorage(key, value);

      // 验证结果
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe("transferVueArrayPropsToObject", () => {
    type Props = ["prop1", "prop2", "prop3"];

    it("应该将字符串数组转换为对象", () => {
      const props: RuntimeProps<Props>[] = ["prop1", "prop2", "prop3"];
      const result = transferVueArrayPropsToObject(props);

      expect(result).toEqual({
        prop1: {},
        prop2: {},
        prop3: {},
      });
    });

    it("应该将带配置的数组项转换为对象", () => {
      const props: RuntimeProps<Props>[] = [
        "prop1",
        ["prop2", { type: String, required: true }],
        ["prop3", { default: "default value" }],
      ];

      const result = transferVueArrayPropsToObject(props);

      expect(result).toEqual({
        prop1: {},
        prop2: { type: String, required: true },
        prop3: { default: "default value" },
      });
    });
  });

  describe("getPropsKeys", () => {
    type Props = ["prop1", "prop2", "prop3"];

    it("应该从字符串数组中提取属性名", () => {
      const props: RuntimeProps<Props>[] = ["prop1", "prop2", "prop3"];
      const result = getPropsKeys(props);

      expect(result).toEqual(["prop1", "prop2", "prop3"]);
    });

    it("应该从带配置的数组项中提取属性名", () => {
      const props: RuntimeProps<Props>[] = [
        "prop1",
        ["prop2", { type: String, required: true }],
        ["prop3", { default: "default value" }],
      ];

      const result = getPropsKeys(props);

      expect(result).toEqual(["prop1", "prop2", "prop3"]);
    });
  });
});
