import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, DatePicker, DatePickerProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";
export interface FtFormColumnDatePicker<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 日期选择器
   */
  type: "date-picker";
  props?: Refs<DatePickerProps>;
}

export default defineFormComponent<FtFormColumnDatePicker<any>>(props => {
  const { valueComputed } = useFormItem<any, "antd">({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = {
      valueFormat: "YYYY-MM-DD",
      ...unrefs(props.column.props),
    };

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          // @ts-expect-error 类型推断错误
          <DatePicker v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
