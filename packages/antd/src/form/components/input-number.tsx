import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, InputNumber, InputNumberProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";
import { AntdColumnBase } from "../register";

export interface FtFormColumnInputNumber<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 输入框
   */
  type: "input-number";
  props?: Refs<InputNumberProps>;
}

export default defineFormComponent<FtFormColumnInputNumber<any>>(props => {
  const { valueComputed, isView } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {toValue(isView.value) ? (
          <div>{valueComputed.value}</div>
        ) : (
          <InputNumber
            v-model:value={valueComputed.value}
            placeholder={`请输入${formItemProps.value.label}`}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
