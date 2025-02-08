import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormCommonComponent,
} from "@tf/core";
import { FormItem, Input, InputProps } from "ant-design-vue";

export interface TfFormColumnInput<T> extends TfFormColumnBase<T> {
  /** 输入框 */
  type: "input";
  props?: Refs<InputProps>;
}

const com = defineFormComponent<"input">((props) => {
  const { valueComputed } = useFormCommonComponent({
    column: props.column,
    isView: props.isView,
  });

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem label={props.column.title} name={props.column.field}>
        <Input v-model:value={valueComputed.value} {..._props} />
      </FormItem>
    )
  };
});

export default com;