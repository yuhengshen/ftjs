import { TfFormColumn } from "@tf/core";
import { computed, toValue } from "vue";

export const useFormItemProps = <T>(column: TfFormColumn<T>) => {
  return computed(() => {
    const field = column.field || column.fields?.[0];
    const name = field!.split(".");
    const label = toValue(column.title);

    return {
      name,
      label,
    };
  });
};
