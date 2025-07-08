import { FtFormColumnBase, Unrefs, ValueOf } from "@ftjs/core";
import { defineComponent, SetupContext, type Component } from "vue";
import AutoComplete, {
  FtFormColumnAutoComplete,
} from "./components/auto-complete";
import Cascader, { FtFormColumnCascader } from "./components/cascader";
import { FormItemRule } from "element-plus";

export interface EleColumnBase<FormData extends Record<string, any>>
  extends FtFormColumnBase<FormData> {
  rules?: FormItemRule[];
}

/**
 * 允许外部注册类型
 */
export interface RegisterColumnMap<FormData extends Record<string, any>> {
  "auto-complete": FtFormColumnAutoComplete<FormData>;
  cascader: FtFormColumnCascader<FormData>;
}

export interface FormItemProps<Column extends EleColumnBase<any>> {
  column: Column;
  isView: boolean;
  unrefsProps: Unrefs<Column["props"]>;
}

export function defineFormItem<Column extends EleColumnBase<any>>(
  setup: (props: FormItemProps<Column>, ctx: SetupContext) => any,
) {
  return defineComponent(setup, {
    props: {
      column: Object,
      isView: Boolean,
      unrefsProps: Object,
    } as any,
  });
}

/**
 * 全部的 element column 集合
 */
export type FtEleFormColumn<FormData extends Record<string, any>> =
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
