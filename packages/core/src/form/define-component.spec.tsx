import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  h,
  Component,
  toValue,
  ref,
  nextTick,
  Ref,
  defineComponent,
} from "vue";
import { mount } from "@vue/test-utils";
import { defineFtForm, defineFormComponent } from "./define-component";
import { useFormItem } from "./use-form-item";
import { unrefs } from "../utils";
import { FormInject, useFormInject } from "./use-form";

const renderMap = new Map<string, Component>();

const clickInputValue = "点击了";

renderMap.set(
  "input",
  defineFormComponent<any>(props => {
    const { valueComputed } = useFormItem({ props });

    return () => {
      return (
        <div
          class="mock-input"
          data-view={JSON.stringify(props.isView)}
          data-value={valueComputed.value}
          data-title={toValue(props.column.title)}
          onClick={() => {
            valueComputed.value = clickInputValue;
          }}
        >
          {valueComputed.value}
        </div>
      );
    };
  }),
);
renderMap.set(
  "select",
  defineFormComponent<any>(props => {
    const { valueComputed } = useFormItem({ props });

    return () => {
      const _props = unrefs(props.column.props);

      const text = props.isView
        ? _props.options.find(e => e.value === valueComputed.value)?.label
        : valueComputed.value;

      return (
        <div
          class="mock-select"
          data-title={toValue(props.column.title)}
          data-view={JSON.stringify(props.isView)}
          data-value={valueComputed.value}
        >
          {text}
        </div>
      );
    };
  }),
);

const isView = ref(false);

interface FormData {
  name?: string;
  gender?: number;
  notExist?: string;
}

// 没有声明这些 type 的 column 类型，使用 any
const columns: any[] = [
  {
    type: "input",
    field: "name",
    title: "姓名",
  },
  {
    type: "select",
    field: "gender",
    title: "性别",
    value: 1,
    props: {
      options: [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ],
    },
    isView,
  },
  {
    type: "not-exist",
    field: "not-exist",
    title: "不存在",
  },
];

interface CreateFormComponentOptions {
  formData?: Ref<FormData>;
  FormComponent?: Component;
}

function createFormComponent({
  formData,
  FormComponent,
}: CreateFormComponentOptions = {}) {
  let injectValue: FormInject<any, any>;
  FormComponent ??= defineFtForm(
    (_, ctx) => {
      injectValue = useFormInject()!;
      return () =>
        h("div", { class: "mock-form-container" }, ctx.slots.formContent?.());
    },
    renderMap,
    [],
  );

  const App = defineComponent(() => {
    return () =>
      h(FormComponent, {
        columns,
        formData: formData?.value,
        "onUpdate:formData": (v: FormData) => {
          if (formData) {
            formData.value = v;
          }
        },
      });
  });

  const wrapper = mount(App);

  const input = wrapper.find(".mock-input");

  const select = wrapper.find(".mock-select");

  function getInputValue() {
    const input = wrapper.find(".mock-input");
    expect(input.exists()).toBe(true);
    const inputValue = input.attributes()["data-value"];
    return inputValue;
  }

  return {
    FormComponent,
    getInputValue,
    input,
    select,
    injectValue: injectValue!,
    wrapper,
  };
}

describe("defineFtForm", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockClear();
  });

  it("应该创建一个可以处理默认值的表单组件，不存在的类型会产生警告", () => {
    const formData = ref<FormData>({
      name: "测试",
    });

    // 挂载组件
    const { wrapper, input, select, getInputValue } = createFormComponent({
      formData,
    });

    expect(wrapper.html()).toContain("mock-form-container");
    expect(input.exists()).toBe(true);
    // 默认值生效 formData
    expect(getInputValue()).toBe("测试");

    expect(select.exists()).toBe(true);
    const selectValue = select.attributes()["data-value"];
    // 默认值生效 column
    expect(selectValue).toBe("1");
    const selectView = select.attributes()["data-view"];
    expect(selectView).toBe("false");

    // warn
    expect(warn).toHaveBeenCalledOnce();
  });

  it("isView 计算属性应该是响应式的", async () => {
    const { select } = createFormComponent();

    expect(select.attributes()["data-view"]).toBe("false");
    expect(select.text()).toBe("1");
    isView.value = true;
    await nextTick();

    expect(select.attributes()["data-view"]).toBe("true");
    expect(select.text()).toBe("男");
  });

  it("应该正确处理 runtimeProps ", () => {
    let injectValue: any;

    const FormComponentWithRuntimeProps = defineFtForm(
      (_, ctx) => {
        injectValue = useFormInject()!;

        return () =>
          h("div", { class: "mock-form-container" }, ctx.slots.formContent?.());
      },
      renderMap,
      // @ts-expect-error 测试未定义具体类型
      [
        "runtimeProp",
        ["runtimePropWithDefaultValue", { type: Boolean, default: true }],
      ],
    );

    mount(FormComponentWithRuntimeProps, {
      props: {
        columns,
        runtimeProp: "runtime-prop-value",
        notDefinedRuntimeProp: "not-defined-runtime-prop-value",
      },
    });

    expect(injectValue.runtimeProp.value).toBe("runtime-prop-value");
    // 默认值生效
    expect(injectValue.runtimePropWithDefaultValue.value).toBe(true);
    // 未声明的 runtimeProp 不会出现在 injectValue 中
    expect(injectValue.notDefinedRuntimeProp).not.toBeDefined();
  });

  it("formData 支持响应变更，重置，设置&恢复默认值", async () => {
    const formData = ref<FormData>({
      name: "测试",
    });

    const { injectValue, getInputValue, input } = createFormComponent({
      formData,
    });

    expect(getInputValue()).toBe("测试");

    input.trigger("click");
    expect(formData.value.name).toBe(clickInputValue);

    // 修改 formData 的值
    let v = "修改 formData 的值";
    formData.value.name = v;
    await nextTick();
    expect(getInputValue()).toBe(v);
    // 重置 column 默认值
    await injectValue.resetToDefault();
    expect(formData.value).toEqual({ gender: 1 });
    expect(getInputValue()).toBeUndefined();
    // 设置默认值
    v = "设置默认值";
    injectValue.setAsDefault({ name: v });
    expect(formData.value).not.toEqual({ name: v });
    await injectValue.resetToDefault();
    expect(formData.value).toEqual({ name: v });
    expect(getInputValue()).toBe(v);
  });
});
