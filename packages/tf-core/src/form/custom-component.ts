import { Component, defineComponent, h, MaybeRefOrGetter } from "vue";
import { defineFormComponent } from "./define-component";
import { TfFormColumnBase } from "./columns";
import { useFormItem } from "./use-form-item";

export interface TfFormColumnCustomProps<T> {
  modelValue: any;
  column: TfFormColumnCustom<T>;
  isView: MaybeRefOrGetter<boolean>;
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
  const { valueComputed, isView } = useFormItem({
    props,
  });
  const render = props.column.props.render;
  return () => {
    return h(render, {
      modelValue: valueComputed.value,
      column: props.column,
      isView: isView.value,
      "onUpdate:modelValue": (v: any) => (valueComputed.value = v),
    });
  };
});
