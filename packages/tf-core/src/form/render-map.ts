import { Component } from "vue";
import { FormContainerProps, TfFormColumn, TfFormRenderMap } from "./types";

/**
 * 渲染组件集合
 */
export const renderMap = {
  // 由外部注册
} as TfFormRenderMap;


export interface FormComponentProps<T = Record<string, any>> {
  columns: TfFormColumn<T>[];
  formData: T;
  formProps?: FormContainerProps;
  onSubmit?: () => Promise<void> | void
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
