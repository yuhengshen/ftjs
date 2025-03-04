import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Radio, RadioGroupProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { computed, toValue, unref } from "vue";
import { RadioGroupChildOption } from "ant-design-vue/es/radio/Group";
import { AntdColumnBase } from "../register";

export interface FtFormColumnRadio<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 单选框
   */
  type: "radio";
  props?: Refs<RadioGroupProps>;
}

export default defineFormComponent<FtFormColumnRadio<any>>(props => {
  const { valueComputed, isView } = useFormItem({
    props,
  });

  const formItemProps = useFormItemProps(props.column);

  const isViewText = computed(() => {
    const options = unref(
      props.column.props!.options,
    ) as RadioGroupChildOption[];
    if (!options) return valueComputed.value;
    return (
      options.find(option => option.value === valueComputed.value)?.label || ""
    );
  });

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {toValue(isView.value) ? (
          <div>{isViewText.value}</div>
        ) : (
          <Radio.Group v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
