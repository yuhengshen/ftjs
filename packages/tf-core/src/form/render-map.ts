import { Component } from "vue";
import { FormContainerProps, TfFormColumn, TfFormRenderMap } from "./types";
import { GetFormData, ResetToDefault, SetAsDefault } from "./use-form";

/**
 * 渲染组件集合
 */
export const renderMap = {
  // 由外部注册
} as TfFormRenderMap;


export interface FormComponentProps<T = Record<string, any>> {
  columns: TfFormColumn<T>[];
  /**
   * 表单数据
   */
  formData: T;
  formProps?: FormContainerProps;
  /**
   * 表单提交事件
   */
  onSubmit?: (formData: T) => Promise<void> | void
  getFormData: GetFormData<T>;
  resetToDefault: ResetToDefault;
  setAsDefault: SetAsDefault<T>;
}



/**
 * 表单容器组件
 * 泛型参数
 */
export type FormComponent = Component<FormComponentProps>;

export const formRender: {
  c?: FormComponent;
} = {
  c: undefined,
}
