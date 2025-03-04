import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Slider, SliderProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";
import { AntdColumnBase } from "../register";

export interface TfFormColumnSlider<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 滑块
   */
  type: "slider";
  props?: Refs<SliderProps>;
}

export default defineFormComponent<TfFormColumnSlider<any>>(props => {
  const { valueComputed, isView } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {toValue(isView.value) ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Slider v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
