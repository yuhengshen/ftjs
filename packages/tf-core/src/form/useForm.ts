import { computed, ref, watch, onMounted, onUnmounted, nextTick, MaybeRefOrGetter, toValue, Ref } from "vue";
import { cloneDeep, isEqual } from "es-toolkit";
import { get, has, set } from "es-toolkit/compat";
import { TfFormColumn } from "./types";
import { useFormProvide } from "./useProvide";

export const useForm = <T extends Record<string, any>>(
  _columns: MaybeRefOrGetter<TfFormColumn<T>[]>,
  formProps?: Ref<T>,
) => {
  const columns = computed(() => toValue(_columns));
  
  const form = useFormProvide(formProps);

  let tmpDefaultForm: T;

  // 需要监听的表单字段
  let unWatchList: { field: string; cancel: () => void }[] = [];
  // 需要隐藏的表单字段
  const expectHideFields = ref<string[]>([]);

  // 需要显示的表单字段
  const visibleColumns = computed(() => {
    const set = new Set<string>(expectHideFields.value);
    return columns.value.filter(
      column => {
        const key = column.field ?? column.fields!.join(",")
        return !set.has(key) && !toValue(column.hide)
      }
    );
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
  async function resetToDefault(sync = false) {
    if (!sync) await nextTick();
    if (tmpDefaultForm) {
      form.value = cloneDeep(tmpDefaultForm);
      return;
    }
    form.value = visibleColumns.value.reduce<T>(
      (prev, column) => {
        const fields = column.fields ? column.fields : [column.field!];
        const valueArr = column.fields ? (column.value ?? []) : [column.value];
        fields.forEach((field, idx) => {
          set(prev, field, cloneDeep(valueArr[idx]));
        });
        return prev;
      },
      {} as T,
    );
  }

  /**
   * 设置当前表单的默认值，如果参数为空，则将`当前表单值`设置为默认值
   * @param v 
   */
  function setAsDefault(v?: T) {
    tmpDefaultForm = cloneDeep(v ?? form.value);
  }

  /**
   * 如果有字段是新加的, 则加默认值
   */
  function addFormDefaultValue() {
    visibleColumns.value.forEach(column => {
      const fields = column.fields ? column.fields : [column.field!];
      const valueArr = column.fields ? (column.value ?? []) : [column.value];
      fields.forEach((field, idx) => {
        if (!has(form.value, field)) {
          set(form.value, field, cloneDeep(valueArr[idx]));
        }
      });
    });
  }

  function checkExpectColumns() {
    const expectHideSet = new Set<string>();
    columns.value
      .filter(column => column.expect)
      .forEach(column => {
        column.expect!.forEach(expectItem => {
          const targetColumn = columns.value.find(
            column => {
              const field = column.field ?? column.fields![0];
              return field === expectItem.key
            },
          );
          if (!targetColumn)
            return console.warn("找不到关联的字段", expectItem.key);

          const targetField = targetColumn.field ?? targetColumn.fields![0];
          const expectValue = get(form.value, targetField);

          let hide = false;
          if (typeof expectItem.value === "function") {
            hide = !expectItem.value({
              form: form.value,
              val: expectValue,
            });
          } else {
            hide = Array.isArray(expectItem.value)
              ? !expectItem.value.includes(expectValue)
              : expectItem.value !== expectValue;
          }
          if (hide) {
            expectHideSet.add(targetField);
          }
        });
      });

    const newExpectHideFields = [...expectHideSet];
    if (isEqual(expectHideFields.value, newExpectHideFields)) return;
    expectHideFields.value = newExpectHideFields;
  }

  /**
   * 获取表单有用的表单值
   */
  function getFormData() {
    const formData: Partial<T> = {};
    visibleColumns.value.forEach(usefulColumn => {
      const fields = usefulColumn.fields ?? [usefulColumn.field!];
      fields.forEach(field => {
        const value = get(form.value, field);
        set(formData, field, value);
      });
    });
    return formData;
  }

  return {
    form,
    visibleColumns,
    resetToDefault,
    getFormData,
    setAsDefault,
  };
};



