import { Refs, unrefs, useFormItem, useLocale } from "@ftjs/core";
import { FormItem, InputNumber, InputNumberProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnInputNumber<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 输入框
   */
  type: "input-number";
  props?: Refs<InputNumberProps>;
}

export default defineFormItem<FtFormColumnInputNumber<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          <InputNumber
            v-model:value={valueComputed.value}
            placeholder={locale.value.placeholder.input(
              formItemProps.value.label,
            )}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
