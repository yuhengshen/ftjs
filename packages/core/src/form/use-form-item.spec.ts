import { describe, it, expect, vi, beforeEach } from "vitest";
import { Ref, ref } from "vue";
import { useFormItem } from "./use-form-item";
import { FormInject, useFormInject } from "./use-form";
import { FtFormColumnBase } from "./columns";
import { CommonFormItemProps } from "./define-component";

// 模拟useFormInject函数
vi.mock("./use-form", () => ({
  useFormInject: vi.fn(),
}));

describe("useFormItem", () => {
  // 基础测试数据
  type TestFormData = {
    name: string;
    age: number;
    address: {
      city: string;
      street: string;
    };
    tags: string[];
  };

  // 模拟表单数据
  let mockForm: Ref<TestFormData>;

  // 模拟列
  let mockColumn: FtFormColumnBase<TestFormData>;

  // 模拟props
  let mockProps: CommonFormItemProps<any>;

  beforeEach(() => {
    console.warn = vi.fn();

    mockForm = ref({
      name: "张三",
      age: 30,
      address: {
        city: "北京",
        street: "长安街",
      },
      tags: ["开发", "测试"],
    });

    const mockReturn = {
      form: mockForm,
    };

    vi.mocked(useFormInject).mockReturnValue(
      mockReturn as FormInject<TestFormData, "default">,
    );
  });

  it("应该正确处理简单字段", () => {
    // 准备测试数据
    mockColumn = {
      field: "name",
    };

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    // 调用被测试函数
    const { valueComputed } = useFormItem({
      props: mockProps,
    });

    // 验证得到正确的值
    expect(valueComputed.value).toBe("张三");

    // 修改值
    valueComputed.value = "李四";

    // 验证表单数据被正确更新
    expect(mockForm.value.name).toBe("李四");
  });

  it("应该正确处理嵌套字段", () => {
    // 准备测试数据
    mockColumn = {
      field: "address.city",
    };

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    // 调用被测试函数
    const { valueComputed } = useFormItem({
      props: mockProps,
    });

    // 验证得到正确的值
    expect(valueComputed.value).toBe("北京");

    // 修改值
    valueComputed.value = "上海";

    // 验证表单数据被正确更新
    expect(mockForm.value.address.city).toBe("上海");
  });

  it("应该能处理多字段情况", () => {
    // 准备测试数据
    mockColumn = {
      fields: ["address.city", "address.street"],
    };

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    const { valueComputed } = useFormItem({
      props: mockProps,
    });

    expect(valueComputed.value).toEqual(["北京", "长安街"]);

    valueComputed.value = ["上海", "南京路"];

    expect(mockForm.value.address.city).toBe("上海");
    expect(mockForm.value.address.street).toBe("南京路");
  });

  it("应该能处理多字段中包含占位符的情况", () => {
    // 准备测试数据
    mockColumn = {
      fields: ["address.city", "-", "address.street"],
    };

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    const { valueComputed } = useFormItem({
      props: mockProps,
    });

    expect(valueComputed.value).toEqual(["北京", undefined, "长安街"]);

    valueComputed.value = ["上海", "忽略", "南京路"];

    expect(mockForm.value.address.city).toBe("上海");
    expect(mockForm.value.address.street).toBe("南京路");
  });

  it("应该能使用 valueSetter 处理设置值", () => {
    // 准备测试数据
    mockColumn = {
      field: "age",
    };

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    // 调用被测试函数，传入值转换函数
    const { valueComputed } = useFormItem({
      props: mockProps,
      valueSetter: val => Number(val),
    });

    // 修改值为字符串
    valueComputed.value = "40";

    // 验证表单数据被正确转换为数字
    expect(mockForm.value.age).toBe(40);
  });

  it("应该能使用 valueGetter 处理获取值", () => {
    // 准备测试数据
    mockColumn = {
      field: "age",
    };

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    // 调用被测试函数，传入值转换函数
    const { valueComputed } = useFormItem({
      props: mockProps,
      valueGetter: val => `${val}岁`,
    });

    // 验证获取值时被正确转换
    expect(valueComputed.value).toBe("30岁");
  });

  it("应该优先使用column中定义的转换函数", () => {
    // 准备测试数据
    mockColumn = {
      field: "age",
      valueGetter: val => `年龄: ${val}`,
      valueSetter: val => Number(val.replace("年龄: ", "")),
    };

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    // 调用被测试函数，传入与column中不同的转换函数
    const { valueComputed } = useFormItem({
      props: mockProps,
      valueGetter: val => `${val}岁`, // 这个不会被使用
      valueSetter: val => Number(val), // 这个不会被使用
    });

    expect(valueComputed.value).toBe("年龄: 30");

    valueComputed.value = "年龄: 50";

    expect(mockForm.value.age).toBe(50);
  });

  it("当column没有field或fields时应该发出警告", () => {
    console.warn = vi.fn();

    mockColumn = {};

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    const { valueComputed } = useFormItem({
      props: mockProps,
    });

    expect(valueComputed.value).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("column 没有设置 field 或者 fields"),
      mockColumn,
    );

    vi.mocked(console.warn).mockReset();

    valueComputed.value = "测试";
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("column 没有设置 field 或者 fields"),
      mockColumn,
    );
  });

  it("应该能处理数组清空操作", () => {
    mockColumn = {
      fields: ["address.city", "address.street"],
    };

    mockProps = {
      column: mockColumn,
      isView: false,
    };

    const { valueComputed } = useFormItem({
      props: mockProps,
    });

    valueComputed.value = undefined;

    expect(mockForm.value.address.city).toBeUndefined();
    expect(mockForm.value.address.street).toBeUndefined();
  });

  it("应该能处理slots", () => {
    mockColumn = {
      field: "age",
      slots: {
        clearIcon: ({ value, isView }) => {
          return `value: ${value}, isView: ${isView}`;
        },
      },
    };

    mockProps = {
      column: mockColumn,
      isView: true,
    };

    const { slots } = useFormItem({
      props: mockProps,
    });

    expect(slots).toBeDefined();
    expect(slots?.clearIcon?.()).toBe("value: 30, isView: true");
  });
});
