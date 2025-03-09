import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Switch, SwitchProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";

export interface FtFormColumnSwitch<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 开关
   */
  type: "switch";
  props?: Refs<SwitchProps>;
}

export default defineFormComponent<FtFormColumnSwitch<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Switch v-model:checked={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
