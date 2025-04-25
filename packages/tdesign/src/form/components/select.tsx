import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, Select, SelectProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { viewRenderOptions } from "../utils";

export interface FtFormColumnSelect<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 选择器
   */
  type: "select";
  props?: Refs<SelectProps>;
}

export default defineFormItem<FtFormColumnSelect<any>>(props => {
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
            keys: props.unrefsProps?.keys,
            multiple: props.unrefsProps?.multiple,
          })
        ) : (
          // @ts-expect-error 库类型错误
          <Select v-model:value={valueComputed.value} {...props.unrefsProps} />
        )}
      </FormItem>
    );
  };
});
