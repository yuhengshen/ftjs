import { computed, ref, VNodeChild } from "vue";
import { get, set } from "../utils";
import { FtBaseFormProps, useFormInject } from "./use-form";

type Slots = (props: {
  value: any;
  isView: boolean;
  [key: string]: any;
}) => VNodeChild;

export type CommonSlots<T extends readonly string[]> = {
  [K in T[number]]?: Slots;
};

interface UseFormItemOptions<P extends FtBaseFormProps<any>> {
  /** 通用 props */
  props: P;
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
export const useFormItem = (options: UseFormItemOptions<any>) => {
  let { props, valueGetter, valueSetter } = options;
  // column 有自定义的转换函数
  if (props.column.valueGetter) {
    valueGetter = props.column.valueGetter;
  }
  // column 有自定义的转换函数
  if (props.column.valueSetter) {
    valueSetter = props.column.valueSetter;
  }

  const { form } = useFormInject()!;

  const fieldsData = ref([]);

  /**
   * form 中的值处理
   */
  const valueComputed = computed<any>({
    get() {
      let val;
      if (props.column.fields) {
        const length = Math.max(
          props.column.fields.length,
          fieldsData.value.length,
        );
        const valArr: any[] = Array(length).fill(undefined);
        for (let i = 0; i < length; i++) {
          // 优先从 form.value 获取，以获取外部变更
          const field = props.column.fields![i];
          if (field && field !== "-") {
            valArr[i] = get(form.value, field);
          } else if (fieldsData.value[i]) {
            valArr[i] = fieldsData.value[i];
          }
        }
        val = valArr;
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
        const valArr = val ?? [];
        fieldsData.value = valArr;
        props.column.fields.forEach((field, index) => {
          const v = valArr[index];
          if (field === "-") {
            return;
          }
          set(form.value, field, v);
        });
      } else if (props.column.field) {
        set(form.value, props.column.field, val);
      } else {
        console.warn(`column 没有设置 field 或者 fields`, props.column);
      }
    },
  });

  /**
   * 通用 slots，
   */
  let slots: Record<string, (props?: any) => VNodeChild> | undefined;

  if (props.column.slots) {
    slots = Object.fromEntries(
      Object.entries<Slots>(props.column.slots).map(([key, value]) => {
        return [
          key,
          scopedProps =>
            value({
              value: valueComputed.value,
              isView: props.isView,
              scopedProps,
            }),
        ];
      }),
    );
  }

  return {
    valueComputed,
    slots,
  };
};
