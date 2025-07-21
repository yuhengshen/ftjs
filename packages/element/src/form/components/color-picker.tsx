import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElColorPicker, ElTag } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ExtractEventsFromProps } from "../../type";
import { ComponentProps } from "vue-component-type-helpers";

type ColorPickerProps = ComponentProps<typeof ElColorPicker>;

export interface FtFormColumnColorPicker<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 颜色选择器
   */
  type: "color-picker";
  props?: Refs<ColorPickerProps> & ExtractEventsFromProps<ColorPickerProps>;
}

export default defineFormItem<FtFormColumnColorPicker<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          valueComputed.value ? (
            <ElTag color={valueComputed.value}>{valueComputed.value}</ElTag>
          ) : (
            "-"
          )
        ) : (
          <ElColorPicker v-model={valueComputed.value} {...props.unrefsProps} />
        )}
      </ElFormItem>
    );
  };
});
