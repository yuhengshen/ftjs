import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormItem,
} from "tf-core";
import { FormItem, RangePicker } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";
import { RangePickerProps } from "ant-design-vue/es/date-picker";
import dayjs from "dayjs";

export interface TfFormColumnRangePicker<T> extends TfFormColumnBase<T> {
  /** 日期范围选择器 */
  type: "range-picker";
  props?: Refs<RangePickerProps>;
}

export default defineFormComponent<"range-picker">(props => {
  const { valueComputed } = useFormItem({
    column: props.column,
  });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const unrefsProps = unrefs(props.column.props) as any;
    const _props = {
      valueFormat: unrefsProps?.showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD",
      ...unrefsProps,
      showTime: unrefsProps?.showTime
        ? {
            defaultValue: [dayjs().startOf("day"), dayjs().endOf("day")],
            ...(typeof unrefsProps?.showTime === "object"
              ? unrefsProps.showTime
              : {}),
          }
        : false,
    } as any;

    return (
      <FormItem {...formItemProps.value}>
        {toValue(props.isView) ? (
          <div>{valueComputed.value}</div>
        ) : (
          <RangePicker v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
