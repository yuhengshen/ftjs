import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormCommonComponent,
} from "@tf/core";
import { FormItem, Select, SelectProps } from "ant-design-vue";
import { useFormItemProps } from "./composables";

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

  const formItemProps = useFormItemProps(props.column);


  return () => {
    const _props = unrefs(props.column.props);
    return (
      <FormItem {...formItemProps.value}>
        <Select v-model:value={valueComputed.value} {..._props} />
      </FormItem>
    );

  };
});
