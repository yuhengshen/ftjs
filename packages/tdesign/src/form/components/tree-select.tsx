import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, TreeSelect, TreeSelectProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { viewRenderOptions } from "../utils";

export interface FtFormColumnTreeSelect<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 树选择
   */
  type: "tree-select";
  props?: Refs<TreeSelectProps>;
}

export default defineFormItem<FtFormColumnTreeSelect<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const viewRender = () => {
      return viewRenderOptions({
        options: props.unrefsProps?.data,
        keys: props.unrefsProps?.keys,
        multiple: props.unrefsProps?.multiple,
        value: valueComputed.value,
        withChildren: true,
      });
    };
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{viewRender()}</div>
        ) : (
          // @ts-expect-error 类型错误
          <TreeSelect
            v-model:value={valueComputed.value}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
