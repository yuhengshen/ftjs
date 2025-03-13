import { Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, CheckboxGroup, CheckboxGroupProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem, VueNode } from "../register";
import { computed, toValue } from "vue";
import { isSimpleOption } from "../utils";
import { isViewOptionsStyle } from "../style";
export interface FtFormColumnCheckbox<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 复选框
   */
  type: "checkbox";
  props?: Refs<CheckboxGroupProps>;
}

export default defineFormItem<FtFormColumnCheckbox<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const options = computed(() => {
    if (!props.column.props?.options) {
      console.warn("checkbox 组件的 options 属性不能为空");
      return [];
    }
    return toValue(props.column.props.options) ?? [];
  });

  return () => {
    const _props = unrefs(props.column.props);

    const isViewTextVNodeMap = computed(() => {
      let result: (string | VueNode)[] = [];
      if (props.isView && valueComputed.value) {
        result = valueComputed.value.map(v => {
          let text: string | VueNode = "";
          options.value.some(item => {
            if (isSimpleOption(item)) {
              if (item === v) {
                text = item;
                return true;
              }
            } else {
              if (item.value === v) {
                text = item.label;
                return true;
              }
            }
          });
          return text;
        });
      }
      return result.length > 0 ? result : ["-"];
    });

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div style={isViewOptionsStyle}>
            {isViewTextVNodeMap.value.map(v => (
              <span>{v}</span>
            ))}
          </div>
        ) : (
          <CheckboxGroup v-model:value={valueComputed.value} {..._props} />
        )}
      </FormItem>
    );
  };
});
