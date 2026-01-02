import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { ElFormItem, ElInput } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type InputProps = ComponentProps<typeof ElInput>;
export interface FtFormColumnInput<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 输入框
   */
  type: "input";
  props?: Refs<InputProps> & ExtractEventsFromProps<InputProps>;
}

export default defineFormItem<FtFormColumnInput<any>>(props => {
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
          <ElInput
            v-model={valueComputed.value}
            placeholder={locale.value.placeholder.input()}
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
