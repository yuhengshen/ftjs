import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Mentions, MentionsProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";

export interface FtFormColumnMentions<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 提及
   */
  type: "mentions";
  props?: Refs<MentionsProps>;
}

export default defineFormComponent<FtFormColumnMentions<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Mentions v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
