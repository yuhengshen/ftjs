import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick } from "vue";
import { useForm, useFormInject } from "./use-form";
import { FtFormColumnBase } from "./columns";
import { getField } from "../utils";

// 模拟 localStorage
const setupLocalStorageMock = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    storage: {} as Record<string, string>,
  };

  localStorageMock.getItem.mockImplementation((key: string) => {
    return localStorageMock.storage[key] || null;
  });

  localStorageMock.setItem.mockImplementation((key: string, value: string) => {
    localStorageMock.storage[key] = value;
  });

  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("window", {});
    localStorageMock.storage = {};
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  return localStorageMock;
};

// 模拟 Vue 的 provide/inject
vi.mock("vue", async () => {
  const actual = await vi.importActual("vue");

  const provided: Record<symbol, any> = {};

  return {
    ...actual,
    provide: vi.fn((key, value) => {
      provided[key] = value;
    }),
    inject: vi.fn(key => {
      return provided[key];
    }),
    onScopeDispose: vi.fn(),
  };
});

describe("useForm", () => {
  // 定义测试用的表单数据类型
  type TestFormData = {
    name: string;
    age: number;
    address: {
      city: string;
      street: string;
    };
    contacts: string[];
    hobby: string;
    isActive: boolean;
  };

  // 测试用的列定义
  let columns: FtFormColumnBase<TestFormData>[];

  // 测试用的表单数据
  let formData: TestFormData;

  let defaultFormData: TestFormData;

  beforeEach(() => {
    formData = {
      name: "张三",
      age: 30,
      address: {
        city: "上海",
        street: "南京路",
      },
      contacts: ["123456789", "987654321"],
      hobby: "阅读",
      isActive: true,
    };

    columns = [
      {
        field: "name",
        title: "姓名",
        value: "默认姓名",
      },
      {
        field: "age",
        title: "年龄",
        value: 25,
      },
      {
        field: "address.city",
        title: "城市",
        value: "北京",
      },
      {
        field: "address.street",
        title: "街道",
        value: "长安街",
      },
      {
        fields: ["contacts.0", "contacts.1"],
        title: "联系方式",
        value: ["默认电话1", "默认电话2"],
      },
      {
        field: "hobby",
        title: "爱好",
        value: "运动",
        hide: true,
      },
      {
        field: "isActive",
        title: "是否激活",
        value: false,
      },
    ];

    defaultFormData = {
      name: "默认姓名",
      age: 25,
      address: {
        city: "北京",
        street: "长安街",
      },
      contacts: ["默认电话1", "默认电话2"],
      hobby: "运动",
      isActive: false,
    };

    vi.clearAllMocks();
  });

  describe("基础功能", () => {
    it("应该正确初始化表单数据", async () => {
      const { form } = useForm({
        formData,
        columns,
      });

      expect(form.value).toEqual(formData);
    });

    it("当未提供formData时应该创建空对象并触发onUpdate:formData", async () => {
      const onUpdateMock = vi.fn();

      useForm({
        columns,
        "onUpdate:formData": onUpdateMock,
      });

      expect(onUpdateMock).toHaveBeenCalledTimes(1);
      expect(onUpdateMock).toHaveBeenCalledWith(defaultFormData);
    });

    it("更新form.value时应该触发onUpdate:formData", async () => {
      const onUpdateMock = vi.fn();

      const { form } = useForm({
        formData,
        columns,
        "onUpdate:formData": onUpdateMock,
      });

      // 修改表单值
      form.value = { ...formData, name: "李四" };

      expect(onUpdateMock).toHaveBeenCalledTimes(1);
      expect(onUpdateMock).toHaveBeenCalledWith({ ...formData, name: "李四" });
    });
  });

  describe("列处理功能", () => {
    it("visibleColumns应该过滤掉hide=true的列", async () => {
      const { visibleColumns } = useForm({
        formData,
        columns,
      });

      // 检查visibleColumns不包含hobby字段
      expect(visibleColumns.value.length).toBe(columns.length - 1);
      expect(visibleColumns.value.some(col => col.field === "hobby")).toBe(
        false,
      );
    });

    it("columnsChecked应该包含所有未隐藏的列", async () => {
      const { columnsChecked } = useForm({
        formData,
        columns,
      });

      const expectedFields = columns
        .filter(col => !col.hide)
        .map(col => getField(col));

      expect(columnsChecked.value).toEqual(expectedFields);
    });

    it("应该能修改columnsChecked并反映在visibleColumns中", async () => {
      const { columnsChecked, visibleColumns } = useForm({
        formData,
        columns,
      });

      // 初始状态
      expect(visibleColumns.value.length).toBe(columns.length - 1);

      // 修改columnsChecked - 排除'name'字段
      const newChecked = columnsChecked.value.filter(field => field !== "name");
      columnsChecked.value = newChecked;

      // 验证visibleColumns不再包含name字段
      expect(visibleColumns.value.some(col => col.field === "name")).toBe(
        false,
      );
      expect(visibleColumns.value.length).toBe(columns.length - 2);
    });
  });

  describe("数据转换功能", () => {
    it("getFormData应该只返回可见列的数据", async () => {
      const { getFormData } = useForm({
        formData,
        columns,
      });

      const result = getFormData();

      // hobby字段在columns中是隐藏的
      expect(result).not.toHaveProperty("hobby");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("age");
    });

    it("formatGetFormData应该正确转换字段值", async () => {
      // 创建带有formatGetFormData的列定义
      const columnsWithFormat = [...columns];
      columnsWithFormat[1] = {
        ...columnsWithFormat[1],
        formatGetFormData: (value: number) => value * 2,
      };

      const { getFormData } = useForm({
        formData,
        columns: columnsWithFormat,
      });

      const result = getFormData();

      // age字段应该被转换
      expect(result.age).toBe(formData.age * 2);
    });
  });

  describe("缓存功能", () => {
    const localStorageMock = setupLocalStorageMock();

    it("应该在提供cache参数时保存列配置", async () => {
      const { columnsChecked } = useForm({
        formData,
        columns,
        cache: "test-cache-key",
      });

      // 修改columnsChecked
      columnsChecked.value = ["name", "age"];

      // 验证localStorage.setItem被调用
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("resetColumnsChecked应该重置列显示状态", async () => {
      const { columnsChecked, resetColumnsChecked } = useForm({
        formData,
        columns,
        cache: "test-cache-key",
      });

      // 更改列显示状态
      const originalLength = columnsChecked.value.length;
      columnsChecked.value = ["name"];

      // 重置
      resetColumnsChecked();

      // 验证重置后的状态
      expect(columnsChecked.value.length).toBe(originalLength);
    });

    it("resetColumnsSort应该重置列排序", async () => {
      const { columnsSort, resetColumnsSort } = useForm({
        formData,
        columns,
        cache: "test-cache-key",
      });

      // 更改排序
      const originalSort = { ...columnsSort.value };
      columnsSort.value = { ...originalSort, name: 100 };

      // 重置
      resetColumnsSort();

      // 验证重置后的状态
      expect(columnsSort.value.name).toBe(originalSort.name);
    });
  });

  describe("useFormInject", () => {
    it("应该通过inject获取表单值", async () => {
      // 先使用useForm提供表单值
      const { form } = useForm({
        formData,
        columns,
      });

      // 然后使用useFormInject注入表单值
      const injected = useFormInject<TestFormData>();

      // 验证注入的值
      expect(injected?.form.value).toEqual(form.value);
    });
  });

  describe("多字段控制同一字段", () => {
    it("应该正确处理多个字段控制同一个字段的情况", async () => {
      interface FormData {
        fieldA: string;
        fieldB: string;
        targetField: string;
      }

      const columns: FtFormColumnBase<FormData>[] = [
        {
          field: "fieldA",
          title: "字段A",
          control: [{ field: "targetField", value: "showA" }],
        },
        {
          field: "fieldB",
          title: "字段B",
          control: [{ field: "targetField", value: "showB" }],
        },
        {
          field: "targetField",
          title: "目标字段",
        },
      ];

      const { form, visibleColumns } = useForm({
        columns,
        formData: { fieldA: "", fieldB: "", targetField: "" },
      });

      // 初始状态：targetField应该被隐藏
      expect(visibleColumns.value.map(c => c.field)).toEqual([
        "fieldA",
        "fieldB",
      ]);

      form.value.fieldA = "showA";
      await nextTick();
      expect(visibleColumns.value).toHaveLength(2);
      expect(visibleColumns.value.map(c => c.field)).toEqual([
        "fieldA",
        "fieldB",
      ]);

      form.value.fieldB = "showB";
      await nextTick();
      expect(visibleColumns.value).toHaveLength(3);
      expect(visibleColumns.value.map(c => c.field)).toEqual([
        "fieldA",
        "fieldB",
        "targetField",
      ]);

      form.value.fieldA = "other";
      await nextTick();
      expect(visibleColumns.value).toHaveLength(2);
      expect(visibleColumns.value.map(c => c.field)).toEqual([
        "fieldA",
        "fieldB",
      ]);
    });

    it("应该正确处理函数类型的控制条件", async () => {
      interface FormData {
        fieldA: number;
        fieldB: number;
        targetField: string;
      }

      const columns: FtFormColumnBase<FormData>[] = [
        {
          field: "fieldA",
          title: "字段A",
          control: [
            {
              field: "targetField",
              value: ({ val }) => val > 5,
            },
          ],
        },
        {
          field: "fieldB",
          title: "字段B",
          control: [
            {
              field: "targetField",
              value: ({ val }) => val < 10,
            },
          ],
        },
        {
          field: "targetField",
          title: "目标字段",
        },
      ];

      const { form, visibleColumns } = useForm({
        columns,
        formData: { fieldA: 0, fieldB: 0, targetField: "" },
      });

      expect(visibleColumns.value).toHaveLength(2);

      form.value.fieldA = 6;
      form.value.fieldB = 8;
      await nextTick();
      expect(visibleColumns.value).toHaveLength(3);

      form.value.fieldB = 11;
      await nextTick();
      expect(visibleColumns.value).toHaveLength(2);
    });
  });
});
