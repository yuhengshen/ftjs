import {
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  toValue,
  MaybeRef,
  Ref,
  unref,
  provide,
  inject,
  ComputedRef,
} from "vue";
import {
  cloneDeep,
  isEqualStrArr,
  get,
  has,
  set,
  getField,
  getStorage,
  setStorage,
} from "../utils";
import {
  DefineFormProps,
  FormRuntimeProps,
  TfFormHOCComponentProps,
} from "./define-component";
import { ExposeWithComment, TfFormColumn } from "./columns";
import { RecordPath, SplitEventKeys } from "../type-helper";

export type FormInject<T extends Record<string, any>> = Pick<
  ExposeWithComment<T>,
  | "form"
  | "columnsChecked"
  | "columnsSort"
  | "columns"
  | "visibleColumns"
  | "formProps"
  | "onSubmit"
  | "getFormData"
  | "resetToDefault"
  | "setAsDefault"
  | "resetColumnsSort"
  | "resetColumnsChecked"
  | "cache"
> &
  SplitEventKeys<DefineFormProps<T>>;

const provideFormKey = Symbol("tf-core-form-provide");

/**
 * 缓存展示项
 */
const useColumnsChecked = <T extends Record<string, any>>(
  columns: ComputedRef<TfFormColumn<T>[]>,
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

  const vRef = ref<Record<RecordPath<T>, boolean>>(
    Object.assign({}, columnsV.value, storageV),
  );

  const columnsChecked = computed<RecordPath<T>[]>({
    get() {
      return Object.entries(vRef.value)
        .filter(([_, show]) => show)
        .map(([field]) => field) as RecordPath<T>[];
    },
    set(v) {
      const storageV = {} as Record<RecordPath<T>, boolean>;
      const entries = columns.value.map(e => {
        const field = getField(e);
        const show = v.includes(field);
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
const useColumnsSorted = <T extends Record<string, any>>(
  columns: ComputedRef<TfFormColumn<T>[]>,
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

  const vRef = ref<Record<RecordPath<T>, number>>(
    Object.assign({}, columnsV.value, storageV),
  );

  const columnsSort = computed<Record<RecordPath<T>, number>>({
    get() {
      return vRef.value;
    },
    set(v) {
      const storageV = {} as Record<RecordPath<T>, number>;
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
    const resetV = {} as Record<RecordPath<T>, number>;
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

export const useForm = <T extends Record<string, any>>(
  props: TfFormHOCComponentProps<T>,
  formData: MaybeRef<T>,
  runtimeProps: FormRuntimeProps,
) => {
  const columns = computed(() => toValue(props.columns));

  const formLocal = ref({} as T);
  const form = (unref(formData) != null ? formData : formLocal) as Ref<T>;

  const { columnsChecked, resetColumnsChecked } = useColumnsChecked(
    columns,
    props.cache,
  );
  const { columnsSort, resetColumnsSort } = useColumnsSorted(
    columns,
    props.cache,
  );

  let tmpDefaultForm: T;

  // 需要监听的表单字段
  let unWatchList: { field: string; cancel: () => void }[] = [];
  const expectHideFields = ref<string[]>([]);

  // 需要显示的表单字段
  const visibleColumns = computed(() => {
    const set = new Set<string>(expectHideFields.value);
    return columns.value
      .filter(column => {
        const key = getField(column);
        return !set.has(key) && (columnsChecked.value?.includes(key) ?? true);
      })
      .sort((a, b) => {
        const keyA = getField(a);
        const keyB = getField(b);
        const aSort = columnsSort.value[keyA] ?? 0;
        const bSort = columnsSort.value[keyB] ?? 0;
        return aSort - bSort;
      });
  });

  const customProps = runtimeProps.reduce((acc, event: string) => {
    if (event.startsWith("on")) {
      acc[event] = props[event];
    } else {
      acc[event] = computed(() => props[event]);
    }
    return acc;
  }, {});

  watch(
    visibleColumns,
    () => {
      addFormDefaultValue();
      runFieldWatchFn();
    },
    {
      immediate: true,
    },
  );

  watch(
    form,
    () => {
      checkExpectColumns();
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    checkExpectColumns();
  });

  /**
   * 运行表单字段监听函数
   */
  function runFieldWatchFn() {
    const needNewWatchList = columns.value.filter(column => column.watch);
    const oldUnWatchList = unWatchList.filter(({ field, cancel }) => {
      const index = needNewWatchList.findIndex(column => {
        const watchField = column.field ?? column.fields![0];
        return watchField === field;
      });
      if (index !== -1) {
        needNewWatchList.splice(index, 1);
        return true;
      }
      cancel();
      return false;
    });
    const newUnWatchList = needNewWatchList.map(column => {
      let watchObj = column.watch!;
      if (typeof watchObj === "function") {
        watchObj = {
          handler: watchObj,
        };
      }
      const watchField = column.field ?? column.fields![0];
      return {
        cancel: watch(
          () => {
            return get(form.value, watchField);
          },
          (val, oldVal) => {
            watchObj.handler({ val, oldVal, form: form.value });
          },
          {
            immediate: watchObj.immediate,
            deep: watchObj.deep,
          },
        ),
        field: watchField,
      };
    });
    unWatchList = [...oldUnWatchList, ...newUnWatchList];
  }

  onUnmounted(() => {
    unWatchList.forEach(({ cancel }) => cancel());
  });

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
    form.value = visibleColumns.value.reduce<T>((prev, column) => {
      const fields = column.fields ? column.fields : [column.field!];
      const valueArr = column.fields ? (column.value ?? []) : [column.value];
      fields.forEach((field, idx) => {
        set(prev, field, cloneDeep(valueArr[idx]));
      });
      return prev;
    }, {} as T);
  };

  /**
   * 设置当前表单的默认值，如果参数为空，则将`当前表单值`设置为默认值
   */
  const setAsDefault: SetAsDefault<T> = (v?) => {
    tmpDefaultForm = cloneDeep(v ?? form.value);
  };

  /**
   * 如果有字段是新加的, 则加默认值
   */
  function addFormDefaultValue() {
    visibleColumns.value.forEach(column => {
      const fields = column.fields ? column.fields : [column.field!];
      const valueArr = column.fields ? (column.value ?? []) : [column.value];
      fields.forEach((field, idx) => {
        if (valueArr[idx] != null && !has(form.value, field)) {
          set(form.value, field, cloneDeep(valueArr[idx]));
        }
      });
    });
  }

  /**
   * 检查需要隐藏的字段
   */
  function checkExpectColumns() {
    const expectHideSet = new Set<string>();
    columns.value
      .filter(column => column.control)
      .forEach(column => {
        const columnField = column.field ?? column.fields![0];
        column.control!.forEach(expectItem => {
          const targetColumn = columns.value.find(column => {
            const field = column.field ?? column.fields![0];
            return field === expectItem.field;
          });
          if (!targetColumn)
            return console.warn("找不到关联的字段", expectItem.field);

          const targetField = targetColumn.field ?? targetColumn.fields![0];
          const expectValue = get(form.value, columnField);

          let hide = false;
          if (typeof expectItem.value === "function") {
            hide = !expectItem.value({
              formData: form.value,
              val: expectValue,
            });
          } else {
            hide = Array.isArray(expectItem.value)
              ? !(expectItem.value as any).includes(expectValue)
              : expectItem.value !== expectValue;
          }
          if (hide) {
            expectHideSet.add(targetField);
          }
        });
      });

    const newExpectHideFields = [...expectHideSet];
    if (isEqualStrArr(expectHideFields.value, newExpectHideFields)) return;
    expectHideFields.value = newExpectHideFields;
  }

  /**
   * 获取表单当先展示出的表单值
   */
  const getFormData: GetFormData<T> = () => {
    const formData: T = {} as T;
    visibleColumns.value.forEach(usefulColumn => {
      const fields = usefulColumn.fields ?? [usefulColumn.field!];
      fields.forEach(field => {
        const value = get(form.value, field);
        set(formData, field, value);
      });
    });
    return formData;
  };

  const formProps = computed(() => props.formProps);

  const cache = computed(() => props.cache);

  provide<FormInject<T>>(provideFormKey, {
    form,
    columnsChecked,
    columnsSort,
    columns,
    visibleColumns,
    formProps,
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

export const useFormInject = <T extends Record<string, any>>() => {
  return inject<FormInject<T>>(provideFormKey);
};

export type GetFormData<T> = () => T;

export type ResetToDefault = (sync?: boolean) => Promise<void> | void;

export type SetAsDefault<T> = (v?: T) => void;
