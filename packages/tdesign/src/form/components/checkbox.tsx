import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, CheckboxGroup, CheckboxGroupProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { viewRenderOptions } from "../utils";

export interface FtFormColumnCheckbox<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 多选框
   */
  type: "checkbox";
  props?: Refs<CheckboxGroupProps>;
}

export default defineFormItem<FtFormColumnCheckbox<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const options = props.unrefsProps?.options || [];

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          viewRenderOptions({
            options,
            value: valueComputed.value,
            multiple: true,
          })
        ) : (
          <CheckboxGroup
            v-model:value={valueComputed.value}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
