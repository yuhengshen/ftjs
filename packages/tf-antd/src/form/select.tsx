import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormCommonComponent,
} from "@tf/core";
import { FormItem, Select, SelectProps } from "ant-design-vue";


export interface TfFormColumnSelect<T> extends TfFormColumnBase<T> {
  /** 选择框 */
  type: "select";
  props?: Refs<SelectProps>;
}

export default defineFormComponent<"select">((props) => {
  const { valueComputed } = useFormCommonComponent({
    column: props.column,
    isView: props.isView,
  });

  const _props = unrefs(props.column.props);

  return () => (
    <FormItem label={props.column.title} name={props.column.field}>
      <Select v-model:value={valueComputed.value} {..._props} />
    </FormItem>
  );
});