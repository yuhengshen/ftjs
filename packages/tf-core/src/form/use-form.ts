import {
  computed,
  ref,
  watch,
  onMounted,
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
  isEqualStrArr,
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

const provideFormKey = Symbol("tf-core-form-provide");

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

export const useForm = <
  FormData extends Record<string, any>,
  Type extends keyof FormTypeMap<FormData>,
>(
  props: TfFormIntrinsicProps<FormData, Type> &
    FormTypeMap<FormData>[Type]["extendedProps"] & {
      columns: FormTypeMap<FormData>[Type]["columns"][];
    },
  formData: Ref<FormData | undefined>,
  runtimeProps: string[],
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
  let unWatchList: { field: string; cancel: () => void }[] = [];
  const expectHideFields = ref<string[]>([]);

  // 需要显示的表单字段
  const visibleColumns = computed(() => {
    const set = new Set<string>(expectHideFields.value);
    return columns.value
      .filter(column => {
        const key = getField(column) as any;
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
  }, {}) as any;

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
    form.value = visibleColumns.value.reduce<FormData>((prev, column) => {
      const fields = column.fields ? column.fields : [column.field!];
      const valueArr = column.fields ? (column.value ?? []) : [column.value];
      fields.forEach((field, idx) => {
        set(prev, field, cloneDeep(valueArr[idx]));
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
  const getFormData: GetFormData<FormData> = () => {
    const formData: FormData = {} as FormData;
    visibleColumns.value.forEach(usefulColumn => {
      const fields = usefulColumn.fields ?? [usefulColumn.field!];
      fields.forEach(field => {
        const value = get(form.value, field);
        set(formData, field, value);
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
