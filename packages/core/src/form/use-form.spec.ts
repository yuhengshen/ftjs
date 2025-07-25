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

    it("visibleColumns应该支持hide为函数的列", async () => {
      const columnsWithHideFn = [
        ...columns,
        {
          field: "dynamicHide",
          title: "动态隐藏",
          value: "test",
          hide: (form: any) => form.name === "张三",
        },
      ];
      const { form, visibleColumns } = useForm({
        formData,
        columns: columnsWithHideFn,
      });
      // 初始时name为“张三”，dynamicHide应被隐藏
      expect(
        visibleColumns.value.some(col => col.field === "dynamicHide"),
      ).toBe(false);
      // 修改name为其他值，dynamicHide应显示
      form.value.name = "李四";
      await nextTick();
      expect(
        visibleColumns.value.some(col => col.field === "dynamicHide"),
      ).toBe(true);
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

  describe("控制逻辑功能", () => {
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
        fieldC: number;
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
          fields: ["fieldB", "fieldC"],
          title: "字段B",
          control: [
            {
              field: "targetField",
              value: ({ val }) => val[0] < 10 && val[1] < 10,
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
      form.value.fieldC = 9;
      await nextTick();
      expect(visibleColumns.value).toHaveLength(3);

      form.value.fieldB = 10;
      await nextTick();
      expect(visibleColumns.value).toHaveLength(2);
    });

    it("应该正确处理数组类型的控制条件", async () => {
      interface FormData {
        status: string;
        conditionalField: string;
      }

      const columns: FtFormColumnBase<FormData>[] = [
        {
          field: "status",
          title: "状态",
          control: [
            {
              field: "conditionalField",
              value: ["active", "pending"], // 数组类型判断
            },
          ],
        },
        {
          field: "conditionalField",
          title: "条件字段",
        },
      ];

      const { form, visibleColumns } = useForm({
        columns,
        formData: { status: "inactive", conditionalField: "" },
      });

      // 初始状态：conditionalField应该被隐藏
      expect(visibleColumns.value.map(c => c.field)).toEqual(["status"]);

      form.value.status = "active";
      await nextTick();

      expect(visibleColumns.value.map(c => c.field)).toEqual([
        "status",
        "conditionalField",
      ]);

      form.value.status = "pending";
      await nextTick();

      expect(visibleColumns.value.map(c => c.field)).toEqual([
        "status",
        "conditionalField",
      ]);

      // 设置为不在数组中的值
      form.value.status = "completed";
      await nextTick();

      expect(visibleColumns.value.map(c => c.field)).toEqual(["status"]);
    });
  });

  describe("表单监听功能 (watch)", () => {
    it("应该正确处理字段变化监听", async () => {
      const watchHandler = vi.fn();

      interface FormData {
        watchedField: string;
        otherField: string;
      }

      const columns: FtFormColumnBase<FormData>[] = [
        {
          field: "watchedField",
          title: "被监听字段",
          watch: watchHandler,
        },
        {
          field: "otherField",
          title: "其他字段",
        },
      ];

      const { form } = useForm({
        columns,
        formData: { watchedField: "initial", otherField: "other" },
      });

      expect(watchHandler).toHaveBeenCalledTimes(0);

      form.value.watchedField = "changed";
      await nextTick();

      expect(watchHandler).toHaveBeenCalledTimes(1);
      expect(watchHandler).toHaveBeenLastCalledWith({
        val: "changed",
        oldVal: "initial",
        form: form.value,
      });
    });

    it("应该正确处理监听配置对象", async () => {
      const watchHandler = vi.fn();

      interface FormData {
        watchedField: string;
      }

      const columns: FtFormColumnBase<FormData>[] = [
        {
          field: "watchedField",
          title: "被监听字段",
          watch: {
            handler: watchHandler,
            immediate: false,
            deep: true,
          },
        },
      ];

      const { form } = useForm({
        columns,
        formData: { watchedField: "initial" },
      });

      expect(watchHandler).not.toHaveBeenCalled();

      form.value.watchedField = "changed";
      await nextTick();

      expect(watchHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("默认值与重置功能", () => {
    it("应该能重置表单到默认值", async () => {
      const { form, resetToDefault } = useForm({
        formData,
        columns,
      });

      // 修改表单值
      form.value.name = "修改后的名字";
      form.value.age = 99;

      // 重置到默认值
      await resetToDefault();

      expect(form.value.name).toBe("默认姓名");
      expect(form.value.age).toBe(25);
    });

    it("应该支持同步重置", async () => {
      const { form, resetToDefault } = useForm({
        formData,
        columns,
      });

      form.value.name = "修改后的名字";

      // 同步重置
      resetToDefault(true);

      expect(form.value.name).toBe("默认姓名");
    });

    it("当设置了自定义默认值时应该重置到自定义默认值", async () => {
      const { form, resetToDefault, setAsDefault } = useForm({
        formData,
        columns,
      });

      // 设置自定义默认值
      const customDefault = { ...formData, name: "自定义默认名字", age: 88 };
      setAsDefault(customDefault);

      // 修改表单值
      form.value.name = "修改后的名字";
      form.value.age = 99;

      // 重置应该使用自定义默认值
      await resetToDefault();

      expect(form.value.name).toBe("自定义默认名字");
      expect(form.value.age).toBe(88);
    });

    it("setAsDefault应该设置当前表单值为默认值", async () => {
      const { form, setAsDefault, resetToDefault } = useForm({
        formData,
        columns,
      });

      // 修改表单值
      form.value.name = "新的默认名字";
      form.value.age = 77;

      // 设置当前值为默认值
      setAsDefault();

      // 再次修改表单值
      form.value.name = "临时修改";
      form.value.age = 88;

      // 重置应该回到之前设置的默认值
      await resetToDefault();

      expect(form.value.name).toBe("新的默认名字");
      expect(form.value.age).toBe(77);
    });

    it("应该为缺失的嵌套字段添加默认值", async () => {
      interface FormData {
        user: {
          profile: {
            name: string;
            age: number;
          };
        };
        tags: string[];
      }

      const columns: FtFormColumnBase<FormData>[] = [
        {
          field: "user.profile.name",
          title: "用户名",
          value: "默认用户名",
        },
        {
          field: "user.profile.age",
          title: "年龄",
          value: 18,
        },
        {
          fields: ["tags.0", "tags.1"],
          title: "标签",
          value: ["标签1", "标签2"],
        },
      ];

      // 不提供初始数据，应该自动填充默认值
      const { form } = useForm({
        columns,
      });

      expect(form.value).toEqual({
        user: {
          profile: {
            name: "默认用户名",
            age: 18,
          },
        },
        tags: ["标签1", "标签2"],
      });
    });

    it("应该保留已存在的字段值，只添加缺失的默认值", async () => {
      interface FormData {
        user: {
          name: string;
          age: number;
        };
      }

      const columns: FtFormColumnBase<FormData>[] = [
        {
          field: "user.name",
          title: "用户名",
          value: "默认用户名",
        },
        {
          field: "user.age",
          title: "年龄",
          value: 18,
        },
      ];

      // 只提供部分数据
      const { form } = useForm({
        columns,
        formData: { user: { name: "已存在的名字" } } as FormData,
      });

      expect(form.value).toEqual({
        user: {
          name: "已存在的名字", // 保留已存在的值
          age: 18, // 添加默认值
        },
      });
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

      columnsChecked.value = ["name", "age"];

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("resetColumnsChecked应该重置列显示状态", async () => {
      const { columnsChecked, resetColumnsChecked } = useForm({
        formData,
        columns,
        cache: "test-cache-key",
      });

      const originalLength = columnsChecked.value.length;
      columnsChecked.value = ["name"];

      resetColumnsChecked();

      expect(columnsChecked.value.length).toBe(originalLength);
    });

    it("resetColumnsSort应该重置列排序", async () => {
      const { columnsSort, resetColumnsSort } = useForm({
        formData,
        columns,
        cache: "test-cache-key",
      });

      const originalSort = { ...columnsSort.value };
      columnsSort.value = { ...originalSort, name: 100 };

      resetColumnsSort();

      expect(columnsSort.value.name).toBe(originalSort.name);
    });
  });

  describe("useFormInject", () => {
    it("应该通过inject获取表单值", async () => {
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
});
