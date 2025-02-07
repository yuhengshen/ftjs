import { defineComponent, h } from "vue";
import { TfFormColumnBase, TfFormRenderMap } from "../types";
import { useFormCommonComponent } from "../useFormCommonComponent";

export interface TfFormColumnCustom<T> extends TfFormColumnBase<T> {
  /**
   * 自定义渲染
   */
  type: "custom"
}

const Custom = defineComponent({
  props: ['render', 'column', 'isView'],
  setup(props) {

    const valueComputed = useFormCommonComponent({
      _column: props.column,
      _isView: props.isView,
    });

    return () => {
      return h(props.render, {
        modelValue: valueComputed.valueComputed.value,
        column: props.column,
        onUpdateModelValue: (v: any) => valueComputed.valueComputed.value = v,
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
