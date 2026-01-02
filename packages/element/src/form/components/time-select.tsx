import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { ElFormItem, ElTimeSelect } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type TimeSelectProps = ComponentProps<typeof ElTimeSelect>;
export interface FtFormColumnTimeSelect<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 时间选择
   */
  type: "time-select";
  props?: Refs<TimeSelectProps> & ExtractEventsFromProps<TimeSelectProps>;
}

export default defineFormItem<FtFormColumnTimeSelect<any>>(props => {
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
          <ElTimeSelect
            v-model={valueComputed.value}
            placeholder={locale.value.placeholder.select()}
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
