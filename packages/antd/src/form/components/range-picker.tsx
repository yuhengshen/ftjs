import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, RangePicker } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { RangePickerProps } from "ant-design-vue/es/date-picker";
import dayjs from "dayjs";
import { AntdColumnBase } from "../register";

export interface FtFormColumnRangePicker<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 范围选择器
   */
  type: "range-picker";
  props?: Refs<RangePickerProps>;
}

export default defineFormComponent<FtFormColumnRangePicker<any>>(props => {
  const { valueComputed } = useFormItem({
    props,
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
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          <RangePicker v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
