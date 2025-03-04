import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Input, InputProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";
import { AntdColumnBase } from "../register";

export interface TfFormColumnInput<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 输入框
   */
  type: "input";
  props?: Refs<InputProps>;
}

export default defineFormComponent<TfFormColumnInput<any>>(props => {
  const { valueComputed, isView } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    const placeholder = `请输入${formItemProps.value.label}`;

    return (
      <FormItem {...formItemProps.value}>
        {toValue(isView.value) ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Input
            v-model:value={valueComputed.value}
            allowClear
            placeholder={placeholder}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
