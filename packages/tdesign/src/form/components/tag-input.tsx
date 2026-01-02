import { Refs, useFormItem, useLocale } from "@ftjs/core";
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
  const locale = useLocale();

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
            placeholder={locale.value.placeholder.input(
              formItemProps.value.label,
            )}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
