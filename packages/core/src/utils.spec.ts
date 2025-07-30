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
  isEqual,
  forEachTree,
} from "./utils";
import { ref } from "vue";

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

    it("应该正确设置数组的索引", () => {
      const obj = {};
      set(obj, "a.b.0", 123);
      expect(obj).toEqual({ a: { b: [123] } });
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
    it("应该优先获取字段fields.[0]", () => {
      const column = {
        field: "field1",
        fields: ["field2", "field3"],
      };
      expect(getField(column)).toBe("field2");
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

  describe("isEqual", () => {
    describe("基本类型比较", () => {
      it("应该正确比较相同的基本类型", () => {
        expect(isEqual(1, 1)).toBe(true);
        expect(isEqual("test", "test")).toBe(true);
        expect(isEqual(true, true)).toBe(true);
        expect(isEqual(false, false)).toBe(true);
      });

      it("应该正确比较不同的基本类型", () => {
        expect(isEqual(1, 2)).toBe(false);
        expect(isEqual("test", "other")).toBe(false);
        expect(isEqual(true, false)).toBe(false);
        expect(isEqual(1, "1")).toBe(false);
        expect(isEqual(0, false)).toBe(false);
      });
    });

    describe("null和undefined处理", () => {
      it("应该正确处理null值", () => {
        expect(isEqual(null, null)).toBe(true);
        expect(isEqual(null, undefined)).toBe(false);
        expect(isEqual(null, 0)).toBe(false);
        expect(isEqual(null, "")).toBe(false);
        expect(isEqual(null, false)).toBe(false);
      });

      it("应该正确处理undefined值", () => {
        expect(isEqual(undefined, undefined)).toBe(true);
        expect(isEqual(undefined, null)).toBe(false);
        expect(isEqual(undefined, 0)).toBe(false);
        expect(isEqual(undefined, "")).toBe(false);
        expect(isEqual(undefined, false)).toBe(false);
      });
    });

    describe("falsy值处理", () => {
      it("应该正确比较falsy值", () => {
        expect(isEqual(0, 0)).toBe(true);
        expect(isEqual(false, false)).toBe(true);
        expect(isEqual("", "")).toBe(true);

        expect(isEqual(0, false)).toBe(false);
        expect(isEqual(0, "")).toBe(false);
        expect(isEqual(false, "")).toBe(false);
      });
    });

    describe("数组比较", () => {
      it("应该正确比较相同的数组", () => {
        expect(isEqual([], [])).toBe(true);
        expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(isEqual([1, "test", true], [1, "test", true])).toBe(true);
      });

      it("应该正确比较不同的数组", () => {
        expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
        expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
        expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
        expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
      });

      it("应该正确比较嵌套数组", () => {
        expect(
          isEqual(
            [
              [1, 2],
              [3, 4],
            ],
            [
              [1, 2],
              [3, 4],
            ],
          ),
        ).toBe(true);
        expect(
          isEqual(
            [
              [1, 2],
              [3, 4],
            ],
            [
              [1, 2],
              [3, 5],
            ],
          ),
        ).toBe(false);
        expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
        expect(isEqual([1, [2, 3]], [1, [2, 4]])).toBe(false);
      });

      it("不应该将数组和非数组视为相等", () => {
        expect(isEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
        expect(isEqual([], {})).toBe(false);
      });
    });

    describe("对象比较", () => {
      it("应该正确比较相同的对象", () => {
        expect(isEqual({}, {})).toBe(true);
        expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
        expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      });

      it("应该正确比较不同的对象", () => {
        expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
        expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
        expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
        expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      });

      it("应该忽略属性顺序", () => {
        expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
        expect(isEqual({ x: 1, y: 2, z: 3 }, { z: 3, x: 1, y: 2 })).toBe(true);
      });

      it("应该正确比较嵌套对象", () => {
        const obj1 = { a: { b: { c: 1 } } };
        const obj2 = { a: { b: { c: 1 } } };
        const obj3 = { a: { b: { c: 2 } } };

        expect(isEqual(obj1, obj2)).toBe(true);
        expect(isEqual(obj1, obj3)).toBe(false);
      });

      it("应该处理包含数组的对象", () => {
        const obj1 = { a: [1, 2], b: { c: [3, 4] } };
        const obj2 = { a: [1, 2], b: { c: [3, 4] } };
        const obj3 = { a: [1, 2], b: { c: [3, 5] } };

        expect(isEqual(obj1, obj2)).toBe(true);
        expect(isEqual(obj1, obj3)).toBe(false);
      });
    });

    describe("混合类型比较", () => {
      it("应该正确处理包含null/undefined的复杂结构", () => {
        expect(isEqual({ a: null }, { a: null })).toBe(true);
        expect(isEqual({ a: null }, { a: undefined })).toBe(false);
        expect(isEqual([null, 1], [null, 1])).toBe(true);
        expect(isEqual([null, 1], [undefined, 1])).toBe(false);
      });

      it("应该处理深度嵌套的复杂结构", () => {
        const complex1 = {
          a: [1, { b: [2, 3] }],
          c: { d: { e: [4, { f: 5 }] } },
        };
        const complex2 = {
          a: [1, { b: [2, 3] }],
          c: { d: { e: [4, { f: 5 }] } },
        };
        const complex3 = {
          a: [1, { b: [2, 3] }],
          c: { d: { e: [4, { f: 6 }] } },
        };

        expect(isEqual(complex1, complex2)).toBe(true);
        expect(isEqual(complex1, complex3)).toBe(false);
      });
    });

    describe("边界情况", () => {
      it("应该处理同一个对象引用", () => {
        const obj = { a: 1 };
        const arr = [1, 2, 3];

        expect(isEqual(obj, obj)).toBe(true);
        expect(isEqual(arr, arr)).toBe(true);
      });

      it("应该处理特殊数值", () => {
        expect(isEqual(NaN, NaN)).toBe(true);
        expect(isEqual(Infinity, Infinity)).toBe(true);
        expect(isEqual(-Infinity, -Infinity)).toBe(true);
        expect(isEqual(Infinity, -Infinity)).toBe(false);

        // Date
        expect(isEqual(new Date("2021-01-01"), new Date("2021-01-01"))).toBe(
          true,
        );
        expect(isEqual(new Date("2021-01-01"), new Date("2021-01-02"))).toBe(
          false,
        );
      });

      it("应该处理空值组合", () => {
        expect(isEqual(null, {})).toBe(false);
        expect(isEqual(undefined, {})).toBe(false);
        expect(isEqual(null, [])).toBe(false);
        expect(isEqual(undefined, [])).toBe(false);
      });
    });
  });

  describe("forEachTree", () => {
    it("应该遍历单层树结构", () => {
      const tree = [
        { id: 1, name: "Node 1" },
        { id: 2, name: "Node 2" },
        { id: 3, name: "Node 3" },
      ];

      const visited: any[] = [];
      forEachTree(tree, item => {
        visited.push(item);
      });

      expect(visited).toEqual(tree);
    });

    it("应该遍历多层嵌套树结构", () => {
      const tree = [
        {
          id: 1,
          name: "Root 1",
          children: [
            { id: 11, name: "Child 1-1" },
            { id: 12, name: "Child 1-2" },
          ],
        },
        {
          id: 2,
          name: "Root 2",
          children: [
            {
              id: 21,
              name: "Child 2-1",
              children: [
                { id: 211, name: "Grandchild 2-1-1" },
                { id: 212, name: "Grandchild 2-1-2" },
              ],
            },
          ],
        },
      ];

      const visited: any[] = [];
      forEachTree(tree, item => {
        visited.push({ id: item.id, name: item.name });
      });

      expect(visited).toEqual([
        { id: 1, name: "Root 1" },
        { id: 11, name: "Child 1-1" },
        { id: 12, name: "Child 1-2" },
        { id: 2, name: "Root 2" },
        { id: 21, name: "Child 2-1" },
        { id: 211, name: "Grandchild 2-1-1" },
        { id: 212, name: "Grandchild 2-1-2" },
      ]);
    });

    it("应该处理空树结构", () => {
      const tree: any[] = [];
      const visited: any[] = [];

      forEachTree(tree, item => {
        visited.push(item);
      });

      expect(visited).toEqual([]);
    });

    it("应该处理没有children的节点", () => {
      const tree = [
        { id: 1, name: "Node 1" },
        { id: 2, name: "Node 2", children: [] },
        { id: 3, name: "Node 3" },
      ];

      const visited: any[] = [];
      forEachTree(tree, item => {
        visited.push({ id: item.id, name: item.name });
      });

      expect(visited).toEqual([
        { id: 1, name: "Node 1" },
        { id: 2, name: "Node 2" },
        { id: 3, name: "Node 3" },
      ]);
    });

    it("应该支持回调函数修改节点", () => {
      const tree = [
        { id: 1, name: "Node 1", value: 0 },
        {
          id: 2,
          name: "Node 2",
          value: 0,
          children: [{ id: 21, name: "Child 2-1", value: 0 }],
        },
      ];

      forEachTree(tree, item => {
        item.value = item.id * 10;
      });

      expect(tree[0].value).toBe(10);
      expect(tree[1].value).toBe(20);
      expect(tree[1].children![0].value).toBe(210);
    });

    it("应该处理复杂的树结构", () => {
      const tree = [
        {
          id: "root1",
          type: "folder",
          children: [
            {
              id: "child1",
              type: "file",
              children: [
                { id: "grandchild1", type: "file" },
                { id: "grandchild2", type: "file" },
              ],
            },
            { id: "child2", type: "file" },
          ],
        },
        {
          id: "root2",
          type: "folder",
          children: [],
        },
      ];

      const folderCount = { count: 0 };
      const fileCount = { count: 0 };

      forEachTree(tree, item => {
        if (item.type === "folder") {
          folderCount.count++;
        } else if (item.type === "file") {
          fileCount.count++;
        }
      });

      expect(folderCount.count).toBe(2);
      expect(fileCount.count).toBe(4);
    });
  });
});
