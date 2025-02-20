import { defineFormComponent, Refs, unrefs, useFormItem } from "tf-core";
import { FormItem, DatePicker, DatePickerProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";
import { AntdColumnBase } from "../register";
export interface TfFormColumnDatePicker<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  props?: Refs<DatePickerProps>;
}

export default defineFormComponent<TfFormColumnDatePicker<any>>(props => {
  const { valueComputed, isView } = useFormItem<any, "antd">({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = {
      valueFormat: "YYYY-MM-DD",
      ...unrefs(props.column.props),
    };

    return (
      <FormItem {...formItemProps.value}>
        {toValue(isView.value) ? (
          <div>{valueComputed.value}</div>
        ) : (
          // @ts-expect-error 类型推断错误
          <DatePicker v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
