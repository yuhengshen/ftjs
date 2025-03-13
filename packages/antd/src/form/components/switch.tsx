import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Switch, SwitchProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem } from "../register";
import { computed } from "vue";

export interface FtFormColumnSwitch<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 开关
   */
  type: "switch";
  props?: Refs<SwitchProps>;
}

export default defineFormItem<FtFormColumnSwitch<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const isViewText = computed(() => {
    if (props.isView) {
      return valueComputed.value
        ? props.column.props?.checkedChildren || "是"
        : props.column.props?.unCheckedChildren || "否";
    }
    return "-";
  });

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{isViewText.value}</div>
        ) : (
          <Switch v-model:checked={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
