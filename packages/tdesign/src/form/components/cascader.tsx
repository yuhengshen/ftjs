import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Cascader, CascaderProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnCascader<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 级联选择
   */
  type: "cascader";
  props?: Refs<CascaderProps>;
}

export default defineFormItem<FtFormColumnCascader<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          // @ts-expect-error Type 'TdSelectInputProps | SelectInputValue | undefined' is not assignable to type 'TdSelectInputProps | undefined'.
          <Cascader
            v-model:value={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
