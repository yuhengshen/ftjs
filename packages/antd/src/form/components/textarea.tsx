import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Textarea, TextAreaProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";
import { AntdColumnBase } from "../register";

export interface TfFormColumnTextarea<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 文本域
   */
  type: "textarea";
  props?: Refs<TextAreaProps>;
}

export default defineFormComponent<TfFormColumnTextarea<any>>(props => {
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
          <Textarea
            v-model:value={valueComputed.value}
            allowClear
            showCount
            placeholder={placeholder}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
