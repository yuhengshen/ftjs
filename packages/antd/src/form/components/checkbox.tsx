import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, CheckboxGroup, CheckboxGroupProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";

export interface FtFormColumnCheckbox<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 复选框
   */
  type: "checkbox";
  props?: Refs<CheckboxGroupProps>;
}

export default defineFormComponent<FtFormColumnCheckbox<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    // todo:: isView 模式

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          <CheckboxGroup v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
