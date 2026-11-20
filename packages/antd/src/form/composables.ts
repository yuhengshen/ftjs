import { getField } from "@ftjs/core";
import { computed, toValue } from "vue";
import { AntdColumnBase } from "./register";
export const useFormItemProps = <T extends Record<string, any>>(
  column: AntdColumnBase<T>,
) => {
  return computed(() => {
    const field = getField(column);
    const name = field!.split(".");
    const label = toValue(column.title) ?? "";
    const extra = toValue(column.extra);

    return {
      name,
      label,
      extra,
    };
  });
};
