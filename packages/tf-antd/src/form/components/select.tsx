import {
  defineFormComponent,
  Refs,
  TfFormColumnBase,
  unrefs,
  useFormItem,
} from "@tf/core";
import { FormItem, Select, SelectProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { computed, toValue, unref } from "vue";

export interface TfFormColumnSelect<T> extends TfFormColumnBase<T> {
  /** 选择框 */
  type: "select";
  props?: Refs<SelectProps>;
}

export default defineFormComponent<"select">(props => {
  const { valueComputed } = useFormItem({
    column: props.column,
  });

  const formItemProps = useFormItemProps(props.column);

  const isViewText = computed(() => {
    const options = unref(props.column.props?.options);
    const isMultiple = props.column.props?.mode === "multiple";
    const arr = isMultiple ? valueComputed.value : [valueComputed.value];
    if (options) {
      return arr
        .map((e: any) => {
          const option = options.find(o => o.value === e);
          return option?.label;
        })
        .filter(Boolean)
        .join(", ");
    }
    return valueComputed.value;
  });

  return () => {
    const _props = unrefs(props.column.props);
    return (
      <FormItem {...formItemProps.value}>
        {toValue(props.isView) ? (
          <div>{isViewText.value}</div>
        ) : (
          <Select v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
