import { describe, expect, it } from "vitest";
import { defineFormComponent, defineFormContainerComponent } from "./tf-form";
import { TfFormColumnBase } from "./types";
import { h } from "vue";
import { mount } from "@vue/test-utils";
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
  const Test = defineFormContainerComponent(props => {
    return () =>
      h(
        "div",
        `${props.columns.length} ${props.visibleColumns.length} ${props.formProps?.foo}`,
      );
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

  it("it should define a vue component with correct props", () => {
    expect(wrapper.html()).toBe("<div>0 0 bar</div>");
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
