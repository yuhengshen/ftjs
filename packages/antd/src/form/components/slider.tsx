import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Slider, SliderProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnSlider<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 滑块
   */
  type: "slider";
  props?: Refs<SliderProps>;
}

export default defineFormItem<FtFormColumnSlider<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Slider v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
