import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, CheckboxGroup, CheckboxGroupProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { isViewOptionsStyle } from "../style";
import { isSimpleOption } from "../utils";

export interface FtFormColumnCheckbox<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 多选框
   */
  type: "checkbox";
  props?: Refs<CheckboxGroupProps>;
}

export default defineFormItem<FtFormColumnCheckbox<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const options = props.unrefsProps?.options || [];

    const viewRender = () => {
      return (
        valueComputed.value?.map(v => {
          let text = v;
          for (const option of options) {
            if (isSimpleOption(option)) {
              if (option === v) {
                text = option;
                break;
              }
            } else {
              if (option.value === v) {
                text = option.label;
                break;
              }
            }
          }
          return <span>{typeof text === "function" ? text() : text}</span>;
        }) || "-"
      );
    };

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div style={isViewOptionsStyle}>{viewRender()}</div>
        ) : (
          <CheckboxGroup
            v-model:value={valueComputed.value}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
