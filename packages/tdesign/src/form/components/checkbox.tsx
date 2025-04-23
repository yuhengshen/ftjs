import { Refs, unrefs, useFormItem } from "@ftjs/core";
import {
  FormItem,
  CheckboxGroup,
  CheckboxGroupProps,
  CheckboxOption,
} from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { isViewOptionsStyle } from "../style";

export interface FtFormColumnCheckbox<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 多选框
   */
  type: "checkbox";
  props?: Refs<CheckboxGroupProps>;
}

function isSimpleOption(option: CheckboxOption): option is string | number {
  return typeof option === "string" || typeof option === "number";
}

export default defineFormItem<FtFormColumnCheckbox<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);
    const options = _props?.options || [];

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
          <CheckboxGroup v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
