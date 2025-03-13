import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Radio, RadioGroupProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { computed, unref } from "vue";
import { RadioGroupChildOption } from "ant-design-vue/es/radio/Group";
import { AntdColumnBase, defineFormItem, VueNode } from "../register";
import { isSimpleOption } from "../utils";

export interface FtFormColumnRadio<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 单选框
   */
  type: "radio";
  props?: Refs<RadioGroupProps>;
}

export default defineFormItem<FtFormColumnRadio<any>>(props => {
  const { valueComputed } = useFormItem({
    props,
  });

  const formItemProps = useFormItemProps(props.column);

  const isViewTextVNode = computed(() => {
    const options = unref(
      props.column.props!.options,
    ) as RadioGroupChildOption[];
    if (!options) return valueComputed.value;
    let vNode: string | number | VueNode;
    options.some(option => {
      if (isSimpleOption(option)) {
        if (option === valueComputed.value) {
          vNode = option;
          return true;
        }
      } else {
        if (option.value === valueComputed.value) {
          vNode = option.label;
          return true;
        }
      }
    });
    return vNode;
  });

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{isViewTextVNode.value}</div>
        ) : (
          <Radio.Group v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
