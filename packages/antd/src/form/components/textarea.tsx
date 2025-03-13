import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Textarea, TextAreaProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnTextarea<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 文本域
   */
  type: "textarea";
  props?: Refs<TextAreaProps>;
}

export default defineFormItem<FtFormColumnTextarea<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    const placeholder = `请输入${formItemProps.value.label}`;

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
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
