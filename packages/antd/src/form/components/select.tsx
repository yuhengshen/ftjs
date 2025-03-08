import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Select, SelectProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { computed, toValue, unref } from "vue";
import { AntdColumnBase } from "../register";

export interface FtFormColumnSelect<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 选择器
   */
  type: "select";
  props?: Refs<SelectProps>;
}

export default defineFormComponent<FtFormColumnSelect<any>>(props => {
  const { valueComputed, isView } = useFormItem({
    props,
  });

  const formItemProps = useFormItemProps(props.column);

  const placeholder = computed(() => {
    return `请选择${formItemProps.value.label}`;
  });

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
        {toValue(isView.value) ? (
          <div>{isViewText.value}</div>
        ) : (
          <Select
            v-model:value={valueComputed.value}
            placeholder={placeholder.value}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
