import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { ElFormItem, ElTimePicker } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type TimePickerProps = ComponentProps<typeof ElTimePicker>;
export interface FtFormColumnTimePicker<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 时间选择器
   */
  type: "time-picker";
  props?: Refs<TimePickerProps> & ExtractEventsFromProps<TimePickerProps>;
}

export default defineFormItem<FtFormColumnTimePicker<any>>(props => {
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
          <ElTimePicker
            v-model={valueComputed.value}
            placeholder={locale.value.placeholder.select()}
            valueFormat="HH:mm:ss"
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
