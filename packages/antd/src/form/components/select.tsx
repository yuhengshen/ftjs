import { Refs, unrefs, useFormItem, useLocale } from "@ftjs/core";
import { FormItem, Select, SelectProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { computed, unref } from "vue";
import { AntdColumnBase, defineFormItem } from "../register";
import { isViewOptionsStyle } from "../style";

export interface FtFormColumnSelect<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 选择器
   */
  type: "select";
  props?: Refs<SelectProps>;
}

export default defineFormItem<FtFormColumnSelect<any>>(props => {
  const { valueComputed } = useFormItem({
    props,
  });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  const placeholder = computed(() => {
    return locale.value.placeholder.select(formItemProps.value.label);
  });

  const isViewTextVNode = computed(() => {
    const options = unref(props.column.props?.options);
    const isMultiple = props.column.props?.mode === "multiple";
    const arr = isMultiple ? valueComputed.value : [valueComputed.value];
    if (options) {
      return arr
        .map((e: any) => {
          const option = options.find(o => o.value === e);
          return <span>{option?.label}</span>;
        })
        .filter(Boolean);
    }
    return valueComputed.value;
  });

  return () => {
    const _props = unrefs(props.column.props);
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div style={isViewOptionsStyle}>{isViewTextVNode.value}</div>
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
