import { Refs, useFormItem } from "@ftjs/core";
import { ElFormItem, ElSlider } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";

type SliderProps = ComponentProps<typeof ElSlider>;
export interface FtFormColumnSlider<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 滑块
   */
  type: "slider";
  props?: Refs<SliderProps> & ExtractEventsFromProps<SliderProps>;
}

export default defineFormItem<FtFormColumnSlider<any>>(props => {
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
          <ElSlider v-model={valueComputed.value} {...props.unrefsProps} />
        )}
      </ElFormItem>
    );
  };
});
