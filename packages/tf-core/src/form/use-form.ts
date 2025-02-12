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
import { cloneDeep, isEqualStrArr, get, has, set } from "../utils";
import { FormInject } from "./render-map";
import { TfFormHOCComponentProps } from "./tf-form";
import { TfFormColumn } from "./types";

const provideFormKey = Symbol("tf-core-form-provide-form");

const useColumnsChecked = <T extends Record<string, any>>(
  columns: ComputedRef<TfFormColumn<T>[]>,
) => {
  const storageKey = `tf-form-columns-checked-obj`;

  const columnsV = computed(() => {
    const entries = columns.value.map(e => {
      const field = e.field ?? (e.fields?.[0] as string);
      return [field, !e.hide];
    });
    return Object.fromEntries(entries);
  });
  const storageStr = localStorage.getItem(storageKey);
  const storageV = storageStr ? JSON.parse(storageStr) : {};

  const vRef = ref<Record<keyof T, boolean>>(
    Object.assign({}, columnsV.value, storageV),
  );

  return computed({
    get() {
      return Object.entries(vRef.value)
        .filter(([_, show]) => show)
        .map(([field]) => field);
    },
    set(v) {
      const entries = columns.value.map(e => {
        const field = e.field ?? (e.fields?.[0] as string);
        return [field, v.includes(field)];
      });
      vRef.value = Object.fromEntries(entries);
      localStorage.setItem(storageKey, JSON.stringify(entries));
    },
  });
};

export const useForm = <T extends Record<string, any>>(
  props: TfFormHOCComponentProps<T>,
  formData: MaybeRef<T>,
) => {
  const columns = computed(() => toValue(props.columns));

  const formLocal = ref({} as T);
  const form = (unref(formData) != null ? formData : formLocal) as Ref<T>;

  const columnsChecked = useColumnsChecked(columns);
  const columnsSort: FormInject<T>["columnsSort"] = ref({});

  let tmpDefaultForm: T;

  // 需要监听的表单字段
  let unWatchList: { field: string; cancel: () => void }[] = [];
  const expectHideFields = ref<string[]>([]);

  // 需要显示的表单字段
  const visibleColumns = computed(() => {
    const set = new Set<string>(expectHideFields.value);
    return columns.value
      .filter(column => {
        const key = column.field ?? (column.fields![0] as string);
        return !set.has(key) && (columnsChecked.value?.includes(key) ?? true);
      })
      .sort((a, b) => {
        const keyA = a.field ?? (a.fields![0] as string);
        const keyB = b.field ?? (b.fields![0] as string);
        const aSort = columnsSort.value[keyA] ?? 0;
        const bSort = columnsSort.value[keyB] ?? 0;
        return aSort - bSort;
      });
  });

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

  provide<FormInject<T>>(provideFormKey, {
    form,
    columnsChecked,
    columnsSort,
    columns,
    visibleColumns,
    formProps,
    getFormData,
    resetToDefault,
    setAsDefault,
    onSubmit: props.onSubmit,
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
