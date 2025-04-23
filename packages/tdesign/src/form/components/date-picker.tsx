import { Refs, unrefs, useFormItem } from "@ftjs/core";
import {
  FormItem,
  DatePicker,
  DatePickerProps,
  SelectInputProps,
} from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnDatePicker<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 日期选择器
   */
  type: "date-picker";
  props?: Refs<DatePickerProps>;
}

export default defineFormItem<FtFormColumnDatePicker<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    // 内部类型不兼容
    const _props = unrefs(props.column.props) as Omit<
      DatePickerProps,
      "selectInputProps"
    > & {
      selectInputProps?: SelectInputProps;
    };

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          <DatePicker
            v-model:value={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
