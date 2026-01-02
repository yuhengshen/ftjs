import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { ElFormItem, ElDatePicker, CommonPicker } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type DatePickerProps = ComponentProps<typeof ElDatePicker>;

type CommonProps = ComponentProps<typeof CommonPicker>;
export interface FtFormColumnDatePicker<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 日期选择器
   */
  type: "date-picker";
  props?: Refs<DatePickerProps> & ExtractEventsFromProps<CommonProps>;
}

export default defineFormItem<FtFormColumnDatePicker<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  const renderText = () => {
    if (Array.isArray(valueComputed.value)) {
      return valueComputed.value.join(" ~ ");
    }
    return valueComputed.value ?? "-";
  };

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderText()
        ) : (
          <ElDatePicker
            v-model={valueComputed.value}
            placeholder={locale.value.placeholder.select()}
            startPlaceholder={locale.value.datePicker.startTime}
            endPlaceholder={locale.value.datePicker.endTime}
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
