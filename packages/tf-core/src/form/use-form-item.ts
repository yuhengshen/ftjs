import { computed } from "vue";
import { TfFormColumn } from "./columns";
import { useFormInject } from "./use-form";
import { isEmptyStrOrNull, get, set } from "../utils";

export interface UseFormItemOptions<T extends TfFormColumn<any>> {
  /** column 定义 */
  column: T;
  /**
   * set 转换
   */
  valueSetter?: (val: any) => any;
  /**
   * get 转换
   */
  valueGetter?: (val: any) => any;
}

/**
 * 通用的 form item 组件处理，处理 form 中的值
 */
export const useFormItem = <T extends Record<string, any>>(
  options: UseFormItemOptions<TfFormColumn<T>>,
) => {
  let { column, valueGetter, valueSetter } = options;
  // column 有自定义的转换函数
  if (column.valueGetter) {
    valueGetter = column.valueGetter;
  }
  // column 有自定义的转换函数
  if (column.valueSetter) {
    valueSetter = column.valueSetter;
  }

  const { form } = useFormInject<T>()!;
  /**
   * form 中的值处理
   */
  const valueComputed = computed<any>({
    get() {
      let val;
      if (column.fields) {
        val = column.fields
          .map(field => {
            return get(form.value, field);
          })
          .filter(e => !isEmptyStrOrNull(e));
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
