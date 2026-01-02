import { Refs, unrefs, useFormItem, useLocale } from "@ftjs/core";
import { FormItem, AutoComplete, AutoCompleteProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnAutoComplete<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 自动补全
   */
  type: "auto-complete";
  props?: Refs<AutoCompleteProps>;
}

export default defineFormItem<FtFormColumnAutoComplete<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          <AutoComplete
            v-model:value={valueComputed.value}
            placeholder={locale.value.placeholder.input(
              formItemProps.value.label,
            )}
            allowClear
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
