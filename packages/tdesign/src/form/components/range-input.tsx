import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, RangeInput, RangeInputProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { isViewOptionsStyle } from "../style";

export interface FtFormColumnRangeInput<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 范围输入框
   */
  type: "range-input";
  props?: Refs<RangeInputProps>;
}

export default defineFormItem<FtFormColumnRangeInput<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div style={isViewOptionsStyle}>
            {valueComputed.value?.join(" ~ ") || "-"}
          </div>
        ) : (
          <RangeInput
            v-model:value={valueComputed.value}
            {...props.unrefsProps}
          />
        )}
      </FormItem>
    );
  };
});
