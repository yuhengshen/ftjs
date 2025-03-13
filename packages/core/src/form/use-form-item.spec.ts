import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, computed } from "vue";
import { useFormItem } from "./use-form-item";
import * as utils from "../utils";

// 模拟 useFormInject
vi.mock("./use-form", () => {
  return {
    useFormInject: () => ({
      form: computed(() => mockForm.value),
    }),
  };
});

// 模拟表单数据
const mockForm = ref({
  name: "John",
  age: 30,
  address: {
    city: "Shanghai",
    street: "Nanjing Road",
  },
  contacts: ["123456789", "987654321"],
});

describe("useFormItem", () => {
  beforeEach(() => {
    mockForm.value = {
      name: "John",
      age: 30,
      address: {
        city: "Shanghai",
        street: "Nanjing Road",
      },
      contacts: ["123456789", "987654321"],
    };
    vi.clearAllMocks();
  });

  it("应该正确获取单个字段的值", () => {
    const { valueComputed } = useFormItem({
      props: {
        column: {
          field: "name",
        },
        isView: false,
      },
    });

    expect(valueComputed.value).toBe("John");
  });

  it("应该正确获取嵌套字段的值", () => {
    const { valueComputed } = useFormItem({
      props: {
        column: {
          field: "address.city",
        },
        isView: false,
      },
    });

    expect(valueComputed.value).toBe("Shanghai");
  });

  it("应该正确设置字段的值", () => {
    const setSpy = vi.spyOn(utils, "set");

    const { valueComputed } = useFormItem({
      props: {
        column: {
          field: "name",
        },
        isView: false,
      },
    });

    valueComputed.value = "Jane";

    expect(setSpy).toHaveBeenCalledWith(mockForm.value, "name", "Jane");
    expect(mockForm.value.name).toBe("Jane");
  });

  it("应该使用 valueGetter 转换获取的值", () => {
    const { valueComputed } = useFormItem({
      props: {
        column: {
          field: "age",
          valueGetter: (val: number) => val + 10,
        },
        isView: false,
      },
    });

    expect(valueComputed.value).toBe(40);
  });

  it("应该使用 valueSetter 转换设置的值", () => {
    const setSpy = vi.spyOn(utils, "set");

    const { valueComputed } = useFormItem({
      props: {
        column: {
          field: "age",
          valueSetter: (val: number) => val * 2,
        },
        isView: false,
      },
    });

    valueComputed.value = 25;

    expect(setSpy).toHaveBeenCalledWith(mockForm.value, "age", 50);
    expect(mockForm.value.age).toBe(50);
  });

  it("应该使用选项中的 valueGetter 和 valueSetter", () => {
    const { valueComputed } = useFormItem({
      props: {
        column: {
          field: "age",
        },
        isView: false,
      },
      valueGetter: (val: number) => val * 3,
      valueSetter: (val: number) => val / 3,
    });

    expect(valueComputed.value).toBe(90);

    valueComputed.value = 60;

    expect(mockForm.value.age).toBe(20);
  });

  it("应该优先使用 column 中的 valueGetter 和 valueSetter", () => {
    const { valueComputed } = useFormItem({
      props: {
        column: {
          field: "age",
          valueGetter: (val: number) => val * 2,
          valueSetter: (val: number) => val / 2,
        },
        isView: false,
      },
      valueGetter: (val: number) => val * 3,
      valueSetter: (val: number) => val / 3,
    });

    expect(valueComputed.value).toBe(60);

    valueComputed.value = 100;

    expect(mockForm.value.age).toBe(50);
  });

  it("应该处理多个字段 (fields)", () => {
    const { valueComputed } = useFormItem({
      props: {
        column: {
          fields: ["address.city", "address.street"],
        },
        isView: false,
      },
    });

    expect(valueComputed.value).toEqual(["Shanghai", "Nanjing Road"]);

    valueComputed.value = ["Beijing", "Wangfujing Street"];

    expect(mockForm.value.address.city).toBe("Beijing");
    expect(mockForm.value.address.street).toBe("Wangfujing Street");
  });

  it('应该处理带有 "-" 的 fields', () => {
    const { valueComputed } = useFormItem({
      props: {
        column: {
          fields: ["address.city", "-", "address.street"],
        },
        isView: false,
      },
    });

    expect(valueComputed.value).toEqual([
      "Shanghai",
      undefined,
      "Nanjing Road",
    ]);

    valueComputed.value = ["Beijing", "ignored", "Wangfujing Street"];

    expect(mockForm.value.address.city).toBe("Beijing");
    expect(mockForm.value.address.street).toBe("Wangfujing Street");
  });

  it("应该处理 slots", () => {
    const mockSlots = {
      default: vi.fn(
        ({ value, isView }) => `Value: ${value}, IsView: ${isView}`,
      ),
      extra: vi.fn(
        ({ value, isView, scopedProps }) =>
          `Extra: ${value}, IsView: ${isView}, Props: ${scopedProps?.test}`,
      ),
    };

    const { slots } = useFormItem({
      props: {
        column: {
          field: "name",
          slots: mockSlots,
        },
        isView: true,
      },
    });

    expect(slots).toBeDefined();
    expect(slots?.default?.()).toBe("Value: John, IsView: true");
    expect(slots?.extra?.({ test: "test-prop" })).toBe(
      "Extra: John, IsView: true, Props: test-prop",
    );
  });

  it("当 column 没有设置 field 或 fields 时应该发出警告", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { valueComputed } = useFormItem({
      props: {
        column: {},
        isView: false,
      },
    });

    // 访问 valueComputed.value 以触发 get 方法
    void valueComputed.value;

    expect(consoleSpy).toHaveBeenCalledWith(
      "column 没有设置 field 或者 fields",
      {},
    );

    consoleSpy.mockRestore();
  });
});
