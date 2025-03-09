import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Cascader, CascaderProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";

export interface FtFormColumnCascader<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 级联选择器
   */
  type: "cascader";
  props?: Refs<CascaderProps>;
}

export default defineFormComponent<FtFormColumnCascader<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    const placeholder = `请选择${formItemProps.value.label}`;

    // todo:: isView 模式

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Cascader
            v-model:value={valueComputed.value}
            placeholder={placeholder}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
