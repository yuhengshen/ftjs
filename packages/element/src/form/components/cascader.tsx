import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElCascader } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { renderCascaderText } from "../utils/cascader";
import { ExtractEventsFromProps } from "../../type";
import { ComponentProps } from "vue-component-type-helpers";

type CascaderProps = ComponentProps<typeof ElCascader>;

export interface FtFormColumnCascader<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 自动补全
   */
  type: "cascader";
  props?: Refs<CascaderProps> & ExtractEventsFromProps<CascaderProps>;
}

export default defineFormItem<FtFormColumnCascader<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderCascaderText({
            ...props.unrefsProps,
            modelValue: valueComputed.value,
          })
        ) : (
          <ElCascader v-model={valueComputed.value} {...props.unrefsProps} />
        )}
      </ElFormItem>
    );
  };
});
