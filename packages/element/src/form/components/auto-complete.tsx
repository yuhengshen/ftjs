import { Refs, useFormItem, useLocale } from "@ftjs/core";
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
  const locale = useLocale();

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value || "-"}</div>
        ) : (
          <ElAutocomplete
            v-model={valueComputed.value}
            placeholder={locale.value.placeholder.input(
              formItemProps.value.label,
            )}
            {...props.unrefsProps}
            onInput={() => {}}
          />
        )}
      </ElFormItem>
    );
  };
});
