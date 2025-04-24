import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, TagInput, TagInputProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnTagInput<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 标签输入框
   */
  type: "tag-input";
  props?: Refs<TagInputProps>;
}

export default defineFormItem<FtFormColumnTagInput<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          <TagInput
            v-model:value={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
