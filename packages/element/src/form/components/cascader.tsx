import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElCascader, cascaderProps } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ExtractPublicPropTypes } from "vue";
import { renderCascaderText } from "../utils/cascader";

export interface FtFormColumnCascader<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 自动补全
   */
  type: "cascader";
  props?: Refs<ExtractPublicPropTypes<typeof cascaderProps>>;
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
