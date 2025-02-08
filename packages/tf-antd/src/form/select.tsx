import {
  defineFormComponent,
  TfFormColumnBase,
  useFormCommonComponent,
} from "@tf/core";
import { FormItem, Select, SelectProps } from "ant-design-vue";


export interface TfFormColumnSelect<T> extends TfFormColumnBase<T> {
  /** 选择框 */
  type: "select";
  props?: SelectProps;
}

export default defineFormComponent<"select">((props) => {
  const { valueComputed } = useFormCommonComponent({
    column: props.column,
    isView: props.isView,
  });

  return () => (
    <FormItem label={props.column.title} name={props.column.field}>
      <Select v-model:value={valueComputed.value} {...props.column.props} />
    </FormItem>
  );
});