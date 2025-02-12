import { Component, defineComponent, h } from "vue";
import { defineFormComponent } from "./tf-form";
import { TfFormColumnBase } from "./types";
import { useFormItem } from "./use-form-item";

export interface TfFormColumnCustomProps<T> {
  modelValue: any;
  column: TfFormColumnCustom<T>;
  isView: boolean;
  "onUpdate:modelValue": (v: any) => void;
}
export interface TfFormColumnCustom<T> extends TfFormColumnBase<T> {
  /**
   * 自定义渲染
   */
  type: "custom";
  props: {
    render: Component<TfFormColumnCustomProps<T>>;
  };
}

/**
 * 定义自定义组件的 render 属性
 */
export const defineCustomRender = <T>(
  setup: (props: TfFormColumnCustomProps<T>) => any,
) => {
  return defineComponent(setup, {
    inheritAttrs: false,
    props: ["modelValue", "column", "isView", "onUpdate:modelValue"] as any,
  });
};

export const CustomComponent = defineFormComponent<"custom">(props => {
  const { valueComputed } = useFormItem({
    column: props.column,
  });
  const render = props.column.props.render;
  return () => {
    return h(render, {
      modelValue: valueComputed.value,
      column: props.column,
      isView: props.isView,
      "onUpdate:modelValue": (v: any) => (valueComputed.value = v),
    });
  };
});
