import { getField, set } from "@ftjs/core";
import { computed, toValue } from "vue";
import { EleColumnBase } from "./register";
import { FtEleFormProps } from ".";
export const useFormItemProps = <T extends Record<string, any>>(
  column: EleColumnBase<T>,
) => {
  return computed(() => {
    const name = getField(column);
    const label = toValue(column.title) ?? "";

    return {
      name,
      label,
    };
  });
};

export const useRules = (props: FtEleFormProps<any>) => {
  // 收集表单列的验证规则
  const rules = computed(() => {
    const rulesObj = {};
    for (const column of props.columns) {
      if (column.rules) {
        const field = getField(column);
        // 这里需要支持响应式的rules规则
        set(rulesObj, field!, toValue(column.rules));
      }
    }

    return rulesObj;
  });

  return { rules };
};
