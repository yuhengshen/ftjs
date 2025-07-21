import { Refs, useFormItem } from "@ftjs/core";
import {
  ElFormItem,
  ElRadioGroup,
  RadioPropsPublic,
  ElRadio,
  ElRadioButton,
} from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type RadioProps = ComponentProps<typeof ElRadioGroup>;
export interface FtFormColumnRadio<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 单选框
   */
  type: "radio";
  props: Refs<
    RadioProps & {
      /**
       * 单选框类型
       *
       * @default "default"
       */
      type?: "default" | "button";
      options: Pick<
        RadioPropsPublic,
        "label" | "value" | "disabled" | "border" | "size" | "name"
      >[];
    }
  > &
    ExtractEventsFromProps<RadioProps>;
}

export default defineFormItem<FtFormColumnRadio<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const renderText = () => {
    if (!valueComputed.value) {
      return "-";
    }

    const option = props.unrefsProps.options.find(
      option => option.value === valueComputed.value,
    );
    if (!option) {
      return "-";
    }

    return option.label ?? option.value;
  };

  return () => {
    const C = props.unrefsProps.type === "button" ? ElRadioButton : ElRadio;

    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderText()
        ) : (
          <ElRadioGroup v-model={valueComputed.value} {...props.unrefsProps}>
            {props.unrefsProps.options.map((option, index) => (
              <C key={index} {...option}>
                {option.label}
              </C>
            ))}
          </ElRadioGroup>
        )}
      </ElFormItem>
    );
  };
});
