import { Refs, unrefs, useFormItem, useLocale } from "@ftjs/core";
import { FormItem, Cascader, CascaderProps } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { AntdColumnBase, defineFormItem } from "../register";
import { computed } from "vue";

export interface FtFormColumnCascader<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 级联选择器
   */
  type: "cascader";
  props?: Refs<CascaderProps>;
}

export default defineFormItem<FtFormColumnCascader<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  return () => {
    const _props = unrefs(props.column.props);
    const fieldNames = _props?.fieldNames || {};
    const labelKey = fieldNames.label || "label";
    const valueKey = fieldNames.value || "value";
    const childrenKey = fieldNames.children || "children";

    const placeholder = locale.value.placeholder.select(
      formItemProps.value.label,
    );

    const getTextFromOptions = (
      options: any[],
      value: Array<string | number>,
      level: number = 0,
    ) => {
      if (!options || !value || level >= value.length) return undefined;

      const currentValue = value[level];
      const currentOption = options.find(
        option => option[valueKey] === currentValue,
      );

      if (!currentOption) return undefined;

      if (level === value.length - 1) {
        return currentOption[labelKey];
      }

      // 递归处理下一级
      if (currentOption[childrenKey] && currentOption[childrenKey].length > 0) {
        const childText = getTextFromOptions(
          currentOption[childrenKey],
          value,
          level + 1,
        );
        if (childText) {
          return `${currentOption[labelKey]} / ${childText}`;
        }
      }

      return currentOption[labelKey];
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
