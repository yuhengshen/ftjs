import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, Cascader, CascaderProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase } from "../register";
import { computed } from "vue";

export interface FtFormColumnCascader<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 级联选择器
   */
  type: "cascader";
  props?: Refs<CascaderProps>;
}

export default defineFormComponent<FtFormColumnCascader<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    const placeholder = `请选择${formItemProps.value.label}`;

    const getTextFromOptions = (
      options: any[],
      value: string[],
      level: number = 0,
    ) => {
      if (!options || !value || level >= value.length) return undefined;

      const currentValue = value[level];
      const currentOption = options.find(
        option => option.value === currentValue,
      );

      if (!currentOption) return undefined;

      if (level === value.length - 1) {
        return currentOption.label;
      }

      // 递归处理下一级
      if (currentOption.children && currentOption.children.length > 0) {
        const childText = getTextFromOptions(
          currentOption.children,
          value,
          level + 1,
        );
        if (childText) {
          return `${currentOption.label} / ${childText}`;
        }
      }

      return currentOption.label;
    };

    const isViewText = computed(() => {
      if (props.isView && valueComputed.value) {
        const options = _props?.options || [];
        return getTextFromOptions(options, valueComputed.value);
      }
      return "-";
    });

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <div>{isViewText.value}</div>
        ) : (
          <Cascader
            v-model:value={valueComputed.value}
            placeholder={placeholder}
            {..._props}
          />
        )}
      </FormItem>
    );
  };
});
