import { inject, provide, ref, Ref, toValue } from "vue";

const provideFormKey = Symbol("tf-core-form-provide-form");

export const useFormProvide = <T>(formModel?: Ref<T>) => {
  const formLocal = ref({} as T);
  const form =
    (toValue(formModel) != null ? formModel : formLocal) as Ref<T>;

  provide(provideFormKey, form);

  return form;
};

export const useFormInject = <T>() => {
  return inject(provideFormKey) as Ref<T>;
};
