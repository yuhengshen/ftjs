import {
  computed,
  ref,
  watch,
  onUnmounted,
  nextTick,
  toValue,
  Ref,
  unref,
  provide,
  inject,
  ComputedRef,
} from "vue";
import {
  cloneDeep,
  get,
  has,
  set,
  getField,
  getStorage,
  setStorage,
} from "../utils";
import { FormTypeMap, TfFormIntrinsicProps } from "./define-component";
import { TfFormColumnBase } from "./columns";
import { RecordPath, SplitEventKeys } from "../type-helper";
import { ExposeWithComment } from "./types";

export type FormInject<
  FormData extends Record<string, any>,
  Type extends keyof FormTypeMap<FormData>,
> = Pick<
  ExposeWithComment<FormData, Type>,
  | "form"
  | "columnsChecked"
  | "columnsSort"
  | "visibleColumns"
  | "internalFormProps"
  | "onSubmit"
  | "getFormData"
  | "resetToDefault"
  | "setAsDefault"
  | "resetColumnsSort"
  | "resetColumnsChecked"
  | "cache"
> &
  SplitEventKeys<FormTypeMap<FormData>[Type]["extendedProps"]> & {
    columns: ComputedRef<FormTypeMap<FormData>[Type]["columns"][]>;
  };

const provideFormKey = Symbol("@ftjs/core-form-provide");

/**
 * 缓存展示项
 */
const useColumnsChecked = <FormData extends Record<string, any>>(
  columns: ComputedRef<TfFormColumnBase<FormData>[]>,
  cache?: string,
) => {
  const storageKey = `tf-form-columns-checked-obj`;

  const columnsV = computed(() => {
    const entries = columns.value.map(e => {
      const field = e.field ?? (e.fields?.[0] as string);
      return [field, !toValue(e.hide)];
    });
    return Object.fromEntries(entries);
  });
  const storageV = getStorage(storageKey, cache);

  const vRef = ref<Record<RecordPath<FormData>, boolean>>(
    Object.assign({}, columnsV.value, storageV),
  );

  const columnsChecked = computed<RecordPath<FormData>[]>({
    get() {
      return Object.entries(vRef.value)
        .filter(([_, show]) => show)
        .map(([field]) => field) as RecordPath<FormData>[];
    },
    set(v) {
      const storageV = {} as Record<RecordPath<FormData>, boolean>;
      const entries = columns.value.map(e => {
        const field = getField(e);
        const show = v.includes(field as any);
        // 与默认配置一致的选项不存储
        if (show !== !toValue(e.hide)) storageV[field] = show;
        return [field, show];
      });
      vRef.value = Object.fromEntries(entries);
      setStorage(storageKey, storageV, cache);
    },
  });

  const resetColumnsChecked = () => {
    columnsChecked.value = columns.value
      .filter(e => !toValue(e.hide))
      .map(e => getField(e));
  };

  return {
    columnsChecked,
    resetColumnsChecked,
  };
};

/**
 * 缓存排序项
 */
const useColumnsSorted = <FormData extends Record<string, any>>(
  columns: ComputedRef<TfFormColumnBase<FormData>[]>,
  cache?: string,
) => {
  const storageKey = `tf-form-columns-sorted-obj`;

  const columnsV = computed(() => {
    const entries = columns.value.map((e, idx) => {
      const field = e.field ?? (e.fields?.[0] as string);
      return [field, e.sort ?? idx];
    });
    return Object.fromEntries(entries);
  });
  const storageV = getStorage(storageKey, cache);

  const vRef = ref<Record<RecordPath<FormData>, number>>(
    Object.assign({}, columnsV.value, storageV),
  );

  const columnsSort = computed<Record<RecordPath<FormData>, number>>({
    get() {
      return vRef.value;
    },
    set(v) {
      const storageV = {} as Record<RecordPath<FormData>, number>;
      const entries = columns.value.map((e, idx) => {
        const field = getField(e);
        // 与默认配置一致的选项不存储
        if (v[field] !== (e.sort ?? idx)) {
          storageV[field] = v[field];
        }
        return [field, v[field]];
      });
      vRef.value = Object.fromEntries(entries);
      setStorage(storageKey, storageV, cache);
    },
  });

  const resetColumnsSort = () => {
    const resetV = {} as Record<RecordPath<FormData>, number>;
    columns.value.forEach((e, idx) => {
      const field = getField(e);
      resetV[field] = e.sort ?? idx;
    });
    columnsSort.value = resetV;
  };

  return {
    columnsSort,
    resetColumnsSort,
  };
};

/**
 * 结构提取 columns 的 field 和 value
 */
const getFieldsAndValues = <T extends Record<string, any>>(
  column: TfFormColumnBase<T>,
) => {
  const fields = column.fields || [column.field!];
  const values = column.fields ? column.value || [] : [column.value];
  return { fields, values };
};

export const useForm = <
  FormData extends Record<string, any>,
  Type extends keyof FormTypeMap<FormData>,
>(
  props: TfFormIntrinsicProps<FormData, Type> &
    FormTypeMap<FormData>[Type]["extendedProps"] & {
      columns: FormTypeMap<FormData>[Type]["columns"][];
    },
  formData: Ref<FormData | undefined>,
  runtimePropsKeys: string[],
) => {
  const columns = computed(() => toValue(props.columns));

  const formLocal = ref({} as FormData);
  const form = (
    unref(formData) != null ? formData : formLocal
  ) as Ref<FormData>;

  const { columnsChecked, resetColumnsChecked } = useColumnsChecked(
    columns,
    props.cache,
  );
  const { columnsSort, resetColumnsSort } = useColumnsSorted(
    columns,
    props.cache,
  );

  let tmpDefaultForm: FormData;

  // 需要监听的表单字段
  const watchMap = new Map<string, () => void>();
  const hideFieldSet = ref<Set<string>>(new Set());

  // 需要显示的表单字段
  const visibleColumns = computed(() => {
    return columns.value
      .filter(column => {
        const key = getField(column);
        return (
          !hideFieldSet.value.has(key) &&
          (columnsChecked.value?.includes(key) ?? true)
        );
      })
      .sort((a, b) => {
        const keyA = getField(a);
        const keyB = getField(b);
        const aSort = columnsSort.value[keyA] ?? 0;
        const bSort = columnsSort.value[keyB] ?? 0;
        return aSort - bSort;
      });
  });

  const customProps = runtimePropsKeys.reduce((acc, event: string) => {
    if (event.startsWith("on")) {
      acc[event] = props[event];
    } else {
      acc[event] = computed(() => props[event]);
    }
    return acc;
  }, {}) as any;

  watch(
    columns,
    (_v, _o, onCleanup) => {
      onCleanup(() => {
        watchMap.forEach(cancel => cancel());
        watchMap.clear();
        hideFieldSet.value.clear();
        console.warn(`[@ftjs/core] 检测到columns在改变，应该尽量避免变动`);
      });
      addFormDefaultValue();
      runFieldWatch();
    },
    {
      immediate: true,
    },
  );

  onUnmounted(() => {
    watchMap.forEach(cancel => cancel());
  });

  /**
   * 运行表单字段监听(watch, controls)函数
   */
  function runFieldWatch() {
    columns.value.forEach(column => {
      let watchObj = column.watch;
      const control = column.control;

      if (!watchObj && !control) return;

      const field = getField(column);
      const cancel: (() => void)[] = [];

      if (typeof watchObj === "function") {
        watchObj = {
          handler: watchObj,
        };
      }
      if (watchObj) {
        cancel.push(
          watch(
            () => {
              return get(form.value, field);
            },
            (val, oldVal) => {
              watchObj.handler({ val, oldVal, form: form.value });
            },
            {
              immediate: watchObj.immediate,
              deep: watchObj.deep,
            },
          ),
        );
      }
      if (control) {
        cancel.push(
          watch(
            () => get(form.value, field),
            val => {
              control.forEach(({ field, value }) => {
                let show = true;
                if (typeof value === "function") {
                  show = value({
                    formData: form.value,
                    val,
                  });
                } else {
                  show = Array.isArray(value)
                    ? (value as any[]).includes(val)
                    : val === value;
                }
                if (show) {
                  hideFieldSet.value.delete(field);
                } else {
                  hideFieldSet.value.add(field);
                }
              });
            },
            {
              immediate: true,
            },
          ),
        );
      }
      watchMap.set(field, () => {
        cancel.forEach(c => c());
      });
    });
  }

  /**
   * 重置表单为默认值
   *
   * sync false: 由于这个方法很可能在watchEffect中调用，其内部属性不应该放到watchEffect的依赖中
   * @param sync 是否同步更新，默认为 false
   */
  const resetToDefault: ResetToDefault = async (sync = false) => {
    if (!sync) await nextTick();
    if (tmpDefaultForm) {
      form.value = cloneDeep(tmpDefaultForm);
      return;
    }
    form.value = columns.value.reduce<FormData>((prev, column) => {
      const { fields, values } = getFieldsAndValues(column);
      fields.forEach((field, idx) => {
        set(prev, field, cloneDeep(values[idx]));
      });
      return prev;
    }, {} as FormData);
  };

  /**
   * 设置当前表单的默认值，如果参数为空，则将`当前表单值`设置为默认值
   */
  const setAsDefault: SetAsDefault<FormData> = (v?) => {
    tmpDefaultForm = cloneDeep(v ?? form.value);
  };

  /**
   * 加默认值
   */
  function addFormDefaultValue() {
    columns.value.forEach(column => {
      const { fields, values } = getFieldsAndValues(column);
      fields.forEach((field, idx) => {
        if (values[idx] != null && !has(form.value, field)) {
          set(form.value, field, cloneDeep(values[idx]));
        }
      });
    });
  }

  /**
   * 获取表单当前展示出的表单值
   */
  const getFormData: GetFormData<FormData> = () => {
    const formData: FormData = {} as FormData;
    visibleColumns.value.forEach(usefulColumn => {
      const { fields } = getFieldsAndValues(usefulColumn);
      fields.forEach(field => {
        set(formData, field, get(form.value, field));
      });
    });
    return formData;
  };

  const internalFormProps = computed(() => props.internalFormProps);

  const cache = computed(() => props.cache);

  provide<FormInject<FormData, Type>>(provideFormKey, {
    form,
    columnsChecked,
    columnsSort,
    columns,
    visibleColumns,
    internalFormProps,
    cache,
    getFormData,
    resetToDefault,
    setAsDefault,
    onSubmit: props.onSubmit,
    resetColumnsChecked,
    resetColumnsSort,
    ...customProps,
  });

  return {
    form,
    visibleColumns,
    resetToDefault,
    getFormData,
    setAsDefault,
  };
};

export const useFormInject = <
  FormData extends Record<string, any>,
  Type extends keyof FormTypeMap<FormData>,
>() => {
  return inject<FormInject<FormData, Type>>(provideFormKey);
};

export type GetFormData<FormData extends Record<string, any>> = () => FormData;

export type ResetToDefault = (sync?: boolean) => Promise<void> | void;

export type SetAsDefault<FormData extends Record<string, any>> = (
  v?: FormData,
) => void;
