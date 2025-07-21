import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElSelectV2 } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";
import { renderCascaderText } from "../utils/cascader";

type SelectProps = ComponentProps<typeof ElSelectV2>;
export interface FtFormColumnSelect<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 选择器
   */
  type: "select";
  props: Refs<SelectProps> & ExtractEventsFromProps<SelectProps>;
}

export default defineFormItem<FtFormColumnSelect<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const renderText = () => {
    return renderCascaderText({
      modelValue: valueComputed.value,
      showAllLevels: false,
      options: props.unrefsProps.options,
      props: {
        emitPath: false,
        multiple: props.unrefsProps.multiple,
      },
    });
  };

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderText()
        ) : (
          <ElSelectV2 v-model={valueComputed.value} {...props.unrefsProps} />
        )}
      </ElFormItem>
    );
  };
});
