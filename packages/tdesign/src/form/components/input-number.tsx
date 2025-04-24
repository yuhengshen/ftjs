import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, InputNumber, InputNumberProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnInputNumber<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 数字输入框
   */
  type: "input-number";
  props?: Refs<InputNumberProps>;
}

export default defineFormItem<FtFormColumnInputNumber<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          <InputNumber
            v-model:value={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
