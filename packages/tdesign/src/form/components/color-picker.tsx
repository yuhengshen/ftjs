import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, ColorPicker, ColorPickerProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";

export interface FtFormColumnColorPicker<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 颜色选择器
   */
  type: "color-picker";
  props?: Refs<ColorPickerProps>;
}

export default defineFormItem<FtFormColumnColorPicker<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div
            style={
              valueComputed.value && {
                background: valueComputed.value,
                backgroundClip: "text",
                color: "transparent",
                border: "1px solid var(--td-border-level-2-color)",
                padding: "2px 4px",
                borderRadius: "var(--td-radius-default)",
              }
            }
          >
            {valueComputed.value || "-"}
          </div>
        ) : (
          // @ts-expect-error null 类型不兼容
          <ColorPicker v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
