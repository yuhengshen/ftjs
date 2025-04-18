import { FtFormColumnBase, ValueOf } from "@ftjs/core";
import type { FormRule } from "tdesign-vue-next";
import { defineComponent, SetupContext, type Component } from "vue";
import AutoComplete, {
  FtFormColumnAutoComplete,
} from "./components/auto-complete";
import Cascader, { FtFormColumnCascader } from "./components/cascader";

export interface TdColumnBase<FormData extends Record<string, any>>
  extends FtFormColumnBase<FormData> {
  rules?: FormRule[];
}

/**
 * 允许外部注册类型
 */

export interface RegisterColumnMap<FormData extends Record<string, any>> {
  "auto-complete": FtFormColumnAutoComplete<FormData>;
  cascader: FtFormColumnCascader<FormData>;
  // name: TdColumnBase<FormData>;
}

export interface FormItemProps<Column extends TdColumnBase<any>> {
  column: Column;
  isView: boolean;
}

export function defineFormItem<Column extends TdColumnBase<any>>(
  setup: (props: FormItemProps<Column>, ctx: SetupContext) => any,
) {
  return defineComponent(setup, {
    props: {
      column: Object,
      isView: Boolean,
    } as any,
  });
}

/**
 * 全部的 antd column 集合
 */
export type FtTdFormColumn<FormData extends Record<string, any>> =
  // 外部自定义的部分
  ValueOf<RegisterColumnMap<FormData>>;

export const formRenderMap = new Map<string, Component>([
  ["auto-complete", AutoComplete],
  ["cascader", Cascader],
]);

export function registerForm<T extends keyof RegisterColumnMap<any>>(
  type: T,
  Component: any,
) {
  formRenderMap.set(type, Component);
}
