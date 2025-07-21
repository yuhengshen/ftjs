import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElInputTag, ElTag } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";
import { isViewOptionsStyle } from "../style";

type InputTagProps = ComponentProps<typeof ElInputTag>;
export interface FtFormColumnInputTag<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 输入标签
   */
  type: "input-tag";
  props?: Refs<InputTagProps> & ExtractEventsFromProps<InputTagProps>;
}

export default defineFormItem<FtFormColumnInputTag<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const renderText = () => {
    if (!valueComputed.value?.length) {
      return "-";
    }

    const tagType = props.unrefsProps?.tagType;
    const tagEffect = props.unrefsProps?.tagEffect;

    return (
      <div style={isViewOptionsStyle}>
        {valueComputed.value?.map(item => (
          <ElTag
            key={item}
            disableTransitions
            type={tagType}
            effect={tagEffect}
          >
            {item}
          </ElTag>
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
          <ElInputTag
            v-model={valueComputed.value}
            placeholder="请输入"
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
