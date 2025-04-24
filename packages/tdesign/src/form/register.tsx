import { FtFormColumnBase, Unrefs, ValueOf } from "@ftjs/core";
import type { FormRule } from "tdesign-vue-next";
import { defineComponent, SetupContext, type Component } from "vue";
import AutoComplete, {
  FtFormColumnAutoComplete,
} from "./components/auto-complete";
import Cascader, { FtFormColumnCascader } from "./components/cascader";
import Checkbox, { FtFormColumnCheckbox } from "./components/checkbox";
import ColorPicker, {
  FtFormColumnColorPicker,
} from "./components/color-picker";
import DatePicker, { FtFormColumnDatePicker } from "./components/date-picker";
import DateRangePicker, {
  FtFormColumnDateRangePicker,
} from "./components/date-range-picker";
import Input, { FtFormColumnInput } from "./components/input";
import InputNumber, {
  FtFormColumnInputNumber,
} from "./components/input-number";
import TagInput, { FtFormColumnTagInput } from "./components/tag-input";
import Radio, { FtFormColumnRadio } from "./components/radio";
import RangeInput, { FtFormColumnRangeInput } from "./components/range-input";
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
  checkbox: FtFormColumnCheckbox<FormData>;
  "color-picker": FtFormColumnColorPicker<FormData>;
  "date-picker": FtFormColumnDatePicker<FormData>;
  "date-range-picker": FtFormColumnDateRangePicker<FormData>;
  input: FtFormColumnInput<FormData>;
  "input-number": FtFormColumnInputNumber<FormData>;
  "tag-input": FtFormColumnTagInput<FormData>;
  radio: FtFormColumnRadio<FormData>;
  "range-input": FtFormColumnRangeInput<FormData>;
}

export interface FormItemProps<Column extends TdColumnBase<any>> {
  column: Column;
  isView: boolean;
  unrefsProps: Unrefs<Column["props"]>;
}

export function defineFormItem<Column extends TdColumnBase<any>>(
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
 * 全部的 antd column 集合
 */
export type FtTdFormColumn<FormData extends Record<string, any>> =
  // 外部自定义的部分
  ValueOf<RegisterColumnMap<FormData>>;

export const formRenderMap = new Map<string, Component>([
  ["auto-complete", AutoComplete],
  ["cascader", Cascader],
  ["checkbox", Checkbox],
  ["color-picker", ColorPicker],
  ["date-picker", DatePicker],
  ["date-range-picker", DateRangePicker],
  ["input", Input],
  ["input-number", InputNumber],
  ["tag-input", TagInput],
  ["radio", Radio],
  ["range-input", RangeInput],
]);

export function registerForm<T extends keyof RegisterColumnMap<any>>(
  type: T,
  Component: any,
) {
  formRenderMap.set(type, Component);
}
