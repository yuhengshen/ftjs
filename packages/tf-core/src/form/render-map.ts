import { Component, ComputedRef, Ref } from "vue";
import { FormContainerProps, TfFormColumn, TfFormRenderMap } from "./types";
import { GetFormData, ResetToDefault, SetAsDefault } from "./use-form";

/**
 * 渲染组件集合
 */
export const renderMap = {
  // 由外部注册
} as TfFormRenderMap;

export interface FormInject<T = Record<string, any>> {
  form: Ref<T>;
  columnsChecked: Ref<string[]>;
  columnsSort: Ref<Partial<Record<keyof T, number>>>;
  columns: ComputedRef<TfFormColumn<T>[]>;
  visibleColumns: ComputedRef<TfFormColumn<T>[]>;
  formProps: ComputedRef<FormContainerProps | undefined>;
  /**
   * 表单提交事件
   */
  onSubmit?: (formData: T) => Promise<void> | void;
  getFormData: GetFormData<T>;
  resetToDefault: ResetToDefault;
  setAsDefault: SetAsDefault<T>;
}

export const formRender: {
  c?: Component;
} = {
  c: undefined,
};
