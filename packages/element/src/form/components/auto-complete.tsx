import { Refs, useFormItem } from "@ftjs/core";
import {
  ElFormItem,
  ElAutocomplete,
  AutocompletePropsPublic,
} from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";

export interface FtFormColumnAutoComplete<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 自动补全
   */
  type: "auto-complete";
  props?: Refs<AutocompletePropsPublic>;
}

export default defineFormItem<FtFormColumnAutoComplete<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          <ElAutocomplete
            v-model={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
