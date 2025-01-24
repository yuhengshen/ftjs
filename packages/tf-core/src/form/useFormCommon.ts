import { computed } from "vue";
import { CommonFormOptions, TfFormColumn } from "./types";
import { useFormInject } from "./useProvide";
import { get, set } from "es-toolkit/compat";
import { isEmptyStrOrNull } from "./utils";

/**
 * 通用的 form 处理
 */
export const useFormCommon = <T extends Record<string, any>>(
  options: CommonFormOptions<TfFormColumn<T>>,
) => {
  let { props, valueGetter, valueSetter } = options;
  // column 有自定义的转换函数
  if (props.search.valueGetter) {
    valueGetter = props.search.valueGetter;
  }
  // column 有自定义的转换函数
  if (props.search.valueSetter) {
    valueSetter = props.search.valueSetter;
  }

  const form = useFormInject<T>();
  /**
   * form 中的值处理
   */
  const valueComputed = computed<any>({
    get() {
      let val;
      if (props.search.fields) {
        val = props.search.fields
          .map(field => {
            return get(form.value, field);
          })
          .filter(e => !isEmptyStrOrNull(e));
      } else if (props.search.field) {
        val = get(form.value, props.search.field);
      } else {
        console.warn(`column 没有设置 field 或者 fields`, props.search)
      }
      if (valueGetter) val = valueGetter(val);
      return val;
    },
    set(val) {
      if (valueSetter) val = valueSetter(val);
      if (props.search.fields) {
        props.search.fields.forEach((field, index) => {
          set(form.value, field, val?.[index]);
        });
      } else if (props.search.field) {
        set(form.value, props.search.field, val);
      } else {
        console.warn(`column 没有设置 field 或者 fields`, props.search)
      }
    },
  });

  return {
    valueComputed,
  };
};
