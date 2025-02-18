import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormItem,
} from "tf-core";
import { FormItem, Textarea, TextAreaProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";

export interface TfFormColumnTextarea<T> extends TfFormColumnBase<T> {
  /** 输入框 */
  type: "textarea";
  props?: Refs<TextAreaProps>;
}

export default defineFormComponent<"textarea">(props => {
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
