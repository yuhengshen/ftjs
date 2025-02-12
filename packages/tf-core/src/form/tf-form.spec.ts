import { describe, expect, it } from "vitest";
import { defineFormComponent, defineFormContainerComponent } from "./tf-form";
import { TfFormColumnBase } from "./types";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import { useFormInject } from "./use-form";
import { FormInject } from "./render-map";
export interface TfFormColumnTest<T> extends TfFormColumnBase<T> {
  /**
   * 自定义渲染
   */
  type: "test";
  props?: {
    foo: string;
  };
}

declare module "./types" {
  interface TfFormColumnMap<T> {
    test: TfFormColumnTest<T>;
  }

  interface FormContainerProps {
    foo: string;
  }
}

describe("defineFormContainerComponent", () => {
  let inject: FormInject<any>;
  const Test = defineFormContainerComponent(props => {
    inject = useFormInject()!;

    return () => h("div", `${props}`);
  });

  const wrapper = mount(Test, {
    props: {
      columns: [],
      formProps: {
        foo: "bar",
      },
      onSubmit: () => {},
      "onUpdate:formData": () => {},
    },
  });

  it("it should inject correct properties", () => {
    expect(inject).toBeDefined();
    const injectProperties = [
      "form",
      "columnsChecked",
      "columnsSort",
      "columns",
      "visibleColumns",
      "formProps",
      "onSubmit",
      "getFormData",
      "resetToDefault",
      "setAsDefault",
    ] as const;
    for (const property of injectProperties) {
      expect(inject[property]).toBeDefined();
    }

    expect(inject.formProps.value).toEqual({
      foo: "bar",
    });
  });

  it("it should expose correct methods", () => {
    expect(wrapper.vm.getFormData).toBeDefined();
    expect(wrapper.vm.resetToDefault).toBeDefined();
    expect(wrapper.vm.setAsDefault).toBeDefined();
  });
});

describe("defineFormComponent", () => {
  it("it should define a vue component with correct props", () => {
    const Test = defineFormComponent<"test">(props => {
      const isView = props.isView;
      const foo = props.column.props?.foo;
      return () => h("div", `${isView} ${foo}`);
    });

    const wrapper = mount(Test, {
      props: {
        column: {
          type: "test",
          props: {
            foo: "bar",
          },
        },
        isView: false,
      },
    });

    expect(wrapper.html()).toBe("<div>false bar</div>");
  });
});
