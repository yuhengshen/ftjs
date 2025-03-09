import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, AutoComplete, AutoCompleteProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";

export interface FtFormColumnAutoComplete<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 自动补全
   */
  type: "auto-complete";
  props?: Refs<AutoCompleteProps>;
}

export default defineFormComponent<FtFormColumnAutoComplete<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    const placeholder = `请输入${formItemProps.value.label}`;

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          <AutoComplete
            v-model:value={valueComputed.value}
            placeholder={placeholder}
            allowClear
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
