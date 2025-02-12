import { getField, TfFormColumn } from "@tf/core";
import { computed, toValue } from "vue";

export const useFormItemProps = <T extends Record<string, any>>(
  column: TfFormColumn<T>,
) => {
  return computed(() => {
    const field = getField(column);
    const name = field!.split(".");
    const label = toValue(column.title);

    return {
      name,
      label,
    };
  });
};
