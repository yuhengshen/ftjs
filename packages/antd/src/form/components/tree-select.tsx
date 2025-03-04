import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, TreeSelect, TreeSelectProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";
import { AntdColumnBase } from "../register";

export interface FtFormColumnTreeSelect<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 树选择
   */
  type: "tree-select";
  props?: Refs<TreeSelectProps>;
}

export default defineFormComponent<FtFormColumnTreeSelect<any>>(props => {
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
          <TreeSelect
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
