import { Refs, useFormItem } from "@ftjs/core";
import { FormItem, Switch, SwitchProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { h } from "vue";

export interface FtFormColumnSwitch<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 开关
   */
  type: "switch";
  props?: Refs<SwitchProps>;
}

export default defineFormItem<FtFormColumnSwitch<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const label = props.unrefsProps?.label || ["开", "关"];
    const viewRender = () => {
      if (Array.isArray(label)) {
        return valueComputed.value ? label[0] : label[1];
      }
      if (typeof label === "function") {
        return label(h, {
          value: valueComputed.value,
        });
      }
      return valueComputed.value;
    };
    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{viewRender()}</div>
        ) : (
          <Switch v-model:value={valueComputed.value} {...props.unrefsProps} />
        )}
      </FormItem>
    );
  };
});
