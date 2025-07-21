import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElSwitch } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type SwitchProps = ComponentProps<typeof ElSwitch>;
export interface FtFormColumnSwitch<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 开关
   */
  type: "switch";
  props?: Refs<SwitchProps> & ExtractEventsFromProps<SwitchProps>;
}

export default defineFormItem<FtFormColumnSwitch<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const renderText = () => {
    const activeText = props.unrefsProps?.activeText ?? "是";
    const inactiveText = props.unrefsProps?.inactiveText ?? "否";

    return valueComputed.value ? activeText : inactiveText;
  };

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderText()
        ) : (
          <ElSwitch v-model={valueComputed.value} {...props.unrefsProps} />
        )}
      </ElFormItem>
    );
  };
});
