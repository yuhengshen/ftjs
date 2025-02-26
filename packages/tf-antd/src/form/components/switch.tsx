import { defineFormComponent, Refs, unrefs, useFormItem } from "tf-core";
import { FormItem, Switch, SwitchProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue } from "vue";
import { AntdColumnBase } from "../register";

export interface TfFormColumnSwitch<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 开关
   */
  type: "switch";
  props?: Refs<SwitchProps>;
}

export default defineFormComponent<TfFormColumnSwitch<any>>(props => {
  const { valueComputed, isView } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {toValue(isView.value) ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Switch v-model:checked={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
