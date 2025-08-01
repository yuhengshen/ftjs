import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElAutocomplete } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ExtractEventsFromProps } from "../../type";
import { ComponentProps } from "vue-component-type-helpers";

type AutocompleteProps = ComponentProps<typeof ElAutocomplete>;
export interface FtFormColumnAutoComplete<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 自动补全
   */
  type: "auto-complete";
  props?: Refs<AutocompleteProps> & ExtractEventsFromProps<AutocompleteProps>;
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
            onInput={() => {}}
          />
        )}
      </ElFormItem>
    );
  };
});
