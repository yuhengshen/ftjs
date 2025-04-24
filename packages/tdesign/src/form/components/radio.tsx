import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, RadioGroup, RadioGroupProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { isSimpleOption } from "../utils";

export interface FtFormColumnRadio<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 单选框
   */
  type: "radio";
  props?: Refs<RadioGroupProps>;
}

export default defineFormItem<FtFormColumnRadio<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const viewRender = () => {
      const options = props.unrefsProps?.options || [];
      let text = valueComputed.value ?? "-";
      for (const option of options) {
        if (isSimpleOption(option)) {
          if (option === valueComputed.value) {
            text = option;
            break;
          }
        } else {
          if (option.value === valueComputed.value) {
            text = option.label;
            break;
          }
        }
      }
      return text;
    };

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{viewRender()}</div>
        ) : (
          <RadioGroup
            v-model:value={valueComputed.value}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
