import {
  computed,
  ref,
  watch,
  nextTick,
  toValue,
  ComputedRef,
  inject,
  provide,
  watchEffect,
  ComputedGetter,
  onScopeDispose,
  unref,
} from "vue";
import {
  cloneDeep,
  get,
  has,
  set,
  getField,
  getStorage,
  setStorage,
  isEqual,
  getDefaultValues,
} from "../utils";
import { FtFormColumnBase } from "./columns";
import { MaybeRefOrFormGetter, RecordPath } from "../type-helper";

interface FormInject<F extends Record<string, any>> {
  form: ComputedRef<F>;
}

export function isFormGetter<T, F extends Record<string, any>>(
  fn: MaybeRefOrFormGetter<T, F>,
): fn is (form: F) => T {
  return typeof fn === "function";
}

const provideFormKey = Symbol("@ftjs/core-form-provide");

/**
 * 将 MaybeRefOrFormGetter 转换为普通值
 */
export function toValueWithForm<T extends Record<string, any>, R>(
  fn: MaybeRefOrFormGetter<R, T>,
  form: ComputedRef<T>,
) {
  if (isFormGetter(fn)) {
    return fn(form.value);
  }
  return unref(fn);
}

export const useFormInject = <
  F extends Record<string, any> = Record<string, any>,
>() => {
  return inject<FormInject<F>>(provideFormKey);
};

/**
 * 缓存展示项
 */
const useColumnsChecked = <FormData extends Record<string, any>>(
  columns: ComputedRef<FtFormColumnBase<FormData>[]>,
  cache: ComputedGetter<string | undefined>,
  form: ComputedRef<FormData>,
) => {
  const storageKey = `ftjs-form-columns-checked-obj`;

  const columnsV = computed(() => {
    const entries = columns.value.map(e => {
      const field = getField(e);
      return [field, !toValueWithForm(e.hide, form)];
    });
    return Object.fromEntries(entries);
  });
  const storageV = computed(() => {
    return getStorage(storageKey, toValue(cache));
  });

  const vRef = ref<Record<RecordPath<FormData>, boolean>>(
    {} as Record<RecordPath<FormData>, boolean>,
  );

  watchEffect(() => {
    vRef.value = {
      ...columnsV.value,
      ...storageV.value,
    };
  });

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
        if (show !== !toValueWithForm(e.hide, form)) storageV[field] = show;
        return [field, show];
      });
      vRef.value = Object.fromEntries(entries);
      setStorage(storageKey, storageV, toValue(cache));
    },
  });

  const resetColumnsChecked = () => {
    columnsChecked.value = columns.value
      .filter(e => !toValueWithForm(e.hide, form))
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
  columns: ComputedRef<FtFormColumnBase<FormData>[]>,
  cache: ComputedGetter<string | undefined>,
) => {
  const storageKey = `tfjs-form-columns-sorted-obj`;

  const columnsV = computed(() => {
    const entries = columns.value.map((e, idx) => {
      const field = e.field ?? (e.fields?.[0] as string);
      return [field, e.sort ?? idx];
    });
    return Object.fromEntries(entries);
  });
  const storageV = computed(() => {
    return getStorage(storageKey, toValue(cache));
  });

  const vRef = ref<Record<RecordPath<FormData>, number>>(
    {} as Record<RecordPath<FormData>, number>,
  );

  watchEffect(() => {
    vRef.value = {
      ...columnsV.value,
      ...storageV.value,
    };
  });

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
      setStorage(storageKey, storageV, toValue(cache));
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

export interface FtBaseFormProps<F extends Record<string, any>> {
  /**
   * v-model:formData 的值
   */
  formData?: F;
  "onUpdate:formData"?: (value: F) => void;
  /**
   * 提交表单
   */
  onSubmit?: (formData: F) => Promise<void> | void;
  /**
   * 是否查看模式
   */
  isView?: boolean;
  /**
   * 表单列
   */
  columns: FtFormColumnBase<F>[];
  /**
   * 用于缓存配置，不填则不缓存
   */
  cache?: string;
}

/**
 * 结构提取 columns 的 field 和 value
 */
const getFieldsAndValues = <T extends Record<string, any>>(
  column: FtFormColumnBase<T>,
) => {
  const fields = column.fields || [column.field!];
  const values = column.fields
    ? getDefaultValues(column) || []
    : [getDefaultValues(column)];
  return { fields, values };
};

export type ExtractFormData<P extends FtBaseFormProps<any>> =
  P extends FtBaseFormProps<infer F> ? F : never;

export type ExtractColumns<P extends FtBaseFormProps<any>> =
  P extends FtBaseFormProps<any> ? P["columns"] : never;

export const useForm = <P extends FtBaseFormProps<any>>(props: P) => {
  const columns = computed(() => props.columns as ExtractColumns<P>);

  const formLocal = ref(props.formData ?? {});

  if (props.formData == null) {
    props["onUpdate:formData"]?.(formLocal.value);
  }

  const form = computed({
    get() {
      return formLocal.value;
    },
    set(v) {
      formLocal.value = v;
      props["onUpdate:formData"]?.(v);
    },
  });

  const { columnsChecked, resetColumnsChecked } = useColumnsChecked(
    columns,
    () => props.cache,
    form,
  );
  const { columnsSort, resetColumnsSort } = useColumnsSorted(
    columns,
    () => props.cache,
  );

  let tmpDefaultForm: ExtractFormData<P>;

  // 需要监听的表单字段
  const watchMap = new Map<string, () => void>();
  // 存储每个字段的控制条件：Map<被控制字段, Map<控制字段, 是否显示>>
  const fieldControlMap = ref<Map<string, Map<string, boolean>>>(new Map());
  // 计算得出的需要隐藏的字段集合
  const hideFieldSet = computed(() => {
    const hiddenFields = new Set<string>();

    fieldControlMap.value.forEach((controlMap, targetField) => {
      // 只有所有控制条件都为true时，字段才显示
      const shouldShow = Array.from(controlMap.values()).every(Boolean);
      if (!shouldShow) {
        hiddenFields.add(targetField);
      }
    });

    return hiddenFields;
  });

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
      }) as ExtractColumns<P>;
  });

  watch(
    columns,
    (_v, _o, onCleanup) => {
      onCleanup(() => {
        watchMap.forEach(cancel => cancel());
        watchMap.clear();
        fieldControlMap.value.clear();
      });
      addFormDefaultValue();
      runFieldWatch();
    },
    {
      immediate: true,
    },
  );

  onScopeDispose(() => {
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
      const watchArr = column.fields ?? ([column.field] as string[]);

      const isSingleWatch = watchArr.length === 1;
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
              return watchArr.map(f => get(form.value, f));
            },
            (val, oldVal) => {
              if (isSingleWatch) {
                val = val?.[0];
                oldVal = oldVal?.[0];
              }
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
            () => watchArr.map(f => get(form.value, f)),
            val => {
              control.forEach(({ field: targetField, value }) => {
                let show = true;
                if (typeof value === "function") {
                  show = value({
                    formData: form.value,
                    val: isSingleWatch ? val[0] : val,
                  });
                } else {
                  if (Array.isArray(value)) {
                    if (isSingleWatch) {
                      show = value.some(v => isEqual(v, val[0]));
                    } else {
                      show = isEqual(value, val);
                    }
                  } else {
                    show = isEqual(value, val[0]);
                  }
                }

                // 确保目标字段的控制映射存在
                if (!fieldControlMap.value.has(targetField)) {
                  fieldControlMap.value.set(targetField, new Map());
                }

                fieldControlMap.value.get(targetField)!.set(field, show);
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
    form.value = columns.value.reduce<ExtractFormData<P>>((prev, column) => {
      const { fields, values } = getFieldsAndValues(column);
      fields.forEach((field, idx) => {
        set(prev, field, cloneDeep(values[idx]));
      });
      return prev;
    }, {} as ExtractFormData<P>);
  };

  /**
   * 设置当前表单的默认值，如果参数为空，则将`当前表单值`设置为默认值
   */
  const setAsDefault: SetAsDefault<ExtractFormData<P>> = (v?) => {
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
  const getFormData: GetFormData<ExtractFormData<P>> = () => {
    const formData = {} as ExtractFormData<P>;
    visibleColumns.value.forEach(usefulColumn => {
      const { fields } = getFieldsAndValues(usefulColumn);
      fields.forEach(field => {
        let value = get(form.value, field);
        if (usefulColumn.formatGetFormData) {
          value = usefulColumn.formatGetFormData(value);
        }
        set(formData, field, value);
      });
    });
    return formData;
  };

  provide(provideFormKey, {
    form,
  });

  return {
    form,
    visibleColumns,
    columnsChecked,
    columnsSort,
    resetToDefault,
    getFormData,
    setAsDefault,
    resetColumnsChecked,
    resetColumnsSort,
  };
};

export type GetFormData<FormData extends Record<string, any>> = () => FormData;

export type ResetToDefault = (sync?: boolean) => Promise<void> | void;

export type SetAsDefault<FormData extends Record<string, any>> = (
  v?: FormData,
) => void;
