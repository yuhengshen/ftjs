import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormItem,
} from "tf-core";
import { FormItem, Input, InputProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";

export interface TfFormColumnInput<T> extends TfFormColumnBase<T> {
  /** 输入框 */
  type: "input";
  props?: Refs<InputProps>;
}

export default defineFormComponent<"input">(props => {
  const { valueComputed } = useFormItem({
    column: props.column,
  });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    const placeholder = `请输入${formItemProps.value.label}`;

    return (
      <FormItem {...formItemProps.value}>
        {toValue(props.isView) ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Input
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
