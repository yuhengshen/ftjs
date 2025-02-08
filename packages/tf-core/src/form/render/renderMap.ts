import { Component, defineComponent, h } from "vue";
import { FormContainerProps, TfFormColumn, TfFormColumnBase, TfFormRenderMap } from "../types";
import { useFormCommonComponent } from "../useFormCommonComponent";

export interface TfFormColumnCustomProps<T> {
  modelValue: any;
  column: TfFormColumnCustom<T>;
  isView: boolean;
  'onUpdate:modelValue': (v: any) => void;
}
export interface TfFormColumnCustom<T> extends TfFormColumnBase<T> {
  /**
   * 自定义渲染
   */
  type: "custom",
  props: {
    render: Component<TfFormColumnCustomProps<T>>
  }
}

const Custom = defineComponent({
  props: ['render', 'column', 'isView'],
  setup(props) {

    const valueComputed = useFormCommonComponent({
      column: props.column,
      isView: props.isView,
    });

    return () => {
      return h(props.render, {
        modelValue: valueComputed.valueComputed.value,
        column: props.column,
        isView: props.isView,
        'onUpdate:modelValue': (v: any) => valueComputed.valueComputed.value = v,
      });
    }
  }
})

/**
 * 渲染组件集合
 */
export const renderMap = {
  // 唯一内置核心的自定义渲染
  custom: Custom,
} as TfFormRenderMap;


export interface FormComponentProps<T = Record<string, any>> {
  columns: TfFormColumn<T>[];
  formData: T;
  formProps?: FormContainerProps;
  onSubmit?: () => Promise<void> | void
}

/**
 * 表单容器组件
 * 泛型参数
 */
export type FormComponent = Component<FormComponentProps>;

export const formRender: {
  c?: FormComponent;
} = {
  c: undefined,
}
