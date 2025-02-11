import {
  computed,
  inject,
  MaybeRef,
  provide,
  ref,
  Ref,
  toValue,
  unref,
} from "vue";
import { TfFormColumn } from "./types";

const provideFormKey = Symbol("tf-core-form-provide-form");
const provideColumnsCheckedReverseKey = Symbol(
  "tf-core-form-provide-columns-checked-reverse",
);

export const useFormProvide = <T extends Record<string, any>>(
  formModel?: MaybeRef<T>,
) => {
  const formLocal = ref({} as T);
  const form = (unref(formModel) != null ? formModel : formLocal) as Ref<T>;

  provide(provideFormKey, form);

  return form;
};

export const useFormInject = <T extends Record<string, any>>() => {
  return inject(provideFormKey) as Ref<T>;
};

export const useColumnsCheckedReverseInject = () => {
  return inject(provideColumnsCheckedReverseKey) as Ref<string[]>;
};

export const useColumnsCheckedReverseProvide = (
  columns: Ref<TfFormColumn<any>[]>,
) => {
  /**
   * 配置选中的字段的反选（即没选中的字段）
   */
  const columnsCheckedReverse = computed<string[]>({
    get() {
      // todo:: 标识根据ID来
      const v = localStorage.getItem("columnsCheckedReverse");
      console.log("v", v);
      const getDefaultV = () =>
        columns.value
          .filter(e => toValue(e.hide))
          .map(e => e.field ?? (e.fields![0] as string));
      return v ? JSON.parse(v) : getDefaultV();
    },
    set(v) {
      // 存储到本地
      localStorage.setItem("columnsCheckedReverse", JSON.stringify(v));
    },
  });
  provide(provideColumnsCheckedReverseKey, columnsCheckedReverse);
  return columnsCheckedReverse;
};
