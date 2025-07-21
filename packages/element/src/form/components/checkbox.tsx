import { Refs, useFormItem } from "@ftjs/core";
import {
  ElFormItem,
  ElCheckboxGroup,
  ElCheckbox,
  ElCheckboxButton,
  CheckboxPropsPublic,
} from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ExtractEventsFromProps } from "../../type";
import { computed } from "vue";
import { isViewOptionsStyle } from "../style";
import { ComponentProps } from "vue-component-type-helpers";

type CheckboxGroupProps = ComponentProps<typeof ElCheckboxGroup>;

export interface FtFormColumnCheckbox<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 复选框组
   */
  type: "checkbox";
  props: Refs<
    CheckboxGroupProps & {
      /**
       * checkbox 类型
       *
       * @default "default"
       */
      type?: "default" | "button";
      options: Pick<
        CheckboxPropsPublic,
        | "label"
        | "value"
        | "disabled"
        | "border"
        | "size"
        | "name"
        | "ariaControls"
      >[];
    }
  > &
    ExtractEventsFromProps<CheckboxGroupProps>;
}

export default defineFormItem<FtFormColumnCheckbox<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const type = computed(() => {
    return props.unrefsProps?.type || "default";
  });

  const renderText = () => {
    const value = valueComputed.value;
    if (!value?.length) return "-";
    let text = value.map(v => {
      const option = props.unrefsProps!.options.find(
        option => option.value === v,
      );
      return option?.label ?? v;
    });
    text = text.length > 0 ? text : ["-"];

    return (
      <div style={isViewOptionsStyle}>
        {text.map(v => (
          <span>{v}</span>
        ))}
      </div>
    );
  };

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderText()
        ) : (
          <ElCheckboxGroup v-model={valueComputed.value} {...props.unrefsProps}>
            {props.unrefsProps!.options.map(option => {
              return type.value === "default" ? (
                <ElCheckbox {...option} />
              ) : (
                <ElCheckboxButton {...option} />
              );
            })}
          </ElCheckboxGroup>
        )}
      </ElFormItem>
    );
  };
});
