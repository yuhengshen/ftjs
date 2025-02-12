import { Component } from "vue";
import { ExposeWithComment, TfFormRenderMap } from "./types";

/**
 * 渲染组件集合
 */
export const renderMap = {
  // 由外部注册
} as TfFormRenderMap;

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
>;

export const formRender: {
  c?: Component;
} = {
  c: undefined,
};
