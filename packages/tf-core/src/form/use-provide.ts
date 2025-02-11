import { inject, MaybeRef, provide, ref, Ref, unref } from "vue";

const provideFormKey = Symbol("tf-core-form-provide-form");

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
