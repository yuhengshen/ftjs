import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormItem,
} from "tf-core";
import { FormItem, DatePicker, DatePickerProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";

export interface TfFormColumnDatePicker<T> extends TfFormColumnBase<T> {
  /** 日期选择器 */
  type: "date-picker";
  props?: Refs<DatePickerProps>;
}

export default defineFormComponent<"date-picker">(props => {
  const { valueComputed, isView } = useFormItem({ props });

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
          // @ts-expect-error antd date picker onChange 类型不兼容
          <DatePicker v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
