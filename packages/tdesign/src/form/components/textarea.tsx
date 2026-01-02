import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { FormItem, Textarea, TextareaProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnTextarea<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 开关
   */
  type: "textarea";
  props?: Refs<TextareaProps>;
}

export default defineFormItem<FtFormColumnTextarea<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  return () => {
    const viewRender = () => {
      return valueComputed.value ?? "-";
    };
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{viewRender()}</div>
        ) : (
          <Textarea
            v-model:value={valueComputed.value}
            placeholder={locale.value.placeholder.input(
              formItemProps.value.label,
            )}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
