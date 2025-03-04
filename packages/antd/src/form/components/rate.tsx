import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Rate, RateProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";

export interface TfFormColumnRate<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 评分
   */
  type: "rate";
  props?: Refs<RateProps>;
}

export default defineFormComponent<TfFormColumnRate<any>>(props => {
  const { valueComputed, isView } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        <Rate
          v-model:value={valueComputed.value}
          disabled={isView.value}
          {..._props}
        />
      </FormItem>
    );
  };
});
