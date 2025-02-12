import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormItem,
} from "@tf/core";
import { FormItem, Input, InputProps } from "ant-design-vue";
import { useFormItemProps } from "./composables";

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

    return (
      <FormItem {...formItemProps.value}>
        <Input v-model:value={valueComputed.value} {..._props} />
      </FormItem>
    );
  };
});
