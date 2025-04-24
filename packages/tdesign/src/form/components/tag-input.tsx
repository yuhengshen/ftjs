import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, Tag, TagInput, TagInputProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { isViewOptionsStyle } from "../style";

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
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div style={isViewOptionsStyle}>
            {valueComputed.value?.map(str => {
              return <Tag {...props.unrefsProps?.tagProps}>{str}</Tag>;
            }) || "-"}
          </div>
        ) : (
          <TagInput
            v-model:value={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
