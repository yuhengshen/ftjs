import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, AutoComplete, AutoCompleteProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnAutoComplete<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 自动补全
   */
  type: "auto-complete";
  props?: Refs<AutoCompleteProps>;
}

export default defineFormItem<FtFormColumnAutoComplete<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          <AutoComplete
            v-model:value={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
