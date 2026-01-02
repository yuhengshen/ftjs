import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { FormItem, Cascader, CascaderProps } from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { isViewOptionsStyle } from "../style";
import { renderCascaderText } from "../utils/cascader";

export interface FtFormColumnCascader<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 级联选择
   */
  type: "cascader";
  props?: Refs<CascaderProps>;
}

export default defineFormItem<FtFormColumnCascader<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  return () => {
    const _props = props.unrefsProps as CascaderProps;

    const viewRender = () => {
      return renderCascaderText({
        ..._props,
        value: valueComputed.value,
      });
    };

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div style={isViewOptionsStyle}>{viewRender()}</div>
        ) : (
          <Cascader
            v-model:value={valueComputed.value}
            placeholder={locale.value.placeholder.select(
              formItemProps.value.label,
            )}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
