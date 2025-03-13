import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Input, InputProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnInput<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 输入框
   */
  type: "input";
  props?: Refs<InputProps>;
}

export default defineFormItem<FtFormColumnInput<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    const placeholder = `请输入${formItemProps.value.label}`;

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
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
