import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Rate, RateProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";

export interface FtFormColumnRate<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 评分
   */
  type: "rate";
  props?: Refs<RateProps>;
}

export default defineFormComponent<FtFormColumnRate<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        <Rate
          v-model:value={valueComputed.value}
          disabled={props.isView}
          {..._props}
        />
      </FormItem>
    );
  };
});
