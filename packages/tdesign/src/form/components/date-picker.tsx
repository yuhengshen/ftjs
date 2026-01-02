import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { FormItem, DatePicker, DatePickerProps } from "tdesign-vue-next";
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
  const locale = useLocale();

  return () => {
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          // @ts-expect-error 当前版本类型bug不兼容
          <DatePicker
            v-model:value={valueComputed.value}
            placeholder={locale.value.placeholder.select(
              formItemProps.value.label,
            )}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
