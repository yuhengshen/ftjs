import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, TimePicker, TimePickerProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnTimePicker<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 开关
   */
  type: "time-picker";
  props?: Refs<TimePickerProps>;
}

export default defineFormItem<FtFormColumnTimePicker<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const viewRender = () => {
      return valueComputed.value ?? "-";
    };
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{viewRender()}</div>
        ) : (
          // @ts-expect-error 类型错误
          <TimePicker
            v-model:value={valueComputed.value}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
