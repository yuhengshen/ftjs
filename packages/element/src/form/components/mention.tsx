import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElMention } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type MentionProps = ComponentProps<typeof ElMention>;
export interface FtFormColumnMention<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 提及
   */
  type: "mention";
  props?: Refs<MentionProps> & ExtractEventsFromProps<MentionProps>;
}

export default defineFormItem<FtFormColumnMention<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const renderText = () => {
    return valueComputed.value ?? "-";
  };

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderText()
        ) : (
          <ElMention
            v-model={valueComputed.value}
            placeholder="请输入"
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
