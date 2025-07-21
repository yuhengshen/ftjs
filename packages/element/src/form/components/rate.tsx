import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElRate } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";
import { computed } from "vue";

type RateProps = ComponentProps<typeof ElRate>;
export interface FtFormColumnRate<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 评分
   */
  type: "rate";
  props?: Refs<RateProps> & ExtractEventsFromProps<RateProps>;
}

export default defineFormItem<FtFormColumnRate<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const disabled = computed(() => props.isView || props.unrefsProps?.disabled);

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        <ElRate
          v-model={valueComputed.value}
          {...props.unrefsProps}
          disabled={disabled.value}
        />
      </ElFormItem>
    );
  };
});
