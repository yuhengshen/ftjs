import { computed } from "vue";
import { CommonFormOptions, TfFormColumnBase } from "./types";
import { useFormInject } from "./useProvide";
import { get, set } from "es-toolkit/compat";
import { isEmptyStrOrNull } from "./utils";

/**
 * 通用的 form 组件处理
 */
export const useFormCommonComponent = <T extends Record<string, any>>(
  options: CommonFormOptions<TfFormColumnBase<T>>
) => {
  let { _column: column, valueGetter, valueSetter } = options;
  // column 有自定义的转换函数
  if (column.valueGetter) {
    valueGetter = column.valueGetter;
  }
  // column 有自定义的转换函数
  if (column.valueSetter) {
    valueSetter = column.valueSetter;
  }

  const form = useFormInject<T>();
  /**
   * form 中的值处理
   */
  const valueComputed = computed<any>({
    get() {
      let val;
      if (column.fields) {
        val = column.fields
          .map((field) => {
            return get(form.value, field);
          })
          .filter((e) => !isEmptyStrOrNull(e));
      } else if (column.field) {
        val = get(form.value, column.field);
      } else {
        console.warn(`column 没有设置 field 或者 fields`, column);
      }
      if (valueGetter) val = valueGetter(val);
      return val;
    },
    set(val) {
      if (valueSetter) val = valueSetter(val);
      if (column.fields) {
        column.fields.forEach((field, index) => {
          set(form.value, field, val?.[index]);
        });
      } else if (column.field) {
        set(form.value, column.field, val);
      } else {
        console.warn(`column 没有设置 field 或者 fields`, column);
      }
    },
  });

  return {
    valueComputed,
  };
};
