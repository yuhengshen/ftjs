import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { ElFormItem, ElInputNumber } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type InputNumberProps = ComponentProps<typeof ElInputNumber>;
export interface FtFormColumnInputNumber<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 数字输入框
   */
  type: "input-number";
  props?: Refs<InputNumberProps> & ExtractEventsFromProps<InputNumberProps>;
}

export default defineFormItem<FtFormColumnInputNumber<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  const renderText = () => {
    return valueComputed.value ?? "-";
  };

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderText()
        ) : (
          <ElInputNumber
            v-model={valueComputed.value}
            placeholder={locale.value.placeholder.input()}
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
