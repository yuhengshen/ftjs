import { Refs, useFormItem } from "@ftjs/core";
import {
  FormItem,
  DateRangePickerProps,
  DateRangePicker,
} from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnDateRangePicker<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 日期范围选择器
   */
  type: "date-range-picker";
  props?: Refs<DateRangePickerProps>;
}

export default defineFormItem<FtFormColumnDateRangePicker<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>
            {valueComputed.value ? valueComputed.value.join(" ~ ") : "-"}
          </div>
        ) : (
          <DateRangePicker
            v-model:value={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
