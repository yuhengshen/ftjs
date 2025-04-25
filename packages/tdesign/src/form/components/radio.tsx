import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, RadioGroup, RadioGroupProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { viewRenderOptions } from "../utils";

export interface FtFormColumnRadio<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 单选框
   */
  type: "radio";
  props?: Refs<RadioGroupProps>;
}

export default defineFormItem<FtFormColumnRadio<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          viewRenderOptions({
            options: props.unrefsProps?.options,
            value: valueComputed.value,
            multiple: false,
          })
        ) : (
          <RadioGroup
            v-model:value={valueComputed.value}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
