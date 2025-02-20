import { computed, toValue } from "vue";
import { TfFormColumnBase } from "./columns";
import { useFormInject } from "./use-form";
import { isEmptyStrOrNull, get, set } from "../utils";
import { CommonFormItemProps, FormTypeMap } from "./define-component";

interface UseFormItemOptions<
  FormData extends Record<string, any>,
  Type extends keyof FormTypeMap<FormData>,
> {
  /** 通用 props */
  props: CommonFormItemProps<FormTypeMap<FormData>[Type]["columns"]>;
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
export const useFormItem = <
  FromData extends Record<string, any>,
  Type extends keyof FormTypeMap<FromData>,
>(
  options: UseFormItemOptions<TfFormColumnBase<FormData>, Type>,
) => {
  let { props, valueGetter, valueSetter } = options;
  // column 有自定义的转换函数
  if (props.column.valueGetter) {
    valueGetter = props.column.valueGetter;
  }
  // column 有自定义的转换函数
  if (props.column.valueSetter) {
    valueSetter = props.column.valueSetter;
  }

  const { form } = useFormInject<FormData, Type>()!;
  /**
   * form 中的值处理
   */
  const valueComputed = computed<any>({
    get() {
      let val;
      if (props.column.fields) {
        val = props.column.fields
          .map(field => {
            return get(form.value, field);
          })
          .filter(e => !isEmptyStrOrNull(e));
      } else if (props.column.field) {
        val = get(form.value, props.column.field);
      } else {
        console.warn(`column 没有设置 field 或者 fields`, props.column);
      }
      if (valueGetter) val = valueGetter(val);
      return val;
    },
    set(val) {
      if (valueSetter) val = valueSetter(val);
      if (props.column.fields) {
        props.column.fields.forEach((field, index) => {
          set(form.value, field, val?.[index]);
        });
      } else if (props.column.field) {
        set(form.value, props.column.field, val);
      } else {
        console.warn(`column 没有设置 field 或者 fields`, props.column);
      }
    },
  });

  const isView = computed(() => {
    return toValue(props.column.isView) ?? props.isView;
  });

  return {
    valueComputed,
    isView,
  };
};
