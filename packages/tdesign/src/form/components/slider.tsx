import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, Slider, SliderProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnSlider<T extends Record<string, any>>
  extends TdColumnBase<T> {
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
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value ?? "-"}</div>
        ) : (
          <Slider v-model:value={valueComputed.value} {...props.unrefsProps} />
        )}
      </FormItem>
    );
  };
});
