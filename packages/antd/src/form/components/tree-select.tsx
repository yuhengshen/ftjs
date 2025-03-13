import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, TreeSelect, TreeSelectProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem } from "../register";
import { computed, toValue } from "vue";
import { isViewOptionsStyle } from "../style";

export interface FtFormColumnTreeSelect<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 树选择
   */
  type: "tree-select";
  props?: Refs<TreeSelectProps>;
}

export default defineFormItem<FtFormColumnTreeSelect<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const isViewText = computed(() => {
    if (props.isView && valueComputed.value) {
      const vNodes: any[] = [];
      const isMultiple = toValue(props.column.props?.multiple);
      const options = toValue(props.column.props?.treeData) || [];
      const traverse = (options: any[], values: string[]) => {
        if (vNodes.length === values.length) {
          return;
        }
        for (const option of options) {
          if (values.includes(option.value)) {
            vNodes.push(<span>{option.label}</span>);
          }
          if (option.children) {
            traverse(option.children, values);
          }
        }
      };
      traverse(
        options,
        isMultiple ? valueComputed.value : [valueComputed.value],
      );
      return vNodes;
    }
    return ["-"];
  });

  return () => {
    const _props = unrefs(props.column.props);

    const placeholder = `请输入${formItemProps.value.label}`;

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div style={isViewOptionsStyle}>{isViewText.value}</div>
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
