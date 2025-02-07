import { Component, defineComponent, h } from "vue";
import { TfFormColumn, TfFormColumnBase, TfFormRenderMap } from "../types";
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
  props: ['render', '_column', '_isView'],
  setup(props) {

    const valueComputed = useFormCommonComponent({
      _column: props._column,
      _isView: props._isView,
    });

    return () => {
      return h(props.render, {
        modelValue: valueComputed.valueComputed.value,
        column: props._column,
        isView: props._isView,
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


/**
 * 表单容器组件
 * 泛型参数
 */
export type FormComponent = Component<{
  columns: TfFormColumn<any>[];
  formData: Record<string, any>;
}>;

export const formRender: {
  c?: FormComponent;
} = {
  c: undefined,
}
